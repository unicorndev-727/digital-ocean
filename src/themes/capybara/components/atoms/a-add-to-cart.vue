<template>
  <SfButton
    class="a-add-to-cart sf-button--full-width"
    :disabled="isProductDisabled || loading"
    @click.native="addToCart"
  >
    <SfLoader v-if="loading" :loading="loading" />
    <span v-else>{{ $t("Add to cart") }}</span>
  </SfButton>
</template>

<script>
import { SfButton, SfLoader } from '@storefront-ui/vue';
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages.ts';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapGetters, mapActions } from 'vuex';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { Logger } from '@vue-storefront/core/lib/logger';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'AAddToCart',
  components: {
    SfButton,
    SfLoader
  },
  props: {
    product: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    qty: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding',
      activeVehicle: 'vehicles/activeVehicle',
      productVinCapability: 'vehicles/currentProductVinCapability',
      cartToken: 'cart/getCartToken',
      updatedCartItem: 'cart/getUpdatedCartItem',
      product: 'product/getCurrentProduct',
      token: 'user/getToken'
    }),
    isProductDisabled () {
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== '' ||
        this.isAddingToCart
      );
    },
    status () {
      const isExistActiveVehicle = this.activeVehicle && Object.keys(this.activeVehicle).length
      if (!isExistActiveVehicle) {
        return 'no-active-vehicle'
      } else if (isExistActiveVehicle && (this.activeVehicle.VIN || this.activeVehicle.VRN || this.activeVehicle.vin || this.activeVehicle.vrn)) {
        return 'have-vin'
      } else {
        return 'no-vin'
      }
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    async addToCart () {
      if (this.status !== 'have-vin'
          && this.product.national_code) {
        this.openModal({
            name: ModalList.OmVinPopupModal,
            payload: {
              vin: ''
            }
          })
      } else {
        try {
          this.loading = true;
          const result = await this.$store.dispatch('cart/addItem', {
            productToAdd: Object.assign({}, this.product, { qty: this.qty })
          });

          console.log(result, 'item result');
          let itemId = result?.serverResponses[0];
          if (itemId) {
            itemId = itemId?.result.result.item_id;
            console.log(itemId, 'itemId')
          }

          const cartItems = await StorageManager.get('cart').getItem('current-cart');
          cartItems.forEach(item => {
            if (item.groupedParents) {
              item.groupedParents.map(p => {
                if (p.name === this.product.name && this.activeVehicle.National_Code) {
                  if (item.fitVehicles) {
                    const existFitVehicle = item.fitVehicles.find(item => item.National_Code === this.activeVehicle.National_Code);
                    if (!existFitVehicle) {
                      item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                    }
                  } else {
                    item.fitVehicles = [ this.activeVehicle ];
                  }

                  // setting main_image
                }
                if (p.name === this.product.name && this.product.main_image) {
                  item.main_image = this.product.main_image;
                }
              })
            } else {
              if (item.sku === this.product.sku && this.activeVehicle.National_Code) {
                if (item.fitVehicles) {
                  const existFitVehicle = item.fitVehicles.find(item => item.National_Code === this.activeVehicle.National_Code);
                  if (!existFitVehicle) {
                    item.fitVehicles = [ ...item.fitVehicles, this.activeVehicle ];
                  }
                } else {
                  item.fitVehicles = [ this.activeVehicle ];
                }
              }
            }
          })

          await StorageManager.get('cart').setItem('current-cart', cartItems).catch((reason) => {
            Logger.error(reason)()
          })
          const storedItems = await StorageManager.get('cart').getItem('current-cart');
          this.$store.dispatch('cart/syncCartWhenLocalStorageChange', { items: storedItems })
          this.loading = false;

          this.$store.commit(
            'notification/clearNotification',
            { root: true }
          );

          //sending the vin/reg to endpoint
          if (this.status === 'have-vin') {
            let cartId = this.cartToken;
            let body = {
              giftMessage: {
                sender: "customer",
                recipient: "vehicle_data",
                message: this.activeVehicle.VIN || this.activeVehicle.VRN || this.activeVehicle.vin || this.activeVehicle.vrn,
                VIN: this.activeVehicle.VIN || this.activeVehicle.vin,
                VRN: this.activeVehicle.VRN || this.activeVehicle.vrn,
              }
            };
            const result = await axios({method: 'POST', url: `${config.api.url}/api/cart/vehicle-data?cartId=${cartId}&itemId=${itemId}&token=${this.token}`, headers: {}, data: body});

          }

          this.openModal({
            name: ModalList.OmCartPopupModal,
            payload: {
              qty: this.qty,
              name: this.product.name
            }
          })
        } catch (message) {
          this.$store.dispatch(
            'notification/spawnNotification',
            notifications.createNotification({ type: 'danger', message }),
            { root: true }
          );
        }
      }
    }
  }
};
</script>

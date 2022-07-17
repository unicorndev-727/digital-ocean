<template>
  <div class="om-cart-popup">
    <SfModal :visible="isVisible" @close="closeModal" title="">
      <div class="om-cart-popup__content">
        <div class="a-loading-spinner" v-if="loading">
          <SfLoader :loading="loading" />
        </div>
        <div class="title">
          <h2>{{ isRequired ? 'Vehicle Information Required' : 'Recommended' }}</h2>
          <p>please provide your vehicle VIN or registration number so our expert parts team can confirm compatibility</p>
        </div>
        <!-- <div class="product-count"> -->
          <SfInput
            v-model.trim="vin"
            class="form__element form__element--half form__element--half-even"
            name="vin"
            :label="$t('VIN / Reg')"
            :required="true"
            :valid="!$v.vin.$error"
            :error-message="!$v.vin.minLength ? $t('Vin must be at least 4 character.') : $t('Field is required')"
            @blur="$v.vin.$touch()"
            :disabled="loading"
          />
        <!-- </div> -->
        <div class="actions">
          <SfButton
            class="sf-button--full-width color-secondary"
            @click="() => setSkippedCheck(true)"
            :disabled="loading"
          >
            Save & Continue
          </SfButton>
          <SfButton
            class="sf-button--full-width color-secondary"
            @click="() => setSkippedCheck(false)"
            :disabled="loading"
            v-if="!isRequired"
          >
            SKIP
          </SfButton>
        </div>
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfIcon, SfButton, SfInput, SfLoader } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
import { required, minLength } from 'vuelidate/lib/validators';
import axios from 'axios';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'OmVinPopupModal',
  components: { SfModal, SfIcon, SfButton, SfInput, SfLoader },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: 'OmVinPopupModal',
        payload: {
          name: '',
          vin: ''
        }
      }),
      required: true
    }
  },
  validations () {
    const rules = {
      vin: {
        required,
        minLength: minLength(4),
      }
    }

    return rules;
  },
  data () {
    return {
      vin: this.modalData.payload.vin,
      loading: false,
      itemId: '',
    }
  },
  computed: {
    ...mapGetters({
      product: 'product/getCurrentProduct',
      activeVehicle: 'vehicles/activeVehicle',
      qty: 'vehicles/getQTY',
      cartToken: 'cart/getCartToken',
      updatedCartItem: 'cart/getUpdatedCartItem',
      token: 'user/getToken',
    }),
    isRequired() {
      const { storeId } = currentStoreView();
      return !!config?.vinRequired[storeId];
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    async goToCart () {
      this.$router.push(localizedRoute('/cart'));
      await this.setSkippedCheck();
    },
    async setSkippedCheck (flag = false) {
      // await this.$store.dispatch('mb-vehicle-finder/setSkippedVinCheckProducts',
      //   this.modalData.payload.sku
      // );
      this.loading = true;
      const result = await this.$store.dispatch('cart/addItem', {
        productToAdd: Object.assign({}, this.product, { qty: this.qty })
      });
      this.loading = false;
      this.$emit('close', this.modalData.name)
      this.$store.commit(
        'notification/clearNotification',
        { root: true }
      );

      if (flag) {
        //post vin
          let cartId = this.cartToken;
          let itemId = this.itemId;
          let body = {
            giftMessage: {
              sender: "customer",
              recipient: "vehicle_data",
              message: this.vin
            }
          };
          const result = await axios({method: 'POST', url: `${config.api.url}/api/cart/vehicle-data?cartId=${cartId}&itemId=${itemId}&token=${this.token}`, headers: {}, data: body});
        }

      this.openModal({
        name: ModalList.OmCartPopupModal,
        payload: {
          qty: this.qty,
          name: this.product?.name
        }
      })
    }
  },
  watch: {
    updatedCartItem (value) {
      this.itemId = value.item_id;
    }
  }
};
</script>

<style lang="scss">
.om-cart-popup {

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
    max-height: 600px;
    padding-top: 0;

    .title {
      font-weight: bold;
      font-size: 14px;
    }

    .product-count {
      display: flex;
      gap: var(--spacer-xs);
      color: var(--c-primary);
    }

    .actions {
      display: flex;
      gap: var(--spacer-base);
    }
  }

  .a-loading-spinner {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
}
</style>

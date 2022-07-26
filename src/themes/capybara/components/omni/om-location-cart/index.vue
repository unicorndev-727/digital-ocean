<template>
  <SfSidebar
    :visible="isLocationCartOpen"
    class="sf-sidebar--right sf-sidebar--icon om-location-cart"
    @close="closeSidebar"
    title="Set Location"
  >
    <SfLoader v-if="loading" :loading="loading" />
    <div
      v-for="(location, index) in locations"
      :key="index"
      class="location-item"
      :class="{'active': location.id === activeLocation.id}"
      @click="setActiveLocation(location)"
    >
      <div>
        <span class="location-name">{{ location.location_name }}</span>
        <div>{{ getAddress(location) }}</div>
      </div>
    </div>
    <template #content-bottom>
      <SfButton
        class="sf-button--full-width om-btn--primary"
        @click.native="closeSidebar"
      >
        Continue with this option
      </SfButton>
    </template>
  </SfSidebar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';
import OmLocationCartCard from './om-location-cart-card';
import { SfSidebar, SfImage, SfLoader, SfButton } from '@storefront-ui/vue';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import axios from 'axios';

export default {
  name: 'LocationSidebar',
  components: {
    SfSidebar,
    OmLocationCartCard,
    SfImage,
    SfLoader,
    SfButton
  },
  mixins: [VueOfflineMixin, onEscapePress],
  data () {
    return {
      // showAllLocations: true
      locations: [],
      loading: false
    };
  },
  computed: {
    ...mapGetters({
      isLocationCartOpen: 'ui/isLocationCartOpen',
      getCurrentProduct: 'product/getCurrentProduct',
      activeLocation: 'omLocator/activeLocation'
    })
  },
  watch: {
    async isLocationCartOpen (value) {
      if (value) {
        await this.fetchLocations();
      }
    }
  },
  methods: {
    ...mapActions({
      closeSidebar: 'ui/closeSidebar'
    }),
    onEscapePress () {
      this.closeMicrocartExtend();
    },
    async fetchLocations () {
      this.loading = true;
      this.locations = [];
      const storeId = currentStoreView().storeId;
      const { data: { status, data } } = await axios.get(`https://portal-api.omninext.app/api/locations/2?vsf_code=${storeId}`);
      if (status === 'success') {
        this.locations = data;
      }
      this.loading = false;
    },
    async setActiveLocation (location) {
      await this.$store.dispatch('omLocator/saveActiveLocation', location);
    },
    getAddress (location) {
      let result = '';
      result += location.region ? location.region + ', ' : ' ';
      result += location.street ? location.street + ', ' : ' ';
      result += location.postcode ? location.postcode + ', ' : ' ';
      result += location.city ? location.city + ', ' : ' ';
      return result;
    }
  },
  async mounted () {
    await this.fetchLocations();
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-location-cart {
  ::v-deep .sf-sidebar__aside {
    --sidebar-background: #fff;
    padding: 0px;
  }
  @include for-mobile {
    ::v-deep .sf-sidebar__aside {
      max-height: calc(100vh - var(--bottom-navigation-height));
    }
  }
  @include for-desktop {
    --sidebar-width: 34.5rem;
    --sidebar-bottom-padding: var(--spacer-base);
    --sidebar-content-padding: var(--spacer-base);
  }
  ::v-deep .sf-icon.size-xxl {
    --icon-size: 12.5rem;
    margin-top: -25px;
    height: 10.5rem;
  }
  .sidebar-text {
    font-size: var(--spacer-base);
    font-weight: 700;
    color: var(--c-grey-text);
    margin-bottom: var(--spacer-xl);
    &.footer-text {
      color: var(--c-grey-text-light);
      margin-bottom: 0;
      padding: 0 var(--spacer-2xl);
      text-align: center;
    }
  }
  .om-location-cart-card {
    &:first-child {
      margin-top: 0px;
    }
    margin-top: 20px;
  }
  .location-item {
    display: flex;
    align-items: center;
    gap: var(--spacer-sm);
    cursor: pointer;
    padding: var(--spacer-sm);
    margin: 0;
    .location-name{
      font-size: 17px;
      color: var(--c-primary)
    }
    &:first-child {
      margin-top: 0;
    }

    &:hover {
      transition: border 0.2s;
      background: #f4f4f4;
    }

    &.active {
      border-left: 2px solid var(--c-primary);
      background: #f4f4f4;
    }
  }
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-sm);
    --price-font-weight: var(--font-semibold);
    margin: 0 0 var(--spacer-xs) 0;
  }
}
.sidebar-footer {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sf-button--full-width {
  font-size: 24px;
}
.empty-cart {
  --heading-subtitle-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-base) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 13.1875rem;
    margin: 0 0 var(--spacer-2xl) 0;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-xl);
  }
}
.collected-product-list {
  flex: 1;
}
.collected-product {
  --collected-product-image-background: var(--c-white);
  margin: 0 0 var(--spacer-sm) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
    opacity: var(--cp-actions-opacity, 0);
  }
  &__action {
    --button-padding: 0;
  }
  &:hover {
    --cp-actions-opacity: 1;
  }
}
</style>

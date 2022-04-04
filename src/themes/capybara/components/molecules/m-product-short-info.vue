<template>
  <div class="m-product-short-info">
    <div class="product__header">
      <SfHeading
        :title="product.enhanced_title || product.name | htmlDecode"
        :level="3"
        class="sf-heading--no-underline sf-heading--left"
      />
    </div>
    <div class="product__price-and-rating">
      <div class="product-partno">
        <span>Part No: {{ title }}</span>
      </div>
      <AProductPrice
        :product="product"
        :custom-options="customOptions"
      />
    </div>
  </div>
</template>

<script>
import { SfHeading, SfIcon } from '@storefront-ui/vue';
import AProductPrice from 'theme/components/atoms/a-product-price';
import { createSmoothscroll } from 'theme/helpers'
export default {
  name: 'MProductShortInfo',
  components: {
    SfHeading,
    SfIcon,
    AProductPrice
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    customOptions: {
      type: Object,
      default: () => ({})
    },
    reviews: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    reviewsCount () {
      return this.reviews.length
    },
    title () {
      if (this.product.sku.includes('-')) {
        const skuAry = this.product.sku.split('-');
        return skuAry[0];
      } else return this.product.sku;
    }
  },
  methods: {
    openReviewsTab () {
      this.$store.commit('ui/setReviewProductTab', true);

      const reviewsEl = document.querySelector('#m-product-additional-info');
      if (!reviewsEl) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      createSmoothscroll(scrollTop, scrollTop + reviewsEl.getBoundingClientRect().top);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "~@storefront-ui/shared/styles/helpers/typography";

.product {
  &__header {
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    margin: var(--spacer-xs) 0 var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__description {
    color: var(--c-link);
    @include font(
      --product-description-font,
      var(--font-light),
      var(--font-base),
      1.6,
      var(--font-family-primary)
    );
  }
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>

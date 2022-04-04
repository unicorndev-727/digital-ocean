<template>
  <div class="om-card">
    <router-link :to="info.cta">
      <SfImage :src="info.imgUrl" loading="lazy" class="image" :alt="info.text" />
      <h1>{{ info.title }}</h1>
      <p>{{ info.text }}</p>
    </router-link>
  </div>
</template>

<script>
import { SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'OmCard',
  components: {
    SfImage,
    SfIcon
  },
  props: {
    info: {
      type: Object,
      default: () => ({
        imgUrl: 'https://cdn.shopify.com/s/files/1/0081/3229/6819/files/BMW_Teaser_Accessoire_Interior.jpg?9121191146221420472',
        text: 'Card Text',
        title: 'Cart Title',
        cta: ''
      })
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-card {
  display: flex;
  flex-direction: column;
  width: 100% !important;
  color: var(--c-grey-text);
  h1 {
    margin-top: var(--spacer-xl);
    margin-bottom: 0;
    font-family: var(--font-family-bold);
    font-size: 16px;
    font-weight: 700;
    line-height: 18px;
    margin-bottom: 10px;
    letter-spacing: .8px;
    color: #0c121c;
  }
  .sf-image {
    border-radius: 0;
  }
  .link {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    color: var(--c-primary);
    font-weight: 700;
    font-size: 14px;
    text-transform: none;
    .sf-icon {
      margin-left: var(--spacer-xl);
    }
  }
}
::v-deep .sf-image--has-size {
  width: 100%;
  max-width: none;
}
</style>

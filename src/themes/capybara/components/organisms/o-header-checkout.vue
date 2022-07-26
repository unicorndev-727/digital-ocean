<template>
  <div class="o-header-checkout">
    <ALogo />
    <router-link
      :to="localizedRoute('/cart')"
      class="checkout-icon"
    >
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
           width="30" height="30"
           viewBox="0 0 128 128"
           style=" fill:#000000;"
      ><path d="M81.1,31.9c-1.2-1.2-3.1-1.2-4.2,0l-30,30c-1.2,1.2-1.2,3.1,0,4.2l30,30c0.6,0.6,1.4,0.9,2.1,0.9s1.5-0.3,2.1-0.9 c1.2-1.2,1.2-3.1,0-4.2L53.2,64l27.9-27.9C82.3,34.9,82.3,33.1,81.1,31.9z" /></svg>
      Edit Basket
    </router-link>
  </div>
</template>
<script>
import ALogo from 'theme/components/atoms/a-logo';
import { SfImage, SfIcon } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
export default {
  name: 'OCheckoutHeader',
  components: { ALogo, SfImage, SfIcon }
}
</script>

<style lang="scss" scoped>
.o-header-checkout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--height-header);
  padding: 0 20px;
  max-width: 1280px;
  margin: auto;
  .checkout-icon {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
</style>

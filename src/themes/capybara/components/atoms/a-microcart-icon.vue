<template>
  <SfButton
    class="sf-button--pure a-microcart-icon"
    @click="goToCart"
  >
    <div :class="menuStyle"
         class="sf-header__custom-icon"
         :aria-label="$t('Open microcart')"
    >
      <i class="icon-shopping-cart" />
      <SfBadge v-show="!floatingIcon && totalQuantity" class="sf-icon__badge sf-badge--number">
        {{ totalQuantity }}
      </SfBadge>
    </div>
  </SfButton>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { SfIcon, SfButton, SfBadge } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

export default {
  components: { SfIcon, SfButton, SfBadge },
  props: {
    floatingIcon: {
      type: Boolean,
      default: false
    },
    menuStyle: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleSidebar'
    }),
    goToCart () {
      this.$router.push(localizedRoute('/cart'));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sf-header__custom-icon{
  font-size: 48px;
  color: #0c121c;
  line-height: 48px;
  position: relative;
  &.navigation-transparent{
    color: #ffffff;
  }
}
::v-deep .sf-badge--number{
    --badge-background: var(--c-primary);
}

</style>

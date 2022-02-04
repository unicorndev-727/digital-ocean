<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon"
    @click="openVehicleCart({ type: 'vehiclecart' })"
  >
    <div :class="['sf-header__custom-icon', menuStyle]">
      <i class="icon-configurator" />
    </div>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OmVehicleIcon',
  components: { SfIcon, SfButton },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar'
    })
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sf-header__custom-icon{
font-size: 48px;
color: #0c121c;
line-height: 48px;
  &.navigation-transparent{
    color: #ffffff;
  }
}
</style>

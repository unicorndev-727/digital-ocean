<template>
  <SfButton
    class="sf-button--pure om-vehicle-icon"
    @click="openVehicleCart({ type: 'vehiclecart' })"
  >
    <div :class="['sf-header__custom-icon', menuStyle]">
      <i class="icon-configurator" />
      <SfBadge v-if="vehicleCount" class="sf-icon__badge sf-badge--number">
        {{ vehicleCount }}
      </SfBadge>
    </div>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton, SfBadge } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'OmVehicleIcon',
  components: { SfIcon, SfButton, SfBadge },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters({
      vehicles: 'vehicles/vehicles'
    }),
    vehicleCount () {
      if (this.vehicles && this.vehicles.length) {
        return this.vehicles.length;
      } else return false;
    }
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
position: relative;
  &.navigation-transparent{
    color: #ffffff;
  }
}
::v-deep .sf-badge--number{
    --badge-background: var(--c-primary);
}
</style>

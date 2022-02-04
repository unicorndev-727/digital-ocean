<template>
  <div class="vehicle-finder global-container__restricted">
    <div class="vehicle-finder__container">
      <div class="left-content">
        <h3>YOUR VEHICLE</h3>
        <span>Find parts and accessories specifically designed for your vehicle.</span>
      </div>
      <div class="right-content">
        <div v-if="isModelSet" class="model-details">
      <div class="vehicle-details__with-reg" v-if="getModelReg">
      <input disabled :value="getModelReg">
      <div class="reg-label">
        <svg data-v-6f0354be="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="inline-icon inline-icon--medium"><g data-v-6f0354be=""><circle data-v-6f0354be="" fill="none" stroke="#fff" stroke-width="2" stroke-miterlimit="10" stroke-dasharray="2.0027,2.0027" cx="24" cy="13.8" r="12.8" /></g> <g data-v-6f0354be=""><path data-v-6f0354be="" fill="#fff" d="M11,41.1c0-4.2,3.2-6.9,7.1-6.9c2.7,0,4.5,1.4,5.5,3l-2.3,1.3c-0.6-0.9-1.8-1.7-3.1-1.7   c-2.4,0-4.2,1.8-4.2,4.4s1.7,4.4,4.2,4.4c1.2,0,2.3-0.5,2.8-1v-1.6h-3.5v-2.5h6.3v5.1C22.4,47,20.5,48,18.1,48   C14.2,48,11,45.3,11,41.1z" /> <path data-v-6f0354be="" fill="#fff" d="M25.9,47.8V34.5h7c2.5,0,3.8,1.6,3.8,3.4c0,1.7-1,2.8-2.3,3c1.4,0.2,2.5,1.6,2.5,3.2c0,2-1.3,3.6-3.9,3.6   H25.9z M33.9,38.4c0-0.8-0.6-1.4-1.6-1.4h-3.5v2.8h3.5C33.3,39.8,33.9,39.2,33.9,38.4z M34.1,43.8c0-0.8-0.6-1.5-1.7-1.5h-3.7v3   h3.7C33.5,45.3,34.1,44.7,34.1,43.8z" /></g>
        </svg>
      </div>
           </div>
            <p v-else class="model-details__name">{{ getModelName }} {{ getModelYear }}</p>
          </div>
        <NewVehicle v-else />
        <SfButton class="om-btn--secondary finder-button" @click="onClick">
        {{ isModelSet ? 'Add New Vehicle' :  'Or find your vehicle manually' }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import NewVehicle from '../omni/om-hero/new-vehicle.vue';
import { ModalList } from 'theme/store/ui/modals';

export default {
  name: 'SbVehicleFinder',
  components: { SfIcon, SfButton, NewVehicle },
  data () {
    return {
      open: true
    }
  },
  computed: {
    ...mapGetters({
      activeVehicle: 'vehicles/activeVehicle',
      getVehicleByNationalCode: 'vehicles/getVehicleByNationalCode',
      isSidebarOpen: 'ui/isSidebarOpen',
      activeModals: 'ui/activeModals',
      getCurrentCategory: 'category-next/getCurrentCategory'
    }),
    vehicleName () {
      return `${this.activeVehicle?.Model || 'Select your Vehicle to find accessories'}`
    },
    getModelName () {
      return `${this.activeVehicle.Model }`;
    },
    getModelReg () {
      return `${this.activeVehicle.VRN || ''}`;
    },
     getModelYear () {
      return `${this.activeVehicle.Year || ''}`;
    },
    isModelSet () {
      return this.activeVehicle && Object.keys(this.activeVehicle).length
    }
  },
  methods: {
    ...mapActions({
      openVehicleCart: 'ui/toggleSidebar',
      openModal: 'ui/openModal'
    }),
    onClick () {
      this.openModal({
        name: ModalList.OmSelectorModal,
        payload: { dropdownKeys: [], enableAction: true }
      });
    }
  },
  watch: {
    isSidebarOpen (status) {
      this.open = !status
    },
    activeModals (modals) {
      this.open = !modals.length
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.vehicle-finder {
  &__container {
    margin: var(--spacer-lg) auto;
    box-shadow: 1px 2px 6px 0px #bbbbbb;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    min-height: 150px;
    @include for-mobile{
      box-shadow: none;
    }
    .left-content{
      h3{
          font-size: 24px;
          letter-spacing: normal;
          font-weight: 300;
      }
    }
    .right-content{
      width: 33.3333%;
    @include for-mobile{
      width: 100%;
      margin-top: 20px;
    }
    }
    .new-vehicle {
      padding: 20px 0;
    }
    .finder-button{
      width: 100%;
    }
  }
}
.vehicle-details__with-reg{
  position: relative;
  margin: 10px 0;
  width: 100%;
  overflow: hidden;
}
  input {
    text-align: center;
    width: 100%;
    font-size: 16px;
    color: #343434;
    background: #f6f6f6;
    padding-left: 32px;
    border: none;
    font-weight: normal;
    text-transform: uppercase;
    border-radius: 0;
    padding: 1rem;
  }
  input::-webkit-input-placeholder {
    font-size: 18px;
  }
  .reg-label {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 32px;
    background-color: var(--c-primary);
    padding: 8px 0;
    svg {
      width: 32px;
      height: 32px;
    }
  }
</style>

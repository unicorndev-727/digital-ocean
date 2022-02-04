<template>
  <div class="om-vehicle-viewer-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <div v-if="isVisible" class="om-vehicle-viewer-modal__content">
        <OmVehicleSvgViewer
          :national-code="modalData.payload.nationalCode"
          :visual-group="modalData.payload.visualGroup"
          :image-code="modalData.payload.imageCode"
          :sku="modalData.payload.sku"
        />
      </div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal } from '@storefront-ui/vue';
import OmVehicleSvgViewer from 'theme/components/omni/om-vehicle-svg-viewer.vue';

export default {
  name: 'OmVehicleViewerModal',
  components: { SfModal, OmVehicleSvgViewer },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        name: '',
        payload: {
          nationalCode: '',
          visualGroup: '',
          imageCode: '',
          sku: ''
        }
      }),
      required: true
    }
  },
  data () {
    return {};
  },
  computed: {},
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name);
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
::v-deep.sf-modal__close {
  position: absolute;
  right: 0;
  z-index: 9;
  top: 0;
  background: #ccc;
  padding: 10px;
  font-size: 30px;
}
.om-vehicle-viewer-modal {
  overflow-y: auto;

  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-sm);
    padding: var(--spacer-sm) 0;
  }

  .sf-modal {
    &__container {
      width: calc(100vw - 85px) !important;
      height: calc(100vh - 45px) !important;
      @include for-mobile {
        width: 100vw !important;
        height: 100vh !important;
      }
    }

    &__content {
      height: 100%;
      padding: 0;
    }
  }
}
</style>

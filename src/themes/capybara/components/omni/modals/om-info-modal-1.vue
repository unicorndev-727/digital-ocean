<template>
  <div class="om-info-modal-1">
    <SfModal :visible="isVisible" @close="closeModal">
      <div v-html="content"></div>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfIcon, SfButton } from '@storefront-ui/vue';
import axios from 'axios';

export default {
  name: 'OmInfoModal1',
  components: { SfModal, SfIcon, SfButton },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => {},
      required: false
    }
  },
  data () {
    return {
      content: null
    }
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    }
  },
  async mounted () {
    const { data: { result } } = await axios.get(
      `https://shop.theoceangroup.co.uk/api/storyblok/storyblok-2/info-modals`
    );

    this.content = result;
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.om-info-modal-1 {
  .sf-modal__container {
    width: 900px;
    height: calc(100vh - 100px);

    @include for-mobile{
      width: 100vw;
      height: 100vh;
    }
  }
}
</style>

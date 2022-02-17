<template>
  <div class="om-selector-modal">
    <SfModal :visible="isVisible" @close="closeModal">
      <transition name="fade" mode="out-in">
        <div class="om-selector-modal__wrapper">
          <div class="om-selector-modal__header">
            <div v-show="!newVinError" class="new-vin-wrapper">
              <p class="subtitle-bold">
                Enter Your Registration
              </p>
              <NewVehicle
                ref="newVehicle"
                :enableManuelSelector="false"
                :successAction="true"
                @close="closeModal"
                @toggleErrorFlag="toggleErrorFlag"
              />
            </div>
            <div v-show="newVinError" class="new-vin-wrapper__error">
              <p>We could not find your vehicle</p>
              <p>{{ getVrm() }}</p>
              <p>Please select it below</p>
            </div>
            <SfBar>
              <template #title>
                <p class="om-selector-modal__header-title">
                  Or Select Your Vehicle Manually
                </p>

                <SfSteps
                  :active="currentStep"
                  :steps="steps"
                  @change="changeStep"
                >
                  <SfStep v-for="step in steps" :key="step" :name="step" />
                </SfSteps>
              </template>
            </SfBar>
          </div>
          <div class="om-selector-modal__content">
            <SfLoader v-if="loading" :loading="loading" />
            <div v-if="!loading && loadingError">
              Not connecting ES
            </div>
            <div v-if="!loading && !loadingError">
              <div
                v-for="item in currentItems"
                :key="item.label"
                class="om-selector-modal__content-item"
                @click="onSelectVehicle(item.label)"
              >
                <div class="title">
                  {{ item.label }}
                </div>
                <i class="icon-arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </transition>
    </SfModal>
  </div>
</template>

<script>
import { SfModal, SfBar, SfCheckbox, SfImage, SfSteps, SfLoader } from '@storefront-ui/vue';
import NewVehicle from '../om-hero/new-vehicle.vue';
import config from 'config';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { mapActions } from 'vuex';

export default {
  name: 'OmSelectorModal',
  components: {
    SfModal,
    SfBar,
    SfCheckbox,
    NewVehicle,
    SfImage,
    SfSteps,
    SfLoader
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    modalData: {
      type: Object,
      default: () => ({
        payload: {
          hasError: false,
          regCode: '',
          successAction: false
        },
        name: 'modal'
      }),
      required: true
    }
  },
  data () {
    return {
      currentItems: [],
      searchPattern: [],
      currentStep: 0, // it's number, not string
      esItems: [],
      steps: [
        'Model',
        'Year',
        'Bodystyle',
        'Fuel',
        'Transmission',
        'Trim',
        'Engine'
      ],
      loading: false,
      loadingError: false,
      newVinError: false,
      models: [],
      years: []
    };
  },
  methods: {
    ...mapActions({
      toggleSidebar: 'ui/toggleSidebar'
    }),
    async onSelectVehicle (label) {
      const storeview = currentStoreView();
      this.searchPattern = [...this.searchPattern, label];
      if (this.currentStep === 0) {
        this.currentItems = this.normalizationData(this.years, 1);
      } else if (this.currentStep === 1) {
        this.loading = true;
        const {
          data: { result, success }
        } = await axios.post(`${config.api.url}/api/vehicle/models-` + storeview.storeId, {
          Model: this.searchPattern[0],
          Year: this.searchPattern[1]
        });
        this.loading = false;

        if (success) {
          this.esItems = result.map(item => item._source);
          const currentStepItems = this.esItems.reduce((result, item) => {
            const existItem = result.find(i => i[this.steps[2]] === item[this.steps[2]])
            if (!existItem) {
              result = [...result, item];
            }
            return result;
          }, []);

          this.currentItems = this.normalizationData(currentStepItems, 2);
        } else {
          this.loadingError = true;
        }
      } else {
        this.currentItemsBySearchPattern(this.currentStep + 1);
      }

      if (this.searchPattern.length === this.steps.length) {
        let finalProduct = this.esItems.find(item => {
          return this.searchPattern.every((pattern, index) => {
            if (index === 1) {
              return true;
            }
            return Object.values(item).indexOf(pattern) >= 0;
          });
        });
        finalProduct = Object.assign({}, { ...finalProduct, Year: this.searchPattern[1], National_Code: finalProduct['National_code'] });
        ['YearStart', 'YearEnd', 'ProdStart', 'ProEnd', 'National_code'].map(key => {
          delete finalProduct[key];
        });

        await this.$store.dispatch('vehicles/saveVehicles', finalProduct);
        await this.$store.dispatch('vehicles/saveActiveVehicle', finalProduct);
        if (this.modalData?.payload.successAction) {
          this.toggleSidebar({ type: 'vehiclecart' });
        }
        this.closeModal();
        this.currentItems = this.normalizationData(this.models, 0);
        this.searchPattern = [];
        this.currentStep = 0;
      } else {
        this.currentStep++;
      }
    },
    changeStep (nextStep) {
      if (nextStep < this.currentStep) {
        this.searchPattern = this.searchPattern.slice(0, nextStep);
        if (nextStep === 0) {
          this.currentItems = this.normalizationData(this.models, 0);
        } else if (nextStep === 1) {
          this.currentItems = this.normalizationData(this.years, 1);
        } else {
          this.currentItemsBySearchPattern(nextStep);
        }
        this.currentStep = nextStep;
      }
    },
    normalizationData (items, level) {
      return items.map(item => ({
        label: item[this.steps[level]],
        image: ''
      }))
    },
    currentItemsBySearchPattern (step) {
      const currentStepItems = this.esItems.reduce((result, item) => {
        const isMatched = this.searchPattern.every((pattern, index) => {
          if (index === 1) {
            return true;
          }
          return Object.values(item).indexOf(pattern) >= 0;
        });

        if (isMatched) {
          const existItem = result.find(i => i[this.steps[step]] === item[this.steps[step]]);
          if (!existItem) {
            result = [...result, item];
          }
        }

        return result;
      }, []);

      this.currentItems = this.normalizationData(currentStepItems, step)
    },
    closeModal () {
      this.$emit('close', this.modalData.name);
    },
    toggleErrorFlag (flag) {
      this.newVinError = flag;
    },
    getVrm () {
      if (this.modalData.payload.regCode) {
        return this.modalData.payload.regCode
      } else {
        return this.$refs['newVehicle'] ? this.$refs['newVehicle'].vrm : '';
      }
    }
  },
  watch: {
    isVisible (val) {
      if (val) {
        this.newVinError = this.modalData.payload.hasError;
      }
    }
  },
  async mounted () {
    const storeview = currentStoreView();
    let fileName = 'year_' + storeview.storeId + '.json';
    const allYears = await import(`theme/resource/vehicle-models/${fileName}`).then(module => module.default);
    this.years = allYears.sort((a, b) => Number(b['Year']) - Number(a['Year']));

    fileName = 'model_' + storeview.storeId + '.json';
    this.models = await import(`theme/resource/vehicle-models/${fileName}`).then(module => module.default);

    this.currentItems = this.normalizationData(this.models, 0);
    this.newVinError = this.modalData.payload.hasError;
  }
};
</script>

<style lang="scss">
.om-selector-modal {
  .sf-modal__close {
    display: none;
  }

  .sf-modal__content {
    padding: 0;

    .sf-bar {
      width: 100%;
      height: auto;
      padding: 10px;

      & > div:nth-child(2) {
        width: 100% !important;
      }
    }
  }

  .sf-steps {
    &__title {
      font-size: 12px;
    }
  }

  &__new-vehicle {
    text-align: left;

    .new-vehicle {
      margin-left: 12px;
    }
  }

  &__wrapper {
    position: relative;
    text-align: center;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__header {
    width: 100%;

    &-title {
      margin: 0;
      text-align: center;
      padding: 10px 0;
      margin-bottom: 10px;
      font-weight: 500;
      font-family: var(--font-family-secondary);
    }

    &-subtitle {
      font-size: 12px;
      font-weight: 400;
      text-align: center;
    }

    .vuejs-progress-bar {
      width: 100%;

      svg {
        width: 100% !important;
      }
    }
  }

  &__content {
    min-height: 45vh;
    max-height: 45vh;
    overflow: auto;

    &-item {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
      padding: 15px;
      i{
        font-size: 30px;
      }

      .sf-image {
        width: 170px;
        margin-right: 5px;
      }

      .title {
        font-weight: bold;
        font-size: 16px;
      }

      .description {
        font-size: 14px;
        color: gray;
      }
    }

    .sf-loader {
      height: inherit;
      position: relative;
      min-height: inherit;
    }

    &.with-progressbar {
      margin-top: 78px !important;
    }
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    .sf-button {
      padding: 13px 25px;
      margin: 0 10px;
    }
  }

  .new-vin-wrapper__error {
    color: red;
  }
}
</style>

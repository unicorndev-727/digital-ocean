import Vue from 'vue';
import * as VehicleStorage from './vehicles-storage';
import axios from 'axios';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import config from 'config';

export const vehiclesStore = {
  namespaced: true,
  state: {
    savedVehicles: [],
    svgs: {},
    activeVehicle: {},
    storyblok: null,
    tooltips: [],
    selectedSvgCode: '',
    svgEventName: '',
    criterias: [],
    stripeToken: null,
    showSetPrompt: false
  },
  actions: {
    async fetchVehicles ({ commit }) {
      const result = await VehicleStorage.getSavedVehiclesData();

      commit('setVehicles', result);
    },
    async fetchActiveVehicle ({ commit }) {
      const result = await VehicleStorage.getActiveVehicleData();

      commit('setActiveVehicle', result);
    },
    async fetchStoryblok ({ commit }) {
      const result = { global: {}, home: {}, about: {} };
      const storeId = currentStoreView().storeId;

      await Promise.all(Object.keys(result).map(async (key) => {
        const res: any = await axios.get(
          `https://shop.theoceangroup.co.uk/api/storyblok/storyblok-${storeId}/${key}`
        );

        if (res?.data?.success) {
          result[key] = res?.data?.result
        }
      }))

      commit('setStoryblok', result);
    },
    async saveVehicles ({ commit }, vehicle) {
      await VehicleStorage.saveVehicles(vehicle);
      const vehicles = await VehicleStorage.getSavedVehiclesData();
      commit('setVehicles', vehicles);
    },
    async saveActiveVehicle ({ commit }, vehicle) {
      await VehicleStorage.saveActiveVehicle(vehicle);
      commit('setActiveVehicle', vehicle);
    },
    async removeVehicle ({ commit }, vehicle) {
      await VehicleStorage.removeVehicle(vehicle);
      commit('removeVehicle', vehicle);
    },
    async clearVehicles ({ commit }) {
      await VehicleStorage.clearVehicles();
      commit('clearVehicles');
    }
  },
  mutations: {
    addNewSvg (state, svg) {
      const { key, value } = svg;
      const stateSvgInstance = Object.assign({}, state.svgs);
      stateSvgInstance[key] = value;
      state.svgs = stateSvgInstance;
    },
    clearSvgs (state) {
      state.svgs = {};
    },
    setActiveVehicle (state, vehicle) {
      Vue.set(state, 'activeVehicle', vehicle);
    },
    setVehicles (state, vehicles) {
      Vue.set(state, 'savedVehicles', vehicles);
    },
    setStoryblok (state, payload) {
      Vue.set(state, 'storyblok', payload);
    },
    removeVehicle (state, vehicle) {
      const oldVehicles = [...state.savedVehicles];
      const newVehicles = oldVehicles.filter(v => {
        return v.National_Code !== vehicle.National_Code;
      });
      Vue.set(state, 'savedVehicles', newVehicles);

      if (state.activeVehicle.National_Code === vehicle.National_Code) {
        Vue.set(state, 'activeVehicle', newVehicles[0]);
      }
    },
    clearVehicles (state) {
      Vue.set(state, 'activeVehicle', {});
      Vue.set(state, 'activeVehicle', []);
    },
    setTooltips (state, payload) {
      Vue.set(state, 'tooltips', payload);
    },
    setSelectedSvgCode (state, payload) {
      Vue.set(state, 'selectedSvgCode', payload);
    },
    setSvgEvent (state, payload) {
      Vue.set(state, 'svgEventName', payload);
    },
    setCriterias (state, payload) {
      Vue.set(state, 'criterias', payload);
    },
    setStripeToken (state, payload) {
      Vue.set(state, 'stripeToken', payload);
    },
    toggleSetPrompt (state, payload) {
      Vue.set(state, 'showSetPrompt', payload);
    }
  },
  getters: {
    getAttributeIdByLabel: (state, getters, rootState, rootGetters) => (
      attributeCode,
      attributeLabel
    ) => {
      const attribute =
        rootGetters['attribute/getAttributeListByCode'][attributeCode];
      if (!attribute) {
        return null;
      }
      const attributeId = attribute.options.find(
        option => option.label === attributeLabel
      )?.value;
      return attributeId || null;
    },
    getAttributeLabelById: (state, getters, rootState, rootGetters) => (
      attributeCode,
      attributeId
    ) => {
      const attribute =
        rootGetters['attribute/getAttributeListByCode'][attributeCode];
      if (!attribute) {
        return null;
      }

      const attributeLabel = attribute.options.find(
        option => option.value === attributeId.toString()
      )?.label;
      return attributeLabel || null;
    },
    getVehicleByNationalCode: (
      state,
      getters,
      rootState,
      rootGetters
    ) => nationalCode => {
      return state.savedVehicles.find(
        vehicle => vehicle.National_Code === nationalCode
      );
    },
    vehicles: state => {
      const result = state.savedVehicles.filter(
        vehicle => vehicle.National_Code !== state.activeVehicle.National_Code
      );

      if (state.activeVehicle?.National_Code) {
        return [state.activeVehicle, ...result];
      } else {
        return [];
      }
    },
    activeVehicle: state => {
      return state.activeVehicle;
    },
    svgObjectIds: state => {
      return state.svgObjectIds;
    },
    storyblok: state => {
      let result = {};
      if (state.storyblok) {
        Object.keys(state.storyblok).map(key => {
          result[key] = state.storyblok[key].content;
        });
      }

      return result;
    },
    storyblokContent: state => (key, page = 'home') => {
      const contents = {};
      if (state.storyblok) {
        Object.keys(state.storyblok).map(key => {
          contents[key] = state.storyblok[key].content;
        });
      }

      if (contents[page]) {
        return contents[page]['body'].find(
          content => content.component === key
        );
      } else {
        return null;
      }
    },
    tooltips: state => {
      return state.tooltips;
    },
    currentSvgCodeTooltip: state => {
      const currentTooltip = state.tooltips?.find(
        ({ calloutNumber }) => calloutNumber === state.selectedSvgCode
      );

      return (
        currentTooltip || {
          sku: '',
          tooltip: '',
          calloutNumber: ''
        }
      );
    },
    svgEventName: state => {
      return state.svgEventName;
    },
    getStripeToken: state => {
      return state.stripeToken;
    }
  }
};

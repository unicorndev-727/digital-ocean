import { setupMultistoreRoutes } from '@vue-storefront/core/lib/multistore';
import App from './App';
import routes from './router';
import Vue from 'vue';
import VueProgressBar from 'vue-progressbar';
import '@vue-storefront/core/lib/passive-listeners';
import { once } from '@vue-storefront/core/helpers';
import { module as cartModule } from './store/cart';

import { claimsStore } from 'theme/store/claims';
import { vehiclesStore } from 'theme/store/vehicles';
import { omLocatorStore } from 'theme/store/om-locator';
import { homepageStore } from 'theme/store/homepage';
import { uiStore } from 'theme/store/ui';
import { promotedStore } from 'theme/store/promoted-offers';
import { instagramStore } from 'theme/store/instagram-images';
import { FulfillmentStore } from 'theme/store/fulfillment';
import { defaultContentStore } from 'theme/store/default-content';
import { StorageManager } from '@vue-storefront/core/lib/storage-manager';
// import { VueReCaptcha } from 'vue-recaptcha-v3';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import OmPanZoom from 'theme/components/omni/om-panzoom.vue';
import * as sbComponents from 'theme/components/storyblok/index.js';

Object.keys(sbComponents).map(key => {
  Vue.component(sbComponents[key].name, sbComponents[key]);
})

Vue.use(VueAwesomeSwiper /* { default options with global component } */);
// Vue.use(VueReCaptcha, { siteKey: '6LeMJLkZAAAAADcLY2qurohjqjDcZszw98_u1MSE' });

Vue.component('OmPanZoom', OmPanZoom);

once('__VUE_EXTEND_DROPPOINT_VPB__', () => {
  const options = {
    color: '#4d4d4d'
  };
  Vue.use(VueProgressBar, options);
});

const themeEntry = App;
function initTheme (app, router, store, config) {
  store.registerModule('themeCart', cartModule);
  setupMultistoreRoutes(config, router, routes, 10);

  StorageManager.init('claims');
  store.registerModule('claims', claimsStore);
  store.registerModule('homepage', homepageStore);
  store.registerModule('ui', uiStore);
  store.registerModule('promoted', promotedStore);
  store.registerModule('instagram', instagramStore);
  store.registerModule('defaultContent', defaultContentStore);
  store.registerModule('vehicles', vehiclesStore);
  store.registerModule('omLocator', omLocatorStore);
  store.registerModule('Fulfillment', FulfillmentStore);
}

export { themeEntry, initTheme };

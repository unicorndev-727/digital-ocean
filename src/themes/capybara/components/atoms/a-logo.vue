<template>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo"
    v-if="storeId == 2"
  >
    <div class="a-logo__holder">
      <span :class="['a-logo__copy', menuStyle]">Ocean Group<br>BMW</span>
      <SfImage
        v-if="menuStyle"
        :src="logoLight"
        :alt="$t(defaultTitle)"
        class="sf-header__logo"
      />
      <SfImage
        v-else
        :src="logoDark"
        :alt="$t(defaultTitle)"
        class="sf-header__logo"
      />
    </div>
  </router-link>
  <router-link
    :to="localizedRoute('/')"
    :title="$t('Home Page')"
    class="a-logo--left"
    v-else
  >
    <div class="a-logo__holder">
      <SfImage
        v-if="menuStyle"
        :src="logoLight"
        :alt="$t(defaultTitle)"
        class="sf-header__logo--left"
      />
      <SfImage
        v-else
        :src="logoDark"
        :alt="$t(defaultTitle)"
        class="sf-header__logo--left"
      />
      <span :class="['a-logo--left__copy', menuStyle]">Ocean Group<br>MINI</span>
    </div>
  </router-link>
</template>

<script>
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { SfImage } from '@storefront-ui/vue';
import get from 'lodash-es/get';

const storeView = currentStoreView();

export default {
  components: { SfImage },
  props: {
    menuStyle: String
  },
  computed: {
    defaultTitle () {
      return get(storeView, 'seo.defaultTitle', config.seo.defaultTitle);
    },
    storeId () {
      return currentStoreView().storeId;
    },
    logoLight () {
      return ('/assets/' + currentStoreView().storeId + '-white.svg');
    },
    logoDark () {
      return ('/assets/' + currentStoreView().storeId + '-dark.svg');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.a-logo {
  display: block;
  order: 1;
  margin-right: 40px;
   @include for-mobile {
     margin-right: 15px;
   }
  &__holder{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__copy{
    text-align: right;
    letter-spacing: .03em;
    padding: 0 20px;
    white-space: pre;
    line-height: 122%;
    font-family: var(--font-family-bold);
    color: #000000;
     @include for-mobile {
       font-size: 13px;
     }
    &.navigation-transparent{
      color: #ffffff;
    }
  }
}
.a-logo--left {
  display: block;
  margin-left: 40px;
   @include for-mobile {
     margin-left: 15px;
   }
  &__holder{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__copy{
    text-align: left;
    letter-spacing: .03em;
    padding: 0 20px;
    white-space: pre;
    line-height: 122%;
    font-family: var(--font-family-bold);
    color: #000000;
     @include for-mobile {
       font-size: 13px;
     }
    &.navigation-transparent{
      color: #ffffff;
    }
  }
}
::v-deep .sf-image img {
  width: 56px;
  height: 56px;
   @include for-mobile {
     height: 42px;
     width: 42px;
   }
}
::v-deep .sf-header__logo--left img {
  width: 75px;
  height: 75px;
   @include for-mobile {
     height: 42px;
     width: 42px;
   }
}
</style>

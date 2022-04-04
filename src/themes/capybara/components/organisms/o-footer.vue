<template>
  <footer class="o-footer">
    <div class="mb-container">
      <div class="mb-footer__information-bar">
        <ul class="information-card">
          <li class="information-card__item">
            <a @click="openContactModal">
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 33.5" aria-hidden="true" class="dcp-frame-footer-tile__icon"><path d="M0 0h5.163l14.829 16.81L5.343 33.5H.12l12.848-16.69z" /></svg>
            </a>
          </li>
          <li class="information-card__item">
            <a @click="openInfoModal('modal-faq')">
              FAQ's
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 33.5" aria-hidden="true" class="dcp-frame-footer-tile__icon"><path d="M0 0h5.163l14.829 16.81L5.343 33.5H.12l12.848-16.69z" /></svg>
            </a>
          </li>
          <li class="information-card__item">
            <a @click="openInfoModal('modal-delivery')">
              Delivery Information
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 33.5" aria-hidden="true" class="dcp-frame-footer-tile__icon"><path d="M0 0h5.163l14.829 16.81L5.343 33.5H.12l12.848-16.69z" /></svg>
            </a>
          </li>
          <li class="information-card__item">
            <a @click="openInfoModal('modal-returns')">
              Returns Information
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 33.5" aria-hidden="true" class="dcp-frame-footer-tile__icon"><path d="M0 0h5.163l14.829 16.81L5.343 33.5H.12l12.848-16.69z" /></svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="mb-footer__to-top">
      <div class="mb-container to-top__container">
        <div @click="backToTop" class="back-to-top">
          <p>To Top</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 33.5" aria-hidden="true" class="dcp-frame-footer-breadcrumb-link-up__icon"><path d="M0 0h5.163l14.829 16.81L5.343 33.5H.12l12.848-16.69z" /></svg>
        </div>
      </div>
    </div>
    <div class="mb-container mb-footer__terms">
      <div class="mb-footer__terms--left">
        <ul class="terms-links">
          <li class="terms-links__item">
            <a @click="openInfoModal('modal-privacy')">Privacy Policy</a>
          </li>
          <li class="terms-links__item">
            <a @click="openInfoModal('modal-terms')">Terms of Sale</a>
          </li>
        </ul>
      </div>
      <div class="mb-footer__terms--right">
        <p>©️ Ocean Group 2022. All rights reserved.</p>
        <p>Ocean GROUP St Modwen House Longbridge Road Plymouth PL6 8LD</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ABackToTop from 'theme/components/atoms/a-back-to-top';
import { SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { getPathForStaticPage } from 'theme/helpers';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { createSmoothscroll } from 'theme/helpers';
import get from 'lodash-es/get';

export default {
  name: 'OFooter',
  components: {
    ABackToTop,
    SfFooter,
    SfList,
    SfMenuItem
  },
  data () {
    return {
      social: ['facebook', 'pinterest', 'twitter', 'youtube']
    };
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    multistoreEnabled () {
      return get(config, 'storeViews.multistore', false);
    },
    currentLanguage () {
      const { i18n = config.i18n } = currentStoreView();
      return `${i18n.defaultCountry} / ${i18n.defaultLanguage} / ${i18n.currencyCode}`;
    },
    links () {
      return {
        orders: {
          name: 'Orders',
          children: [
            {
              name: 'My account',
              ...this.isLoggedIn
                ? { link: '/my-account' }
                : { clickHandler: () => this.openModal({ name: ModalList.Auth, payload: 'login' }) }
            },
            { name: 'Delivery', link: '/delivery' },
            { name: 'Return policy', link: '/returns' }
          ]
        },
        help: {
          name: 'Help',
          children: [
            { name: 'Customer service', link: '/customer-service' },
            { name: 'Contact us', link: '/contact' }
          ]
        },
        about: {
          name: 'About us',
          children: [
            {
              name: 'About us',
              link: getPathForStaticPage('/about-us')
            },
            {
              name: 'Customer service',
              link: getPathForStaticPage('/customer-service')
            },
            { name: 'Find A Retailer', link: '/store-locator' }
          ]
        }
      };
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    backToTop () {
      createSmoothscroll(document.documentElement.scrollTop || document.body.scrollTop, 0)
      this.$emit('scrolled');
    },
    showLanguageSwitcher () {
      this.openModal({ name: ModalList.LanguageSwitcher })
    },
    openInfoModal (contentKey) {
      this.openModal({ name: ModalList['OmInfoModal'],
        payload: {
          contentKey
        }
      });
    },
    openContactModal () {
      this.openModal({ name: ModalList['OmContactModal'] });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-footer {
  background: #262626;
  color: #fff;
  @include for-desktop {
    margin: auto;
    padding: 0 0 40px 0;
  }
  .sf-footer {
    --footer-width: auto;
    max-width: 1680px;
    margin: auto;
    width: 86%;
  }
.mb-footer__information-bar{
  padding: 48px 20px;
  .information-card{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-column-gap: 20px;
    padding: 0;
    margin: 0;
    list-style: none;
    @include for-mobile{
    grid-template-columns: 1fr;
    grid-column-gap: 0;
    grid-row-gap: 20px;
    }
  &__item{
    a{
       display: flex;
      align-content: space-between;
      justify-content: space-between;
      padding: 24px;
      color: #fff;
      font-size: 18px;
      font-weight: 700;
        svg{
      width: 20px;
      height: 20px;
      fill: #fff;
    }
    @include for-mobile{
      padding: 16px;
    }
    }
  }
  }
}
.mb-footer__to-top{
  border-top: 1px solid #7d7d7d;
  border-bottom: 1px solid #7d7d7d;
  .to-top__container{
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: flex-end;
    color: #bfbfbf;
    .back-to-top{
      display: flex;
      cursor: pointer;
      align-items: center;
      svg{
        fill: #bfbfbf;
        width: 16px;
        transform: rotate(270deg);
        margin-left: 10px;
        height: 16px;
      }
    }
  }
}
.mb-footer__terms{
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  @include for-mobile{
    flex-wrap: wrap;
  }
  &--left{
    width: 50%;
  .terms-links{
    list-style: none;
    display: flex;
    padding: 0;
    &__item{
      margin-right: 24px;
    a{
      color: #bfbfbf;
      font-size: 16px;
    }
    }
  }
  @include for-mobile{
    width: 100%;
  }
  }
  &--right{
    width: 50%;
    text-align: right;
    color: #bfbfbf;
    @include for-mobile{
      width: 100%;
      text-align: left;
    }
  }
}
}
.social-column {
  flex-basis: auto;
}
.social-icon {
  padding: var(--spacer-sm) var(--spacer-xl);
  @include for-desktop {
    padding: var(--spacer-xs) 0;
  }
  &__img {
    height: 1.75rem;
    &:not(:last-child) {
      margin-right: var(--spacer-base);
    }
  }
}
::v-deep .sf-footer-column__title{
    color: #fff;

}
::v-deep .sf-menu-item__label{
  color: #fff;
}
</style>

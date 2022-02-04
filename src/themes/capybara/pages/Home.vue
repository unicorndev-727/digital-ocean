<template>
  <div id="home">
    <transition-group name="fade">
      <component
        v-for="content in storyblokData"
        :key="content._uid"
        :is="getComponentName(content.component)"
        :content="content"
        :varient="content.variant"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Logger } from '@vue-storefront/core/lib/logger';
import { isServer, onlineHelper } from '@vue-storefront/core/helpers';

export default {
  name: 'Home',
  components: {},
  data () {
    return {
      loading: true
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'user/isLoggedIn',
      dummyInstagramImages: 'instagram/getInstagramImages'
    }),
    ...mapGetters('vehicles', [
      'storyblok'
    ]),
    isOnline () {
      return onlineHelper.isOnline;
    },
    storyblokData () {
      if (this.storyblok && this.storyblok['home']) {
        return this.storyblok['home'].body
      } else return []
    }
  },
  methods: {
    getComponentName (name) {
      return `sb-${name.replaceAll('_', '-')}`;
    }
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect');
      if (redirectObj) this.$router.push(redirectObj);
      localStorage.removeItem('redirect');
    }
  },
  async asyncData ({ store, context }) {
    Logger.info('Calling asyncData in Home (theme)')();
    if (context) context.output.cacheTags.add(`home`);
  },
  async mounted () {
    this.$store.commit('vehicles/toggleSetPrompt', true);
    if (!this.isLoggedIn && localStorage.getItem('redirect')) {
      this.$bus.$emit('modal-show', 'modal-signup');
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) {
      next((vm) => {
        vm.$store.dispatch('homepage/fetchNewCollection').then(() => {
          vm.loading = false;
        });
      });
    } else {
      next();
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Home Page'),
      meta: this.$route.meta.description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: this.$route.meta.description
          }
        ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#home {
  box-sizing: border-box;
  padding: 0;
  background: white;
  @include for-desktop {
    max-width: 100%;
    margin: 0 auto;
  }
}
.sf-hero-item {
  --hero-item-height: 14rem;
  height: initial;
}
.banner-grid {
  margin: var(--spacer-base) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
  }
}
.brand-logos {
  margin-bottom: var(--spacer-xl);
}
::v-deep .section {
  padding: 0 var(--spacer-xl);
  --section-margin: var(--spacer-xl) 0;
  --section-content-margin: var(--spacer-xl) 0 0 0;
  .sf-heading__title.sf-heading__title--h2 {
    font-weight: 700;
    font-size: 26px;
    color: #444444;
  }
}
</style>

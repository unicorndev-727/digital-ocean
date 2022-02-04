<template>
  <SfButton
    class="sf-button--pure a-account-icon"
    @click="goToAccount"
  >
    <div class="sf-header__custom-icon" :class="[{
      'sf-header__icon--is-active': isLoggedIn
    }, menuStyle]"
    >
      <i class="icon-user" />
    </div>
  </SfButton>
</template>

<script>
import { SfIcon, SfButton } from '@storefront-ui/vue';
import { mapGetters, mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'

export default {
  components: { SfIcon, SfButton },
  props: {
    menuStyle: String
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn'])
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    goToAccount () {
      if (this.isLoggedIn) {
        this.$router.push(this.localizedRoute('/my-account'))
      } else {
        this.openModal({ name: ModalList.Auth, payload: 'login' })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sf-header__custom-icon{
  font-size: 48px;
  color: #0c121c;
  line-height: 48px;
  &.navigation-transparent{
    color: #ffffff;
  }
}
</style>

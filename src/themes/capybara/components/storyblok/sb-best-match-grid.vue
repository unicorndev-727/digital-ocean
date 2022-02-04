<template>
  <div class="sb-best-match-grid">
    <div class="title-area">
      <h3>Shop Online</h3>
      <h6>Explore Our Range</h6>
    </div>
    <div class="sb-best-match-grid__container">
      <OmCard
        v-for="(card, index) in cards"
        :key="index"
        :info="card"
      />
    </div>
  </div>
</template>

<script>
import OmCard from '../omni/om-card-collection/om-card.vue';

export default {
  name: 'SbBestMatchGrid',
  components: {
    OmCard
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    cards () {
      if (this.content) {
        return this.content.logos.map(logo =>
          ({
            imgUrl: logo.logo.filename,
            title: logo.title,
            text: logo.description,
            cta: logo.cta.url

          }))
      } else {
        return []
      }
    }
  }
};
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.sb-best-match-grid {
  width: 90%;
  margin: 50px auto;
  background: #f5f5f5;
  .title-area{
    padding: 50px 30px 0 30px;
  h3{
    text-align: center;
    margin: 0;
  }
  h6{
    text-align: center;
    text-transform: none;
    font-size: 14px;
    margin: 10px 0;
  }
  }
  &__container{
  margin: 0 auto 60px auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: var(--spacer-xl);
  padding: 40px 40px;
    @include for-mobile {
  grid-template-columns: 1fr;
  padding: 0 20px;
    }
    }
}
</style>

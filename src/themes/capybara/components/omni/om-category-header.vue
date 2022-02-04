<template>
  <transition name="fade" mode="out-in">
    <div class="om-category-header">
      <SfHeading :title="title" class="title" />
      <div v-if="links && links.length" class="links">
        <div v-for="product in links" :key="product.id">
          <SfButton @click="goToLink(product.url_path)" class="sf-button sf-button--outline color-light om-category-header__btn">
            <b v-if="product.active">{{ product.name }}</b>
            <span v-else>
              {{ product.name }}
            </span>
          </SfButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { SfHeading, SfButton } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';

export default {
  name: 'OmniCategoryHeader',
  components: {
    SfHeading,
    SfButton
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    products: {
      type: Array,
      default: () => []
    },
    description: {
      type: String,
      default: ''
    },
    parentId: {
      type: Number
    }
  },
  computed: {
    ...mapGetters({
      getCategoriesMap: 'category-next/getCategoriesMap'
    }),
    links () {
      if (this.products?.length) {
        return this.products
      } else {
        const parentKey = Object.keys(this.getCategoriesMap)?.find(key => +key === +this.parentId)

        if (this.getCategoriesMap[parentKey]?.children_data) {
          return this.getCategoriesMap[parentKey].children_data.map(p => {
            if (p.name !== this.title) {
              return p
            } else {
              return { ...p, active: true }
            }
          })
        } else return []
        // return this.getCategoriesMap[parentKey].children_data
      }
    }
  },
  methods: {
    goToLink (url) {
      this.$router.push(this.localizedRoute('/' + url));
    }
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.om-category-header {
  margin: 50px 40px 20px 40px;
  @include for-mobile{
    margin: 5px
  }
  .description {
    display: flex;
    justify-content: center;
    max-width: 800px;
    text-align: left;
    padding: 0 30px 30px 30px;
    p{
      margin: 0;
    }
  }

  .links {
    margin-top: 5px;
    display: flex;
    padding: 10px 0;
    height: 45px;
    gap: 20px;
    justify-content: flex-start;
    white-space: pre-wrap;
    max-width: 90vw;
    overflow: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  @include for-desktop{
    max-width: 800px;
  }
  }
.links::-webkit-scrollbar {
  display: none;
}
  .sf-heading {
    margin: 10px 0 20px 0;
    text-align: left;
  }
  &__btn{
    border: none;
    font-size: 14px;
    padding: 10px 15px;
    border: 1px solid #cacaca;
    background: #fff;
    border-radius: 8px;
  }
}
</style>

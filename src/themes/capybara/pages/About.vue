<template>
  <div class="static-page">
    <transition-group name="fade">
      <component
        v-for="content in storyblokData.body"
        :key="content._uid"
        :is="getComponentName(content.component)"
        :content="content"
      />
    </transition-group>
  </div>
</template>

<script>
import axios from 'axios';
import { SfLoader } from '@storefront-ui/vue';

export const getStoryblokData = async (pageId) => {
  const res = await axios.get(
    `https://altayer-stage.omninext.co.uk/api/storyblok/storyblok-4/${pageId}`
  );

  if (res.data.success) {
    return res.data.result.content;
  }
  return {};
}

export default {
  name: 'StaticPage',
  components: {
    SfLoader
  },
  data () {
    return {
      storyblokData: {}
    };
  },
  methods: {
    getComponentName (name) {
      return `sb-${name.replaceAll('_', '-')}`;
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler () {
        this.storyblokData = await getStoryblokData(this.$route.params.pageId)
      }
    }
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || `${this.$route.params.pageId} Page`,
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

.loading-container {
  height: 100vh;
}

</style>

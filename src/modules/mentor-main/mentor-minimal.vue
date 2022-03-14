<template>
  <nav :class="`${isMobile() ? 'nav' : 'nav pc'}`">
    <span> {{ title }} </span>
    <i class="fas fa-arrow-left" @click="goOnePageBack()"></i>
  </nav>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';

export default defineComponent({
  props: {
    title: { type: String, default: '' },
    onePageBack: { default: '', type: String }
  },
  setup(props) {
    const goOnePageBack = () => {
      if (props.onePageBack) {
        router.push({
          name: props.onePageBack
        });
      } else {
        router.go(-1);
      }
    };

    return { goOnePageBack };
  }
});
</script>
<style lang="scss" scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.19);
  color: white;
  background: transparent;
  padding: 5px;
  img {
    padding: 0;
    margin: 0;
  }
  span {
    font-size: 11px;
    font-weight: bold;
    padding: 0.4rem;
  }
}
</style>

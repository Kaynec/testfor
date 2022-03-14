<template>
  <div class="st-wrapper" :style="getMainStyle()">
    <desktopRightSide v-if="!isMobile() && store.getters.getMentorToken" />
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import desktopRightSide from '@/modules/mentor-main/desktop-rightside.vue';
import detectMobile from '@/mixins/detectMobile';
import { store } from '@/store';

@Options({
  components: { desktopRightSide }
})
export default class Main extends Vue {
  public data(): any {
    return {
      windowHeight: window.innerHeight,
      store: store
    };
  }

  public ismobile = detectMobile.methods.isMobile();

  onResize(): void {
    (this as any).windowHeight = window.innerHeight;
  }

  getMainStyle() {
    let fraction = '';

    if (this.ismobile) {
      fraction = '1fr';
    } else if (!this.ismobile && !store.getters.getMentorToken) {
      fraction = '1fr';
    } else {
      fraction = '40% 60%';
    }

    return {
      height: `${(this as any).windowHeight - 1}px`,
      'grid-template-columns': fraction
    };
  }
}
</script>
<style lang="scss">
.st-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #f4f4f4;
  display: grid;
  font-family: IRANSans;
}
</style>

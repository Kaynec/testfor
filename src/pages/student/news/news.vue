<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <div
    class="shop-message"
    :style="`padding-top :${isMobile() ? '6.5vh' : ' 9rem'}`"
  >
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader
      title="تازه های کنکور"
      goOnePageBack="MyProfile"
      v-if="isMobile()"
    />
    <MinimalHeader
      title="تازه های کنکور"
      goOnePageBack="MyProfile"
      :colors="true"
      v-else-if="!isMobile()"
    />
    <iframe
      src="https://www.mahan.ac.ir/home#!f-1"
      title="description"
      class="iframe"
    ></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: {
    MinimalHeader,
    DesktopMinimalHeader
  },
  setup() {
    const goOnePageBack = () => {
      router.push({
        name: 'MyProfile'
      });
    };

    return {
      goOnePageBack
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop-message {
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  position: relative;
  max-width: 750px;

  .iframe {
    width: 100%;
    height: 100%;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: fixed;
    top: 0;
    .svg {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;
    }

    span {
      font-family: IRANSans;
      //   font-family: IRANYekan;
      font-size: 16px;
      font-weight: bold;
      text-align: right;
      color: #fff;
      z-index: 9999;
      padding: 2rem;
      padding-top: 1.25rem;
    }

    .transform {
      position: absolute;
      bottom: -65%;
      left: 0;
      right: 0;
      width: 75%;
      height: 64px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 52px 0 rgba(0, 0, 0, 0.09);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-family: IRANSans;
        //   font-family: IRANYekan;
        font-size: 15px;
        font-weight: bold;
        text-align: center;
        color: #000;
        white-space: nowrap;
      }
    }
  }

  //
  .paper-icon {
    margin: 0 auto;
  }
}
</style>

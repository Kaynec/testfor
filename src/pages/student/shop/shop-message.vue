<template>
  <div class="desktop" v-if="!isMobile()"></div>
  <div class="shop-message animate__animated animate__fadeIn" v-else>
    <nav class="nav">
      <svg
        class="svg"
        width="100%"
        height="150"
        viewBox="0 0 500 80"
        preserveAspectRatio="none"
      >
        <path d="M0,0 L0,40 Q250,80 500,40 L500,0 Z" fill="black" />
      </svg>
      <span> امتیاز کسب شده </span>
      <div class="transform">
        <span> پیغام خرید موفق یا ناموفق </span>
      </div>
    </nav>
    <img
      src="@/assets/img/paper-icon.png"
      class="paper-icon"
      alt="paper icon"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';

export default defineComponent({
  setup() {
    const goOnePageBack = () => router.go(-1);

    return {
      goOnePageBack
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop-message {
  position: relative;
  overflow-x: hidden;
  background: #fff;
  font-family: IRANSans;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

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

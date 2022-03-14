<template>
  <div
    :class="`${isMobile() ? 'shop-order-failure' : 'shop-order-failure pc'}`"
  >
    <DesktopMinimalHeader v-if="!isMobile()" />
    <img src="@/assets/img/failkey-red@2x.png" alt="White failure Key" />
    <h6>سفارش شما ثبت نشد</h6>
    <div class="middle-card animate__animated animate__fadeIn">
      <div class="left">
        <p>3235454533</p>
        <p>۲ آبان ۱۴۰۰</p>
        <p>۰۷۳۵۴۱</p>
        <p>۴۱۶،۰۰۰ تومان</p>
      </div>

      <div class="right">
        <p>شماره پیگیری</p>
        <p>تاریخ ثبت سفارش</p>
        <p>شماره سفارش</p>
        <p>مبلغ پرداخت نشده</p>
      </div>
      <button @click="goToHomePage">برگشت به برنامه</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { DesktopMinimalHeader },
  setup() {
    const goToHomePage = () => {
      router.push({
        name: 'Home'
      });
    };

    return { goToHomePage };
  }
});
</script>

<style lang="scss" scoped>
.shop-order-failure {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding-top: 5rem;
  font-family: IRANSans;

  img {
    max-width: 30%;
  }

  h6 {
    margin: 18px 0 0;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: #000;
  }

  .middle-card {
    width: 85%;
    max-width: 90%;
    margin: 15px 0 0;
    padding: 15px 32px 19px;
    border-radius: 16px;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    background-color: #fff;
    display: grid;

    // Farsi Is Right to Left Soo

    grid-template-areas:
      'right left'
      'button button';
    .left {
      grid-area: left;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-end;

      p {
        font-size: 12px;
        font-weight: bold;
        line-height: 2.36;
        color: #000;
      }
    }
    .right {
      grid-area: right;

      p {
        font-size: 12px;
        line-height: 2.36;
        text-align: right;
        color: #000;
      }
    }
    button {
      grid-area: button;
      padding: 14px 83px 16px 84px;
      border-radius: 15px;
      background-color: #d3d7e0;
      border: none;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #646464;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    }
  }
}

.pc {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.782);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999999;

  h6 {
    color: #fff;
  }

  .middle-card {
    max-width: 450px;
  }
}
</style>

<template>
  <div class="comp-test" :style="`padding-top :${isMobile() ? '' : '8vh'}`">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <SmallHeader onePageBack="Home" v-if="isMobile()" />
    <div class="hero animate__animated animate__fadeIn">
      <img
        :src="`${
          isMobile()
            ? require('@/assets/img/comptest.png')
            : require('@/assets/img/comptest-pc@3x.png')
        }`"
        :style="`margin-top  : ${isMobile() ? '0' : '2rem'}`"
        class="hero"
        alt="header of comp test"
      />
    </div>
    <div class="btns animate__animated animate__fadeIn">
      <button
        @click="() => (currentState = 'future')"
        :class="{ active: currentState == 'future' }"
      >
        آزمون های جاری
      </button>
      <button
        @click="() => (currentState = 'past')"
        :class="{ active: currentState == 'past' }"
      >
        آزمون های گذشته
      </button>
    </div>

    <keep-alive>
      <CompTestFuture v-if="currentState == 'future'" />
    </keep-alive>
    <keep-alive>
      <CompTestPast v-if="currentState == 'past'" />
    </keep-alive>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SmallHeader from '@/modules/student-modules/header/small-header.vue';
import CompTestPast from '@/modules/student-modules/azmoon/comp-test-past.vue';
import CompTestFuture from '@/modules/student-modules/azmoon/comp-test-future.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
export default defineComponent({
  components: {
    SmallHeader,
    CompTestPast,
    CompTestFuture,
    DesktopMinimalHeader
  },
  setup() {
    const currentState = ref('past');
    return { currentState };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.comp-test {
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  max-width: 750px;
  // padding-top: 5vh;

  .hero {
    width: 100%;
    max-width: 750px;
    max-height: 300px;
    margin-top: 15px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .btns {
    margin: 1rem auto;
    width: 97%;
    display: flex;
    justify-content: center;
    align-items: center;

    button {
      font-family: IRANSans;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 10px;
      outline: none;
      border: none;
      width: 50%;
      box-shadow: 0 0 23px 0 rgba(0, 0, 0, 0.13);
      background: white;
      color: #171717;

      &:nth-child(2) {
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
      }
      &:nth-child(1) {
        border-bottom-right-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
  }
  button.active {
    background-image: $redish-background;
    color: #fff;
  }
}
</style>

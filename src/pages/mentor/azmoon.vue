<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <MentorDesktopHeader v-if="!isMobile()" />
  <div class="comp-test" :style="`padding-top : ${!isMobile() ? '3rem' : ''}`">
    <MinimanHeader title="آزمون های کاربر" />
    <!-- <img src="../../../assets/img/comptest.png" class="hero" /> -->
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

    <CompTestFuture v-if="currentState == 'future'" :id="route.params.id" />

    <CompTestPast v-if="currentState == 'past'" :id="route.params.id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimanHeader from '@/modules/student-modules/header/minimal-header.vue';
import CompTestPast from '@/modules/mentor-main/comp-test-past.vue';
import CompTestFuture from '@/modules/mentor-main/comp-test-future.vue';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  components: {
    MinimanHeader,
    CompTestPast,
    CompTestFuture,
    MentorDesktopHeader
  },
  setup() {
    const currentState = ref('past');
    const route = useRoute();

    return { currentState, route };
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

  .hero {
    width: 100%;
    max-height: 35vh;
  }
  .btns {
    margin: 1rem auto;
    width: 100%;
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
      width: 48%;
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

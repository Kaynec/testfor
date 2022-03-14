<template>
  <div class="podcast pc" v-if="!isMobile()" v-bind="$attrs">
    <DesktopMinimalHeader />
    <div class="audio-container">
      <img src="@/assets/img/podcast.webp" @click="pauseAndPlay" />
      <audio
        :src="audioSrc"
        ref="audio"
        @timeupdate="onUpdate"
        @click="pauseAndPlay"
        autoplay
        alt="audio of component"
      ></audio>

      <div class="progress-container">
        <span v-if="audio && audio.duration">{{
          formatTime(audio.duration)
        }}</span>
        <span v-else>{{ 0 }}</span>

        <div
          class="progressbar"
          @touchend="onTouch"
          @touchmove="touchMove"
          @mousedown="mousedown"
          @mouseup="mouseup"
        >
          <div
            :style="`width : ${
              (audio && (audio.currentTime / audio.duration) * 100) || 0
            }% `"
            class="progressbar-child"
            ref="progressbarChild"
          ></div>
        </div>
        <span>{{ 0 || currentTime }}</span>
      </div>
    </div>
    <span class="back" @click="goBack()">
      برگشت

      <i class="fa fa-angle-right" aria-hidden="true"></i
    ></span>
  </div>
  <!--  -->
  <div class="podcast mobile" v-else>
    <MinimalHeader title="پخش پادکست" onePageBack="Home" />
    <div class="audio-container">
      <img src="@/assets/img/podcast.webp" @click="pauseAndPlay" />
      <audio
        :src="audioSrc"
        ref="audio"
        @timeupdate="onUpdate"
        @click="pauseAndPlay"
        autoplay
      ></audio>

      <div class="progress-container">
        <span v-if="audio && audio.duration">{{
          formatTime(audio.duration)
        }}</span>
        <span v-else>{{ 0 }}</span>

        <div
          class="progressbar"
          @touchend="onTouch"
          @touchmove="touchMove"
          @mousedown="mousedown"
          @mouseup="mouseup"
        >
          <div
            :style="`width : ${
              (audio && (audio.currentTime / audio.duration) * 100) || 0
            }% `"
            class="progressbar-child"
            ref="progressbarChild"
          ></div>
        </div>
        <span>{{ 0 || currentTime }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import router from '@/router';

export default defineComponent({
  components: { DesktopMinimalHeader, MinimalHeader },
  setup() {
    const audio = ref() as any;

    const audioSrc = ref('');

    // Fetching The Podcast

    const currentTime = ref();

    const onUpdate = () => {
      currentTime.value = ~~audio.value?.currentTime;

      const tmp = currentTime?.value / 60;
      let firstSide = tmp > 0 ? ~~tmp : `0${~~tmp}`;

      let secondSide =
        currentTime.value < 60 ? ~~currentTime.value : ~~currentTime.value % 60;
      currentTime.value = firstSide + ':' + secondSide;
    };

    const pauseAndPlay = () => {
      audio.value.paused ? audio.value.play() : audio.value.pause();
    };
    ``;

    const touchMove = (e: any) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.right;
      // Account for margin and etc
      let deltaX = e.changedTouches[0].clientX - clientRect.left;
      const tmp = ~~audio.value.duration / (~~fullWidth / ~~deltaX);
      audio.value.currentTime = ~~tmp;
      audio.value.play();
    };

    const onTouch = (e: any) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.right;
      // Account for margin and etc
      let deltaX = e.changedTouches[0].clientX - clientRect.left;
      const tmp = ~~audio.value.duration / (~~fullWidth / ~~deltaX);
      audio.value.currentTime = ~~tmp;
      audio.value.play();
    };

    const mousedown = (e) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.width;
      // Account for margin and etc
      let deltaX = e.clientX - clientRect.left;
      const tmp = ~~audio.value.duration / (~~fullWidth / ~~deltaX);
      audio.value.currentTime = ~~tmp;
      audio.value.play();
    };

    const mouseup = (e) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.width;
      // Account for margin and etc
      let deltaX = e.clientX - clientRect.left;
      const tmp = ~~audio.value.duration / (~~fullWidth / ~~deltaX);
      audio.value.currentTime = ~~tmp;
      audio.value.play();
    };

    const formatTime = (time) => {
      const tmp = time / 60;
      if (tmp > 0) {
        let firstSide = tmp > 0 ? ~~tmp : `0${~~tmp}`;
        let secondSide = currentTime.value < 60 ? ~~time : ~~time % 60;
        time = firstSide + ':' + secondSide;
        time = firstSide + ':' + secondSide;
      }

      return time;
    };

    const goBack = () => router.go(-1);

    return {
      audio,
      touchMove,
      onTouch,
      mousedown,
      mouseup,
      formatTime,
      pauseAndPlay,
      onUpdate,
      currentTime,
      goBack,
      audioSrc
    };
  }
});
</script>

<style lang="scss" scoped>
.podcast {
  width: 100%;
  height: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  position: relative;
  overflow: hidden;
}

.pc {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background: rgba(0, 0, 0, 0.95);
  top: 0;
  left: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .audio-container {
    background-image: url('../../../assets/img/podcast-bg.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 5rem;
    max-width: 700px;
    overflow: hidden;

    img {
      max-width: 50%;
      transform: translate(-50%);
      margin-bottom: 1.5rem;
    }
  }
}

.mobile {
  .audio-container {
    background-image: url('../../../assets/img/podcast-bg.webp');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    display: grid;
    align-content: center;
    justify-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;

    img {
      max-width: 50%;
      margin-bottom: 2rem;
    }
  }
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  min-width: 300px;

  span {
    display: inline-flex;
    &:first-child {
      margin-left: 1rem;
    }
    &:last-child {
      margin-right: 1rem;
    }
  }

  .progressbar {
    flex-grow: 1;
    height: 12px;
    background-color: white;
    position: relative;
    margin-bottom: 1rem;
    color: #000;

    .progressbar-child {
      background-color: red;
      position: absolute;
      height: 100%;
      transition: ease 0.2s;
      width: 10%;
      left: 0;
    }
  }
}
.back {
  color: #fff;
  font-size: 1.3rem;
  padding: 15px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  cursor: pointer;
  align-self: center;
  justify-self: flex-end;
  align-self: flex-start;
  width: clamp(450px, 40vw, 850px);

  i {
    font-size: 2rem;
    margin-left: 0.6rem;
  }
}
</style>

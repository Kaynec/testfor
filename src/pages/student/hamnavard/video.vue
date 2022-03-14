<template>
  <main v-if="!isMobile()" class="pc">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <div class="loader-wrapper" v-if="isLoading">
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <section class="video-container" v-else-if="!isLoading && videoSrc">
      <i
        @click="pauseAndPlay"
        :class="
          pausedStatus == false
            ? 'fas fa-play pause-play'
            : 'fas fa-pause pause-play'
        "
        v-if="videoSrc && video"
        :style="`display : ${video.paused ? 'flex' : 'none'}`"
      ></i>

      <video
        ref="video"
        @timeupdate="onUpdate"
        @click="pauseAndPlay"
        :src="videoSrc"
        alt="video of component"
        autoplay
        v-if="videoSrc"
      ></video>

      <div
        v-if="videoSrc && video"
        class="progress-button"
        :style="`width :${video ? video.clientWidth + 'px' : ''}`"
      >
        <div class="progress-container">
          <span v-if="video && video.duration">{{
            formatTime(video.duration)
          }}</span>
          <span v-else>{{ 0 }}</span>

          <div class="progressbar" @mousedown="mousedown" @mouseup="mouseup">
            <div
              :style="`width : ${
                (video && (video.currentTime / video.duration) * 100) || 0
              }% `"
              class="progressbar-child"
              ref="progressbarChild"
            ></div>
          </div>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </section>
    <h1 class="text-center" v-if="error">خطایی در دریافت ویدیو رخ داده است</h1>
  </main>

  <main class="mobile" v-else>
    <nav class="nav">
      <span> پخش ویدیو </span>
      <i class="fas fa-arrow-left" @click="onePageBack"></i>
    </nav>
    <!-- Spinner -->
    <h1 class="text-center" v-if="isLoading">دزحال بارگیری ویدیو</h1>
    <!--  -->
    <section class="video-container" v-else-if="!isLoading">
      <i
        v-if="video"
        @click="video.paused ? video.play() : video.pause()"
        :class="
          pausedStatus == false
            ? 'fas fa-play pause-play'
            : 'fas fa-pause pause-play'
        "
        :style="`display : ${video.paused ? 'flex' : 'none'}`"
      ></i>

      <div class="progress-button-mobile" v-if="video">
        <div class="progress-container">
          <span>{{ formatTime(video.duration) }}</span>

          <div class="progressbar" @touchend="onTouch" @touchmove="touchMove">
            <div
              :style="`width : ${
                (video && (video.currentTime / video.duration) * 100) || 0
              }% `"
              class="progressbar-child"
              ref="progressbarChild"
            ></div>
          </div>
          <span>{{ currentTime }}</span>
        </div>
      </div>

      <video
        ref="video"
        @click.stop="pauseAndPlay"
        autoplay
        :src="videoSrc"
        @timeupdate="onUpdate"
        v-if="videoSrc"
      ></video>
    </section>
    <h1 class="text-center" v-else-if="error">
      خطایی در دریافت ویدیو رخ داده است
    </h1>
  </main>
</template>

<script lang="ts">
import { baseUrl } from '@/api/apiclient';
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import router from '@/router';
import { store } from '@/store';

export default defineComponent({
  components: { DesktopMinimalHeader },
  setup() {
    const route = useRoute();
    const videoHref = route.params.filename;
    const pausedStatus = ref(false);
    const video = ref() as any;
    const currentTime = ref(0) as any;
    const videoSrc = ref('');
    const isLoading = ref(true);
    const videoUrl = `${baseUrl}session/download-file/${videoHref}`;
    const progressbarChild = ref() as any;
    const error = ref(false);

    (async () => {
      try {
        const blob = await fetch(videoUrl, {
          headers: {
            token: store.getters.getStudentToken
          }
        }).then((r) => r.blob());
        videoSrc.value = URL.createObjectURL(blob);
        isLoading.value = false;
      } catch (err) {
        error.value = true;
        isLoading.value = false;
      }

      // You can now insert video into DOM
    })();

    const onUpdate = () => {
      currentTime.value = ~~video.value?.currentTime;
      video?.paused
        ? (pausedStatus.value = true)
        : (pausedStatus.value = false);

      const tmp = currentTime?.value / 60;
      let firstSide = tmp > 0 ? ~~tmp : `0${~~tmp}`;

      let secondSide =
        currentTime.value < 60 ? ~~currentTime.value : ~~currentTime.value % 60;
      currentTime.value = firstSide + ':' + secondSide;
    };

    const pauseAndPlay = () => {
      pausedStatus.value = !pausedStatus.value;
      video.value.paused ? video.value.play() : video.value.pause();
    };
    ``;

    const touchMove = (e: any) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.height;
      let deltaX = e.changedTouches[0].clientY;
      const tmp = ~~video.value.duration / (~~fullWidth / ~~deltaX);
      video.value.currentTime = ~~Math.abs(tmp - ~~video.value.duration);
    };

    const onTouch = (e: any) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.height;
      let deltaX = e.changedTouches[0].clientY;
      const tmp = ~~video.value.duration / (~~fullWidth / ~~deltaX);
      video.value.currentTime = ~~Math.abs(tmp - ~~video.value.duration);
    };

    const mousedown = (e) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.width;
      // Account for margin and etc
      let deltaX = e.clientX - clientRect.left;
      const tmp = ~~video.value.duration / (~~fullWidth / ~~deltaX);
      video.value.currentTime = ~~tmp;
    };

    const mouseup = (e) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.width;
      // Account for margin and etc
      let deltaX = e.clientX - clientRect.left;
      const tmp = ~~video.value.duration / (~~fullWidth / ~~deltaX);
      video.value.currentTime = ~~tmp;
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

    const onePageBack = () => {
      router.go(-1);
    };

    return {
      videoSrc,
      video,
      formatTime,
      pauseAndPlay,
      pausedStatus,
      onUpdate,
      mouseup,
      mousedown,
      onTouch,
      touchMove,
      currentTime,
      isLoading,
      onePageBack,
      progressbarChild,
      error
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';

main {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  z-index: 9999;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pc {
  .video-container {
    width: 80%;
    margin: 0 auto;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .pause-play {
      background-color: red;
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      width: 120px;
      height: 120px;
      background-image: linear-gradient(268deg, #f55e637a 6%, #a50d1580);
      font-size: 3rem;
      border-radius: 50%;
      z-index: 99;
    }

    video {
      width: 100%;
      max-height: 600px;
      object-fit: contain;
      z-index: 1;
      margin: 0 auto;
    }
  }
}

.mobile {
  transform: rotate(-90deg);
  transform-origin: left top;
  width: 100vh;
  height: 100vw;
  overflow: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .video-container {
    width: 80%;
    height: 50%;
    max-height: 550px;
    margin: 0 auto;
    max-width: 750px;
    display: flex;
    align-items: center;
    justify-content: center;

    .pause-play {
      background-color: red;
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      width: 120px;
      height: 120px;
      background-image: linear-gradient(268deg, #f55e637a 6%, #a50d1580);
      font-size: 3rem;
      border-radius: 50%;
      z-index: 99;
    }

    img {
      width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    video {
      width: 100%;
      max-height: 250px;
      object-fit: contain;
      z-index: 1;
    }
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    position: fixed; /* Set the navbar to fixed position */
    padding: 15px 4.5rem;
    background-color: #1717178f;
    width: 100%;
    max-height: 8vh;
    left: 0;
    top: 0;
    z-index: 99999;

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
}

.progress-button,
.progress-button-mobile {
  position: absolute;
  bottom: 5rem;
  width: 100%;
  left: 0;
  right: 0;
  margin: 1rem auto;
  max-width: 750px;

  .progress-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;

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
}

.progress-button-mobile {
  position: absolute;
  bottom: 0;
  width: 80vh;
  margin: -0.3rem auto;
  left: 0;
  right: 0;
  max-width: 750px;
}

.loader-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

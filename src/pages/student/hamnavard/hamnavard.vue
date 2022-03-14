<template>
  <div :class="`${isMobile() ? 'hamnavard' : 'hamnavard pc'}`">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="همنورد" v-if="isMobile()" OnePageBack="compTest" />
    <!-- Spinner -->
    <div class="loader-parent" v-if="videoLoading">
      <div class="loading1"></div>
      <br />
      <h3>درحال بارگیری ویدیو</h3>
    </div>
    <!--  -->
    <div class="wrapper animate__animatd animate__fadeIn" v-else>
      <i
        @click="pauseAndPlay"
        :class="
          pausedStatus == false
            ? 'fas fa-play pause-play'
            : 'fas fa-pause pause-play'
        "
        v-if="video"
        :style="`display : ${video.paused ? 'flex' : 'none'}`"
      ></i>
      <div class="c-video">
        <video
          class="video"
          autoplay
          @timeupdate="onUpdate"
          @click="pauseAndPlay"
          alt="video of hamnavard"
          ref="video"
          :src="videoSrc"
          type="video/mp4"
          preload="auto"
        ></video>
      </div>
      <!-- Btns -->
      <div class="progress-button">
        <div class="progress-container">
          <span v-if="video && video.duration">{{
            formatTime(video.duration)
          }}</span>
          <span v-else>{{ 0 }}</span>
          <!-- Attaching The event listener to the parent element and filling the child using a ref -->

          <div
            class="progressbar"
            @touchend="onTouch"
            @touchmove="touchMove"
            @mousedown="isMobile() ? '' : mousedown()"
            @mouseup="isMobile() ? '' : mouseup()"
          >
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

        <!-- <button
          @click="changeSendRequest"
          class="btn"
          :class="sendRequest ? 'green' : 'red'"
        >
          <span>
            {{
              sendRequest == false
                ? 'درخواست جلسه مشاوره'
                : 'درخواست شما ارسال شد'
            }}
          </span>
          <i class="fas fa-arrow-right"></i>
        </button> -->
      </div>
    </div>
    <span class="Back" @click="goOnepageBack()">
      برگشت

      <i class="fa fa-angle-right" aria-hidden="true"></i
    ></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { StudentHamnavardApi } from '@/api/services/student/student-hamnavard-service';
import { baseUrl } from '@/api/apiclient';
import { useRoute } from 'vue-router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    const allData = ref({}) as any;
    const sendRequest = ref(false);
    const video = ref(null) as any;
    const currentTime = ref(0) as any;
    const duration = ref(0) as any;
    const pausedStatus = ref(false);
    const progressbarChild = ref() as any;
    const videoSrc = ref('');
    const route = useRoute();
    const videoLoading = ref(false);
    const percent = route.params.percent;

    (async () => {
      const res = await StudentHamnavardApi.getAll();

      if (res.data.data) {
        allData.value = res.data.data;
        videoLoading.value = true;
        allData.value?.videos.forEach((video) => {
          if (
            +percent >= +video.startPercent &&
            +percent <= +video.endPercent
          ) {
            videoSrc.value = `${baseUrl}hamnavard/getVideo/${video.file}`;
          }
        });
      }
      videoLoading.value = false;
    })();

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

    const onUpdate = () => {
      currentTime.value = ~~video.value.currentTime;
      video.value.paused
        ? (pausedStatus.value = true)
        : (pausedStatus.value = false);

      const tmp = currentTime.value / 60;
      let firstSide = tmp > 0 ? ~~tmp : `0${~~tmp}`;

      let secondSide =
        currentTime.value < 60 ? ~~currentTime.value : ~~currentTime.value % 60;
      currentTime.value = firstSide + ':' + secondSide;
    };

    const pauseAndPlay = () => {
      video.value.paused ? video.value.play() : video.value.pause();
    };
    ``;

    const touchMove = (e: any) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.right;
      let deltaX = e.changedTouches[0].clientX;
      const tmp = ~~video.value.duration / (~~fullWidth / ~~deltaX);

      video.value.currentTime = ~~tmp;
    };

    const onTouch = (e: any) => {
      let clientRect = e.currentTarget.getBoundingClientRect();
      let fullWidth = clientRect.right;
      let deltaX = e.changedTouches[0].clientX;
      const tmp = ~~video.value.duration / (~~fullWidth / ~~deltaX);

      video.value.currentTime = ~~tmp;
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

    const changeSendRequest = () => (sendRequest.value = true);

    const goOnepageBack = () => router.go(-1);

    return {
      goOnepageBack,
      video,
      currentTime,
      duration,
      onUpdate,
      pauseAndPlay,
      pausedStatus,
      progressbarChild,
      sendRequest,
      changeSendRequest,
      touchMove,
      onTouch,
      videoSrc,
      videoLoading,
      mousedown,
      mouseup,
      formatTime
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';

.pc {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #0e0505c5;
  z-index: 9999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .Back {
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
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0 2rem 2.5rem;
    i {
      font-size: 2rem;
      margin-left: 0.6rem;
    }
  }

  .wrapper {
    max-width: 650px;
    max-height: 700px;
    position: relative;
    display: flex;
    flex-direction: column;

    .c-video {
      max-width: 1000px;
      max-height: 700px;
      position: relative;
      margin: 2rem auto 0;
    }

    .progress-button {
      margin: 0 auto 2rem;
      position: fixed;
      width: 90%;
      max-width: 650px;
      bottom: 0;

      .progress-container {
        color: #fff;
      }
    }
  }
}
.hamnavard {
  width: 100%;
  height: 100%;
  font-family: IRANSans;

  .pause-play {
    position: fixed;
    margin-left: auto;
    margin-right: auto;
    width: 0px; /* Need a specific value to work */
    height: 2rem;
    font-size: 3rem;
    border-radius: 50%;
    color: white;
    width: 120px;
    height: 120px;
    padding: 31px 32px 31px 36px;
    background-image: linear-gradient(268deg, #ff545ade 6%, #a50d15d8);
    top: 40%;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  .c-video {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;

    video {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .progress-button {
    margin: 1rem 1rem 1rem;
    position: fixed;
    width: 90%;
    bottom: 0;

    .btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-direction: row-reverse;
      text-align: center;
      width: 100%;
      border-radius: 15px;
      padding: 15px 8px;
      border: none;
      color: white;

      span {
        width: 100%;
      }
    }

    .red {
      background: $redish-background;

      i {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 0.3rem;
        width: 24px;
        height: 24px;
        background: red;
        border-radius: 50%;
      }
    }
    .green {
      background: #4ac367;
      i {
        visibility: hidden;
      }
    }

    .progress-container {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;

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
}
</style>

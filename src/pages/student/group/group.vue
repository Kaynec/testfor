<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>

  <main class="roadmap" ref="roadmap" v-else>
    <nav class="nav sm-nav">
      <div>
        <img :src="imageUrl" class="profile-image" alt="profile image" />
        <span class="user-parts">
          {{ `${currentUser.firstname} ${currentUser.lastname}` }} | امتیاز شما:
          {{ toPersianNumbers(`${currentUser.point ? currentUser.point : 0}`) }}
        </span>
      </div>
      <i class="fas fa-arrow-left" @click="goOnePageBack()"></i>
    </nav>
    <DesktopMinimalHeader v-if="!isMobile()" />

    <h1 class="center" v-if="!allExams.length">
      محتوایی برای نمایش وجود ندارد
    </h1>

    <section class="circles" ref="circles" v-if="allExams && allExams.length">
      <div
        class="circle animate__animatd animate__fadeIn"
        v-for="(circle, i) in allExams"
        :key="circle._id"
      >
        <div
          class="control-container animate__animated animate__fadeIn"
          :style="`display : ${i === currentIndex ? 'block' : 'none'}`"
        >
          <div class="control" v-if="circle.state === 0">
            <img
              src="@/assets/img/roadmap/angle-left.svg"
              class="shape1"
              @click="moveImg(-1)"
              alt="angle left"
            />
            <img
              src="@/assets/img/roadmap/angle-right.svg"
              class="shape2"
              @click="moveImg(1)"
              alt="angle right"
            />
          </div>

          <div class="control" v-else-if="circle.state === 1">
            <img
              src="@/assets/img/roadmap/angle-left.svg"
              class="shape1"
              @click="moveImg(-1)"
              alt="angle left"
            />
            <img
              src="@/assets/img/roadmap/angle-right.svg"
              class="shape2"
              @click="moveImg(1)"
              alt="angle right"
            />
          </div>

          <div class="control" v-else-if="circle.state === 2">
            <img
              src="@/assets/img/roadmap/angle-left.svg"
              class="shape1"
              @click="moveImg(-1)"
              alt="angle left"
            />
            <img
              src="@/assets/img/roadmap/angle-right.svg"
              class="shape2"
              @click="moveImg(1)"
              alt="angle right"
            />
          </div>
        </div>
        <img
          src="@/assets/img/roadmap/asset-11@3x.png"
          class="circle-main-img animate__animatd animate__fadeIn"
          alt="circle image"
        />

        <div class="bar-container">
          <div class="text">
            <span> میزان پیشرفت شما </span>
            <span>
              {{
                Math.floor(
                  (circle.totalAnswer / circle.totalQuestion) * 100 || 0
                ) + '%'
              }}
            </span>
          </div>
          <div class="bar">
            <div
              class="bar-child"
              :style="` width : ${
                (circle.totalAnswer / circle.totalQuestion) * 100 || 0
              }% `"
            ></div>
          </div>
        </div>
        <div class="info">{{ circle.title }}</div>
      </div>
    </section>
    <h1 class="center" v-else>محتوایی برای نمایش وجود ندارد</h1>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated } from 'vue';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import router from '@/router';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import { baseUrl } from '@/api/apiclient';

export default defineComponent({
  components: { DesktopMinimalHeader },
  setup() {
    const isLoading = ref(true);
    const roadmap = ref();
    const circles = ref();
    const currentIndex = ref(0);
    const course = ref({} as any);
    const allExams = ref([] as any);
    const firstView = ref(true);
    const currentUser = ref(store.getters.getCurrentStudent);

    const imageUrl = ref('');

    imageUrl.value =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (currentUser.value && currentUser.value.profileImage) {
      imageUrl.value = `${baseUrl}student/getProfileImage/${currentUser.value.profileImage}`;
    }

    const goOnePageBack = () => {
      router.push({
        name: 'Home'
      });
    };

    onUpdated(() => {
      if (firstView.value) {
        roadmap.value.scrollLeft = -circles.value?.clientWidth;
        firstView.value = false;
      }
    });

    (async () => {
      const res = await StudentExamApi.getAll();
      console.log(res.data);
      course.value = res?.data?.data;
      const historyOfExamPromises = [] as any;
      // Looping Through Sessions of the Course
      for (let i = 0; i < course.value.length; i++) {
        const exam = course.value[i];
        allExams.value[i] = exam;
        historyOfExamPromises.push(StudentExamApi.getResult(exam._id));
      }

      const promises = await Promise.all(historyOfExamPromises);

      promises.forEach((promise: any, idx) => {
        allExams.value[idx] = {
          ...allExams.value[idx],
          totalAnswer: promise.data?.data?.totalAnswer,
          totalQuestion: promise.data?.data?.totalQuestion,
          totalCorrectAnswer: promise.data?.data?.totalCorrectAnswer,
          // state for the img shown in control pad
          state: 1
        };
      });

      isLoading.value = false;
    })();

    const moveToSelfTestQuestions = (id) => {
      router.push({
        name: 'SelfTestQuestions',
        params: { id }
      });
    };

    const moveImg = (amountToAdd: number) => {
      const calc = currentIndex.value + amountToAdd;

      document.querySelectorAll('.control-container').forEach((circle: any) => {
        const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        if (circle.style.display != 'none') {
          amountToAdd > 0
            ? ((document.querySelector('.roadmap') as any).scrollLeft +=
                width / 2)
            : ((document.querySelector('.roadmap') as any).scrollLeft -=
                width / 2);
        }
      });

      if (calc >= 0 && calc <= allExams.value.length - 1)
        currentIndex.value += amountToAdd;
    };
    //
    const moveToReportCard = (circle) => {
      router.push({
        name: 'SelfTestReportCard',
        params: { data: JSON.stringify(circle) }
      });
    };

    return {
      currentIndex,
      moveImg,
      allExams,
      moveToSelfTestQuestions,
      isLoading,
      roadmap,
      circles,
      moveToReportCard,
      goOnePageBack,
      currentUser,
      toPersianNumbers,
      imageUrl
    };
  }
});
</script>
<style lang="scss" scoped>
.roadmap {
  font-family: IRANSans;
  position: relative;
  overflow: auto;
  width: 100%;
  height: 100%;
  display: flex;

  .circles {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-end;
    height: 100%;
    width: 100vw;

    background: url('../../../assets/img/roadmap/3-d-space-scene@3x.png');
    background-position: center;
    background-size: cover;
    background-repeat: repeat;

    // overflow-x: visible;
    // overflow-x: auto;

    // overflow-: touch;
    overflow-x: auto;

    -webkit-overflow-scrolling: touch; /* Lets it scroll lazy */

    // -webkit-overflow-scrolling: scroll; /* Stops scrolling immediately */

    .circle {
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      min-width: 75vw;
      margin-right: 2rem;
      margin-left: 2rem;

      .bar-container {
        width: 100%;
        transform: translateY(-1.25rem);
        max-width: 450px;
        .text {
          color: #fff;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          font-size: 0.55rem;
          margin: 0.5rem 0;
        }
        .bar {
          width: 100%;
          height: 0.7rem;
          border-radius: 1em;
          position: relative;
          background: rgba(0, 0, 0, 0.308);
          .bar-child {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            color: red;
            background-color: red;
            border-radius: 1em;
          }
        }
      }

      .circle-main-img {
        max-width: 18rem;
        object-fit: contain;
        animation: bounce 1s infinite alternate;
        -webkit-animation: bounce 1s infinite alternate;
      }

      .control-container {
        display: flex;
        flex-direction: column;
        margin-left: 1.5rem;
        transform: translateY(-4rem);
        width: 75vw;
        max-width: 450px;
        .img {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          transform: translateY(50%);
        }

        .control {
          z-index: 9999;
          position: relative;
        }

        .shape1 {
          position: absolute;
          width: 1.2rem;
          height: 1.2rem;
          top: 35%;
          left: -1.5rem;
        }
        .shape2 {
          position: absolute;
          width: 1.2rem;
          height: 1.2rem;
          top: 35%;
          right: -1.5rem;
        }
      }
      .info {
        padding: 0.3rem 3.5rem;
        white-space: nowrap;
        background: red;
        border-radius: 1em;
        font-size: 16px;
        color: #fff;
        margin-bottom: 1rem;
      }
    }
  }
}

@keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }
}
@-webkit-keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-20px);
  }
}

.scale-enter-active,
.scale-leave-active {
  transform-origin: top;
  transition: transform 0.3s ease-in-out;
}

.scale-enter-to,
.scale-leave-from {
  transform: scaleY(1);
}

.scale-enter-from,
.scale-leave-to {
  transform: scaleY(0);
}

.sm-nav {
  background-color: #171717;
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem;
  max-height: 8vh;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.19);
  position: fixed; /* Set the navbar to fixed position */
  top: 0; /* Position the navbar at the top of the page */
  width: 100%; /* Full width */
  z-index: 99999999999999999999999999999999;
  div {
    img {
      width: 29px;
      height: 28px;
      margin: 0 10px 0 0;
      border-radius: 8px;
      border: solid 2px #ddd;
      margin-left: 0.5rem;
    }

    span {
      font-family: IRANSans;
      font-size: 11px;
      font-weight: bold;
    }
  }
}
</style>

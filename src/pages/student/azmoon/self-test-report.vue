<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <main class="report-card">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader OnePageBack="Selftest" title="کارنامه آزمون خودسنجی" />
    <!--  -->
    <section class="label">
      <p>آزمون خودسنجی {{ courseTitle }} {{ sessionTitle }}</p>
      <!-- Info -->
      <h6>
        {{ currentUser.grade.title }}
      </h6>
      <h6 class="second-h6">
        {{ currentUser.group.title }}
      </h6>
    </section>
    <!--  -->
    <section class="chart-container">
      <div class="chart-info">
        <p>
          <span>{{ toPersianNumbers(totalCorrectAnswer) }} </span> پاسخ‌های صحیح
        </p>
        <p>
          <span>{{ toPersianNumbers(totalFailed) }}</span> پاسخ‌های غلط
        </p>
        <p>
          <span>{{ toPersianNumbers(totalUnAnswered) }}</span> بی پاسخ‌ها
        </p>
      </div>
      <!--  -->
      <div class="chart">
        <vue3-chart-js v-bind="{ ...doughnutChart }" />
      </div>
    </section>
    <section class="Cards">
      <div
        :class="getClass(answer)"
        v-for="(answer, idx) in model.answers"
        :key="answer._id"
      >
        <span @click="moveToAnswer(answer, idx)">
          {{ toPersianNumbers(idx + 1) }}.
          {{ answer.question.text }}
        </span>

        <div class="imgs">
          <img
            v-if="answer.question.images.length"
            @click="setCurrentImages(answer.question.images)"
            src="@/assets/img/azmoon-icons/img-icon@3x.png"
            alt="image of question"
          />

          <i class="fas fa-angle-left"></i>
        </div>
      </div>
    </section>
  </main>

  <ShowImages
    @convertBoolean="showImages = false"
    v-if="showImages"
    :images="JSON.stringify(currentImages)"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import ShowImages from '@/modules/student-modules/show-images.vue';
import router from '@/router';

export default defineComponent({
  components: {
    Vue3ChartJs,
    MinimalHeader,
    DesktopMinimalHeader,
    ShowImages
  },
  props: {
    data: { type: String }
  },

  setup(props) {
    const model = ref();

    if (props.data) {
      model.value = JSON.parse(props.data);
      store.commit(
        StudentMutationTypes.SET_CURRENT_SELFTEST_REPORT,
        model.value
      );
    } else {
      model.value = store.getters.getCurrentSelfTestReport;
    }

    const currentUser = store.getters.getCurrentStudent;

    const sessionTitle = ref('');
    const courseTitle = ref('');

    sessionTitle.value = model.value.title;

    (async () => {
      const titleRes = await StudentSelfTestApi.getOneCourse(
        model.value.course
      );
      courseTitle.value = titleRes.data.data.title;
    })();

    const allQuestions = model.value.totalQuestion;
    const totalCorrectAnswer = model.value.totalCorrectAnswer;
    const totalFailed = model.value.totalAnswer - totalCorrectAnswer;
    const totalUnAnswered = allQuestions - model.value.totalAnswer;

    const showImages = ref(false);
    const currentImages = ref([]);
    const setCurrentImages = (images) => {
      currentImages.value = images;
      showImages.value = true;
    };

    const doughnutChart = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            backgroundColor: ['#4ac367', '#ff5960', '#d3d7e0'],
            data: [totalCorrectAnswer, totalFailed, totalUnAnswered]
          }
        ]
      }
    };

    const moveToAnswer = (answer, idx) => {
      router.push({
        name: 'SelfTestOneQuestion',
        params: { answer: JSON.stringify(answer), id: idx }
      });
    };

    const getClass = (answer) => {
      if (!answer.answer) return 'Card animate__animated animate__fadeIn';

      if (answer.correct == answer.answer)
        return 'Card animate__animated animate__fadeIn success';
      else if (answer.correct != answer.answer)
        return 'Card animate__animated animate__fadeIn fail';
    };

    return {
      doughnutChart,
      totalCorrectAnswer,
      totalFailed,
      totalUnAnswered,
      toPersianNumbers,
      currentUser,
      sessionTitle,
      courseTitle,
      currentImages,
      showImages,
      setCurrentImages,
      model,
      moveToAnswer,
      getClass
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.report-card {
  width: 100%;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  max-width: 750px;
  overflow: hidden;

  .label {
    width: 100%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    background-color: #fff;
    margin-bottom: 1rem;
    padding: 0.5rem;

    p {
      font-size: 11px;
      text-align: right;
      color: #ed1b24;
    }

    h6 {
      font-size: 14px;
      font-weight: bold;
      color: #171717;
      display: inline-flex;
    }
    .second-h6 {
      margin-right: 1.25rem;
    }
  }
  .chart-container {
    display: grid;
    width: 90%;
    margin: 10px auto;
    border-radius: 16.7px;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    background-color: #fff;
    grid-template-areas:
      'chart chart-info'
      'chart chart-info'
      'user-info user-info ';
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    grid-gap: 1rem;
    padding: 15px;
    .chart {
      grid-area: chart;
      max-width: 200px;
    }
    .chart-info {
      grid-area: chart-info;
      display: flex;
      flex-direction: column;
      margin-top: 1rem;

      p {
        font-size: 12px;
        color: #646464;
        span {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          color: #fff;
          border-radius: 10px;
          display: inline-block;
          width: 30px;
          height: 30px;
          padding: 5px;
        }
        //
        &:first-child {
          span {
            // Change This Later Automatically
            background-color: #4ac367;
          }
        }
        &:nth-child(2) {
          span {
            background-color: #ff5960;
          }
        }
        &:nth-child(3) {
          span {
            background-color: #d3d7e0;
          }
        }
      }
    }
    .user-info {
      border-top: dotted 2px #959fba;
      grid-area: user-info;
      display: flex;
      justify-content: space-between;
      padding: 1rem 0.5rem;

      .info-div {
        border-right: 5px solid #ededed;
        padding-right: 0.5rem;
        p {
          font-size: 12px;
          text-align: right;
          color: #646464;
          margin: 0;
          line-height: 1.9em;
        }

        span {
          font-size: 14px;
          font-weight: bold;
          text-align: right;

          color: #171717;
        }
      }
    }
  }
  // card-container
  .card-container {
    width: 90%;
    margin: 10px auto;
    display: flex;
    flex-direction: column;

    .card {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0.4rem 0.6rem;
      border: 3px solid #fff;
      border-radius: 10px;

      .img-label {
        img {
          width: 52px;
          height: 52px;
          background-color: #ededed;
          padding: 13px;
          border-radius: 18px;
        }

        .card-label {
          font-size: 13px;
          font-weight: bold;
          text-align: right;
          color: #171717;
          margin-right: 10px;
        }
      }
      .percent {
        margin-left: 0.8rem;
        display: flex;
        gap: 1rem;
        .percent-wrapper {
          display: flex;
          width: 2rem;
          height: 2rem;
          font-size: 12px;
          border-radius: 12px;
          align-items: center;
          justify-content: center;
          // text-align: center;
          // padding: 0.5rem;
          padding: 1.1rem;
        }
        .card-first-number {
          background-color: #4ac3666b;
          color: green;
        }
        .card-second-number {
          background-color: #ff596175;
          color: red;
          margin-left: 15%;
        }
      }
    }
  }
  // btns
  .btns {
    width: 90%;
    margin: 10px auto;
    display: flex;
    justify-content: space-between;

    button {
      background: $redish-background;
      padding: 1rem 0;
      border: none;
      width: 46%;
      border-radius: 15px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }
  }
}

.Cards {
  width: 100%;
  overflow: auto;
  height: 100%;
  max-height: 96%;
  padding-bottom: 28rem;

  .Card {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 19px 15px 24px 12px;
    border-radius: 10px;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    background-color: #fff;
    margin: 10px auto;
    word-wrap: break-word !important;

    span {
      font-size: 12px;
      text-align: right;
      color: #171717;
      word-break: break-word;

      &:hover {
        cursor: pointer;
      }
    }

    .imgs {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        max-width: 2.5rem;
        margin-left: 0.3rem;
        transition: 0.3s ease-in-out all;
        &:hover {
          cursor: pointer;
          transform: scale(1.12);
        }
      }

      i {
        font-weight: light !important;
      }
    }
  }
}

.success {
  color: #4ac367;
  border: 1px solid #4ac367;
}

.fail {
  color: #ed1b24;
  border: 1px solid #ed1b24;
}
</style>

<template>
  <MentorDesktopHeader v-if="!isMobile()" />
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <template v-else>
    <div
      class="report-card"
      :style="`padding-top : ${!isMobile() ? '3rem' : ''}`"
    >
      <MinimalHeader
        :title="`کارنامه ${
          model.student
            ? `${model.student.firstname} ${model.student.lastname}`
            : ''
        }`"
        onePageBack="MentorProfile"
      />

      <!--  -->
      <div class="label animate__animated animate__fadeIn">
        <p v-if="model.exam">
          {{ model.exam.title }}
          {{ toPersianNumbers(model.exam.date.split('/')[0]) }}
          -
          {{ toPersianNumbers(+model.exam.date.split('/')[0] + 1) }}
        </p>

        <!-- Info -->
        <h6>
          <!-- {{ currentUser.grade.title }} -->
        </h6>
        <h6 class="second-h6">
          <!-- {{ currentUser.group.title }} -->
        </h6>
      </div>
      <!--  -->

      <main
        class="wrapper animate__animated animate__fadeIn"
        :style="`${
          !isMobile() ? 'display:grid; grid-template-columns :1fr 1fr   ' : ''
        }`"
      >
        <div class="chart-container animate__animated animate__fadeIn">
          <div class="chart-info">
            <p>
              <span>{{ correctAnswers }} </span> پاسخ‌های صحیح
            </p>
            <p>
              <span>{{ wrongAnswers }} </span> پاسخ‌های غلط
            </p>
            <p>
              <span>{{ unAnswered }}</span> بی پاسخ‌ها
            </p>
          </div>
          <!--  -->

          <div class="chart">
            <vue3-chart-js
              :id="doughnutChart.id"
              ref="chartRef"
              :type="doughnutChart.type"
              :data="doughnutChart.data"
            />
          </div>

          <!--  -->
          <div class="user-info">
            <div class="info-div" v-if="model.exam && model.exam.results">
              <p>تراز کاربر</p>
              <span> {{ +model.exam.results[0].taraz.toFixed(2) }} </span>
            </div>
            <div class="info-div" v-if="model.exam && model.exam.results">
              <p>رتبه کاربر</p>
              <span> {{ model.exam.results[0].rate }} </span>
            </div>
          </div>
        </div>
        <!--  -->
        <div class="card-container">
          <div
            class="card animate__animated animate__fadeIn"
            v-for="budget in model.resultDetails"
            :key="budget._id"
          >
            <div class="img-label">
              <img
                :src="budget.img"
                class="animate__animated animate__fadeIn"
              />
              <span class="card-label">
                {{ budget.course.title }} ({{ budget.session.title }})
              </span>
            </div>
            <div class="percent">
              <div class="percent-wrapper card-first-number">
                <span class="">
                  {{
                    Math.round(
                      (budget.totalCurrectAnswers / budget.totalQuestions) * 100
                    )
                  }}٪
                </span>
              </div>
              <div class="percent-wrapper card-second-number">
                <span class="">
                  {{
                    Math.round(
                      ((budget.totalQuestions - budget.totalCurrectAnswers) /
                        budget.totalQuestions) *
                        100
                    )
                  }}٪
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, onUpdated, ref } from 'vue';
import router from '@/router';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { store } from '@/store';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';
import { baseUrl } from '@/api/apiclient';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';
import { useRoute } from 'vue-router';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';

export default defineComponent({
  components: {
    Vue3ChartJs,
    MinimalHeader,
    MentorDesktopHeader
  },

  setup() {
    const isFetching = ref(true);
    const model = ref({}) as any;
    const correctAnswers = ref();
    const unAnswered = ref();
    const wrongAnswers = ref();
    const chartRef = ref();
    const route = useRoute();
    const id = ref(route.params.id as any);
    const studentId = ref(route.params.studentId as any);
    const showTaraz = ref(false);

    const goOnePageBack = () =>
      router.push({
        name: 'Azmoon',
        params: { id: id.value }
      });

    const changeShowTaraz = () => (showTaraz.value = !showTaraz.value);

    const results = ref([]);

    if (model.value.results) {
      results.value = model.value.results;
    }

    const doughnutChart = {
      id: 'doughnut',
      type: 'doughnut',
      data: {
        datasets: [
          {
            backgroundColor: ['#4ac367', '#ff5960', '#d3d7e0'],
            data: [10, 10, 10]
          }
        ]
      }
    };

    const firstView = ref(true);

    onUpdated(() => {
      if (firstView.value) {
        doughnutChart.data.datasets[0].data = [
          correctAnswers.value,
          wrongAnswers.value,
          unAnswered.value
        ];
        chartRef.value.update(250);
        firstView.value = false;
      }
    });

    (async () => {
      const res = await MentorAuthServiceApi.getOneExam({
        examId: id.value,
        studentId: studentId.value
      });
      model.value = res.data.data;

      correctAnswers.value = model.value.totalCurrectAnswers;
      wrongAnswers.value =
        model.value.totalAnswers - model.value.totalCurrectAnswers;
      unAnswered.value = model.value.totalQuestions - model.value.totalAnswers;

      for (const [idx, budget] of model.value.resultDetails.entries()) {
        const imgUrl = `${baseUrl}course/download-image/${budget.session.image}`;
        model.value.resultDetails[idx].img = imgUrl;
      }

      isFetching.value = false;
    })();

    const currentUser = store.getters.getCurrentStudent;

    return {
      goOnePageBack,
      doughnutChart,
      showTaraz,
      changeShowTaraz,
      model,
      results,
      currentUser,
      correctAnswers,
      unAnswered,
      wrongAnswers,
      chartRef,
      isFetching,
      toPersianNumbers
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.report-card {
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  overflow: hidden;
  max-width: 750px;

  .wrapper {
    width: 100%;
    height: 100%;
    max-height: 96%;
    overflow: scroll;
  }

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
    max-height: 350px;
    .chart {
      grid-area: chart;
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
      justify-content: space-around;
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

      &:last-child {
        margin-bottom: 30vh;
      }

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
          color: #171717;
          margin-right: 10px;
          flex-grow: 1;
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
  // // btns
  // .btns {
  //   width: 90%;
  //   margin: 10px auto;
  //   display: flex;
  //   justify-content: space-between;

  //   button {
  //     background: $redish-background;
  //     padding: 1rem 0;
  //     border: none;
  //     width: 46%;
  //     border-radius: 15px;
  //     font-size: 14px;
  //     font-weight: bold;
  //     text-align: center;
  //     color: #fff;
  //   }
  // }
}
</style>

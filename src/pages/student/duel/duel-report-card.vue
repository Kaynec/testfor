<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>

  <div class="report-card" v-else>
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="کارنامه" onePageBack="Duel" />

    <div v-if="!model" class="center">
      <h1 class="text-center mt-5">محتوایی برای نمایش وجود ندارد</h1>
    </div>

    <!--  -->
    <div class="content" v-else>
      <div class="label">
        <p>آزمون جامع {{ model?.title }}</p>

        <!-- Info -->
        <h6>
          {{ currentUser?.grade.title }}
        </h6>
        <h6 class="second-h6">
          {{ currentUser?.group.title }}
        </h6>
      </div>
      <!--  -->

      <main
        class="wrapper"
        :style="`grid-template-columns: ${
          isMobile() ? '' : 'repeat(2, 1fr)'
        } ; overflow :${isMobile() ? 'scroll' : 'auto'} ;`"
      >
        <section class="rightSide">
          <div class="chart-container">
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

            <div class="chart animate__animated animate__fadeIn">
              <vue3-chart-js
                :id="doughnutChart.id"
                ref="chartRef"
                :type="doughnutChart.type"
                :data="doughnutChart.data"
              />
            </div>

            <!--  -->
            <div class="user-info animate__animated animate__fadeIn">
              <div class="info-div">
                <p>تراز کاربر</p>
                <span> {{ +model.taraz.toFixed(2) }} </span>
              </div>

              <div class="info-div">
                <p>رتبه کاربر</p>
                <span> {{ +model.taraz.toFixed(2) }} </span>
              </div>
            </div>
          </div>
        </section>
        <!--  -->
        <div class="card-container animate__animated animate__fadeIn">
          <div
            class="card animate__animated animate__fadeIn"
            v-for="budget in model?.resultDetails"
            :key="budget?._id"
          >
            <div class="img-label">
              <img
                :src="budget.img"
                class="animate__animated animate__fadeIn"
                alt="session img"
              />
              <span class="card-label">
                {{ budget?.course?.title }} ({{ budget?.session?.title }})
              </span>
            </div>
            <div class="percent">
              <div class="percent-wrapper card-first-number">
                <span class="">
                  {{
                    Math.round(
                      (budget?.totalCurrectAnswers / budget?.totalQuestions) *
                        100
                    )
                  }}٪
                </span>
              </div>
              <div class="percent-wrapper card-second-number">
                <span class="">
                  {{
                    Math.round(
                      ((budget?.totalQuestions - budget?.totalCurrectAnswers) /
                        budget?.totalQuestions) *
                        100
                    )
                  }}٪
                </span>
              </div>
            </div>
          </div>
          <!-- <div class="btns animate__animated animate__fadeIn">
            <button @click="showAll">مشاهده کلی رتبه ها</button>
          </div> -->
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUpdated, ref } from 'vue';
import router from '@/router';
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { useRoute } from 'vue-router';
import { StudentDuelApi } from '@/api/services/student/student-duel-service';

export default defineComponent({
  components: {
    Vue3ChartJs,
    MinimalHeader,
    DesktopMinimalHeader
  },

  setup() {
    const isFetching = ref(true);
    const model = ref({}) as any;
    const correctAnswers = ref(0);
    const unAnswered = ref(0);
    const wrongAnswers = ref(0);
    const chartRef = ref();
    const route = useRoute();

    const goOnePageBack = () =>
      router.push({
        name: 'Duel'
      });

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
        chartRef?.value?.update(250);
        firstView.value = false;
      }
    });

    (async () => {
      const res = await StudentDuelApi.getResult(route.params.id as any);

      model.value = res.data.data;

      console.log(res.data.data);

      if (!model.value) {
        isFetching.value = false;
        return;
      }

      correctAnswers.value = model.value.totalCurrectAnswers;
      wrongAnswers.value =
        model.value.totalAnswers - model.value.totalCurrectAnswers;
      unAnswered.value = model.value.totalQuestions - model.value.totalAnswers;
      for (const [idx, budget] of model.value.resultDetails.entries()) {
        const imgUrl = `${baseUrl}course/download-image/${budget.session.image}`;
        model.value.resultDetails[idx].img = imgUrl;
      }

      const tmpArray = [] as any;

      const taraz = [] as any;

      const percent = [] as any;

      const allRatios = [] as any;

      model.value.courseResult.forEach((el, idx) => {
        taraz.push(el.taraz);
        percent.push(el.percent);
        tmpArray[idx] = el;
        model.value.resultDetails.forEach((element) => {
          if (el.course === element.course._id) {
            el.ratio = element.course.ratio;
          }
        });
      });

      model.value.courseResult.forEach((ratio) => allRatios.push(ratio.ratio));

      const allRatiosCombined = allRatios.reduce((acc, ratio) => {
        return (acc += ratio);
      }, 0);

      model.value.taraz =
        taraz.reduce((acc, el, idx) => {
          return (acc += allRatios[idx] * el);
        }, 0) / allRatiosCombined;

      model.value.percent =
        percent.reduce((acc, el, idx) => {
          return (acc += allRatios[idx] * el);
        }, 0) / allRatiosCombined;

      isFetching.value = false;
    })();

    const currentUser = store.getters.getCurrentStudent;

    return {
      goOnePageBack,
      doughnutChart,
      model,
      results,
      currentUser,
      correctAnswers,
      unAnswered,
      wrongAnswers,
      chartRef,
      isFetching
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';

.report-card {
  width: 100%;
  height: 100%;
  max-width: 750px;
  font-family: IRANSans;
  position: relative;
  overflow: auto;

  .wrapper {
    width: 100%;
    overflow: scroll;
    height: 100%;
    max-height: 96%;
    display: grid;
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
    padding-bottom: 2rem;

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
}
</style>

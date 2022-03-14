<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="start" v-else>
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="آزمون" onePageBack="compTest" />
    <!--  -->
    <div class="label animate__animated animate__fadeIn">
      <!-- Count -->
      <p>{{ apiData.title }}</p>
      <!-- Info -->
      <h6 v-if="apiData.date">
        عمومی {{ toPersianNumbers(apiData.date.split('/')[0]) }} -
        {{ toPersianNumbers(+apiData.date.split('/')[0] + 1) }}
      </h6>
      <!-- {{ apiData }} -->
      <h6 class="second-h6">پایه {{ apiData.grade.title }}</h6>
    </div>

    <!--  -->
    <div class="time animate__animated animate__fadeIn">
      <div>
        <p>
          {{ timeInformation.texts.weekDay }}
          {{ timeInformation.texts.dayInText }}
          {{ timeInformation.texts.monthInText }}
          {{ timeInformation.texts.year }}
        </p>
        <h5>تاریخ آزمون</h5>
      </div>
      <div>
        <p>{{ toPersianNumbers(timeInformation.time) }}</p>
        <h5>ساعت شروع آزمون</h5>
      </div>
      <div>
        <p>
          {{
            addMinutes(`${timeInformation.time}:00`, timeInformation.duration)
          }}
        </p>
        <h5>ساعت پایان آزمون</h5>
      </div>
    </div>
    <!--  -->
    <div class="budget">
      <div class="budget-img">
        <h5>بودجه بندی آزمون</h5>
        <img src="@/assets/img/start-test.png" alt="icon of start" />
      </div>

      <div
        class="budget-label animate__animated animate__fadeIn"
        v-for="item in orientationTitleInformation"
        :key="item"
      >
        <p class="budget-label-first-p">{{ item.orientation }}</p>
        <p class="budget-label-second-p">{{ item.title }}</p>
      </div>
    </div>
    <div class="btns">
      <button @click="goToquestions">
        شروع آزمون
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { useRoute } from 'vue-router';
import { compareAsc } from 'date-fns';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import alertify from '@/assets/alertifyjs/alertify';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import JalaliConverter from '@/utilities/date-converter';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    const orientationTitleInformation = reactive([] as any);
    const apiData = ref({}) as any;
    const route = useRoute();
    const isFetching = ref(true);
    const timeInformation = ref({}) as any;

    const addMinutes = (time, minsToAdd) => {
      function D(J) {
        return (J < 10 ? '0' : '') + J;
      }
      let piece = time.split(':');
      let mins = piece[0] * 60 + +piece[1] + +minsToAdd;

      return D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    };

    (async () => {
      const res = await StudentExamApi.get(route.params.id as any);
      timeInformation.value = res.data.data;

      let mDate = new Date(
        JalaliConverter(
          timeInformation.value.date.split('/')[0],
          timeInformation.value.date.split('/')[1],
          timeInformation.value.date.split('/')[2]
        ) as any
      );

      let currentDate = mDate.toLocaleDateString('fa-FA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }) as any;

      currentDate = currentDate.split(',');
      let year = currentDate[0].split(' ')[0],
        monthInText = currentDate[0].split(' ')[1],
        weekDay = currentDate[1],
        dayInText = currentDate[0].split(' ')[2];

      console.log(currentDate);

      timeInformation.value.texts = {
        monthInText,
        weekDay,
        year,
        dayInText
      };

      apiData.value = res.data.data;
      res.data.data.budgeting.forEach((item: any) => {
        let tmp = {} as any;

        if (item.course && item.session && item.questions) {
          tmp = {
            orientation: item.course.orientation,
            title: item.course.title,
            ...item
          };
          orientationTitleInformation.push(tmp);
        }
      });
      isFetching.value = false;
    })();

    const goOnePageBack = () => {
      router.push({
        name: 'CompTest'
      });
    };

    const goToquestions = () => {
      let mDate = new Date(
        JalaliConverter(
          apiData.value.date.split('/')[0],
          apiData.value.date.split('/')[1],
          apiData.value.date.split('/')[2]
        ) as any
      );

      mDate.setHours(
        apiData.value.time.split(':')[0],
        apiData.value.time.split(':')[1]
      );

      if (compareAsc(mDate, new Date()) <= 0) {
        router.push({
          name: 'CompTestQuestions',
          params: { id: apiData.value._id }
        });
      } else {
        alertify
          .alert('زمان این امتحان هنوز فرا نرسیده است')
          .set('basic', true);
      }
    };

    return {
      goOnePageBack,
      goToquestions,
      orientationTitleInformation,
      timeInformation,
      apiData,
      toPersianNumbers,
      addMinutes,
      isFetching
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.start {
  width: 100%;
  height: 100%;
  max-width: 750px;
  font-family: IRANSans;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;

  .time {
    width: 95%;
    margin: 1rem auto;
    background: linear-gradient(268deg, #ff545b 6%, #a50d14);
    border-radius: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.66rem 0;

    div {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      text-align: center;
      min-width: 33%;
      color: #fff;
      padding: 0.5rem 0;

      &:nth-of-type(2) {
        border-right: 1px dashed #fff;
      }
      &:nth-of-type(3) {
        border-right: 1px dashed #fff;
      }

      p {
        font-size: 13.2px;
        margin: 0;
      }
      h5 {
        font-size: 11.2px;
        margin: 0;
        margin-top: 0.7rem;
      }
    }
  }

  .budget {
    width: 95%;
    margin: 1rem auto;
    border-radius: 18px;
    padding: 0.5rem;
    background: #fff;

    .budget-img {
      width: 100%;
      align-items: center;
      justify-content: flex-end;
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      padding: 0.5rem 0;

      img {
        margin-left: 0.5rem;
        border: 2px solid red;
        border-radius: 50%;
        margin-bottom: 0.2rem;
      }

      h5 {
        font-size: 14px;
        text-align: right;
        font-weight: bold;
      }
    }

    .budget-img::before {
      content: '';
      position: absolute;
      width: 1px;
      top: 80%;
      right: 3px;
      height: 40%;
      margin-right: 10.5px;
      background: #d21921;
    }

    .budget-label {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 0.3rem 1.5rem;

      .budget-label-first-p {
        font-size: 12px;
        font-weight: bold;
        text-align: right;
        color: #646464;
        word-break: break-word;
        width: 70%;
      }

      .budget-label-second-p {
        font-size: 12px;
        text-align: left;
        color: #646464;
        word-break: break-word;
        width: 30%;
      }
    }
    .budget-label::after {
      content: '';
      position: absolute;
      right: 0;
      top: 30%;
      width: 0.5rem;
      height: 0.5rem;
      background: #d21921;
      border-radius: 50%;
      margin-right: 10px;
    }
    .budget-label::before {
      content: '';
      position: absolute;
      width: 1px;
      top: 55%;
      height: 20px;
      right: 0;
      margin-right: 13px;
      background: #d21921;
    }
  }

  .label {
    width: 95%;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    background-color: #fff;
    margin: 0 auto 1rem;
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

  .btns {
    bottom: 0;
    left: 0;
    right: 0;
    position: sticky;
    margin: 0 auto;
    width: 95%;
    max-width: 750px;
  }

  button {
    background: $redish-background;
    padding: 1rem 0;
    border: none;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    width: 100%;

    i {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.7rem;
      background: rgb(207, 8, 8);
      border-radius: 50%;
      position: absolute;
      right: 0;
      top: 20%;
      padding: 0.7rem;
    }
  }
}
</style>

<template>
  <DesktopMinimalHeader v-if="!isMobile()" />
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="start" v-else>
    <MinimalHeader title="دوئل" onePageBack="Duel" />
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
          {{ timeInformation.texts.dayInText }}
          {{ timeInformation.texts.monthInText }}
          {{ toPersianNumbers(timeInformation.texts.year) }}
        </p>
        <h5>تاریخ دوئل</h5>
      </div>
      <div>
        <p>{{ toPersianNumbers(`${timeInformation.startTime}`) }}</p>
        <h5>ساعت شروع دوئل</h5>
      </div>
      <div>
        <p>
          {{
            timeInformation.texts.dayInText === timeInformation.texts.endDate
              ? ''
              : timeInformation.texts.endDate
          }}
          {{ toPersianNumbers(timeInformation.endTime) }}
        </p>
        <h5>ساعت پایان دوئل</h5>
      </div>
    </div>
    <!--  -->
    <div class="budget">
      <div class="budget-img">
        <h5>بودجه بندی دوئل</h5>
        <img src="@/assets/img/start-test.png" alt="start test" />
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
        شروع دوئل
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { useRoute } from 'vue-router';
import { compareAsc, isWithinInterval } from 'date-fns';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import alertify from '@/assets/alertifyjs/alertify';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentDuelApi } from '@/api/services/student/student-duel-service';
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
      const res = await StudentDuelApi.get(route.params.id as any);

      timeInformation.value = res.data.data;

      // let mDate = moment(timeInformation.value.startDate, 'jYYYY/jM/jD');
      // let endDate = moment(timeInformation.value.endDate, 'jYYYY/jM/jD');

      let mDate = new Date(
        JalaliConverter(
          timeInformation.value.startDate.split('/')[0],
          timeInformation.value.startDate.split('/')[1],
          timeInformation.value.startDate.split('/')[2]
        ) as any
      ) as any;

      let endDate = new Date(
        JalaliConverter(
          timeInformation.value.endDate.split('/')[0],
          timeInformation.value.endDate.split('/')[1],
          timeInformation.value.endDate.split('/')[2]
        ) as any
      ) as any;

      let currentDate = mDate.toLocaleDateString('fa-FA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      }) as any;

      endDate = endDate.toLocaleDateString('fa-FA', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });

      currentDate = currentDate.split(',');
      let monthInText = currentDate[0].split(' ')[0],
        dayInText = currentDate[0].split(' ')[1],
        weekDay = currentDate[1];

      timeInformation.value.texts = {
        monthInText,
        weekDay,
        dayInText,
        year: timeInformation.value.startDate.split('/')[0],
        endDate: endDate.split(' ')[0]
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
        name: 'Duel'
      });
    };

    const goToquestions = () => {
      // let startDate = moment(apiData.value.startDate, 'jYYYY/jM/jD');
      // let endDate = moment(apiData.value.endDate, 'jYYYY/jM/jD');

      let startDate = new Date(
        JalaliConverter(
          apiData.value.startDate.split('/')[0],
          apiData.value.startDate.split('/')[1],
          apiData.value.startDate.split('/')[2]
        ) as any
      ) as any;

      startDate.setHours(
        apiData.value.startTime.split(':')[0],
        apiData.value.startTime.split(':')[1]
      );

      let endDate = new Date(
        JalaliConverter(
          apiData.value.endDate.split('/')[0],
          apiData.value.endDate.split('/')[1],
          apiData.value.endDate.split('/')[2]
        ) as any
      ) as any;

      endDate.setHours(
        apiData.value.endTime.split(':')[0],
        apiData.value.startTime.split(':')[1]
      );

      // if it's between the exam timeframe move to the exam but if it's not let the user know why
      const isWithinDate = isWithinInterval(new Date(), {
        start: startDate,
        end: endDate
      });
      if (isWithinDate) {
        router.push({
          name: 'DuelQuestions',
          params: { id: apiData.value._id }
        });
      } else {
        if (compareAsc(new Date(), startDate) <= 0) {
          alertify
            .alert('زمان این امتحان هنوز فرا نرسیده است')
            .set('basic', true);
        } else if (compareAsc(new Date(), startDate) >= 1) {
          alertify.alert('زمان این امتحان رد شده است   ').set('basic', true);
        }
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
  background-color: #f4f4f4;
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

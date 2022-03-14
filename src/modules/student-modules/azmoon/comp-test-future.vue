<template>
  <div class="container" v-if="isLoading">
    <div
      v-for="item in azmoonData"
      :key="item"
      class="
        card
        w-100
        d-inline-flex
        align-items-center
        m-1
        position-relative
        flex-row flex-wrap
        border border-white
        rounded-10
        customDiv
        animate__animated animate__fadeIn
      "
      @click="openStartTest(item._id)"
    >
      <div class="d-flex flex-column mt-1 p-0 m-0">
        <span class="label text-dark text-right mb-2 text-bold">
          {{ item.title }}
        </span>
        <span
          class="text-detail text-right danger"
          v-if="
            item.date.isLessThanAminuteAway && timeLeft(`${item.time}:00`) >= 0
          "
        >
          <i class="far fa-clock"></i>
          <span> لحظاتی دیگر </span>
          <strong> | </strong>
          {{ timeLeft(`${item.time}:00`) }}
          تا شروع آزمون
        </span>

        <span
          class="text-detail text-right warning"
          v-else-if="
            item.date.isLessThanFiveMinutesAway &&
            timeLeft(`${item.time}:00`) >= 0
          "
        >
          <i class="far fa-clock"></i>
          <span> امروز </span>
          <strong> | </strong>
          {{ timeLeft(`${item.time}:00`) }}
          تا شروع آزمون
        </span>

        <span
          class="text-detail text-right danger"
          v-else-if="item.date.isToday"
        >
          <i class="far fa-clock"></i>
          <span> امروز </span>
          <strong> | </strong>
          {{ `ساعت ${toPersianNumbers(item.time)}` }}
        </span>

        <span class="text-detail text-right" v-else>
          <i class="far fa-clock"></i>
          {{ item.date['weekDay'] }}
          {{ item.date['dayInText'] }}
          {{ item.date['monthInText'] }}
          <strong> | </strong>
          {{ `ساعت ${toPersianNumbers(item.time)}` }}
        </span>
      </div>
      <img
        src="../../../assets/img/shape.svg"
        class="position-absolute top-50 start-0 translate-middle ml-3"
        alt="angle left icon"
      />
    </div>
  </div>
  <!--  -->
  <div class="loader-parent" v-else>
    <div class="loading1"></div>
  </div>
  <!--  -->
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import router from '@/router';
import {
  toEnglishNumbers,
  parseTime,
  toPersianNumbers,
  strToMins,
  minsToStr,
  secondsToTimeString
} from '@/utilities/to-persian-numbers';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import compareAsc from 'date-fns/compareAsc';
import JalaliConverter from '@/utilities/date-converter';

export default defineComponent({
  setup() {
    const currentDate = new Date();
    const faDate = new Intl.DateTimeFormat('fa', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(currentDate);
    const faHour = new Intl.DateTimeFormat('fa', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(currentDate);
    const isLoading = ref(false);
    const currentHMS = ref(
      toEnglishNumbers(new Date().toLocaleTimeString('fa-FA'))
    );
    setInterval(() => {
      currentHMS.value = toEnglishNumbers(
        new Date().toLocaleTimeString('fa-FA')
      );
    }, 1000);

    const azmoonData = reactive([] as any);

    StudentExamApi.getAll().then((res) => {
      res.data.data.forEach((date: any) => {
        let mDate = new Date(
          JalaliConverter(
            date.date.split('/')[0],
            date.date.split('/')[1],
            date.date.split('/')[2]
          ) as any
        );
        mDate.setHours(date.time.split(':')[0], date.time.split(':')[1]);

        if (compareAsc(mDate, new Date()) >= 1) azmoonData.push(date);
      });

      azmoonData.forEach((child: any) => {
        let mDate = new Date(
          JalaliConverter(
            child.date.split('/')[0],
            child.date.split('/')[1],
            child.date.split('/')[2]
          ) as any
        );

        let currentDate = mDate.toLocaleDateString('fa-FA', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }) as any;
        currentDate = currentDate.split(',');
        let monthInText = currentDate[0].split(' ')[0],
          dayInText = currentDate[0].split(' ')[1],
          weekDay = currentDate[1],
          tmp = child.date[0];
        let day = tmp[2];
        let isLessThanOneHourAway = false,
          isLessThanFiveMinutesAway = false,
          isLessThanAminuteAway = false,
          isToday = false;

        let getToday = toEnglishNumbers(faDate.split('/')[2]),
          getHour = toEnglishNumbers(faHour.split('/')[0]);
        if (+getToday === +day) {
          isToday = true;
          let currentHourConverted = +getHour.split(':').join('');
          let dateHourConverted = +child.time.split(':').join('');
          if (currentHourConverted - dateHourConverted <= 100) {
            isLessThanOneHourAway = true;
            if (currentHourConverted - dateHourConverted <= 1)
              isLessThanAminuteAway = true;
            else if (currentHourConverted - dateHourConverted <= 5)
              isLessThanFiveMinutesAway = true;
          }
        }
        child.date = {
          ...child.date,
          monthInText,
          dayInText,
          weekDay,
          isToday,
          isLessThanOneHourAway,
          isLessThanFiveMinutesAway,
          isLessThanAminuteAway
        };
      });

      //
      isLoading.value = true;
    });

    const timeLeft = (time) => {
      return secondsToTimeString(
        parseTime(`${time}`) - parseTime(`${currentHMS.value}`)
      );
    };

    const openStartTest = (id: string) => {
      router.push({
        name: 'compTestStart',
        params: { id: id }
      });
    };
    return {
      azmoonData,
      openStartTest,
      toPersianNumbers,
      toEnglishNumbers,
      strToMins,
      minsToStr,
      currentHMS,
      parseTime,
      timeLeft,
      isLoading
    };
  }
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.card {
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  font-family: IRANSans;
  cursor: pointer;

  .fa-angle-left {
    color: black !important;
  }
  .label {
    font-size: 13px;
    font-weight: bold;
  }
  .text-detail {
    margin: 0 5px 0 0;
    font-size: 11.5px;
    color: #313131;

    strong {
      margin-right: 0.4rem;
      margin-left: 0.75rem;
    }
    i {
      color: #948888;
      font-size: 14px;
    }
  }
}
.customDiv {
  position: relative;
  z-index: 1;
  padding: 0.6rem;

  &:last-child {
    margin-bottom: 4rem !important;
  }
}

.text-detail.danger {
  color: #d26c34;
  strong {
    margin-right: 0.4rem;
    margin-left: 0.75rem;
  }
  i {
    background-color: transparent;
    color: #d26c34;
    font-size: 14px;
  }
}

.text-detail.warning {
  color: #d21921;
  strong {
    margin-right: 0.4rem;
    margin-left: 0.75rem;
  }
  i {
    color: #d21921;
    font-size: 14px;
  }
}
</style>

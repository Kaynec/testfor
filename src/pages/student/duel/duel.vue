<template>
  <div class="comp-test" :style="`padding-top:${!isMobile() ? '6vh' : ''}`">
    <SmallHeader onePageBack="Home" v-if="isMobile()" />
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader
      :style="`${!isMobile() ? 'margin-top:2rem' : ''}`"
      onePageBack="Home"
      v-if="!isMobile()"
      title="دوئل حرفه‌ای‌ها"
    />
    <main :class="`${isMobile() ? 'wrapper' : 'wrapper-pc'}`">
      <section class="first">
        <div :class="`${isMobile ? 'hero' : 'hero-pc'}`">
          <h1 class="right">
            <span> {{ toPersianNumbers(lastDuelRate) }} </span><br />
            آخرین رتبه دوئلی شما
          </h1>
          <div class="left">
            <p @click="toggleShowDuels">
              {{
                currentTypeOfDuel === 'all' ? 'دوئل های گذشته' : 'تمامی دوئل ها'
              }}
              <i class="fas fa-angle-left"></i>
            </p>
          </div>
        </div>
        <div :class="`${isMobile ? 'points' : 'points-pc'}`">
          <div>
            <span> دوئل های انجام شده </span>
            <p>{{ toPersianNumbers(countOfDuelsParticipated) }}</p>
          </div>
          <div>
            <span> امتیازهای بدست آمده </span>
            <p>{{ toPersianNumbers(point) }}</p>
          </div>
        </div>
      </section>
      <section class="card-container">
        <div class="card" v-for="item in filteredDuels" :key="item._id">
          <div class="right">
            <span class="label">
              {{ item.title }}
            </span>
            <span class="detail" v-if="item && item.date">
              <i class="far fa-clock"></i>
              {{ item.date['weekDay'] }}
              {{ item.date['day'] }}
              {{ item.date['month'] }}

              <strong> | </strong>
              {{ `ساعت ${toPersianNumbers(item.startTime)}` }}
            </span>

            <span class="detail" v-else>
              <i class="far fa-clock"></i>

              <strong> | </strong>
              {{ `ساعت ${toPersianNumbers(item.startTime)}` }}
            </span>
          </div>
          <img
            @click="moveToDuelStart(item)"
            src="@/assets/img/left_aa.svg"
            class="left"
          />
        </div>
      </section>
    </main>

    <div
      v-if="showDetail"
      class="comptest flex-column d-flex justify-content-end align-items-center"
    >
      <div
        style="z-index: 5; color: #fff"
        class="
          d-inline-flex
          flex-column
          justify-content-between
          align-items-center
          w-100
          flex-child
        "
      >
        <div
          class="
            d-inline-flex
            flex-column
            justify-content-center
            align-items-center
            w-100
          "
        >
          <Dialog
            label="پاسخنامه"
            componentName="DuelAnswers"
            :params="currentItem._id"
          />
          <Dialog
            label="کارنامه"
            componentName="DuelReportCard"
            :params="currentItem._id"
          />

          <Dialog
            label="آزمون "
            componentName="DuelStart"
            :params="currentItem._id"
          />
        </div>

        <!-- Img Icon -->
        <img
          src="@/assets/img/icons-raw-close.png"
          class="x-icon"
          @click="showDetail = false"
          alt="close"
        />
        <!--  -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import SmallHeader from '@/modules/student-modules/header/small-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentDuelApi } from '@/api/services/student/student-duel-service';
import Dialog from '@/modules/student-modules/dialog.vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import router from '@/router';
import JalaliConverter from '@/utilities/date-converter';
import max from 'date-fns/max';

export default defineComponent({
  components: {
    SmallHeader,
    DesktopMinimalHeader,
    MinimalHeader,
    Dialog
  },
  setup() {
    const azmoonData = reactive([] as any);
    const currentItem = ref({});
    const showDetail = ref(false);
    const currentTypeOfDuel = ref('all');
    const countOfDuelsParticipated = ref(0);
    const lastDuelRate = ref(0);
    const point = ref(0);
    const filteredDuels = computed(() => {
      if (currentTypeOfDuel.value === 'all') {
        return azmoonData;
      } else {
        return azmoonData.filter((duel) => duel.isExpired);
      }
    });

    (async () => {
      const res = await StudentDuelApi.getAll();
      res.data.data.forEach((date: any) => {
        if (date) {
          azmoonData.push(date);
          if (date.results && date.results.length) {
            countOfDuelsParticipated.value++;
            point.value += 20;
          }
        }
      });

      azmoonData.forEach((child: any) => {
        let mDate = new Date(
          JalaliConverter(
            child.startDate.split('/')[0],
            child.startDate.split('/')[1],
            child.startDate.split('/')[2]
          ) as any
        );

        let currentDate = mDate.toLocaleDateString('fa-FA', {
          weekday: 'long',
          month: 'long',
          day: 'numeric'
        }) as any;

        currentDate = currentDate.split(' ');

        let month = currentDate[2];
        let day = currentDate[1];
        let weekDay = currentDate[0];

        child.date = {
          ...child.date,
          weekDay,
          day,
          month
        };
      });

      const sortedArray = azmoonData.sort((a, b) => {
        let dateA = new Date(
          JalaliConverter(
            a.startDate.split('/')[0],
            a.startDate.split('/')[1],
            a.startDate.split('/')[2]
          ) as any
        ) as any;

        dateA.setHours(a.startTime.split(':')[0], a.startTime.split(':')[1]);

        let dateB = new Date(
          JalaliConverter(
            b.startDate.split('/')[0],
            b.startDate.split('/')[1],
            b.startDate.split('/')[2]
          ) as any
        ) as any;

        dateB.setHours(a.startTime.split(':')[0], a.startTime.split(':')[1]);
        return max([dateA, dateA]);
      });

      for (let i = 0; i < sortedArray.length; i++) {
        let temp = sortedArray[i];
        if (temp.results && temp.results.length) {
          lastDuelRate.value = temp.results[0].rate;
          console.log(temp.results[0]);
          return;
        }
      }
    })();

    const moveToDuelStart = (item) => {
      currentItem.value = item;
      showDetail.value = true;
    };

    const moveToDuelAll = () => {
      router.push({
        name: 'DuelAll'
      });
    };

    const toggleShowDuels = () => {
      if (currentTypeOfDuel.value === 'all') {
        currentTypeOfDuel.value = 'past';
      } else {
        currentTypeOfDuel.value = 'all';
      }
    };

    return {
      azmoonData,
      toPersianNumbers,
      moveToDuelStart,
      currentItem,
      showDetail,
      moveToDuelAll,
      toggleShowDuels,
      currentTypeOfDuel,
      filteredDuels,
      countOfDuelsParticipated,
      lastDuelRate,
      point
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.comptest {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 99999;
  overflow: hidden;
}
.x-icon {
  padding: 4px;
  background: white;
  border-radius: 45%;
  display: block;
  position: fixed;
  margin-bottom: 7vh;
  margin-top: 3rem;
  bottom: 0;
  cursor: pointer;
}

.flex-child {
  min-height: 60vh;
  max-height: 90%;
  max-width: 450px;
  overflow: hidden;
}

.comp-test {
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  max-width: 750px;
  overflow: hidden;

  .wrapper-pc {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 0.5rem;

    .first {
      .hero {
        width: 100%;
        padding: 2.5rem 1rem;
        border-radius: 15px;
      }

      .points {
        width: 100%;
        margin: 1rem auto;
        border-radius: 20px;
        padding: 25px 0;
        transform: translateY(0);
        font-size: 10px;
        text-align: center;
        justify-content: space-evenly;
        align-items: center;
      }
    }
    .card-container {
      overflow: auto;
      margin-top: 2rem;
    }
  }

  .hero {
    background: $redish-background;
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4.3rem 1rem;
    position: relative;

    border-bottom-left-radius: 3.5rem;
    border-bottom-right-radius: 3.5rem;

    .right {
      font-size: 12px;
      font-weight: bold;
      text-align: right;
      color: #fff;
      margin-right: 1rem;
      z-index: 5;

      span {
        font-size: 40px;
        font-weight: bold;
        letter-spacing: 1.43px;
        text-align: right;
        color: #fff;
      }
    }

    .left {
      text-align: left;
      font-size: 12px;
      font-weight: bold;
      color: #fff;
      z-index: 5;

      p {
        &:hover {
          cursor: pointer;
          transform: scale(1.05);
        }
      }
    }
  }
  .points {
    width: 92%;
    margin: 0 auto;
    background-color: #171717;
    display: flex;
    z-index: 5;
    color: #fff;
    border-radius: 20px;
    padding: 20px;
    transform: translateY(-56%);
    font-size: 10px;
    text-align: center;
    justify-content: space-evenly;
    align-items: center;
    p {
      color: #4ac367;
      font-size: 20px;
      margin-top: 10px;
    }

    div:last-child {
      border-right: solid 0.5px rgba(255, 255, 255, 0.356);
      padding-right: 2.5rem;
    }
  }

  .card-container {
    width: 90%;
    margin: 0 auto;
    height: calc(100vh - 150px);
    max-height: 96%;
    overflow: scroll;
    transform: translateY(-2.5rem);
    padding-bottom: 10rem;
    .orange {
      display: inline-flex;
      width: fit-content;
      font-size: 11px;
      letter-spacing: -1.2px;
      text-align: center;
      color: #fff;
      background: #f3925d;
      border-radius: 25px;
      padding: 4px 25px;
    }

    .card {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      padding: 1rem 1.5rem;
      align-items: center;
      background: #fff;
      border-radius: 15px;
      border: 2px solid #fff;
      box-shadow: none;

      .right {
        display: flex;
        flex-direction: column-reverse;

        p {
          font-size: 9.6px;
          letter-spacing: -0.88px;
          text-align: right;
          color: #d26c34;
        }

        h5 {
          font-size: 15px;
          font-weight: bold;
          text-align: right;
          color: #171717;
        }

        .detail {
          margin: 0 4px 0 0;
          font-size: 11.6px;
          letter-spacing: -0.88px;
          text-align: right;
          color: #d26c34;
          padding: 0.45rem;
        }
        .label {
          font-size: 15px;
          font-weight: bold;
          text-align: right;
          color: #171717;
          padding: 0.45rem;
        }
      }

      img {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
}
</style>

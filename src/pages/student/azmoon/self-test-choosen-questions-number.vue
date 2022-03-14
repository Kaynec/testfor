<template>
  <div class="self-test-questions">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader onePageBack="SelfTest" title="سوالات برگزیده " />
    <!-- Progress Bar And Count -->

    <div class="progress-count animate__animated animate__fadeIn">
      <div class="count">
        <span v-if="allData[currentChunk]">
          {{ toPersianNumbers(currentChunk * 20 + 1) }}
          الی
          {{
            toPersianNumbers(allData[currentChunk].length + currentChunk * 20)
          }}
        </span>
        <!-- Change This And Width Of The Progress Bar Dynamically -->
        <span> {{ toPersianNumbers(allCount) }} </span>
      </div>
      <div class="progress" style="height: 5px">
        <div
          class="progress-bar bg-success"
          role="progressbar"
          :style="`width: ${
            (allData[currentChunk].length + (currentChunk * 20) / allCount) *
            100
          }%`"
          v-if="allData[currentChunk]"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
    <!-- Container for numbers -->
    <div class="container animate__animated animate__fadeIn">
      <div
        @click="openThePage(item, i)"
        class="number"
        v-for="(item, i) in allData[currentChunk]"
        :key="i"
      >
        <span>
          {{ toPersianNumbers(i + 1 + currentChunk * 20) }}
        </span>
      </div>
    </div>
    <!-- Buttons -->
    <div class="btns animate__animated animate__fadeIn">
      <button class="red" @click="nextPage">صفحه بعدی</button>
      <button class="grey" @click="previousPage">صفحه قبلی</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import router from '@/router';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    const allData = ref([]) as any;

    const goOnePageBack = () => router.go(-1);

    const currentChunk = ref(0) as any;

    const allCount = ref(0) as any;

    (async () => {
      const resForModel = await StudentSelfTestApi.AllBookmarkQuestions();

      resForModel.data.data.forEach((item) => {
        if (item.question) allData.value.push(item);
      });
      // Count of all items before split
      allCount.value = allData.value.length;

      const tmpArray = allData.value;
      allData.value = [];
      //  Split The Array to array of 20
      for (let i = 0, j = tmpArray.length; i < j; i += 20)
        allData.value.push(tmpArray.slice(i, i + 20));
    })();

    const nextPage = () => {
      if (currentChunk.value + 1 < allData.value.length) currentChunk.value++;
    };
    const previousPage = () => {
      if (currentChunk.value - 1 >= 0) currentChunk.value--;
    };

    const openThePage = (item, idx) => {
      router.push({
        name: 'SelfTestQuestionsChoosen',
        params: { idx, currentChunk: currentChunk.value }
      });
    };

    return {
      goOnePageBack,
      toPersianNumbers,
      allData,
      currentChunk,
      nextPage,
      previousPage,
      allCount,
      openThePage
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.self-test-questions {
  height: 100%;
  position: relative;
  font-family: IRANSans;
  max-width: 750px;

  .progress-count {
    width: 100%;
    padding: 1rem;
    .count {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.5rem;
      color: #171717;

      span {
        &:first-child {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
  //
  .container {
    width: 90%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1rem;
    align-items: center;
    justify-content: center;
    margin: 1rem auto;

    .number {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.22);
      padding: 0.6rem 0.95rem;
      border-radius: 25%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: url('../../../assets/img/blur.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      aspect-ratio: 1;
      cursor: pointer;
      span {
        font-weight: bold;
        font-size: 2.2rem;
      }
    }
  }
  //

  .btns {
    width: 90%;
    margin: 2.5rem auto 0.8rem auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 0.5rem;

    button {
      padding: 0.9rem 1.5rem;
      border-radius: 15px;
      border: none;
      font-family: IRANSans;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }

    .red {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: $redish-background;
    }
    .grey {
      background: #d3d7e0;
      color: #646464;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    }
    .green {
      background-color: #3fca60;
      color: white;
    }
  }
}
</style>

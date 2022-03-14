<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <div class="self-test-questions">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="سوالات برگزیده" onePageBack="QuestionsChoosenList" />
    <!-- Progress Bar And Count -->

    <div class="progress-count animate__animated animate__fadeIn">
      <div class="count">
        <span> </span>
        <span> </span>
      </div>
      <div class="progress" style="height: 5px"></div>
    </div>

    <div
      class="quiz-card shadow animate__animated animate__fadeIn"
      v-if="allData[currentChunk] && allData[currentChunk][idx]"
    >
      <p class="number-of-question animate__animated animate__fadeIn">
        سوال شماره <span> {{ toPersianNumbers(+idx + 1) }} </span>
        <img
          v-if="allData[currentChunk][idx].question.images.length"
          @click="setCurrentImages(item.images)"
          src="@/assets/img/azmoon-icons/img-icon@3x.png"
          style="max-width: 3rem; margin-right: 0.5rem"
          alt="azmoon icon"
        />
      </p>
      <h5>
        {{ allData[currentChunk][idx].question.text }}
      </h5>
      <div
        v-if="allData[currentChunk]"
        class="quiz-card-container animate__animated animate__fadeIn"
      >
        <div
          v-for="(item, index) in allData[currentChunk][idx].question.options"
          :key="item._id"
          @click="changeQuestionsAnswer(index)"
          :class="getClass(item)"
        >
          {{ item.text }}

          <div class="imgs">
            <img
              src="@/assets/img/azmoon-icons/img-icon@3x.png"
              class="img-icon"
              v-if="item.images.length"
              @click="setCurrentImages(item.images)"
            />

            <div class="img animate__animated animate__fadeIn">
              <img src="@/assets/img/accept-path-light.png" alt="active" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons -->
    <div
      class="btns"
      v-if="allData[currentChunk] && allData[currentChunk][idx]"
    >
      <button
        class="red"
        @click="showNextQuestion"
        v-if="idx + 1 < allData[currentChunk].length"
      >
        سوال بعدی
      </button>

      <button class="red" @click="showPreviousQuestion" v-if="idx - 1 >= 0">
        سوال قبلی
      </button>
      <img
        src="@/assets/img/bookmark@2x.png"
        @click="goOnePageBackAlert"
        class="img"
        alt="bookmark icon"
      />
    </div>
  </div>
  <!--  -->
  <ShowImages
    :images="JSON.stringify(currentImages)"
    v-if="showImages"
    @convertBoolean="showImages = false"
  />
  <!--  -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { useRoute } from 'vue-router';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import ShowImages from '@/modules/student-modules/show-images.vue';
const alertify = require('../../../assets/alertifyjs/alertify');
export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader, ShowImages },
  setup() {
    const route = useRoute();

    const allData = ref([] as any);

    const allCount = ref(0);

    const idx = ref(+route.params.idx);

    const currentChunk = ref(+route.params.currentChunk) as any;

    const allBookmarkedQuestions = ref([] as any);
    (async () => {
      const res = await StudentSelfTestApi.AllBookmarkQuestions();

      let tmpArray = [] as any;

      res.data.data.forEach((question) => {
        if (question.question != null) tmpArray.push(question);
      });

      allBookmarkedQuestions.value = tmpArray;

      tmpArray.forEach((item) => {
        item.question.options.forEach((option, idx) => {
          if (option.isAnswer) item.question.correct = idx + 1;
        });
      });

      allCount.value = tmpArray.length;

      for (let i = 0, j = tmpArray.length; i < j; i += 20)
        allData.value.push(tmpArray.slice(i, i + 20));
    })();

    const goOnePageBack = () => {
      router.push({
        name: 'SelfTest'
      });
    };

    const goOnePageBackAlert = () => {
      alertify.success('سوال مورد نظر از لیست سوالات برگزیده حذف شد');
      router.go(-1);
    };

    const showPreviousQuestion = () => {
      if (idx.value - 1 >= 0) idx.value--;
    };

    const showNextQuestion = () => {
      if (idx.value + 1 <= allData.value[currentChunk.value].length)
        idx.value++;
    };

    const getClass = (item) => {
      console.log(allData.value[currentChunk.value][idx.value]);
      if (item.isAnswer) return 'card active';
      return 'card';
    };

    const showImages = ref(false);
    const currentImages = ref([]);
    const setCurrentImages = (images) => {
      if (images.length) currentImages.value = images;
      showImages.value = true;
    };

    return {
      goOnePageBack,
      idx,
      currentChunk,
      allData,
      toPersianNumbers,
      allCount,
      showPreviousQuestion,
      showNextQuestion,
      goOnePageBackAlert,
      getClass,
      setCurrentImages,
      showImages
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.self-test-questions {
  height: 100%;
  width: 100%;
  max-width: 750px;
  position: relative;
  overflow: hidden;

  .progress-count {
    width: 100%;
    padding: 1rem;
    .count {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.5rem;
      font-family: IRANSans;
      color: #171717;

      span {
        &:first-child {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }

  .quiz-card {
    width: 90%;
    margin: 1rem auto 0;
    background-color: #fff;
    padding: 1rem;
    border-radius: 25px;
    overflow-y: scroll;
    .number-of-question {
      font-family: IRANSans;
      font-size: 12px;
      text-align: right;
      color: #ed1b24;
      margin: 0.7rem 0;

      span {
        display: inline-block;
        margin-right: 0.25rem;
        width: 1.5rem;
        height: 1.5rem;
        font-size: 11.8px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        background: #c01a22;
        border-radius: 50%;
        padding: 0.4rem;
      }
    }

    h5 {
      margin: 25px 0 2.2rem;
      font-family: IRANSans;
      font-size: 14px;
      font-weight: bold;
      text-align: right;
      color: #171717;
      line-height: 1.4;
    }

    .quiz-card-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border: solid 1px #c1c1c193;
        background: #fff;
        width: 100%;
        flex-direction: row;
        border-radius: 18px;
        height: 4rem;
        max-height: 5.5rem;

        .img {
          width: 27px;
          height: 27px;
          padding: 7px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #fff;
          border: solid 1px #c1c1c193;

          img {
            object-fit: contain;
          }
        }

        span {
          font-family: IRANSans;
          font-size: 13px;
          font-weight: bold;
          color: #646464;
          word-break: break-word;
        }
      }
      // Success Class
      .active {
        border: solid 1px #3fca60;

        span {
          color: #3fca60;
        }
        .img {
          background: #3fca60;
        }
      }
    }
  }

  .btns {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    margin: 1.2rem auto 0;

    .img {
      aspect-ratio: 1;
      width: 15%;
      height: 15%;
      max-width: 3rem;
    }

    button {
      padding: 1rem 1.4rem;
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
      flex-direction: row-reverse;

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
      background-color: #3fca60;
      color: white;
    }
  }
}
</style>

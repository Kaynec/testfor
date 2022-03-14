<template>
  <div class="comp-test-answer">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader onePageBack="Duel" title="پاسخنامه تشریحی دوئل" />

    <div class="quiz-card shadow animate__animated animate__fadeIn">
      <p class="number-of-question animate__animated animate__fadeIn">
        سوال شماره
        <span> {{ toPersianNumbers(`${id + 1}`) }} </span>
        <img
          v-if="question.question.images.length"
          @click="setCurrentImages(question.question.images)"
          src="@/assets/img/azmoon-icons/img-icon@3x.png"
          style="max-width: 2.5rem; margin-right: 0.5rem"
          alt="image of question"
        />
      </p>

      <h5>
        {{ question.question.text }}
      </h5>
      <div class="quiz-card-container animate__animated animate__fadeIn">
        <div
          v-for="(option, index) in question.question.options"
          :key="option._id"
          :class="getClass(index)"
        >
          <span> {{ option.text }} </span>

          <div class="imgs">
            <img
              v-if="option.images.length"
              @click="setCurrentImages(option.images)"
              src="@/assets/img/azmoon-icons/img-icon@3x.png"
              alt="image of question"
            />

            <div class="img">
              <img
                src="@/assets/img/azmoon-icons/accept-path-light.png"
                alt="active"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <p
      class="answer animate__animated animate__fadeIn"
      v-if="question.descriptiveAnswer && question.descriptiveAnswer.text"
    >
      {{ question.descriptiveAnswer }}
    </p>
    <div class="btns">
      <button
        v-if="id + 1 <= questions.answers.length - 1"
        class="red"
        @click="nextQuestion"
      >
        سوال بعدی
      </button>
      <button v-if="id - 1 >= 0" class="red" @click="previousQuestion">
        سوال قبلی
      </button>
    </div>
  </div>

  <ShowImages
    @convertBoolean="showImages = false"
    v-if="showImages"
    :images="JSON.stringify(currentImages)"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import router from '@/router';
import { useRoute } from 'vue-router';
import ShowImages from '@/modules/student-modules/show-images.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { MinimalHeader, ShowImages, DesktopMinimalHeader },
  setup() {
    const route = useRoute();

    const questions = ref(store.getters.getCurrentDuel);

    const id = ref(+route.params.id);

    const question = computed(() => {
      return questions.value.answers[id.value];
    });

    const goOnePageBack = () => router.go(-1);

    const getClass = (idx: number) => {
      if (question.value.correct == idx + 1) return 'card active';
      else if (
        question.value.answer === idx + 1 &&
        question.value.correct != idx + 1
      ) {
        return 'card danger';
      } else {
        return 'card';
      }
    };

    const showImages = ref(false);
    const currentImages = ref([]);
    // const currentUser = ref(store.getters.getCurrentStudent);
    const setCurrentImages = (images) => {
      currentImages.value = images;
      showImages.value = true;
    };

    const previousQuestion = () => {
      if (id.value - 1 >= 0) {
        id.value = id.value - 1;
      }
    };

    const nextQuestion = () => {
      if (id.value + 1 <= questions.value.answers.length) {
        id.value = id.value + 1;
      }
    };

    return {
      goOnePageBack,
      toPersianNumbers,
      getClass,
      store,
      question,
      id,
      questions,
      setCurrentImages,
      currentImages,
      showImages,
      previousQuestion,
      nextQuestion
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.comp-test-answer {
  width: 100%;
  height: 100%;
  max-width: 750px;
  .quiz-card {
    width: 90%;
    margin: 1rem auto;
    background-color: #fff;
    padding: 1rem;
    border-radius: 25px;

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

        span {
          font-family: IRANSans;
          font-size: 13px;
          font-weight: bold;
          color: #646464;
          word-break: break-word;
        }
      }

      .imgs {
        display: flex;
        grid-gap: 0.25rem;
        align-items: center;
        justify-content: space-between;

        img {
          max-width: 2.5rem;
        }

        .img {
          width: 27px;
          height: 27px;
          padding: 7px;
          background-color: #d3d7e0;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            object-fit: contain;
          }
        }
      }

      //
      .card.active {
        border: solid 2px #4ac367;

        span {
          font-family: IRANSans;
          font-size: 13px;
          font-weight: bold;
          color: #4ac367;
        }
        .img {
          background-color: #4ac367;
        }
      }

      .card.danger {
        border: solid 2px #c01a22;

        span {
          font-family: IRANSans;
          font-size: 13px;
          font-weight: bold;
          color: #c01a22;
        }
        .img {
          background-color: #c01a22;
        }
      }
    }
  }

  .answer {
    margin: 1rem 1rem;
    padding: 20px;
    font-family: IRANSans;
    border-radius: 14.7px;
    box-shadow: 0 11px 17px 0 rgba(7, 125, 62, 0.1);
    background-color: #4ac367;
    color: white;
  }
}

.btns {
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  margin: 1.2rem auto 0;

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
  }

  .green {
    background-color: #3fca60;
    color: white;
  }
}
</style>

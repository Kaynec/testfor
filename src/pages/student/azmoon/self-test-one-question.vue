<template>
  <div class="comp-test-answer">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="پاسخنامه آزمون خودسنجی" />

    <div class="quiz-card shadow animate__animated animate__fadeIn">
      <p class="number-of-question">
        سوال شماره
        <span> {{ toPersianNumbers(`${+id + 1}`) }} </span>
        <img
          v-if="question.question.images.length"
          @click="setCurrentImages(question.question.images)"
          src="@/assets/img/azmoon-icons/img-icon@3x.png"
          style="max-width: 2.5rem; margin-right: 0.5rem"
          alt="question img"
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
              alt="question img"
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

    <div class="answer">
      <img
        v-if="question.question.descriptiveAnswer.images.length"
        @click="setCurrentImages(question.question.descriptiveAnswer.images)"
        src="@/assets/img/azmoon-icons/img-icon@3x.png"
        style="max-width: 2.5rem; margin-right: 0.5rem"
      />

      <p>
        {{
          question.question.descriptiveAnswer.text
            ? question.question.descriptiveAnswer.text
            : 'توضیح سوال'
        }}
      </p>
    </div>
  </div>

  <ShowImages
    @convertBoolean="showImages = false"
    v-if="showImages"
    :images="JSON.stringify(currentImages)"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import ShowImages from '@/modules/student-modules/show-images.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { useRoute } from 'vue-router';

export default defineComponent({
  props: {
    answer: { type: String }
  },
  components: { MinimalHeader, ShowImages, DesktopMinimalHeader },
  setup(props) {
    const question = ref();

    const route = useRoute();

    const id = route.params.id;

    if (props.answer) {
      question.value = JSON.parse(props.answer);
      store.commit(
        StudentMutationTypes.SET_ONE_QUESTION_FOR_SELFTEST,
        question.value
      );
    } else {
      question.value = store.getters.getOneQuestionForSelfTestReport;
    }

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
    const setCurrentImages = (images) => {
      currentImages.value = images;
      showImages.value = true;
    };

    return {
      toPersianNumbers,
      getClass,
      store,
      question,
      setCurrentImages,
      currentImages,
      showImages,
      id
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
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 97%;
    margin: 1rem auto;
    p {
      background-color: #4ac367;
      padding: 20px;
      border-radius: 14.7px;
      box-shadow: 0 11px 17px 0 rgba(7, 125, 62, 0.1);
      color: white;
      font-size: 11px;
      flex-grow: 1;
      word-break: break-word;
    }

    img {
      max-width: 2.8rem;
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

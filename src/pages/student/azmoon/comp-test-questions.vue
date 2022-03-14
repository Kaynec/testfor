<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->

  <main
    v-bind="$attrs"
    v-else-if="!isFetching"
    class="self-test-questions animate__animated animate__fadeIn"
  >
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader
      v-if="isMobile()"
      :title="`
    امتیازات کسب شده :
          ${toPersianNumbers(store.getters.getCurrentStudent.point)} 
    `"
      onePageBack="Home"
    />
    <MinimalHeader
      v-else-if="!isMobile()"
      :title="` ازمون جامع رشته ${data.field.title}`"
      goOnePageBack="Home"
    />

    <section class="center" v-if="arrayIsEmpty">
      <h1 class="text-center mt-5">محتوایی برای نمایش وجود ندارد</h1>
    </section>

    <template v-else-if="!arrayIsEmpty">
      <!-- Progress Bar And Count -->
      <div class="progress-count">
        <div class="count">
          <span>
            {{ data.title }} {{ `رشته ${data.field.title}` }}
            {{ `مقطع ${data.grade.title}` }}
          </span>
          <!-- Change This And Width Of The Progress Bar Dynamically -->
          <span>
            {{ allQuestions[currentLessonIndex].length }}/{{
              currentQuestionIndex + 1
            }}
          </span>
        </div>
        <div class="progress-container animate__animated animate__fadeIn">
          <div class="progressbar">
            <div
              :style="`width : ${
                ((currentQuestionIndex + 1) /
                  allQuestions[currentLessonIndex].length) *
                100
              }%`"
              class="progressbar-child"
              ref="progressbarChild"
            ></div>
          </div>
        </div>
        <div class="timer">
          <span>{{ toPersianNumbers(timeForTemplate) }}</span>
          <img src="@/assets/img/time@2x.png" alt="time icon" />
        </div>
      </div>
      <!-- Quiz Card -->
      <div class="quiz-card shadow">
        <div class="number-of-question">
          <p>
            سوال شماره <span> {{ currentQuestionIndex + 1 }} </span>
          </p>

          <img
            alt="image of question"
            src="@/assets/img/azmoon-icons/img-icon@3x.png"
            v-if="
              allQuestions[currentLessonIndex][currentQuestionIndex].images
                .length
            "
            class="img-icon"
            @click="
              setCurrentImages(
                allQuestions[currentLessonIndex][currentQuestionIndex].images
              )
            "
          />
        </div>

        <h5>
          <!-- Change This With Real Data Of Question -->
          {{ allQuestions[currentLessonIndex][currentQuestionIndex].text }}
        </h5>
        <div
          class="quiz-card-container animate__animated animate__fadeIn"
          ref="container"
        >
          <div
            v-for="(option, index) in allQuestions[currentLessonIndex][
              currentQuestionIndex
            ].options"
            :class="`${
              allQuestions[currentLessonIndex][currentQuestionIndex].answer -
                1 ===
              index
                ? 'card success animate__animated animate__fadeIn'
                : 'card animate__animated animate__fadeIn'
            }`"
            @click="
              allQuestions[currentLessonIndex][currentQuestionIndex].answer =
                index + 1
            "
            :key="option._id"
          >
            <span v-if="option.text">
              {{ option.text }}
            </span>

            <span v-else> ... </span>

            <div class="imgs">
              <img
                src="@/assets/img/azmoon-icons/img-icon@3x.png"
                v-if="option.images.length"
                class="img-icon"
                @click="setCurrentImages(option.images)"
                alt="image of question"
              />
              <div class="img">
                <img src="@/assets/img/accept-path-light.png" alt="active" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Buttons -->
      <div class="lessons">
        <button
          @click="showNextLesson"
          :class="` ${
            currentLessonIndex + 1 <= allQuestions.length - 1 ? 'red' : 'grey'
          }  `"
        >
          درس بعدی
        </button>

        <button
          @click="showPreviousLesson"
          :class="` ${currentLessonIndex - 1 >= 0 ? 'red' : 'grey'}  `"
        >
          درس قبلی
        </button>
      </div>
      <div class="btns">
        <button @click="endAzmoon" class="red end">
          <span> اتمام آزمون </span>
          <i class="fas fa-arrow-right"></i>
        </button>
        <button
          @click="showNextQuestion"
          :class="` ${
            allQuestions[currentLessonIndex][currentQuestionIndex + 1]
              ? 'red'
              : 'grey'
          }  `"
        >
          سوال بعدی
        </button>
        <button
          @click="showPreviousQuestion"
          :class="` ${
            allQuestions[currentLessonIndex][currentQuestionIndex - 1]
              ? 'red'
              : 'grey'
          }  `"
        >
          سوال قبلی
        </button>
      </div>
    </template>

    <!--  -->
    <ShowImages
      :images="JSON.stringify(currentImages)"
      v-if="showImages"
      @convertBoolean="showImages = false"
    />
    <!--  -->
  </main>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import router from '@/router';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import { StudentExamApi } from '@/api/services/student/student-exam-service';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import ShowImages from '@/modules/student-modules/show-images.vue';
import { useRoute } from 'vue-router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  components: { MinimalHeader, ShowImages, DesktopMinimalHeader },
  setup() {
    const showImages = ref(false);
    const isFetching = ref(true);
    const route = useRoute();
    const container = ref();
    const time = ref(7200);
    const currentQuestionIndex = ref(0);
    const currentLessonIndex = ref(0);
    const allQuestions = ref([] as any);
    const duration = ref(0) as any;
    const currentImages = ref([] as any);
    const data = ref({});
    const arrayIsEmpty = ref(false);
    let examId = '';

    const setCurrentImages = (images) => {
      showImages.value = true;
      currentImages.value = [...images];
    };

    (async () => {
      const res = await StudentExamApi.get(route.params.id as any);

      if (!data.value) {
        isFetching.value = false;
        return;
      }

      data.value = res.data?.data;
      // Duration is in minutes we convert to seconds
      duration.value = res.data.data.duration * 60;

      examId = res.data.data._id;

      res.data.data.budgeting.forEach((budget, idx) => {
        if (budget.questions.length) {
          allQuestions.value[idx] = [...budget.questions];
        }
      });

      if (!allQuestions.value.length) {
        arrayIsEmpty.value = true;
        isFetching.value = false;
        return;
      }

      allQuestions.value.forEach((chunk) => {
        chunk.forEach((quest, idx) => {
          chunk[idx] = StudentExamApi.getOneQuestion(quest);
        });
      });

      allQuestions.value.forEach(async (chunk) => {
        await Promise.all(chunk)
          .then((questions) => {
            questions.forEach((quest: any, idx) => {
              chunk[idx] = { ...quest.data.data, answer: null };
            });
          })
          .then(() => {
            isFetching.value = false;
          });
      });

      // Every Second Minus One From The Duration
      setInterval(() => {
        if (time.value >= 0) time.value = time.value - 1;
        else {
          alertify.danger('مدت زمان امتحان شما تمام شده است');
          endAzmoon();
        }
      }, 1000);
    })();

    const goOnePageBack = () => {
      router.push({
        name: 'CompTest'
      });
    };

    const timeForTemplate = computed(() => {
      return new Date(time.value * 1000).toISOString().substr(11, 8);
    });

    const showPreviousQuestion = () => {
      if (currentQuestionIndex.value - 1 >= 0) {
        currentQuestionIndex.value -= 1;
      }
    };

    const showNextQuestion = () => {
      if (
        currentQuestionIndex.value + 1 <=
        allQuestions.value[currentLessonIndex.value].length
      ) {
        currentQuestionIndex.value += 1;
      }
    };

    const showPreviousLesson = () => {
      if (currentLessonIndex.value - 1 >= 0) currentLessonIndex.value -= 1;
    };

    const showNextLesson = () => {
      if (currentLessonIndex.value + 1 <= allQuestions.value.length - 1)
        currentLessonIndex.value += 1;
    };

    const endAzmoon = async () => {
      if (isFetching.value) {
        alertify.alert('لطفا بعد از بارگیری سوال ها دوباره تلاش کنید');
      } else {
        const objectToSend = {
          exam: { _id: examId },
          answers: []
        };
        const answers = [] as any;
        allQuestions.value.forEach((chunk) => {
          chunk.forEach((question) => {
            let correct = '';
            question.options.forEach((option, idx) => {
              if (option.isAnswer) {
                correct = idx;
              }
            });
            answers.push({
              session: {
                _id: question.session._id
              },
              course: {
                _id: question.course._id
              },
              question: {
                _id: question._id
              },
              answer: question.answer,
              correct: +correct + 1
            });
          });
        });

        objectToSend.answers = answers;

        const res = await StudentExamApi.registerExam(objectToSend);

        if (res.data) {
          alertify.alert('امتحان شما با موفقیت ثبت گردید');
          router.push({
            name: 'ReportCard',
            params: { id: res.data.data._id }
          });
        } else {
          alertify.alert('مشکلی رخ داده است! لطفا دوباره امتحان کنید');
        }
      }
    };

    return {
      goOnePageBack,
      timeForTemplate,
      toPersianNumbers,
      store,
      currentQuestionIndex,
      currentLessonIndex,
      allQuestions,
      container,
      showPreviousQuestion,
      showNextQuestion,
      endAzmoon,
      isFetching,
      showImages,
      currentImages,
      setCurrentImages,
      showNextLesson,
      showPreviousLesson,
      data,
      arrayIsEmpty
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.self-test-questions {
  position: relative;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
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
      font-family: IRANSans;
      color: #171717;

      span {
        &:first-child {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .timer {
      width: 100%;
      min-height: 2rem;
      max-height: 3rem;
      background: $redish-background;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;
      border-radius: 50px;
      padding: 5px 2px;

      span {
        background-image: linear-gradient(to left, #fad961 45%, #f76b1c);
        border-radius: 25px;
        display: inline-block;
        margin-left: 0.25rem;
        color: #fff;
        padding: 0.2rem 2rem;
        font-size: 18px;
        font-weight: bold;
      }
      img {
        width: 35px;
        height: 35px;
        object-fit: contain;
        margin-right: 0.75rem;
      }
    }
  }

  .quiz-card {
    width: 90%;
    margin: 1rem auto;
    background-color: #fff;
    padding: 1rem;
    border-radius: 25px;

    .number-of-question {
      display: flex;
      align-items: center;

      img {
        margin-right: 0.5rem;
        max-width: 2rem;
      }
      p {
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
        }

        .imgs {
          display: flex;
          align-items: center;
          justify-content: center;

          & > * {
            margin: 0 0.1rem;
          }
        }

        .img-icon {
          width: 27px;
          height: 27px;
          aspect-ratio: 1;
        }

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
      }
      // Success Class
      .success {
        border: solid 1px #3fca60;

        span {
          color: #3fca60;
        }
        .img {
          background: #3fca60;
        }

        .tick {
          width: 27px;
          height: 27px;
          aspect-ratio: 1;
          border-radius: 50%;
          border: 1px solid #ccc;
          text-align: center;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
      }
      .active {
        border: 1px solid #3fca60;
        color: #3fca60;

        span {
          color: #3fca60;
        }

        .tick {
          background-color: #4ac367;
        }
      }
    }
  }

  .lessons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;

    button {
      width: 48%;
      max-width: 350px;
      padding: 1.22rem 1.5rem;
      border-radius: 15px;
      border: none;
      font-family: IRANSans;
      font-size: 10px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }

    .red {
      background: $redish-background;
      text-align: center;
    }
    .green {
      background-color: #3fca60;
      color: white;
    }
    // Give This Class When There isn't Anymore Question Left Back
    .grey {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
      background-color: #d3d7e0;
      color: #646464;
    }
  }

  .btns {
    width: 90%;
    margin: 0.7rem auto;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 0.5rem;

    button {
      padding: 1.22rem 1.5rem;
      border-radius: 15px;
      border: none;
      font-family: IRANSans;
      font-size: 10px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      white-space: nowrap;
      width: 25%;
    }

    .red {
      background: $redish-background;
      text-align: center;
      position: relative;

      i {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 0.3rem;
        width: 24px;
        height: 24px;
        background: red;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: 30%;
        margin-right: 0.7rem;
        margin-left: 0.7rem;
      }
    }

    .end {
      width: 50%;
    }

    .green {
      background-color: #3fca60;
      color: white;
    }
    // Give This Class When There isn't Anymore Question Left Back
    .grey {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
      background-color: #d3d7e0;
      color: #646464;
    }
  }
}

.progress-container {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  .progressbar {
    flex-grow: 1;
    height: 6px;
    background-color: #171717;
    position: relative;
    margin-bottom: 1rem;
    border-radius: 5px;

    .progressbar-child {
      background-color: #3fca60;
      position: absolute;
      height: 100%;
      transition: ease 0.2s;
      width: 10%;
      left: 0;
    }
  }
}
</style>

<template>
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>

  <main class="answers" v-bind="$attrs" v-else>
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="سوالات برگزیده" onePageBack="SelfTest" />
    <section class="Cards">
      <div
        class="Card animate__animated animate__fadeIn"
        v-for="(answer, idx) in data"
        :key="answer._id"
      >
        <span @click="moveToAnswer(idx)">
          {{ toPersianNumbers(idx + 1) }}.
          {{ answer.question.text }}
        </span>

        <div class="imgs animate__animated animate__fadeIn">
          <img
            v-if="answer.question.images.length"
            @click="setCurrentImages(answer.question.images)"
            src="@/assets/img/azmoon-icons/img-icon@3x.png"
            alt="img of question"
          />

          <i class="fas fa-angle-left"></i>
        </div>
      </div>
    </section>
  </main>

  <ShowImages
    @convertBoolean="showImages = false"
    v-if="showImages"
    :images="JSON.stringify(currentImages)"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import ShowImages from '@/modules/student-modules/show-images.vue';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import router from '@/router';

export default defineComponent({
  components: { DesktopMinimalHeader, MinimalHeader, ShowImages },
  setup() {
    const isLoading = ref(true);
    const data = ref({}) as any;
    const showImages = ref(false);
    const currentImages = ref([]);
    const currentUser = ref(store.getters.getCurrentStudent);
    const setCurrentImages = (images) => {
      currentImages.value = images;
      showImages.value = true;
    };

    (async () => {
      const res = await StudentSelfTestApi.AllBookmarkQuestions();

      data.value = res.data.data;

      isLoading.value = false;
    })();

    const moveToAnswer = (idx) => {
      router.push({
        name: 'ChoosenQuestion',
        params: {
          id: idx
        }
      });
    };

    return {
      showImages,
      currentImages,
      setCurrentImages,
      data,
      currentUser,
      isLoading,
      toPersianNumbers,
      moveToAnswer
    };
  }
});
</script>

<style lang="scss" scoped>
.answers {
  width: 100%;
  height: 100%;
  max-width: 750px;
  overflow-x: hidden;
  overflow-y: auto;

  .label {
    width: 100%;
    padding: 10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    background-color: #fff;
    .label-red {
      font-size: 12px;
      text-align: right;
      color: #ed1b24;
    }
    .label-dark {
      font-weight: bold;
      text-align: right;
      color: #171717;
    }
  }

  .Cards {
    width: 100%;

    .Card {
      width: 95%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 19px 15px 24px 12px;
      border-radius: 10px;
      box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
      background-color: #fff;
      margin: 10px auto;
      word-wrap: break-word !important;

      span {
        font-size: 12px;
        text-align: right;
        color: #171717;
        word-break: break-word;

        &:hover {
          cursor: pointer;
        }
      }

      .imgs {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 2.5rem;
          margin-left: 0.3rem;
          transition: 0.3s ease-in-out all;
          &:hover {
            cursor: pointer;
            transform: scale(1.12);
          }
        }

        i {
          font-weight: light !important;
        }
      }
    }
  }
}
</style>

<template>
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>

  <main class="answers" v-bind="$attrs" v-else>
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader onePageBack="Duel" title="پاسخنامه" />

    <section class="label" v-if="examData && examData.title">
      <p class="label-red">
        {{ examData?.title }}
      </p>

      <p class="label-dark"></p>
    </section>

    <section class="center" v-if="!data">
      <h1 class="text-center mt-5">محتوایی برای نمایش وجود ندارد</h1>
    </section>

    <section class="Cards" v-else-if="data && data.answers">
      <div
        class="Card animate__animated animate__fadeIn"
        @click="moveToAnswer(idx)"
        v-for="(answer, idx) in data?.answers"
        :key="answer?._id"
      >
        <span>
          {{ toPersianNumbers(idx + 1) }}.
          {{ answer.question.text }}
        </span>

        <div class="imgs">
          <img
            v-if="answer.question"
            @click.stop="setCurrentImages(answer.question.images)"
            src="@/assets/img/azmoon-icons/img-icon@3x.png"
            alt="image of question"
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
import { useRoute } from 'vue-router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import ShowImages from '@/modules/student-modules/show-images.vue';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import router from '@/router';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { StudentDuelApi } from '@/api/services/student/student-duel-service';

export default defineComponent({
  components: { DesktopMinimalHeader, MinimalHeader, ShowImages },
  setup() {
    const isLoading = ref(true);
    const route = useRoute();
    const id = route.params.id;
    const data = ref({}) as any;
    const examData = ref({});
    const showImages = ref(false);
    const currentImages = ref([]);
    const currentUser = ref(store.getters.getCurrentStudent);
    const setCurrentImages = (images) => {
      currentImages.value = images;
      showImages.value = true;
    };

    (async () => {
      const res = await StudentDuelApi.getResult(id as any);

      data.value = res.data.data;

      if (!data.value) {
        isLoading.value = false;
        return;
      }

      examData.value = res.data.data.duel;

      isLoading.value = false;
    })();

    const moveToAnswer = (idx) => {
      store.commit(StudentMutationTypes.SET_CURRENT_DUEL, data.value);

      router.push({
        name: 'DuelAnswer',
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
      examData,
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

  .center {
    width: 100%;
    padding-top: 7rem;
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

      span {
        font-size: 12px;
        text-align: right;
        color: #171717;
        word-break: break-word;
      }

      .imgs {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          max-width: 2.5rem;
          margin-left: 0.3rem;
        }

        i {
          font-weight: light !important;
        }
      }
    }
  }
}
</style>

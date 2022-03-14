<template>
  <div class="desktop" v-if="!isMobile()"></div>
  <div class="self-test" v-else>
    <MinimalHeader :title="`پاسخنامه تشریحی ${title}`" onePageBack="SelfTest" />
    <div
      class="Card animate__animated animate__fadeIn"
      v-for="(question, idx) in questions[currentChunk]"
      :key="question._id"
      @click="openAnswerForTheQuestion(idx)"
    >
      <span class="animate__animated animate__fadeIn">
        {{ toPersianNumbers(idx + 1) }}.
        {{ question.text }}
      </span>
      <i class="fas fa-angle-left fa-2x"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import router from '@/router';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';

export default defineComponent({
  components: { MinimalHeader },
  setup() {
    const openAnswerForTheQuestion = (idx) => {
      router.push({
        name: 'SelfTestQuestionsAnswer',
        params: { idx }
      });
    };

    const allData = ref([]) as any;

    const currentChunk = ref(0) as any;

    (async () => {
      const resForModel = await StudentSelfTestApi.AllBookmarkQuestions();
      resForModel.data.data.forEach((item) => {
        if (item.question) allData.value.push(item);
      });
    })();

    return {
      currentChunk,
      toPersianNumbers,
      openAnswerForTheQuestion
    };
  }
});
</script>

<style lang="scss" scoped>
.self-test {
  width: 100%;
  height: 100%;
  padding-top: 8vh;
  font-family: IRANSans;

  .Card {
    width: 92%;
    margin: 10px auto;
    padding: 1.35rem;
    border-radius: 10px;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    background-color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

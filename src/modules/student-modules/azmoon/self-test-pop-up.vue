<template>
  <div
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
          label="شروع آزمون خودسنجی"
          componentName="SelfTestQuestions"
          :params="id"
        />
        <Dialog label="رودمپ درس" />
        <Dialog
          label="سوالات برگزیده"
          componentName="QuestionsChoosenNumbers"
          :params="id"
        />
      </div>

      <!-- Img Icon -->
      <img
        src="@/assets/img/icons-raw-close.png"
        alt="close"
        class="x-icon"
        @click="click"
      />
      <!--  -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Dialog from '@/modules/student-modules/dialog.vue';
export default defineComponent({
  props: {
    id: { type: String }
  },
  components: {
    Dialog
  },
  setup(_, { emit }) {
    const click = () =>
      setTimeout(() => {
        // Run after a bit of time so we don't accidentally touch footer component
        emit('convertBoolean');
      }, 150);

    return { touchstart };
  }
});
</script>

<style language="scss">
.comptest {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 5;
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
}

.flex-child {
  min-height: 60vh;
  max-height: 90%;
  overflow: scroll;
}
</style>

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
        <template v-if="data.isExpired">
          <Dialog
            label="پاسخنامه"
            componentName="CompTestAnswers"
            :params="data._id"
          />
          <Dialog
            label="کارنامه"
            componentName="ReportCard"
            :params="data._id"
          />
        </template>

        <template v-else-if="!data.isExpired">
          <Dialog
            label="پاسخنامه"
            componentName="CompTestAnswers"
            :params="data._id"
          />
          <Dialog
            label="آزمون آفلاین"
            componentName="compTestStart"
            :params="data._id"
            v-if="data.isExpired != 'undefined' && data.isExpired === 'false'"
          />
        </template>
      </div>

      <!-- Img Icon -->
      <img
        src="@/assets/img/icons-raw-close.png"
        class="x-icon"
        @click="click"
        alt="close"
      />
      <!--  -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Dialog from '@/modules/student-modules/dialog.vue';
export default defineComponent({
  props: { data: { required: true } },
  components: {
    Dialog
  },
  setup(props, { emit }) {
    console.log(props.data as any);
    const click = () =>
      setTimeout(() => {
        // Run after a bit of time so we don't accidentally touch footer component
        emit('convertBoolean');
      }, 150);

    return { click };
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
</style>

<template>
  <div
    class="
      comp-test-info
      flex-column
      d-flex
      justify-content-end
      align-items-center
    "
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
        <Dialog label="برترینهای آزمون" />
        <Dialog label="پاسخنامه" />
        <Dialog label="کارنامه" />
        <Dialog label="نمودار پیشرفت" />
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

<script>
import { defineComponent } from 'vue';
import Dialog from '@/modules/student-modules/dialog.vue';
export default defineComponent({
  components: {
    Dialog
  },
  setup(_, { emit }) {
    const click = () => {
      setTimeout(() => {
        emit('convertBoolean');
      }, 150);
    };

    return { touchstart };
  }
});
</script>

<style language="scss">
.comp-test-info {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
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

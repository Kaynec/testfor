<template>
  <div class="alert flex-column d-flex justify-content-end align-items-center">
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
      <div class="content">
        <h5>{{ label }}</h5>
        <p class="paraghraph">
          {{ text }}
        </p>
        <!-- You Can Render Anything In Here -->
        <slot></slot>
        <!--  -->
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
export default defineComponent({
  props: {
    label: { type: String, default: 'عنوان پیام' },
    text: { type: String, default: 'متن پیام' },
    data: { type: String, default: '' }
  },
  setup(_, { emit }) {
    const click = () =>
      setTimeout(() => {
        // Run after a bit of time so we don't accidentally touch footer component
        emit('convertBoolean');
      }, 150);

    return { click };
  }
});
</script>

<style lang="scss" scoped>
.alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 999;
  font-family: IRANSans;

  .content {
    width: 90%;
    min-height: 15rem;
    margin-left: auto;
    margin-right: auto;
    max-width: 600px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;

    h5 {
      font-size: 14px;
      font-weight: bold;
      color: #171717;
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .paraghraph {
      font-size: 12px;
      line-height: 2.36;
      color: #000;
    }
  }
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
  overflow: auto;
}
</style>

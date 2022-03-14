<template>
  <div
    class="message flex-column d-flex justify-content-center align-items-center"
  >
    <div class="card">
      <h5>{{ data.title }}</h5>
      <p>
        {{ data.description }}
      </p>
      <button @click="click">خواندم!</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  // Change The Body And Sender To Real Ones
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  setup(_, { emit }) {
    const click = () => {
      setTimeout(() => {
        emit('convertBoolean');
      }, 150);
    };

    return { click };
  }
});
</script>

<style lang="scss" scoped>
.message {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 99999;

  .card {
    width: 80%;
    max-width: 450px;
    margin: 0 auto;
    padding: 2rem 2.25rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.97);
    font-family: IRANSans;

    h5 {
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #171717;
    }
    p {
      font-size: 12px;
      line-height: 2.17;
      letter-spacing: normal;
      text-align: center;
      color: #171717;
      margin: 1.5rem 0;
    }

    button {
      border-radius: 15px;
      background-color: #d3d7e0;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #646464;
      border: none;
      padding: 15px 5px;
    }
  }
}
</style>

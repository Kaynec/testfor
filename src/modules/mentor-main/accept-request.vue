<template>
  <div
    class="message flex-column d-flex justify-content-center align-items-center"
  >
    <div class="card">
      <button class="green" @click="click('accept')">قبول درخواست</button>
      <button class="red" @click="click('reject')">رد درخواست</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  // Change The Body And Sender To Real Ones
  props: {
    data: {
      type: Object
    }
  },
  setup(_, { emit }) {
    const click = (acceptOrReject) => {
      setTimeout(() => {
        emit('convertBoolean', acceptOrReject);
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

  .card {
    width: 90%;
    margin: 0 auto;
    padding: 2rem 2.25rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.97);
    font-family: IRANSans;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
    max-width: 600px;
    button {
      border-radius: 15px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #fff;
      border: none;
      padding: 15px 5px;
    }

    .red {
      background-color: rgb(170, 25, 25);
    }

    .green {
      background-color: #4ac367;
    }
  }
}
</style>

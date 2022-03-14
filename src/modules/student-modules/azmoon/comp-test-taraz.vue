<template>
  <div class="taraz flex-column d-flex justify-content-end align-items-center">
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
        <div class="middle-card">
          <h5 v-if="sendRequest == false">لطفا تراز کاربری خود را وارد کنید</h5>
          <h5 v-else>رتبه شما</h5>

          <label class="floating-label" v-if="sendRequest == false">
            <input type="text" v-model="taraz" placeholder="00000" />
            <span> تراز کاربری </span>
          </label>

          <div class="points" v-else>
            <span> {{ taraz }} </span>
          </div>

          <button
            class="button-linear"
            style="color: white; padding: 0.85rem"
            @click="changeSendRequest"
            v-if="sendRequest == false"
          >
            محاسبه شود
          </button>
          <!--  -->
          <button
            class="button-linear"
            style="color: white; padding: 0.85rem"
            @click="sendRequestAgain"
            v-else
          >
            مجدد
          </button>
          <!--  -->
        </div>
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
import { defineComponent, ref } from 'vue';
export default defineComponent({
  setup(_, { emit }) {
    const taraz = ref('');
    const sendRequest = ref(false);

    const changeSendRequest = () => {
      sendRequest.value = true;
      taraz.value = '۱۵۲۲۱۵';
    };

    const sendRequestAgain = () => {
      taraz.value = '';
      sendRequest.value = false;
    };

    const click = () => {
      setTimeout(() => {
        emit('convertBoolean');
      }, 150);
    };

    return {
      click,
      taraz,
      changeSendRequest,
      sendRequest,
      sendRequestAgain
    };
  }
});
</script>

<style lang="scss" scoped>
.taraz {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 9999999;

  .middle-card {
    width: 90%;
    margin: 0 auto;
    padding: 1.5rem;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.97);
    position: absolute;
    left: 0;
    top: 20%;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: 450px;

    .points {
      background: #ededed;
      padding: 1rem;
      color: #d21921;
      font-size: 20px;
      font-weight: bold;
      border-radius: 10px;
      text-align: center;
    }

    .floating-label {
      margin-bottom: 1.8rem;

      input {
        transition: all 0.3s ease;
      }
    }

    h5 {
      font-family: IRANSans;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      color: #171717;
      margin: 1rem 0 2rem;
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
  cursor: pointer;
}
.flex-child {
  min-height: 60vh;
  max-height: 90%;
  overflow: scroll;
}
</style>

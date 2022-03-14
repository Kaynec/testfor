<template>
  <div class="desktop" v-if="!isMobile()"></div>

  <div class="Forget-the-password" v-else>
    <img src="@/assets/img/logo-mahan@2x.png" alt="logo" class="logo-mahan" />

    <!-- Main Part -->
    <form
      @submit.prevent="sendToHome()"
      class="Rectangle animate__animated animate__fadeIn"
    >
      <h6
        style="font-family: IRANSans; margin-bottom: 1rem"
        class="text-nowrap text-center"
      >
        ورود به حساب کاربری
      </h6>

      <p
        class="text-muted text-custom text-nowrap"
        style="font-family: IRANSans"
      >
        پیامکی حاوی یک کد ۶ رقمی برای شما ارسال شد
      </p>

      <label class="floating-label custom-label">
        <input
          type="text"
          v-model="code.code"
          placeholder="_ _ _ _"
          @blur="v$.code.$touch()"
        />
        <span> احراز شماره همراه </span>
      </label>

      <p
        v-for="(error, index) in v$.code.$errors"
        :key="index"
        class="text-danger text-bold"
        style="font-family: IRANSans"
      >
        {{ error.$message }}
      </p>

      <button class="button-linear">
        <span> تایید </span>
      </button>

      <p
        @click="resendVerificationCode()"
        class="text-custom text text-nowrap text-center text-secondary"
        style="font-family: IRANSans; font-size: 0.75rem"
      >
        ارسال مجدد کد
      </p>

      <p
        @click="cancel()"
        class="text-custom text text-nowrap text-center"
        style="font-family: IRANSans; font-size: 0.75rem"
      >
        برگشت به صفحه ورود
      </p>
    </form>
    <!--  -->
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { computed, defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import axios from 'axios';
import { store } from '@/store';
// import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
const alertify = require('../../../assets/alertifyjs/alertify');
import { baseUrl } from '@/api/apiclient';

export default defineComponent({
  props: {
    model: { type: String, default: ' {} ' },
    token: { type: String, default: '' }
  },
  setup(props) {
    const model = reactive(JSON.parse(props.model) as any);
    const windowHeight = ref();
    // If Entered Without Authentication

    // if (!model.phone) router.push({ name: 'StudentLogin' });
    const code = reactive({ code: '' });

    const sendToHome = async () => {
      v$.value.$touch();

      if (!v$.value.$invalid) {
        if (typeof +model == 'number') {
          const res = await StudentAuthServiceApi.loginOnce({
            username: model,
            code: code.code
          });
          if (res.data || res.data.status == 0 || res.data.status == 200) {
            // Set The Token If All Working
            store.commit(StudentMutationTypes.SET_TOKEN, res.data.token);
            // Change Current Student To Then Created One
            store.dispatch(StudentActionTypes.CURRENT_STUDENT);
            router.push({ name: 'Home' });
          } else {
            alertify.alert('نام کاربری یا رمز عبور اشتباه می باشد');
          }
        } else {
          const sendCode = await axios({
            method: 'post',
            url: `${baseUrl}auth/verificationcode`,
            headers: {
              token: props.token
            },
            data: {
              code: code.code
            }
          });

          if (
            sendCode.data.status == 0 ||
            sendCode.data.status == 0 ||
            sendCode.data.message == 'messages.verification.success'
          ) {
            // Set The Token If All Working
            store.commit(StudentMutationTypes.SET_TOKEN, props.token);
            // Change Current Student To Then Created One
            store.dispatch(StudentActionTypes.CURRENT_STUDENT);
            router.push({ name: 'Home' });
          } else {
            alertify.alert('نام کاربری یا رمز عبور اشتباه می باشد');
          }
        }
      }
    };
    const sendToPasswordRecover = () =>
      router.push({
        name: 'StudentPasswordRecover',
        params: { phone: model.phone }
      });
    const cancel = () => {
      router.push({ name: 'StudentLogin' });
    };

    const mustBeValidCode = (value: string) => value.length === 6;

    const rules = computed(() => ({
      code: {
        required: helpers.withMessage(
          'لطفا کد ارسال شده را وارد کنید',
          required
        ),
        mustBeValidCode: helpers.withMessage(
          'کد وارد شده باید ۶ رقم باشد',
          mustBeValidCode
        )
      }
    }));
    const v$ = useVuelidate(rules, code);

    const resendVerificationCode = async () => {
      const sendCode = await axios({
        method: 'post',
        url: `${baseUrl}auth/sendverificationcode`,
        headers: {
          token: props.token
        },
        data: {
          phone: model.phone || model
        }
      });
    };

    return {
      cancel,
      code,
      v$,
      sendToHome,
      sendToPasswordRecover,
      resendVerificationCode
    };
  }
});
</script>
<style lang="scss" scoped>
.Forget-the-password {
  width: 100vw;
  height: 100vh;
  padding: 37px 24.6px 156px 24px;
  background-color: #f6f8fa;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.text-custom {
  font-size: 0.55rem;
  font-weight: bold;
}
.Rectangle {
  width: 90vw;
  height: 315px;
  padding: 26px 20px 14px 21px;
  border-radius: 10px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.97);

  .btn-confirm {
    width: 269px;
    height: 51px;
    padding: 14px 120px 15px 121px;
    border-radius: 15px;
    background-image: linear-gradient(268deg, #ff545b 126%, #a50d14 -24%);

    span {
      width: 85px;
      height: 24px;
      font-family: IRANSans;
      font-size: 15.3px;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      color: #fff;
    }
  }

  .Rectangle-header {
    // width: 175px;
    // height: 28px;
    margin: 0 47px 23px 48px;
    font-family: IRANSans;
    font-size: 19px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -2.09px;
    text-align: center;
    color: #171717;
  }

  .Rectangle-label {
    opacity: 0.8;
    font-family: IRANSans;
    text-align: center;
    color: rgba(28, 25, 57, 0.8);
  }

  .inputs {
    width: 270px;
    height: 50px;
    margin: 44px 0 20px;
    border-radius: 10px;
    border: solid 1px #c8c8c8;
    background-color: #fff;
    text-align: center;
    font-family: IRANSans;
    font-size: 17px;
    text-align: center;
    color: #888;
  }

  .cancel {
    width: 109px;
    height: 21px;
    margin: 18px 80px 0 81px;
    font-family: IRANSans;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -2px;
    text-align: center;
    color: #ed1b24;
  }
}
img.logo-mahan {
  margin: 60px;
  width: 190px;
  height: 90px;
  object-fit: contain;
}
.btn-confirm {
  width: 269px;
  height: 51px;
  border-radius: 15px;
  background: rgb(241, 24, 24);
  border: none;
  span {
    width: 85px;
    height: 24px;
    font-family: IRANSans;
    font-size: 15.3px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #fff;
  }
}
.phone-display {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  span {
    font-size: 15px;
    color: #009205;
  }
  i {
    font-size: 12.5px;
    color: #009205;
  }
}

.custom-label {
  input::placeholder {
    opacity: 1;
  }
}
</style>

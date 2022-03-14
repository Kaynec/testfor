<template>
  <MentorDesktopHeader v-if="!isMobile()" />
  <!-- Spinner -->
  <div class="loader-parent" v-if="showThisWhileUplading">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="edit" v-else>
    <MinimalHeader title="ویرایش اطلاعات" onePageBack="MentorProfile" />
    <div class="img-container">
      <div class="img">
        <img :src="imageUrl" class="avatar" alt="avatar image" />

        <img
          src="@/assets/img/camera@2x.png"
          class="camera"
          alt="camera"
          @click="openCamera"
        />
        <input
          type="file"
          accept="image/x-png,image/jpeg,image/gif,image/svg"
          style="display: none"
          ref="imgInput"
          name="image"
          @input="uploadImage"
        />
      </div>

      <!-- Error For img -->
      <p
        v-for="error in v$.img.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>
      <!--  -->
    </div>
    <!-- Form -->
    <form @submit.prevent="onSubmit" class="animate__animated animate__fadeIn">
      <div class="input">
        <span style="white-space: nowrap; padding: 0"> نام </span>
        <input
          type="text"
          @blur="v$.firstname.$touch()"
          v-model="model.firstname"
          maxlength="20"
        />
      </div>
      <p
        v-for="error in v$.firstname.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="input">
        <span style="white-space: nowrap; padding: 0"> نام خانوادگی </span>
        <input
          type="text"
          @blur="v$.lastname.$touch()"
          v-model="model.lastname"
          maxlength="20"
        />
      </div>
      <p
        v-for="error in v$.lastname.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <!--  -->

      <div class="input">
        <span style="white-space: nowrap; padding: 0"> کد ملی </span>
        <input
          type="text"
          @blur="v$.nationalId.$touch()"
          v-model="model.nationalId"
          maxlength="20"
        />
      </div>
      <p
        v-for="error in v$.nationalId.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <!--  -->

      <div class="input">
        <span style="white-space: nowrap; padding: 0"> شماره تلفن همراه </span>
        <input
          type="text"
          @blur="v$.phone.$touch()"
          v-model="model.phone"
          maxlength="20"
        />
      </div>
      <p
        v-for="error in v$.phone.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <!--  -->

      <div class="input">
        <span style="white-space: nowrap; padding: 0"> تاریخ تولد </span>
        <input
          type="text"
          data-jdp
          @blur="v$.birthdate.$touch()"
          v-model="model.birthdate"
        />
      </div>
      <p
        v-for="error in v$.birthdate.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <!--  -->

      <div class="input radio">
        <span style="white-space: nowrap; padding: 0"> جنسیت </span>
        <label>مونث</label>
        <input
          type="radio"
          @blur="v$.gender.$touch()"
          v-model="model.gender"
          value="male"
        />
        <label>مذکر</label>
        <input
          type="radio"
          @blur="v$.gender.$touch()"
          v-model="model.gender"
          value="female"
        />
      </div>
      <p
        v-for="error in v$.gender.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <!--  -->

      <div class="input">
        <span style="white-space: nowrap; padding: 0"> توضیحات </span>
        <textarea
          type="text"
          @blur="v$.shortDescription.$touch()"
          v-model="model.shortDescription"
          maxlength="155"
        >
        </textarea>
      </div>
      <p
        v-for="error in v$.shortDescription.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>
      <button
        type="submit"
        class="button-linear"
        style="padding: 1rem; color: #fff"
      >
        ثبت اطلاعات
      </button>
    </form>
    <!--  -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers, maxLength } from '@vuelidate/validators';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { store } from '@/store';
import router from '@/router';
import { provinces } from '@/assets/provinces';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { baseUrl } from '@/api/apiclient';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  components: {
    MinimalHeader,
    MentorDesktopHeader
  },
  setup() {
    const showThisWhileUplading = ref(false);

    const goOnePageBack = () =>
      router.push({
        name: 'MentorProfile'
      });

    onMounted(() => {
      (window as any).jalaliDatepicker.startWatch();
    });

    const imgInput = ref(null) as any;

    const model = reactive({
      firstname: store.getters.getCurrentMentor.firstname,
      lastname: store.getters.getCurrentMentor.lastname,
      phone: store.getters.getCurrentMentor.phone,
      shortDescription: store.getters.getCurrentMentor.shortDescription,
      gender: store.getters.getCurrentMentor.gender,
      birthdate: store.getters.getCurrentMentor.birthdate,
      nationalId: `${store.getters.getCurrentMentor.nationalId}`,
      img: ''
    }) as any;

    const states = ref([] as any);

    StudentAuthServiceApi.getAllStates().then((res) => {
      states.value = res.data.data;
    });

    const cities = computed(() => {
      return (
        states.value.find((el) => {
          return el.ID === model.stateId;
        })?.CityList || []
      );
    });
    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (
      store.getters.getCurrentMentor &&
      store.getters.getCurrentMentor.profileImage
    ) {
      imageUrl = `${baseUrl}mentor/getProfileImage/${store.getters.getCurrentMentor.profileImage}`;
    }

    // limit for pic is 10 Mb
    const limitSize = (value) => !helpers.req(value) || value.size < 1048576;

    const mustBeValidNationalId = (value: string) => value.length === 10;

    const mustBeValidPhone = (value: string) => value.length === 11;

    const rules = computed(() => ({
      firstname: {
        required: helpers.withMessage('لطفا نام خود را وارد کنید', required),
        minLength: helpers.withMessage(
          'نام باید حداقل ۳ حرف باشد',
          minLength(3)
        )
      },
      lastname: {
        required: helpers.withMessage(
          'لطفا نام خانوادگی خود را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          'نام خانوادگی  باید حداقل ۳ حرف باشد',
          minLength(3)
        )
      },
      shortDescription: {
        required: helpers.withMessage(
          'لطفا توضیحات خود را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          ' توضیحات  باید حداقل 10 حرف باشد',
          minLength(10)
        ),
        maxLength: helpers.withMessage(
          ' توضیحات   باید  حداکثر 150 حرف باشد',
          maxLength(150)
        )
      },
      gender: {
        required: helpers.withMessage('لطفا  جنسیت خود را وارد کنید', required)
      },
      nationalId: {
        exactLength: helpers.withMessage(
          'کد ملی باید  10 رقم باشد',
          mustBeValidNationalId
        )
      },
      birthdate: {
        required: helpers.withMessage(
          'لطفا  تاریخ تولد خود را وارد کنید',
          required
        )
      },
      phone: {
        required: helpers.withMessage(
          'شماره تلفن همراه باید 11 رقم باشد',
          mustBeValidPhone
        )
      },
      img: {
        limitSize: helpers.withMessage(
          'حجم تصویر باید کمتر از 1 مگابایت باشد',
          limitSize
        )
      }
    }));

    const onSubmit = async () => {
      v$.value.$touch();
      // If Something isn't filled return
      if (v$.value.$invalid) return;
      else {
        showThisWhileUplading.value = true;

        let { img, ...restOfModel } = model as any;

        const temp = new FormData();

        const userEditedInfo = (await MentorAuthServiceApi.editMentor(
          restOfModel
        )) as any;
        console.log(userEditedInfo);

        // if user selected a img
        if (img != '') {
          temp.append('profile', img);
          await MentorAuthServiceApi.uploadProfile(temp);
        }

        // If The res is okay
        if (userEditedInfo.data) {
          showThisWhileUplading.value = false;
          // / Update The Current user
          store.dispatch(MentorActionTypes.CURRENT_MENTOR);
          alertify.success(' پروفایل شما با موفقیت ویرایش شد');
          router.push({ name: 'MentorProfile' });
        } else {
          alertify.warning(userEditedInfo.message);
          router.push({ name: 'MentorProfile' });
        }
      }
    };

    const v$ = useVuelidate(rules, model);
    // Open The Gallery On Click
    const openCamera = () => imgInput.value.click();
    // assign The File to a variable

    const uploadImage = async () => (model.img = await imgInput.value.files[0]);

    return {
      v$,
      onSubmit,
      model,
      goOnePageBack,
      provinces,
      imgInput,
      openCamera,
      uploadImage,
      StudentAuthServiceApi,
      store,
      showThisWhileUplading,
      imageUrl,
      states,
      cities
    };
  }
});
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  font-family: IRANSans;
  height: 100%;
  max-width: 750px;
  position: relative;
  padding-top: 7vh;
  .img-container {
    width: 100%;
    margin: 3rem auto 1rem auto;
    display: flex;
    justify-content: center;
    // background: red;
    .img {
      position: relative;
      border: 0.4rem solid #d42527;
      border-radius: 50%;
    }
    .camera {
      position: absolute;
      bottom: 0;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      background: #d21921;
      border-radius: 15px;
      padding: 2px;
      width: 32.5px;
      height: 32.5px;
      transform: translateY(50%);
    }
    .avatar {
      position: relative;
      object-fit: cover;
      width: clamp(6rem, 7.5rem, 12rem);
      aspect-ratio: 1;
      border-radius: 50%;
      border: solid 4.4px white;
    }
  }

  form {
    width: 80%;
    max-width: 500px;
    margin: 2rem auto 1rem auto;

    .input {
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      margin: 1rem 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-areas: 'span input input';
      align-items: center;
      padding: 0.5rem;
      span {
        display: inline-block;
        text-align: right;
        color: #949494;
        font-size: 10px;
        grid-area: Span;
        min-width: 5rem;
      }

      textarea {
        border: none;
        outline: none;
        padding-right: 0.5rem;
        grid-area: input;
        resize: none;
        font-size: 0.71rem;
        min-height: 5rem;
      }

      input {
        border: none;
        outline: none;
        padding-right: 0.5rem;
        grid-area: input;
      }
    }

    .radio {
      display: flex;
      align-items: center;

      input {
        margin-right: 1rem;
        margin-left: 1rem;
      }
    }

    .select {
      width: 100%;
      border-radius: 10px;
      background-color: #fff;
      margin: 1rem 0;
      padding: 0.5rem;

      span {
        font-size: 9px;
      }

      select {
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #949494;
        background: transparent;
      }

      option {
        font-size: 14px;
      }
    }

    .custom {
      span {
        color: #949494;
      }

      select {
        color: #333;
        -webkit-appearance: none;
        -moz-appearance: none;
      }
    }

    .custom select::-ms-expand {
      display: none;
    }
  }
}
</style>

<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <!-- Spinner -->

  <div class="loader-parent" v-if="showThisWhileUplading">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="edit" v-else>
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="ویرایش اطلاعات" goOnePageBack="MyProfile" />
    <div class="img-container animate__animated animate__fadeIn">
      <div class="img">
        <img
          class="animate__animated animate__fadeIn avatar"
          alt="avatar"
          :src="imageUrl"
        />

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

      <!--  -->

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

      <div class="select">
        <select @blur="v$.stateId.$touch()" v-model="model.stateId">
          <option v-for="state in states" :value="state.ID" :key="state.ID">
            {{ state.Title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.stateId.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select">
        <select @blur="v$.cityId.$touch()" v-model="model.cityId">
          <option v-for="city in cities" :value="city.ID" :key="city.ID">
            {{ city.Title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.cityId.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> مقطع تحصیلی </span>
        <select @blur="v$.grade.$touch()" v-model="model.grade">
          <option
            v-for="grade in allGrades"
            :value="{ _id: grade._id }"
            :key="grade._id"
          >
            {{ grade.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.grade.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> گروه تحصیلی </span>
        <select @blur="v$.group.$touch()" v-model="model.group">
          <option
            v-for="group in groups.groups"
            :value="{ _id: group._id }"
            :key="group._id"
          >
            {{ group.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.group.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> فیلد تحصیلی </span>
        <select @blur="v$.field.$touch()" v-model="model.field">
          <option
            v-for="field in fields()"
            :value="{ _id: field._id }"
            :key="field._id"
          >
            {{ field.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.field.$errors"
        :key="error.id"
        class="small text-bold text-danger text-center"
      >
        {{ error.$message }}
      </p>

      <div class="select custom">
        <span style="white-space: nowrap; padding: 0"> گرایش تحصیلی </span>
        <select @blur="v$.orientation.$touch()" v-model="model.orientation">
          <option
            v-for="orientation in orientations()"
            :value="{ _id: orientation._id }"
            :key="orientation._id"
          >
            {{ orientation.title }}
          </option>
        </select>
      </div>
      <p
        v-for="error in v$.orientation.$errors"
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
import { defineComponent, reactive, ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, helpers, maxLength } from '@vuelidate/validators';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import { store } from '@/store';
import router from '@/router';
import { provinces } from '@/assets/provinces';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { StudentGradeApi } from '@/api/services/student/student-grade-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    const showThisWhileUplading = ref(false);

    const goOnePageBack = () => router.go(-1);

    const imgInput = ref(null) as any;

    const model = reactive({
      firstname: store.getters.getCurrentStudent.firstname,
      lastname: store.getters.getCurrentStudent.lastname,
      stateId: store.getters.getCurrentStudent.stateId,
      cityId: store.getters.getCurrentStudent.cityId,
      grade: {
        _id: store.getters.getCurrentStudent.grade._id
      },
      group: {
        _id: store.getters.getCurrentStudent.group._id
      },
      field: {
        _id: store.getters.getCurrentStudent.field._id
      },
      img: ''
    }) as any;
    store.getters.getCurrentStudent.orientation._id &&
      (model.orientation = {
        _id: store.getters.getCurrentStudent.orientation._id
      });

    const states = ref([] as any);
    const allGrades = reactive([] as any);

    StudentGradeApi.getAll().then((res) => {
      res.data.data.forEach((grade: any) => {
        allGrades.push(grade);
      });
    });

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

    const groups = computed(() => {
      return (
        allGrades.find((el) => {
          return el._id === model.grade._id;
        }) || []
      );
    });

    const fields = () => {
      if (groups.value && groups.value.groups) {
        return groups.value.groups.find((el) => {
          return el._id === model.group._id;
        })?.fields;
      }
    };

    const orientations = () => {
      if (fields()) {
        return fields().find((el) => {
          return el._id === model.field._id;
        })?.orientations;
      }
    };

    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (
      store.getters.getCurrentStudent &&
      store.getters.getCurrentStudent.profileImage
    ) {
      imageUrl = `${baseUrl}student/getProfileImage/${store.getters.getCurrentStudent.profileImage}`;
    }

    // limit for pic is 10 Mb
    const limitSize = (value) => !helpers.req(value) || value.size < 1048576;

    const rules = computed(() => ({
      firstname: {
        required: helpers.withMessage('لطفا نام خود را وارد کنید', required),
        minLength: helpers.withMessage(
          'نام باید حداقل ۳ رقم باشد',
          minLength(3)
        )
      },
      lastname: {
        required: helpers.withMessage(
          'لطفا نام خانوادگی خود را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          'نام خانوادگی  باید حداقل ۳ رقم باشد',
          minLength(3)
        )
      },
      stateId: {
        required: helpers.withMessage('لطفا  استان خود را وارد کنید', required)
      },
      cityId: {
        required: helpers.withMessage('لطفا شهر  خود را وارد کنید', required)
      },
      grade: {
        required: helpers.withMessage(
          'لطفا مقطع تحصیلی خود را وارد کنید',
          required
        )
      },
      group: {
        required: helpers.withMessage(
          'لطفا گروه تحصیلی خود را وارد کنید',
          required
        )
      },
      field: {
        required: helpers.withMessage(
          'لطفا زمینه تحصیلی خود را وارد کنید',
          required
        )
      },
      orientation: {
        required: helpers.withMessage(
          'لطفا گرایش تحصیلی خود را وارد کنید',
          required
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

        const { img, ...restOfModel } = model as any;

        const temp = new FormData();

        const userEditedInfo = (await StudentAuthServiceApi.editStudent(
          restOfModel
        )) as any;

        // if user selected a img
        if (img != '') {
          temp.append('profile', img);
          await StudentAuthServiceApi.uploadProfile(temp);
        }

        // If The res is okay
        if (userEditedInfo.data) {
          showThisWhileUplading.value = false;
          // / Update The Current user
          store.dispatch(StudentActionTypes.CURRENT_STUDENT);
          alertify.success('کاربر با موفقیت ویرایش شد');
          router.push({ name: 'MyProfile' });
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
      cities,
      groups,
      fields,
      orientations,
      allGrades
    };
  }
});
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  overflow-x: hidden;
  max-width: 750px;
  // padding-top: 8vh;
  .img-container {
    width: 100%;
    margin: 3rem auto 1rem auto;
    display: flex;
    justify-content: center;
    // background: red;
    .img {
      position: relative;
      border: 0.4rem solid #d42527;
      border-radius: 50px;
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
      width: 6rem;
      height: 6rem;
      border-radius: 50px;
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

<template>
  <div :class="`${!isMobile() ? 'Sign-up desktop' : 'Sign-up'}`">
    <form
      @submit.prevent="register()"
      class="animate__animated animate__fadeIn"
    >
      <h1 class="text-header">اطلاعات خود را وارد کنید</h1>

      <label class="floating-label">
        <input
          placeholder="نام"
          type="text"
          v-model="model.firstname"
          @blur="onBlur('firstname')"
        />
        <span> نام </span>
      </label>
      <p
        v-for="error in v$.firstname.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <input
          placeholder=" نام خانوادگی"
          type="text"
          v-model="model.lastname"
          @blur="onBlur('lastname')"
        />
        <span> نام خانوادگی </span>
      </label>
      <p
        v-for="error in v$.lastname.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <input
          placeholder="رمز عبور"
          type="password"
          v-model="model.password"
          @blur="onBlur('password')"
        />
        <span> رمز عبور</span>
      </label>
      <p
        v-for="error in v$.password.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <input
          placeholder="تکرار رمز عبور"
          type="password"
          v-model="model.repassword"
          @blur="onBlur('repassword')"
        />
        <span>تکرار رمز عبور </span>
      </label>
      <p
        v-for="error in v$.repassword.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <input
          type="text"
          placeholder="شماره همراه"
          v-model="model.phone"
          @blur="onBlur('phone')"
          style="appearance: none"
        />
        <span> شماره همراه </span>
      </label>

      <p
        v-for="error in v$.phone.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <input
          type="text"
          placeholder=" کد ملی"
          v-model="model.nationalId"
          @blur="onBlur('nationalId')"
          style="appearance: none"
        />
        <span> کد ملی </span>
      </label>

      <p
        v-for="error in v$.nationalId.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <select
          v-model="model.stateId"
          class="select stateId"
          @blur="onBlur('stateId')"
        >
          <option v-for="state in states" :value="state.ID" :key="state.ID">
            {{ state.Title }}
          </option>
        </select>
        <span> استان </span>
      </label>

      <p
        v-for="error in v$.stateId.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <select
          v-model="model.cityId"
          class="select cityId"
          @blur="onBlur('cityId')"
        >
          <option v-for="city in cities" :value="city.ID" :key="city.ID">
            {{ city.Title }}
          </option>
        </select>
        <span> شهر </span>
      </label>

      <p
        v-for="error in v$.cityId.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <select
          class="select grade"
          v-model="model.grade"
          placeholder=" مقطع تحصیلی"
          @blur="onBlur('grade')"
        >
          <option
            v-for="grade in allGrades"
            :value="{ _id: grade._id }"
            :key="grade.__id"
          >
            {{ grade.title }}
          </option>
        </select>
        <span> مقطع تحصیلی </span>
      </label>

      <p
        v-for="error in v$.grade.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <select
          class="select orientation"
          v-model="model.group"
          placeholder=" رشته تحصیلی"
          @blur="onBlur('group')"
        >
          <option
            v-for="group in groups.groups"
            :key="group.__id"
            :value="{ _id: group._id }"
          >
            {{ group.title }}
          </option>
        </select>
        <span> رشته تحصیلی </span>
      </label>

      <p
        v-for="error in v$.group.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <select
          class="select orientation"
          v-model="model.field"
          placeholder=" فیلد تحصیلی"
          @blur="onBlur('field')"
        >
          <option
            v-for="field in fields()"
            :key="field.__id"
            :value="{ _id: field._id }"
          >
            {{ field.title }}
          </option>
        </select>
        <span> فیلد تحصیلی </span>
      </label>

      <p
        v-for="error in v$.field.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <label class="floating-label">
        <select
          class="select orientation"
          v-model="model.orientation"
          placeholder=" گرایش تحصیلی"
          @blur="onBlur('field')"
        >
          <option
            v-for="orientation in orientations()"
            :key="orientation.__id"
            :value="{ _id: orientation._id }"
          >
            {{ orientation.title }}
          </option>
        </select>
        <span> گرایش تحصیلی </span>
      </label>

      <p
        v-for="error in v$.orientation.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <p
        class="text-danger text-bold m-2"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ errorMessage }}
      </p>

      <button type="submit" class="button-linear">
        <span> ثبت اطلاعات </span>
      </button>

      <span @click="cancel()" class="text-bold cancel">
        برگشت به صفحه ورود
      </span>
    </form>
    <img v-show="!isMobile()" src="@/assets/img/mahan.png" alt="logo" />
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { computed, defineComponent, reactive, ref } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required, sameAs } from '@vuelidate/validators';
import { StudentGradeApi } from '@/api/services/student/student-grade-service';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const allGrades = reactive([]) as any;
    const states = ref([]) as any;
    const errorMessage = ref('');
    const route = useRoute();
    const model = reactive({
      firstname: '',
      lastname: '',
      password: '',
      repassword: '',
      phone: '',
      stateId: '',
      cityId: '',
      nationalId: '',
      grade: {},
      group: {},
      field: {},
      orientation: {}
    } as any);
    // Filling The Grades And Orientations

    StudentGradeApi.getAll().then((res) => {
      res.data.data.forEach((grade: any) => {
        allGrades.push(grade);
        console.log(res.data);
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
    // Submit The Information
    const register = async () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        // // Copy Every Element Of Model Except repassword
        let { repassword, ...temp } = model;

        const objToSignUpWith = {
          ...temp,
          username: model.phone
        };

        route.params.inviteCode &&
          (objToSignUpWith.inviteCode = {
            _id: route.params.inviteCode
          });

        const signUp = await StudentAuthServiceApi.signUp(objToSignUpWith);

        if (signUp)
          router.push({
            name: 'StudentAuthentication',
            params: { model: JSON.stringify(temp), token: signUp.data.token }
          });
      }
    };

    const onBlur = (prop: any) => {
      if (errorMessage.value) errorMessage.value = '';
      v$.value[prop].$touch();
    };

    const cancel = () => {
      router.push({
        name: 'StudentLogin'
      });
    };

    const mustBeValidPhone = (value: string) => value.length === 11;

    const mustBeValidNationalId = (value: string) => value.length === 10;

    const mustBeNumber = (value: string) => {
      let allAreNumbers = true;
      for (let i = 0; i < value.length; i++)
        if (isNaN(+value[i])) allAreNumbers = false;
      return allAreNumbers;
    };

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
      password: {
        required: helpers.withMessage(
          'لطفا رمز عبور خود را وارد کنید',
          required
        ),
        minLength: helpers.withMessage(
          'رمز عبور باید حداقل  ۸ رقم باشد ',
          minLength(8)
        )
      },
      repassword: {
        sameAs: helpers.withMessage(
          'رمز عبور و تکرار رمز عبور باید یکسان باشند',
          sameAs(model.password)
        )
      },
      phone: {
        required: helpers.withMessage(
          'لطفا شماره همراه خود را وارد کنید',
          required
        ),
        mustBeNumber: helpers.withMessage(
          'شماره همراه نباید دارای حروف باشد',
          mustBeNumber
        ),
        mustBeValidPhone: helpers.withMessage(
          'شماره همراه باید 11 رقم باشد',
          mustBeValidPhone
        )
      },
      nationalId: {
        // required: helpers.withMessage('لطفا کد ملی خود را وارد کنید', required),
        mustBeValidNationalId: helpers.withMessage(
          'کد ملی باید 10 رقم باشد',
          mustBeValidNationalId
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
      }
    }));

    const v$ = useVuelidate(rules, model) as any;

    return {
      model,
      register,
      cancel,
      v$,
      allGrades,
      errorMessage,
      onBlur,
      groups,
      fields,
      states,
      cities,
      orientations
    };
  }
});
</script>
<style lang="scss" scoped>
.Sign-up {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  font-family: IRANSans;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  form {
    width: 90%;
    max-width: 350px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.97);
    text-align: center;
    padding: 2.5rem 1.25rem;
    margin: 2.5rem 0;
    overflow-y: auto;
    // height: 100%;
    .select {
      width: 100%;
      padding: 10px;
      -moz-appearance: none;
      -webkit-appearance: none;
      appearance: none;
    }
    .text-header {
      font-size: 1.35rem;
      font-weight: 500;
      letter-spacing: -2.09px;
      color: #171717;
      margin-bottom: 2rem;
    }
    .province {
      background-image: url('https://s4.uupload.ir/files/arrow-down-filled-triangle-svgrepo-com_cfk0.png');
      background-repeat: no-repeat;
      background-position: left 1.5em top 50%, 0 0;
      background-size: 0.85em auto, 100%;
    }
    .cancel {
      font-size: 13px;
      letter-spacing: -2px;
      text-align: center;
      color: #ed1b24;
    }
  }
}

.desktop {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background: url('../../../assets/img/desktop-bg@2x.png');
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  // overflow-x: hidden;

  .text-header {
    margin-bottom: 0;
  }

  form {
    overflow: hidden;
    padding: 1.5rem;
  }
}
</style>

<template>
  <div
    class="
      calendar-add
      flex-column
      d-flex
      justify-content-center
      align-items-center
      animate__animated animate__fadeIn
    "
  >
    <form @submit.prevent="onSubmit">
      <!-- Add Ability To Change The Stuff Later -->
      <label class="floating-label">
        <select
          v-model="model.date"
          class="select date"
          @blur="v$.date.$touch()"
        >
          <option
            v-for="date in currentdysOfMonth.days"
            :value="formatNumber(date)"
            :key="date"
          >
            {{ date }}
            {{ currentdysOfMonth.name }}
          </option>
        </select>
        <span> تاریخ </span>
      </label>

      <label class="floating-label">
        <input
          type="text"
          placeholder="عنوان"
          v-model="model.title"
          @blur="v$.title.$touch()"
          style="appearance: none"
        />
        <span> عنوان رویداد </span>
      </label>

      <p
        v-for="error in v$.title.$errors"
        class="text-danger text-bold m-2"
        :key="error.$uid"
        style="font-family: IRANSans; font-size: 12px"
      >
        {{ error.$message }}
      </p>

      <button class="button-linear" style="color: #fff; padding: 0.7rem 1rem">
        ویرایش رویداد
      </button>
    </form>

    <!-- Img Icon -->
    <img
      src="../../../assets/img/icons-raw-close.png"
      class="x-icon"
      @click="touchstart"
    />
    <!--  -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { StudentEventApi } from '@/api/services/student/student-event-service';
import { helpers, required } from '@vuelidate/validators';
import { toEnglishNumbers } from '@/utilities/to-persian-numbers';
const alertify = require('../../../assets/alertifyjs/alertify');

export default defineComponent({
  props: {
    data: { type: String },
    currentDaysOfMonth: { type: String }
  },
  setup(props, { emit }) {
    const model = ref(JSON.parse(props.data as any));
    model.value.date = '';
    const currentdysOfMonth = ref(props.currentDaysOfMonth) as any;
    console.log(model.value);
    // currentdysOfMonth.value = JSON.parse(currentdysOfMonth);

    const touchstart = () => {
      setTimeout(() => {
        emit('convertBoolean');
      }, 150);
    };

    const rules = computed(() => ({
      date: {
        required: helpers.withMessage('لطفا تاریخ عنوان را وارد کنید', required)
      },
      title: {
        required: helpers.withMessage(
          'لطفا عنوان رویداد را وارد کنید',
          required
        )
      }
    }));

    const formatNumber = (number) => {
      return number < 10 ? '0' + number : number;
    };

    const onSubmit = () => {
      v$.value.$touch();
      console.log(v$.value, model.value);
      if (!v$.value.$invalid) {
        StudentEventApi.edit(model.value._id, {
          title: model.value.title,
          date: `${toEnglishNumbers(currentdysOfMonth.value.currentYear)}/${
            currentdysOfMonth.value.monthNumber
          }/${model.value.date}`
        }).then((res) => {
          if (res.data) {
            setTimeout(() => {
              emit('convertBoolean');
            }, 150);
          }
        });
      }
    };

    const v$ = useVuelidate(rules, model);

    return { touchstart, v$, model, onSubmit, formatNumber, currentdysOfMonth };
  }
});
</script>

<style lang="scss" scoped>
.calendar-add {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 99999999;

  form {
    width: 80%;
    margin: 0 auto;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.97);
    font-family: IRANSans;
    padding: 2rem 0.7rem;
    max-width: 500px;

    .floating-label {
      width: 100%;
    }

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
}
</style>

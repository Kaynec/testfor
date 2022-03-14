<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.username}` : 'تعریف ادمین جدید' }}
    </h2>
    <Form @submit="save" :validation-schema="validateSchema" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="username">نام کاربری:</label>
          <Field
            type="text"
            class="form-control"
            id="username"
            name="username"
            :readonly="model._id"
            v-model="model.username"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="username" />
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="email">ایمیل:</label>
          <Field
            type="text"
            class="form-control"
            id="email"
            name="email"
            :readonly="model._id"
            v-model="model.email"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="email" />
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="firstname">نام:</label>
          <Field
            type="text"
            class="form-control"
            id="firstname"
            name="firstname"
            v-model="model.firstname"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="firstname" />
          </span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="lastname">نام خانوادگی:</label>
          <Field
            type="text"
            class="form-control"
            id="lastname"
            name="lastname"
            v-model="model.lastname"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="lastname" />
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="birthdate">تاریخ تولد:</label>
          <Field
            type="text"
            class="form-control"
            id="birthdate"
            name="birthdate"
            v-model="model.birthdate"
            data-jdp
          />
          <span class="form-text text-danger">
            <ErrorMessage name="birthdate" />
          </span>
        </div>

        <div class="form-group col-md-4 col-sm-12">
          <label for="gender">جنسیت:</label>
          <div class="form-control" style="background: unset; border: unset">
            <label class="radio-inline"
              ><Field
                type="radio"
                name="gender"
                value="female"
                v-model="model.gender"
                :checked="model.gender == 'female'"
              />زن</label
            >
            <label class="radio-inline mr-4"
              ><Field
                type="radio"
                name="gender"
                value="male"
                v-model="model.gender"
                :checked="model.gender == 'male'"
              />مرد</label
            >
          </div>
          <span class="form-text text-danger">
            <ErrorMessage name="gender" />
          </span>
        </div>
      </div>

      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </Form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import { AdminServiceApi } from '@/api/services/admin/admin-service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import locale from '../../../../lang/locale.json';
import router from '@/router';
import { useRoute } from 'vue-router';
const alertify = require('../../../assets/alertifyjs/alertify');

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage
  },
  setup(props) {
    const route = useRoute();
    let model = ref({} as any);
    (window as any).jalaliDatepicker.startWatch();

    // getting data from the database
    if (route.params.adminId) {
      AdminServiceApi.get(route.params.adminId as string).then((result) => {
        let data = result.data.data;
        model.value = data;
      });
    }

    const save = () => {
      // if user has an id updateit with the current model otherwise create one
      if (model.value._id) {
        let tmp = {
          firstname: model.value.firstname,
          lastname: model.value.lastname,
          gender: model.value.gender,
          birthdate: model.value.birthdate
        };
        AdminServiceApi.update(model.value._id, tmp).then((result) => {
          alertify.success(result.data.message);
          router.push({
            name: 'Admin-List'
          });
        });
      } else {
        AdminServiceApi.create(model).then((result) => {
          alertify.success(result.data.message);
          router.push({
            name: 'Admin-List'
          });
        });
      }
    };
    // cancel
    const cancel = () => {
      router.push({
        name: 'Admin-List'
      });
    };

    const validateSchema = computed(() => {
      yup.setLocale(locale);
      return yup.object({
        email: yup.string().required().email().label('ایمیل'),
        username: yup.string().required().min(6).label('نام کاربری'),
        firstname: yup.string().required().label('نام'),
        lastname: yup.string().required().label('نام خانوادگی'),
        gender: yup.string().required().label('جنسیت'),
        birthdate: yup.string().label('تاریخ تولد')
      });
    });
    return { model, save, validateSchema, cancel };
  }
});
</script>

<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.username}` : 'تعریف کاربر جدید' }}
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
          <label for="phone">شماره تلفن:</label>
          <Field
            type="text"
            class="form-control"
            id="phone"
            name="phone"
            v-model="model.phone"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="phone" />
          </span>
        </div>
      </div>
      <div class="form-row">
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
      </div>

      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="biddingCode">کد داوطلبی:</label>
          <Field
            type="text"
            class="form-control"
            id="biddingCode"
            name="biddingCode"
            :readonly="model._id"
            v-model="model.biddingCode"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="biddingCode" />
          </span>
        </div>

        <div class="form-group col-md-4 col-sm-12">
          <label for="nationalId">کد ملی:</label>
          <Field
            type="text"
            class="form-control"
            id="nationalId"
            name="nationalId"
            :readonly="model._id"
            v-model="model.nationalId"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="biddingCode" />
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="orientation">رشته:</label>
          <Field
            type="text"
            class="form-control"
            id="orientation"
            name="orientation"
            v-model="model.orientation"
          />
          <span class="form-text text-danger">
            <ErrorMessage name="orientation" />
          </span>
        </div>
      </div>

      <div class="form-row">
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

        <div class="form-group col-md-4 col-sm-12">
          <label for="point">امتیاز:</label>
          <input
            type="number"
            class="form-control"
            id="point"
            readonly="readonly"
            v-model="model.point"
          />
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="profileImage">تصویر:</label>
          <img :src="model.profileImage" style="width: 100px" />
        </div>
      </div>

      <button class="btn btn-default ml-3 mt-4" @click="cancel()">برگشت</button>
      <button type="submit" class="btn btn-default mt-4">ذخیره</button>
    </Form>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import { StudentServiceApi } from '@/api/services/admin/student-service';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import locale from '../../../../lang/locale.json';
import router from '@/router';
const alertify = require('../../../assets/alertifyjs/alertify');

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage
  },
  props: {
    student: {
      type: String,
      default: '{}'
    }
  },
  data() {
    return {
      model: {} as any
    };
  },
  mounted() {
    this.model = JSON.parse(this.$props.student);
    (window as any).jalaliDatepicker.startWatch();
  },
  methods: {
    cancel() {
      router.push({
        name: 'student'
      });
    },
    save() {
      if (this.model._id) {
        let temp: any = {
          firstname: this.model.firstname,
          lastname: this.model.lastname,
          gender: this.model.gender,
          birthdate: this.model.birthdate,
          phone: this.model.phone,
          orientation: this.model.orientation
        };
        StudentServiceApi.update(this.model._id, temp).then((result) => {
          alertify.success(result.data.message);
          router.push({
            name: 'student'
          });
        });
      } else {
        StudentServiceApi.create(this.model).then((result) => {
          alertify.success(result.data.message);
          router.push({
            name: 'student'
          });
        });
      }
    }
  },
  computed: {
    validateSchema() {
      yup.setLocale(locale);
      return yup.object({
        email: yup.string().required().email().label('ایمیل'),
        username: yup.string().required().min(6).label('نام کاربری'),
        firstname: yup.string().required().label('نام'),
        lastname: yup.string().required().label('نام خانوادگی'),
        phone: yup.string().required().label('تلفن'),
        orientation: yup.string().required().label('رشته'),
        biddingCode: yup.string().required().label('کد داوطلبی'),
        gender: yup.string().required().label('جنسیت'),
        birthdate: yup.string().required().label('تاریخ تولد'),
        nationalId: yup.string().required().label('کد ملی')
      });
    }
  }
});
</script>

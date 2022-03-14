<template>
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h1>Profile</h1>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-left">
            <li class="breadcrumb-item">
              <router-link class="ml-2" to="/"> Home </router-link>
            </li>
            <li class="breadcrumb-item active">User Profile</li>
          </ol>
        </div>
      </div>
    </div>
    <!-- /.container-fluid -->
  </section>

  <div class="container rounded bg-white mt-5 mb-5">
    <div class="row">
      <div class="col-md-3 border-right">
        <div class="d-flex flex-column align-items-center text-center p-3 py-5">
          <span class="font-weight-bold">
            {{ currentUser.firstname }} {{ currentUser.lastname }}
          </span>
          <img
            class="rounded-circle mt-5"
            :src="currentUser.profileImage || 'https://i.imgur.com/O1RmJXT.jpg'"
            width="90"
          />

          <span class="text-black-50">{{ currentUser.email }}</span>
          <span class="font-weight-bold">
            Username : {{ currentUser.username }}
          </span>
          <span class="font-weight-bold">
            Birthdate : {{ currentUser.birthdate }}
          </span>
        </div>
      </div>

      <div class="col-md-5 border-right">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="text-right border-bottom p-2 border-primary">
              Edit your profile
            </h6>
          </div>
          <!-- Form  -->
          <Form @submit="save" :validation-schema="validateSchema" class="mt-5">
            <div class="form-row">
              <div class="form-group col-md-4 col-sm-12">
                <label for="firstname">نام : </label>
                <Field
                  type="text"
                  name="firstname"
                  class="form-control"
                  id="firstname"
                  v-model="currentUser.firstname"
                />
                <span class="form-text text-danger">
                  <ErrorMessage name="firstname" />
                </span>
              </div>

              <div class="form-group col-md-4 col-sm-12">
                <label for="lastname">نام خانوادگی : </label>
                <Field
                  type="text"
                  class="form-control"
                  id="lastname"
                  name="lastname"
                  v-model="currentUser.lastname"
                />
                <span class="form-text text-danger">
                  <ErrorMessage name="lastname" />
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-4 col-sm-12">
                <label for="birthdate">تاریخ تولد: </label>
                <Field
                  type="text"
                  class="form-control"
                  id="birthdate"
                  name="birthdate"
                  v-model="currentUser.birthdate"
                  data-jdp
                />
                <span class="form-text text-danger">
                  <ErrorMessage name="birthdate" />
                </span>
              </div>

              <div class="form-group col-md-4 col-sm-12">
                <label for="gender"> جنسیت :</label>
                <div
                  class="form-control"
                  style="background: unset; border: unset"
                >
                  <label class="radio-inline"
                    ><Field
                      type="radio"
                      name="gender"
                      value="female"
                      v-model="currentUser.gender"
                      :checked="currentUser.gender == 'female'"
                    />زن
                  </label>

                  <label class="radio-inline mr-4"
                    ><Field
                      type="radio"
                      name="gender"
                      value="male"
                      v-model="currentUser.gender"
                      :checked="currentUser.gender == 'male'"
                    />مرد</label
                  >
                </div>

                <span class="form-text text-danger">
                  <ErrorMessage name="gender" />
                </span>
              </div>
            </div>
            <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
          </Form>
          <!--  -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import { useAdminStore } from '@/store';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage
  },

  setup() {
    (window as any).jalaliDatepicker.startWatch();
    const currentUser = computed(() => {
      return { ...useAdminStore().getters.getCurrentUser };
    });

    const validateSchema = computed(() => {
      return yup.object({
        firstname: yup.string().required().label('نام'),
        lastname: yup.string().required().label('نام خانوادگی'),
        gender: yup.string().required().label('جنسیت'),
        birthdate: yup.string().label('تاریخ تولد')
      });
    });
    return { currentUser, validateSchema };
  }
});
</script>

<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف نوتیفیکیشن جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-5 flex col-sm-12 center-block">
          <label for="title">عنوان :</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="model.title"
            @blur="v$.title.$touch()"
          />
          <span
            v-for="error in v$.title.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div class="form-group col-md-5 col-sm-12">
          <label for="code"> متن:</label>

          <textarea
            class="form-control"
            @blur="v$.description.$touch()"
            v-model="model.description"
          >
          </textarea>
          <span
            v-for="error in v$.description.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  !!!!   Courses   !!!! -->
      </div>

      <!--  -->

      <div class="form-row">
        <div class="form-group col-md-5 flex col-sm-12 center-block">
          <label for="title">لینک :</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="model.link"
            @blur="v$.link.$touch()"
          />
          <span
            v-for="error in v$.link.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div class="form-group col-md-5 col-sm-12">
          <label for="code"> دریافت کنندگان :</label>

          <select v-model="model.receptor" class="form-select">
            <option value="student">دانشجویان</option>
            <option value="mentor">مشاوران</option>
            <option value="all">همه</option>
          </select>

          <span
            v-for="error in v$.receptor.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  !!!!   Courses   !!!! -->
      </div>
      <!--  -->
      <button class="btn btn-default ml-3 mt-4" @click="cancel()">برگشت</button>
      <button type="submit" class="btn btn-default mt-4">ذخیره</button>
    </form>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, computed } from 'vue';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required } from '@vuelidate/validators';
import { NotificationServiceApi } from '@/api/services/admin/notification-service';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  props: {
    notification: {
      type: String,
      default: '{}'
    }
  },

  setup(props) {
    let model = reactive(JSON.parse(props.notification));

    model =
      JSON.stringify(model) === '{}'
        ? reactive({
            title: '',
            description: '',
            link: '',
            receptor: ''
          })
        : model;

    const save = () => {
      NotificationServiceApi.getAll().then((result) => {
        console.log(result, model);
      });
      /// error handeling
      v$.value.$touch();
      if (!v$.value.$invalid) {
        let tmp: any = {
          title: model.title,
          description: model.description,
          receptor: model.receptor
        };
        model.link && (tmp.link = model.link);
        //
        if (model._id) {
          NotificationServiceApi.update(model._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'notification'
            });
          });
        } else {
          NotificationServiceApi.create(tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'notification'
            });
          });
        }
      }
    };

    // Validations
    const rules = computed(() => ({
      title: {
        required: helpers.withMessage('عتوان  را وارد کنید', required),
        minLength: helpers.withMessage(
          'عتوان باید حداقل 3 حرف باشد',
          minLength(3)
        )
      },
      description: {
        required: helpers.withMessage('متن اعلانیه ضروری است', required),
        minLength: helpers.withMessage(
          'متن باید حداقل 3 حرف باشد',
          minLength(3)
        )
      },
      link: {},
      receptor: {
        required: helpers.withMessage(
          ' لطفا دریافت کنندگان را مشخص کنید',
          required
        )
      }
    }));

    const v$ = useVuelidate(rules, model);
    // cancel //
    const cancel = () => {
      router.push({
        name: 'notification'
      });
      alertify.notify('cancelled action');
    };

    return {
      model,
      save,
      cancel,
      v$
    };
  }
});
</script>

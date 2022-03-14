<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف اطلاعیه جدید' }}
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
      <button class="btn btn-default ml-3 mt-4" @click="cancel()">برگشت</button>
      <button type="submit" class="btn btn-default mt-4">ذخیره</button>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required } from '@vuelidate/validators';
import { AnnouncementServiceApi } from '@/api/services/admin/announcement-service';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  props: {
    announcement: {
      type: String,
      default: '{}'
    }
  },

  setup(props) {
    let model = reactive(JSON.parse(props.announcement));

    model =
      JSON.stringify(model) === '{}'
        ? reactive({
            title: '',
            description: ''
          })
        : model;

    const save = () => {
      /// error handeling
      v$.value.$touch();
      if (!v$.value.$invalid) {
        let tmp: any = {
          title: model.title,
          description: model.description
        };
        if (model._id) {
          AnnouncementServiceApi.update(model._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'announcement'
            });
          });
        } else {
          AnnouncementServiceApi.create(tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'announcement'
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
          'عتوان باید حدقا 3 حرف باشد',
          minLength(3)
        )
      },
      description: {
        required: helpers.withMessage('متن اعلانیه ضروری است', required),
        minLength: helpers.withMessage(
          'متن باید حداقل 3 حرف باشد',
          minLength(3)
        )
      }
    }));

    const v$ = useVuelidate(rules, model);
    // cancel //
    const cancel = () => {
      router.push({
        name: 'announcement'
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

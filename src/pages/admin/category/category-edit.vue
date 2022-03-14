<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف محصول جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-5 col-sm-12">
          <label for="title">نام محصول:</label>
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
          <label for="title">کد محصول :</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model="model.code"
            @blur="v$.code.$touch()"
          />
          <span
            v-for="error in v$.code.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>

        <div v-if="model._id" class="form-group col-md-5 col-sm-12">
          <span> تصویر فعلی </span>
          <img
            style="max-width: 200px; margin-right: 0.5rem; margin-left: 0.5rem"
            :src="currentImg"
          />
        </div>

        <div class="form-group col-md-5 col-sm-12">
          <label v-if="!model._id"> فایل کاور </label>
          <label v-else> کاور جدید </label>

          <input
            name="coverImage"
            type="file"
            @change="changeFile($event, 'coverImage')"
            @blur="v$.coverImage.$touch()"
          />
          <span
            v-for="error in v$.coverImage.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
      </div>

      <button class="btn btn-default ml-3 mt-4" @click="cancel()">برگشت</button>
      <button category="submit" class="btn btn-default mt-4">ذخیره</button>
    </form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { StoreServiceApi } from '@/api/services/admin/store-service';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import {
  helpers,
  minLength,
  required,
  requiredIf
} from '@vuelidate/validators';
import { baseUrl } from '@/api/apiclient';
import { returnAProtectedUrlAdmin } from '@/utilities/get-image-from-url';
const alertify = require('@/assets/alertifyjs/alertify');
export default defineComponent({
  props: {
    item: {
      type: String,
      default: '{}'
    }
  },
  setup(props) {
    let model = reactive(JSON.parse(props.item));
    const currentImg = ref('');

    if (model._id) {
      const imageUrl = `${baseUrl}product-category/coverImage/${model._id}`;
      returnAProtectedUrlAdmin(imageUrl).then((res) => {
        currentImg.value = res;
      });
    }

    model =
      JSON.stringify(model) == '{}'
        ? reactive({
            title: '',
            code: '',
            coverImage: ''
          })
        : model;
    // validation
    const rules = computed(() => ({
      title: {
        required: helpers.withMessage('عنوان ضروری است', required),
        minLength: helpers.withMessage(
          'عنوان باید بیشتر از 2 جرف باشد',
          minLength(2)
        )
      },

      code: {
        required: helpers.withMessage('کد ضروری است', required),
        minLength: helpers.withMessage(
          'عنوان باید بیشتر از 1 جرف باشد',
          minLength(1)
        )
      },

      coverImage: {
        required: helpers.withMessage(
          'فایل کاور محصول ضروری است',
          requiredIf(() => {
            return !model._id;
          })
        )
      }
    }));

    const v$ = useVuelidate(rules, model);

    // Handle The File
    const changeFile = async (e: any, description: string) => {
      const file = await e.target.files[0];
      model[description] = await file;
    };

    // Saving The File
    const save = () => {
      v$.value.$touch();
      //
      if (!v$.value.$invalid) {
        const temp: any = new FormData();

        temp.append('title', model.title);

        temp.append('code', model.code);

        for (let key in model) {
          if (typeof model[key] === 'object' && key != 'coverImage') {
            for (let subKey in model[key]) {
              temp.append(`${key}[${subKey}]`, model[key][subKey]);
            }
          }
        }

        //
        if (model._id) {
          let tmp;
          if (model.coverImage) {
            tmp = new FormData();
            tmp.append('title', model.title);

            tmp.append('code', model.code);

            tmp.append('coverImage', model.coverImage);
          } else {
            tmp = {
              title: model.title,
              code: model.code
            } as any;
            model.coverImageFile && (tmp.coverImageFile = model.coverImageFile);
          }

          StoreServiceApi.UpdateCategorie(model._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'category'
            });
          });
        } else {
          model.coverImage && temp.append('coverImage', model.coverImage);
          StoreServiceApi.CreateCategorie(temp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'category'
            });
          });
        }
      }
    };
    //
    const cancel = () => {
      router.push({
        name: 'category'
      });
      alertify.notify('cancelled action');
    };
    //

    return { v$, model, changeFile, save, cancel, currentImg };
  }
});
</script>
<style scoped lang="scss">
.image {
  max-width: 150px;
}
.files {
  margin: 2rem 5rem 1rem 0;
}
h6 {
  font-size: smaller;
  color: rgb(136, 133, 133);
}
</style>

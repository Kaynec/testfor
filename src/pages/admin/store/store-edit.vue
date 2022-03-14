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
          <label for="title">توضیحات :</label>
          <input
            type="text"
            class="form-control"
            id="description"
            v-model="model.description"
          />
        </div>
        <!--  -->
        <div class="form-group col-md-5 col-sm-12">
          <label for="title">نوع محصول:</label>
          <select v-model="model.category" class="form-select">
            <option
              v-for="category in allCategories"
              :key="category._id"
              :value="category"
            >
              {{ category.title }}
            </option>
          </select>
          <span
            v-for="error in v$.category.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
      </div>

      <!--  -->

      <div class="form-row">
        <div class="form-group col-md-5 col-sm-12">
          <label for="title">قیمت :</label>
          <input
            type="number"
            class="form-control"
            id="title"
            v-model="model.price"
            @blur="v$.price.$touch()"
          />
          <br />
          <h6>قیمت ها به تومان هست</h6>
          <br />
          <span
            v-for="error in v$.price.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>

        <div class="form-group col-md-5 col-sm-12">
          <label for="title">قیمت ویژه:</label>
          <input
            type="number"
            class="form-control"
            id="title"
            v-model="model.specialPrice"
            @blur="v$.specialPrice.$touch()"
          />
          <span
            v-for="error in v$.specialPrice.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
      </div>

      <!--  -->
      <div class="form-row files">
        <div v-if="!model._id" class="form-group col-md-5 col-sm-12">
          <label> پیش نمایش</label>
          <input
            name="demo"
            @change="changeFile($event, 'demo')"
            type="file"
            @blur="v$.demo.$touch()"
          />
          <span
            v-for="error in v$.demo.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div v-if="!model._id" class="form-group col-md-5 col-sm-12">
          <label> فایل اصلی</label>
          <input
            name="original"
            type="file"
            @change="changeFile($event, 'original')"
            @blur="v$.original.$touch()"
          />
          <span
            v-for="error in v$.original.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div v-if="!model._id" class="form-group col-md-5 col-sm-12">
          <label> فایل کاور </label>
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

      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button category="submit" class="btn btn-primary mt-4">ذخیره</button>
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
import { useRoute } from 'vue-router';
const alertify = require('@/assets/alertifyjs/alertify');
export default defineComponent({
  setup() {
    const route = useRoute();
    let model = ref({} as any);

    // getting data from the database
    if (route.params.productId) {
      StoreServiceApi.get(route.params.productId as string).then((result) => {
        let data = result.data.data;
        model.value = data;
      });
    }
    const allCategories = ref([]);

    StoreServiceApi.getAllCategories().then((res) => {
      allCategories.value = res.data?.data;
    });

    // validation
    const rules = computed(() => ({
      category: {
        required: helpers.withMessage('نوع محصول ضروری است', required)
      },
      title: {
        required: helpers.withMessage('عنوان ضروری است', required),
        minLength: helpers.withMessage(
          'عنوان باید بیشتر از 2 جرف باشد',
          minLength(2)
        )
      },
      price: { required: helpers.withMessage('قیمت ضروری است', required) },
      specialPrice: {},
      demo: {},
      original: {
        required: helpers.withMessage(
          'فایل اصلی ضروری است',
          requiredIf(() => {
            return !model.value._id;
          })
        )
      },
      coverImage: {
        required: helpers.withMessage(
          'فایل کاور محصول ضروری است',
          requiredIf(() => {
            return !model.value._id;
          })
        )
      }
    }));

    const v$ = useVuelidate(rules, model);

    // Handle The File
    const changeFile = async (e: any, description: string) => {
      const file = await e.target.files[0];
      model[description] = await file;
      // if (description == 'demo') model.demo = await file;
      // else if (description == 'original') model.original = await file;
    };

    // Saving The File
    const save = () => {
      v$.value.$touch();
      //
      if (!v$.value.$invalid) {
        const temp: any = new FormData();

        temp.append('title', model.value.title);
        temp.append('price', model.value.price);
        temp.append('specialPrice', model.value.specialPrice);

        // temp.append('category', { _id: model.category._id });
        temp.append('description', model.value.description);

        for (let key in model.value) {
          if (
            typeof model.value[key] === 'object' &&
            key != 'demo' &&
            key != 'original' &&
            key != 'coverImage'
          ) {
            for (let subKey in model.value[key]) {
              temp.append(`${key}[${subKey}]`, model.value[key][subKey]);
            }
          }
        }

        //
        if (model.value._id) {
          const tmp = {
            title: model.value.title,
            price: model.value.price,
            specialPrice: model.value.specialPrice,
            category: model.value.category
          } as any;
          // model.coverImageFile && (tmp.coverImageFile = model.coverImageFile);
          // console.log(model);
          StoreServiceApi.update(model.value._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'store'
            });
          });
        } else {
          model.value.demo && temp.append('demo', model.value.demo);
          model.value.original && temp.append('original', model.value.original);
          model.value.coverImage &&
            temp.append('coverImage', model.value.coverImage);
          StoreServiceApi.create(temp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'store'
            });
          });
        }
      }
    };
    //
    const cancel = () => {
      router.push({
        name: 'store'
      });
      alertify.notify('cancelled action');
    };
    //

    return { v$, model, changeFile, save, cancel, allCategories };
  }
});
</script>
<style scoped lang="scss">
.files {
  margin: 2rem 5rem 1rem 0;
}
h6 {
  font-size: smaller;
  color: rgb(136, 133, 133);
}
</style>

<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف درس جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> مقطع </label>
          <select
            v-model="currentGrade"
            class="form-select"
            aria-label="مقطع را انتخاب کنید "
            placeholder="مقطع را انتخاب کنید"
          >
            <option
              v-for="grade in grades"
              :key="grade.title"
              @blur="v$.grade.$touch()"
              :value="grade._id"
            >
              {{ grade.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> گروه </label>
          <select
            v-model="currentGroup"
            class="form-select"
            aria-label="مقطع را انتخاب کنید "
            placeholder="مقطع را انتخاب کنید"
          >
            <option
              v-for="group in filteredGroups"
              :key="group.title"
              @blur="v$.group.$touch()"
              :value="group._id"
            >
              {{ group.title }}
            </option>
          </select>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> رشته </label>
          <select
            v-model="currentField"
            class="form-select"
            aria-label="مقطع را انتخاب کنید "
            placeholder="مقطع را انتخاب کنید"
          >
            <option
              v-for="field in filteredFields"
              :key="field.title"
              @blur="v$.field.$touch()"
              :value="field._id"
            >
              {{ field.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="username">نام درس:</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="model.title"
          />
          <span
            v-for="error in v$.title.$errors"
            :key="error"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="code">کد درس:</label>
          <input
            type="code"
            class="form-control"
            id="code"
            v-model="model.code"
          />
          <span
            v-for="error in v$.code.$errors"
            :key="error"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12">
          <label for="orientation"> تصویر در رودمپ:</label>
          <input
            type="file"
            class="form-control"
            id="courseImage"
            accept="image/png"
            name="image"
            @change="onFileChange($event)"
          />
          <img
            style="max-width: 100%; max-height: 100px; margin-top: 3px"
            v-if="model.image"
            :src="getImageUrl()"
          />
        </div>
      </div>
      <div class="form-row">
        <div
          v-for="(ratio, index) in model.ratios"
          :key="index"
          class="form-group col-md-12"
        >
          <div class="form-row">
            <div class="form-group col-md-4 col-sm-12">
              <label> گرایش </label>
              <select
                v-model="ratio.orientation"
                class="form-select"
                aria-label="گرایش را انتخاب کنید "
                placeholder="گرایش را انتخاب کنید"
              >
                <option
                  v-for="orientation in orientations"
                  :key="orientation.title"
                  :value="orientation"
                  :disabled="isSelected(orientation)"
                >
                  {{ orientation.title }}
                </option>
              </select>
            </div>
            <div class="form-group col-md-2 flex col-sm-12 center-block">
              <label for="title">ضریب</label>
              <input
                type="number"
                class="form-control"
                id="startPercent"
                v-model="ratio.ratio"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
        <span @click="addRatio(model.ratios)">افزودن ضریب</span>
        <i
          class="fas fa-plus-square mr-2"
          style="cursor: pointer"
          title="افزودن ضریب"
          @click="addRatio(model.ratios)"
        ></i>
      </div>
      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import router from '@/router';
import { CourseServiceApi } from '@/api/services/admin/course-service';
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import { baseUrl } from '@/api/apiclient';
import { jsonToFormData } from '@/api/helper';
//
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  setup() {
    const route = useRoute();
    // This decides if model should be the same thing or re created
    let model = ref({
      title: '',
      code: '',
      ratios: []
    } as any);
    let grades = ref([] as any);
    let currentGrade = ref('');
    let currentGroup = ref('');
    let currentField = ref('');
    let orientations = ref([] as any[]);

    const isSelected = (orientation) => {
      if (model.value.ratios && model.value.ratios.length) {
        return model.value.ratios.some(
          (s) => s.orientation && orientation._id == s.orientation._id
        );
      } else {
        return false;
      }
    };

    let filteredGroups = computed(() => {
      if (currentGrade.value) {
        let result = grades.value.find(
          (p) => `${p._id}` == `${currentGrade.value}`
        );
        if (result) return result.groups;
        else return [];
      } else {
        return [];
      }
    });

    let filteredFields = computed(() => {
      if (currentGroup.value) {
        let result = filteredGroups.value.find(
          (p) => `${p._id}` == `${currentGroup.value}`
        );
        if (result) return result.fields;
        else return [];
      } else {
        return [];
      }
    });

    watch(currentField, (cur, prev) => {
      CourseServiceApi.getAllOrientationByField(currentField.value).then(
        (orientation) => {
          orientations.value = orientation.data.data;
        }
      );
    });

    GradeServiceApi.getAll().then((res) => {
      res.data.data.forEach((data: any) => {
        grades.value.push(data);
      });
    });

    // getting data from the database
    if (route.params.courseId) {
      CourseServiceApi.get(route.params.courseId as string).then((result) => {
        let data = result.data.data;
        model.value._id = data._id;
        model.value.title = data.title;
        model.value.code = data.code;
        model.value.image = data.image;
        model.value.ratio = data.ratio;
        model.value.grade = data.grade._id;
        model.value.group = data.group._id;
        model.value.field = data.field._id;
        currentGrade.value = data.grade._id;
        currentGroup.value = data.group._id;
        currentField.value = data.field._id;
        model.value.ratios = data.ratios || [];

        CourseServiceApi.getAllOrientationByField(data.field._id).then(
          (orientation) => {
            orientations.value = orientation.data.data;
          }
        );
      });
    }
    //
    const save = () => {
      v$.value.$touch();
      if (!v$.value.$invalid) {
        // if user has an id update it with the current model otherwise create one
        let tmp = {
          title: model.value.title,
          code: model.value.code,
          grade: {
            _id: currentGrade.value
          },
          group: {
            _id: currentGroup.value
          },
          field: {
            _id: currentField.value
          },
          ratios: model.value.ratios
            .filter((p) => !!p.orientation && p.ratio > 0)
            .map((m) => {
              return {
                orientation: { _id: m.orientation._id },
                ratio: m.ratio
              };
            })
        };
        let formData = jsonToFormData(tmp);
        if (model.value.image && model.value.image.file) {
          formData.append(
            'imageFile',
            model.value.image.file,
            model.value.image.file.name
          );
        }
        if (model.value._id) {
          CourseServiceApi.update(model.value._id, formData).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'course',
              params: route.params
            });
          });
        } else {
          CourseServiceApi.create(formData).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'course',
              params: route.params
            });
          });
        }
      }
    };
    // cancel
    const cancel = () => {
      router.push({
        name: 'course',
        params: route.params
      });
    };

    const rules = computed(() => ({
      title: {
        required: helpers.withMessage('اسم نباید خالی باشد', required),
        minLength: helpers.withMessage(
          'اسم باید بیشتر از 2 حرف باشد ',
          minLength(2)
        )
      },
      code: {
        required: helpers.withMessage('کد نباید خالی باشد', required)
      }
    }));

    const v$ = useVuelidate(rules, model);

    const addRatio = (ratios) => {
      ratios.push({
        orientation: null,
        ratio: 0
      });
    };

    /// Handle The Image
    const onFileChange = (e: any) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      model.value.image = { file: files[0] };
      getBase64(files[0]).then((str) => {
        model.value.image.base64 = str;
      });
    };

    const getBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const getImageUrl = () => {
      if (model.value.image && !model.value.image.base64)
        return `${baseUrl}course/download-image/${model.value.image}`;
      else return model.value.image.base64;
    };

    return {
      model,
      save,
      cancel,
      v$,
      addRatio,
      orientations,
      isSelected,
      onFileChange,
      currentGrade,
      currentGroup,
      currentField,
      filteredGroups,
      filteredFields,
      grades,
      getImageUrl
    };
  }
});
</script>

<style scoped lang="scss">
.customDiv {
  width: 50;
  margin: 0 auto;
  wordwrap: wrap;
}
.tag {
  margin: 0.5rem;
  font-weight: 600;
}
</style>

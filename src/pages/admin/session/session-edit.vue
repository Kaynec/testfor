<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف فصل جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-1">
      <div class="form-row" v-if="model._id">
        <div class="label row col-6">
          <span class="col-6">درس:</span>
          <span class="col-6" v-if="currentCourse == null">Loading...</span>
          <span class="col-6" v-else>
            {{ currentCourseTitle }}
          </span>
        </div>
      </div>
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
              :value="field._id"
            >
              {{ field.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="title">نام فصل:</label>
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
        <div class="form-group col-md-4 col-sm-12">
          <label for="code"> کد فصل:</label>
          <input
            type="text"
            class="form-control"
            id="code"
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
        <div class="form-group col-md-4 col-sm-12">
          <label for="orientation"> تصویر در رودمپ:</label>
          <input
            type="file"
            class="form-control"
            id="sessionImage"
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
        <!--  !!!!   Courses   !!!! -->
      </div>
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> درس مرتبط </label>
          <select
            v-model="model.course"
            class="form-select"
            aria-label="فصل را انتخاب کنید  "
          >
            <option
              v-for="course in courses"
              :key="course.title"
              @blur="v$.course.$touch()"
              :value="{ _id: course._id }"
            >
              {{ course.title }}
            </option>
          </select>
          <span
            v-for="error in v$.course.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
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

import { CourseServiceApi } from '@/api/services/admin/course-service';
import { SessionServiceApi } from '@/api/services/admin/session-service';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { helpers, minLength, required } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import { baseUrl } from '@/api/apiclient';
import { jsonToFormData } from '@/api/helper';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  setup() {
    const route = useRoute();
    let model = ref({
      title: '',
      code: '',
      course: {}
    } as any);

    // All The Questions And Courses
    let currentCourse = ref(route.params.courseId || '');
    let currentCourseTitle = ref('');
    const courses = ref([] as any);
    let grades = ref([] as any);
    let currentGrade = ref(route.params.gradeId || '');
    let currentGroup = ref(route.params.groupId || '');
    let currentField = ref(route.params.fieldId || '');

    // getting data from the database
    if (route.params.sessionId) {
      SessionServiceApi.get(route.params.sessionId as string).then(
        (result) => {
          let data = result.data.data;
          model.value._id = data._id;
          model.value.title = data.title;
          model.value.code = data.code;
          model.value.image = data.image;
          model.value.course = data.course._id;
          currentCourse.value = data.course._id;
          currentCourseTitle.value = data.course.title;
        },
        (error) => {
          cancel();
        }
      );
    }
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

    GradeServiceApi.getAll().then((res) => {
      res.data.data.forEach((data: any) => {
        grades.value.push(data);
      });
    });

    watch(currentField, (cur, prev) => {
      CourseServiceApi.getAllByField(currentField.value).then((res) => {
        courses.value = res.data.data;
      });
    });

    const save = () => {
      /// error handeling
      v$.value.$touch();
      if (!v$.value.$invalid) {
        if (model.value._id) {
          let tmp: any = {
            title: model.value.title,
            code: model.value.code
          };
          let formData = jsonToFormData(tmp);
          if (model.value.image && model.value.image.file) {
            formData.append(
              'imageFile',
              model.value.image.file,
              model.value.image.file.name
            );
          }
          SessionServiceApi.update(model.value._id, formData).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'session',
              params: route.params
            });
          });
        } else {
          let tmp: any = {
            title: model.value.title,
            code: model.value.code,
            course: {
              _id: currentCourse.value
            }
          };
          let formData = jsonToFormData(tmp);
          if (model.value.image && model.value.image.file) {
            formData.append(
              'imageFile',
              model.value.image.file,
              model.value.image.file.name
            );
          }
          SessionServiceApi.create(formData).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'session',
              params: route.params
            });
          });
        }
      }
    };

    // Validations
    const rules = computed(() => ({
      title: {
        required: helpers.withMessage('عتوان فصل را وارد کنید', required),
        minLength: helpers.withMessage(
          'عتوان باید حدقا 3 حرف باشد',
          minLength(3)
        )
      },
      code: {
        required: helpers.withMessage('کد فصل را وارد کنید', required),
        minLength: helpers.withMessage(
          'عتوان باید حدقا 2 حرف باشد',
          minLength(3)
        )
      },
      course: {
        required: helpers.withMessage(' لطفا یک درس را انتخاب کنید', required)
      }
    }));

    const v$ = useVuelidate(rules, model);
    // cancel //
    const cancel = () => {
      if (currentCourse.value) {
        router.push({
          name: 'session',
          params: { ...route.params, courseId: currentCourse.value }
        });
      } else {
        router.push({
          name: 'course',
          params: route.params
        });
      }
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
      courses,
      currentGrade,
      currentGroup,
      currentField,
      currentCourse,
      filteredGroups,
      filteredFields,
      grades,
      v$,
      getImageUrl,
      onFileChange,
      currentCourseTitle
    };
  }
});
</script>

<style scoped lang="scss">
.label {
  margin: 0 1rem 1rem 0;
  span {
    font-size: larger;
    font-weight: 600;
    margin-top: 1rem;
    display: block;
    border-bottom: 2px solid #333;
  }
}
</style>

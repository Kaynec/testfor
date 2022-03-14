<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش سوال` : 'تعریف سوال جدید' }}
    </h2>
    <form @submit.prevent="save">
      <div class="form-row" v-if="model._id">
        <div class="label row">
          <span class="col-6">درس:</span>
          <span class="col-6" v-if="currentCourse == null">Loading...</span>
          <span class="col-6" v-else>
            {{ currentCourse.title }}
          </span>
        </div>
        <div class="label row">
          <span class="col-6">فصل:</span>
          <span class="col-6" v-if="currentSession == null">Loading...</span>
          <span class="col-6" v-else>
            {{ currentSession.title }}
          </span>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-8 col-sm-12">
          <label for="text">متن سوال:</label>
          <ckeditor
            :editor="editor"
            class="form-control"
            v-model="model.text"
            :config="editorConfig"
            @blur="v$.text.$touch()"
          ></ckeditor>

          <span class="form-text text-danger" v-if="v$.text.$error">
            عنوان سوال باید بیشتر از سه حرف باشد
          </span>
        </div>
        <!--  -->
        <div class="form-group col-md-4 col-sm-12">
          <label for="image"> تصایر سوال:</label>
          <div v-for="(image, index) in model.images" :key="image.title">
            <input
              v-if="!image._id"
              type="file"
              accept="image/png, image/jpeg , image/svg"
              class="form-control"
              :id="'questionimages-' + index"
              name="image"
              @change="onFileChange($event, 'question', index)"
            />
            <img
              style="max-width: 100%; max-height: 100px; margin-top: 3px"
              :src="getQuestionImageUrl(image)"
            />
          </div>
          <i
            class="fas fa-plus-square"
            style="cursor: pointer"
            title="افزودن تصویر"
            @click="addImage(model.images)"
          ></i>
        </div>
      </div>

      <!--  !!!!   Course    !!!!  -->
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
              @blur="v$.course.$touch()"
              :value="grade._id"
            >
              {{ grade.title }}
            </option>
          </select>
          <span class="form-text text-danger" v-if="v$.course.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
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
              @blur="v$.course.$touch()"
              :value="group._id"
            >
              {{ group.title }}
            </option>
          </select>
          <span class="form-text text-danger" v-if="v$.course.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
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
              @blur="v$.course.$touch()"
              :value="field._id"
            >
              {{ field.title }}
            </option>
          </select>
          <span class="form-text text-danger" v-if="v$.course.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> درس </label>
          <select
            v-model="currentCourse"
            class="form-select"
            aria-label="درس را انتخاب کنید "
            placeholder="Choose a course"
          >
            <option
              v-for="course in courses"
              :key="course.title"
              @blur="v$.course.$touch()"
              :value="course"
            >
              {{ course.title }}
            </option>
          </select>
          <span class="form-text text-danger" v-if="v$.course.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>
        <!-- Session -->
        <div class="form-group col-md-4 col-sm-12" v-if="!model._id">
          <label> فصل </label>

          <select
            v-model="currentSession"
            class="form-select"
            aria-label="فصل را انتخاب کنید  "
          >
            <option
              v-for="session in filteredSessions"
              :key="session.title"
              @blur="v$.session.$touch()"
              :value="session"
            >
              {{ session.title }}
            </option>
          </select>

          <span class="form-text text-danger" v-if="v$.session.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>
      </div>
      <!-- New Row -->
      <h3 class="span">گزینه صحیح</h3>

      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="username"> پاسخ 1 :</label>
          <textarea
            type="text"
            class="form-control"
            v-model="model.options[0].text"
          >
          </textarea>
        </div>
        <!-- first option img -->
        <div class="form-group col-md-4 col-sm-12">
          <label> تصویر :</label>
          <div
            v-for="(image, index) in model.options[0].images"
            :key="image.title"
          >
            <input
              v-if="!image._id"
              type="file"
              accept="image/png, image/jpeg"
              class="form-control"
              @change="onFileChange($event, 0, index)"
            />
            <img
              style="max-width: 100%; max-height: 70px; margin-top: 3px"
              :src="getQuestionImageUrl(image)"
            />
          </div>
          <i
            class="fas fa-plus-square"
            style="cursor: pointer"
            title="افزودن تصویر"
            @click="addImage(model.options[0].images)"
          ></i>
        </div>
        <!-- is answer -->
        <span class="info"> گزینه صحیح ؟ </span>
        <div class="form-group col-md-4 p-5 col-sm-12 answer">
          <input
            class="form-check-input"
            type="radio"
            :value="true"
            name="isAnswer"
            v-model="model.options[0].isAnswer"
          />
        </div>
      </div>
      <hr class="mobile" />
      <!--  Second Option Text  -->
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="username"> پاسخ 2 :</label>
          <textarea
            type="text"
            class="form-control"
            v-model="model.options[1].text"
          >
          </textarea>
        </div>
        <!--  Second Option Img -->
        <div class="form-group col-md-4 col-sm-12">
          <label for="image"> تصویر :</label>
          <div
            v-for="(image, index) in model.options[1].images"
            :key="image.title"
          >
            <input
              v-if="!image._id"
              type="file"
              accept="image/png, image/jpeg"
              class="form-control"
              @change="onFileChange($event, 1, index)"
            />
            <img
              style="max-width: 100%; max-height: 70px; margin-top: 3px"
              :src="getQuestionImageUrl(image)"
            />
          </div>
          <i
            class="fas fa-plus-square"
            style="cursor: pointer"
            title="افزودن تصویر"
            @click="addImage(model.options[1].images)"
          ></i>
        </div>
        <!--  -->
        <span class="info"> گزینه صحیح ؟ </span>
        <div class="form-group col-md-4 p-5 col-sm-12 answer">
          <input
            class="form-check-input"
            type="radio"
            :value="true"
            name="isAnswer"
            v-model="model.options[1].isAnswer"
          />
        </div>
      </div>
      <hr class="mobile" />
      <!--  -->
      <!-- Third Option Text  -->
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12">
          <label for="username"> پاسخ 3 :</label>
          <textarea
            type="text"
            class="form-control"
            v-model="model.options[2].text"
          >
          </textarea>
        </div>
        <!--  Third Option Img -->
        <div class="form-group col-md-4 col-sm-12">
          <label for="image"> تصویر :</label>
          <div
            v-for="(image, index) in model.options[2].images"
            :key="image.title"
          >
            <input
              v-if="!image._id"
              type="file"
              accept="image/png, image/jpeg"
              class="form-control"
              @change="onFileChange($event, 2, index)"
            />
            <img
              style="max-width: 100%; max-height: 70px; margin-top: 3px"
              :src="getQuestionImageUrl(image)"
            />
          </div>
          <i
            class="fas fa-plus-square"
            style="cursor: pointer"
            title="افزودن تصویر"
            @click="addImage(model.options[2].images)"
          ></i>
        </div>
        <!--  -->
        <!--  -->
        <span class="info"> گزینه صحیح ؟ </span>
        <div class="form-group col-md-4 p-5 col-sm-12 answer">
          <input
            class="form-check-input"
            type="radio"
            :value="true"
            name="isAnswer"
            v-model="model.options[2].isAnswer"
          />
        </div>
      </div>
      <hr class="mobile" />
      <!--  -->
      <!--  -->
      <div class="form-row">
        <!-- Fourth Option Text  -->
        <div class="form-group col-md-4 col-sm-12">
          <label for="username"> پاسخ 4 :</label>
          <textarea
            type="text"
            class="form-control"
            v-model="model.options[3].text"
          >
          </textarea>
        </div>
        <!--  Fourth Option Img -->
        <div class="form-group col-md-4 col-sm-12">
          <label for="image"> تصویر :</label>
          <div
            v-for="(image, index) in model.options[3].images"
            :key="image.title"
          >
            <input
              v-if="!image._id"
              type="file"
              accept="image/png, image/jpeg"
              class="form-control"
              @change="onFileChange($event, 3, index)"
            />
            <img
              style="max-width: 100%; max-height: 70px; margin-top: 3px"
              :src="getQuestionImageUrl(image)"
            />
          </div>
          <i
            class="fas fa-plus-square"
            style="cursor: pointer"
            title="افزودن تصویر"
            @click="addImage(model.options[3].images)"
          ></i>
        </div>
        <!--  -->
        <span class="info"> گزینه صحیح ؟ </span>
        <div class="form-group col-md-4 p-5 col-sm-12 answer">
          <input
            class="form-check-input"
            type="radio"
            :value="true"
            name="isAnswer"
            v-model="model.options[3].isAnswer"
          />
        </div>
        <!--  -->
      </div>
      <br />
      <span
        class="form-text text-danger"
        v-for="error in v$.options.$errors"
        :key="error.id"
      >
        {{ error.$message }}
      </span>
      <hr class="mobile" />

      <div class="form-row">
        <div class="form-group col-md-8 col-sm-12">
          <label for="text">پاسخ تشریحی:</label>
          <ckeditor
            :editor="editor"
            class="form-control"
            v-model="model.descriptiveAnswer.text"
            :config="editorConfig"
            @blur="v$.text.$touch()"
          ></ckeditor>
        </div>
        <!--  -->
        <div class="form-group col-md-4 col-sm-12">
          <label for="image"> تصایر پاسخ تشریحی:</label>
          <div
            v-for="(image, index) in model.descriptiveAnswer.images"
            :key="image.title"
          >
            <input
              v-if="!image._id"
              type="file"
              accept="image/png, image/jpeg , image/svg"
              class="form-control"
              :id="'questionimages-' + index"
              name="image"
              @change="onFileChange($event, 'descriptiveAnswer', index)"
            />
            <img
              style="max-width: 100%; max-height: 100px; margin-top: 3px"
              :src="getQuestionImageUrl(image)"
            />
          </div>
          <i
            class="fas fa-plus-square"
            style="cursor: pointer"
            title="افزودن تصویر"
            @click="addImage(model.descriptiveAnswer.images)"
          ></i>
        </div>
      </div>
      <!--  -->
      <!-- End Of Row -->

      <button class="btn btn-secondary ml-3 mt-4" @click="cancel">برگشت</button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { CourseServiceApi } from '@/api/services/admin/course-service';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import { QuestionServiceApi } from '@/api/services/admin/question-service';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { jsonToFormData } from '@/api/helper';
import { baseUrl } from '@/api/apiclient';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CKEditor from '@ckeditor/ckeditor5-vue';
const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  props: {
    questionId: {
      type: String,
      default: ''
    }
  },
  components: {
    // Use the <ckeditor> component in this view.
    ckeditor: CKEditor.component
  },

  setup(props) {
    let editor = ref(ClassicEditor);
    let editorConfig = ref({
      language: {
        // The UI will be in English.
        ui: 'fa',

        // But the content will be edited in Arabic.
        content: 'fa'
      }
    });

    const route = useRoute();
    // INCASE OF UPDATE SHOW THE ASSOCIATED SESSION AND COURSE
    let currentGrade = ref(route.params.gradeId);
    let currentGroup = ref(route.params.groupId);
    let currentField = ref(route.params.fieldId);
    let currentCourse = ref({} as any);
    let currentSession = ref({} as any);
    if (route.params.fieldId) {
      CourseServiceApi.getAllByField(currentField.value).then((res) => {
        courses.value = res.data.data;
        if (route.params.courseId) {
          currentCourse.value = courses.value.find(
            (p) => p._id == route.params.courseId
          );
        }

        if (route.params.sessionId && currentCourse.value) {
          currentSession.value = currentCourse.value.sessions.find(
            (p) => p._id == route.params.sessionId
          );
        }
      });
    }
    let model = ref({
      text: '',
      images: [],
      session: '',
      course: '',
      options: [
        {
          text: '',
          images: [],
          isAnswer: true
        },
        {
          text: '',
          images: [],
          isAnswer: false
        },
        {
          text: '',
          images: [],
          isAnswer: false
        },
        {
          text: '',
          images: [],
          isAnswer: false
        }
      ],
      descriptiveAnswer: {
        text: '',
        images: []
      }
    } as any);
    const rules = computed(() => ({
      text: {},
      course: { required },
      session: { required },
      options: {
        required: helpers.withMessage('لطفا تمام موارد را کامل کنید', required),
        minLength: helpers.withMessage(
          'لطفا تمام موارد را کامل کنید',
          minLength(4)
        ),
        $each: {
          text: { required },
          isAnswer: {}
        }
      }
    }));
    let v$ = useVuelidate(rules, model.value);
    if (route.params.question) {
      QuestionServiceApi.get(route.params.question as string).then((result) => {
        let data = result.data.data;
        currentSession.value = data.session;
        currentCourse.value = data.course;
        model.value._id = data._id;
        model.value.text = data.text;
        model.value.options = data.options;
        model.value.images = data.images;
        model.value.course = data.course._id;
        model.value.session = data.session._id;
        if (data.descriptiveAnswer) {
          model.value.descriptiveAnswer.text = data.descriptiveAnswer.text;
          model.value.descriptiveAnswer.images = data.descriptiveAnswer.images;
        }
      });
    }

    // onMounted(() => {
    //   ClassicEditor.create(document.querySelector('#ckeditor')).catch(
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    // });
    // // // // // // // // // // // // // // // // // // // //

    //
    // const imageRule = helpers.regex('image', /\.(jpe?g|png)$/);
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
    // All The Questions And Courses
    let grades = ref([] as any);
    let courses = ref([] as any);

    /////////////
    GradeServiceApi.getAll().then((res) => {
      res.data.data.forEach((data: any) => {
        grades.value.push(data);
      });
    });
    //
    const filteredSessions = computed(() => {
      if (currentCourse.value) {
        let result = courses.value.find(
          (p) => `${p._id}` == `${currentCourse.value._id}`
        );
        if (result) return result.sessions;
        else return [];
      } else {
        return [];
      }
    });

    /// Handle The Image
    const onFileChange = (e: any, idx: number | string = 'question', index) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      if (idx === 'question') {
        model.value.images[index].file = files[0];
        getBase64(files[0]).then((str) => {
          model.value.images[index].base64 = str;
        });
      } else if (idx === 'descriptiveAnswer') {
        model.value.descriptiveAnswer.images[index].file = files[0];
        getBase64(files[0]).then((str) => {
          model.value.descriptiveAnswer.images[index].base64 = str;
        });
      } else {
        model.value.options[idx].images[index].file = files[0];
        getBase64(files[0]).then((str) => {
          model.value.options[idx].images[index].base64 = str;
        });
      }
    };

    const getBase64 = (file: any) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const getQuestionImageUrl = (image) => {
      if (image._id) return `${baseUrl}question/image/${image.file}`;
      else return image.base64;
    };

    watch(currentField, (cur, prev) => {
      CourseServiceApi.getAllByField(currentField.value).then((res) => {
        courses.value = res.data.data;
      });
    });
    //
    const save = () => {
      model.value.course = currentCourse.value._id;
      model.value.session = currentSession.value._id;
      // if user has an id update it with the current model otherwise create one
      // model.value.options = model.value.options.map((el: any) => {
      //   if (!el.image) return { text: el.text, isAnswer: el.isAnswer };
      //   return { text: el.text, image: el.image, isAnswer: el.isAnswer };
      // });
      v$.value.$touch();
      if (!v$.value.$invalid) {
        let tmp: any = {
          images: [],
          options: [],
          course: {
            _id: model.value.course
          },
          session: {
            _id: model.value.session
          },
          descriptiveAnswer: {
            text: model.value.descriptiveAnswer.text,
            images: []
          }
        };
        // model.value.images && (tmp.images = model.value.images);
        for (const option of model.value.options) {
          tmp.options.push({ ...option, images: [] });
        }
        model.value.text && (tmp.text = model.value.text);
        let formData = jsonToFormData(tmp);
        for (const questionImage of model.value.images) {
          if (!questionImage._id)
            formData.append(
              'questionImg',
              questionImage.file,
              questionImage.file.name
            );
        }
        for (const image of model.value.descriptiveAnswer.images) {
          if (!image._id)
            formData.append(
              'descriptiveAnswerImg',
              image.file,
              image.file.name
            );
        }

        for (let index = 0; index < model.value.options.length; index++) {
          let option = model.value.options[index];
          for (const image of option.images) {
            if (!image._id)
              formData.append(
                `option${index + 1}`,
                image.file,
                image.file.name
              );
          }
        }
        if (model.value._id) {
          QuestionServiceApi.update(model.value._id, formData).then(
            (result) => {
              alertify.success(result.data.message);
              router.push({
                name: 'question',
                params: route.params
              });
            }
          );
        } else {
          QuestionServiceApi.create(formData).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'question',
              params: route.params
            });
          });
        }
      }
    };
    // cancel //
    const cancel = () => {
      router.push({ name: 'question', params: route.params });
      alertify.notify('cancelled action');
    };

    const addImage = (images) => {
      images.push({
        file: '',
        title: '',
        base64: ''
      });
    };

    let showSession = ref<boolean>(false);
    let showCourse = ref<boolean>(false);
    return {
      model,
      save,
      cancel,
      showSession,
      showCourse,
      courses,
      onFileChange,
      v$,
      filteredSessions,
      currentGrade,
      currentGroup,
      currentField,
      currentCourse,
      currentSession,
      filteredGroups,
      filteredFields,
      grades,
      addImage,
      getQuestionImageUrl,
      editorConfig,
      editor
    };
  }
});
</script>
<style lang="scss" scoped>
.ck-editor__editable_inline {
  min-height: 500px;
}
.info {
  display: none;
}

.mobile {
  display: none;
}

.span {
  font-weight: 700;
  margin: 1rem;
  margin-right: 2rem;
  width: 85%;
  color: #010127 207, 236;
  font-family: helvetica, arial;
  font-size: 2rem;
  position: relative;
  font-size: 1.5rem;
  transform: translateY(100%);
  text-align: left;
}
textarea {
  resize: none;
}
.answer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.label {
  width: 40%;
  margin: 10px 0 2rem 0;
  text-align: center;
  border-bottom: 2px solid rgb(111, 104, 104);
  span {
    font-size: larger;
    font-weight: 600;
    display: block;
    padding: 1rem 0 1rem 0;
  }
}

@media screen and (max-width: 800px) {
  .span {
    display: none;
  }

  .label {
    h3 {
      font-size: 1.5rem;
    }
    span {
      font-size: 1rem !important;
      padding: 0;
    }
  }
  .info {
    display: block;
    transform: translateY(250%);
    margin-right: 1rem;
  }
  .answer {
    justify-content: space-evenly;
  }
  .mobile {
    display: block;
    margin: 2rem 0 1rem 0;
  }
}
</style>

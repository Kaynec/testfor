<template>
  <div v-if="!isLoading" class="panel">
    <h2>
      {{ model._id ? `ویرایش همنورد` : 'تعریف همنورد جدید' }}
    </h2>
    <form @submit.prevent="save">
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
          <span class="form-text text-danger" v-if="v$.grade.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-else>
          <span>مقطع: {{ model.grade.title }}</span>
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
          <span class="form-text text-danger" v-if="v$.group.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-else>
          <span>گروه: {{ model.group.title }}</span>
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
          <span class="form-text text-danger" v-if="v$.field.$error">
            لطفا یک گزینه را انتخاب کنید
          </span>
        </div>
        <div class="form-group col-md-4 col-sm-12" v-else>
          <span>رشته: {{ model.field.title }}</span>
        </div>
      </div>
      <hr class="mobile" />
      <div class="form-row">
        <div
          v-for="(video, index) in model.videos"
          :key="video._id"
          class="form-group col-md-12"
        >
          <div class="form-row">
            <div class="form-group col-md-4 flex col-sm-12 center-block">
              <label for="title">{{ index + 1 }}: عنوان</label>
              <input
                type="text"
                :readonly="!!video._id"
                class="form-control"
                id="title"
                v-model="video.title"
              />
            </div>
            <div class="form-group col-md-2 flex col-sm-12 center-block">
              <label for="title">از درصد</label>
              <input
                type="number"
                :readonly="!!video._id"
                class="form-control"
                id="startPercent"
                v-model="video.startPercent"
                min="0"
                max="100"
              />
            </div>
            <div class="form-group col-md-2 flex col-sm-12 center-block">
              <label for="title">تا درصد</label>
              <input
                type="number"
                :readonly="!!video._id"
                class="form-control"
                id="endPercent"
                v-model="video.endPercent"
                min="0"
                max="100"
              />
            </div>
          </div>
          <video
            v-if="video.file || video.base64"
            width="450"
            controls
            :src="getHamnavardVideoUrl(video)"
          ></video>
          <input
            v-if="!video._id"
            type="file"
            accept="video/mp4"
            class="form-control"
            :id="'hamnavard-video-' + index"
            name="video"
            @change="onFileChange($event, index)"
          />
        </div>
        <i
          class="fas fa-plus-square"
          style="cursor: pointer"
          title="افزودن ویدیو"
          @click="addVideo(model.videos)"
        ></i>
      </div>
      <br />
      <span class="form-text text-danger" v-if="error">
        {{ error }}
      </span>
      <hr class="mobile" />

      <button class="btn btn-secondary ml-3 mt-4" @click="cancel">برگشت</button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
  <skeleton-block v-else height="500px" tag="div" effect="wave">
  </skeleton-block>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import router from '@/router';
const alertify = require('@/assets/alertifyjs/alertify');
import useVuelidate from '@vuelidate/core';
import { required, minLength, helpers } from '@vuelidate/validators';
import { useRoute } from 'vue-router';
import { jsonToFormData } from '@/api/helper';
import { baseUrl } from '@/api/apiclient';
import { HamnavardServiceApi } from '@/api/services/admin/hamnavard-service';
import { SkeletonBlock } from 'skeleton-elements/vue';

export default defineComponent({
  components: { SkeletonBlock },
  props: {
    hamnavardId: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const route = useRoute();
    // INCASE OF UPDATE SHOW THE ASSOCIATED SESSION AND COURSE
    let currentGrade = ref('');
    let currentGroup = ref('');
    let currentField = ref('');
    let model = ref({
      grade: {},
      group: {},
      field: {},
      videos: []
    } as any);
    const rules = computed(() => ({
      grade: { required },
      group: { required },
      field: { required }
    }));
    let isLoading = ref(true);
    let v$ = useVuelidate(rules, model.value);
    if (route.params.hamnavardId) {
      HamnavardServiceApi.get(route.params.hamnavardId as string).then(
        (result) => {
          isLoading.value = false;
          let data = result.data.data;
          model.value._id = data._id;
          model.value.grade = data.grade;
          model.value.group = data.group;
          model.value.field = data.field;
          model.value.videos = data.videos;
          currentGrade.value = data.grade._id;
          currentGroup.value = data.group._id;
          currentField.value = data.field._id;
        }
      );
    } else {
      isLoading.value = false;
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
    // All The Questions And Courses
    let grades = ref([] as any);

    /////////////
    GradeServiceApi.getAll().then((res) => {
      res.data.data.forEach((data: any) => {
        grades.value.push(data);
      });
    });

    /// Handle The Image
    const onFileChange = (e: any, index) => {
      error.value = '';
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      model.value.videos[index].file = files[0];
    };

    const getHamnavardVideoUrl = (video) => {
      if (video._id) return `${baseUrl}hamnavard/getVideo/${video.file}`;
      else return URL.createObjectURL(video.file);
    };

    let error = ref('');

    //
    const save = async () => {
      error.value = '';
      model.value.grade._id = currentGrade.value;
      model.value.group._id = currentGroup.value;
      model.value.field._id = currentField.value;
      let newVideos = model.value.videos.filter((p) => !p._id && !!p.file);
      if (newVideos.length == 0) {
        error.value = 'ویدیو جدیدی معرفی نشده است.';
        return;
      }
      let oldVideos = model.value.videos.filter((p) => !!p._id);
      debugger;
      for (const video of newVideos) {
        if (
          oldVideos.some(
            (p) =>
              p.startPercent < video.endPercent &&
              p.endPercent > video.startPercent
          )
        ) {
          error.value = 'بازه های درصدی تعیین شده با یکدیگر همپوشانی دارند.';
          return;
        }
      }
      v$.value.$touch();
      if (!v$.value.$invalid) {
        isLoading.value = true;
        for (const video of newVideos) {
          let tmp: any = {
            title: video.title,
            grade: { _id: currentGrade.value },
            group: { _id: currentGroup.value },
            field: { _id: currentField.value },
            startPercent: video.startPercent,
            endPercent: video.endPercent
          };
          let formData = jsonToFormData(tmp);
          formData.append('video', video.file, video.file.name);

          HamnavardServiceApi.create(formData).then(
            (result) => {
              alertify.success(result.data.message);
              isLoading.value = false;
              router.push({
                name: 'hamnavard'
              });
            },
            (error) => {
              isLoading.value = false;
            }
          );
        }
      }
    };
    // cancel //
    const cancel = () => {
      router.push({ name: 'hamnavard' });
    };

    const addVideo = (videos) => {
      videos.push({
        file: '',
        title: '',
        base64: '',
        startPercent: 0,
        endPercent: 0
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
      onFileChange,
      v$,
      currentGrade,
      currentGroup,
      currentField,
      filteredGroups,
      filteredFields,
      grades,
      addVideo,
      getHamnavardVideoUrl,
      error,
      isLoading,
      SkeletonBlock
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

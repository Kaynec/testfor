<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">دروس</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createCourse()"
            >
              جدید
            </button>
          </div>
        </div>
        <!-- /.row -->

        <!--  !!!!   Course    !!!!  -->
        <div class="form-row">
          <div class="form-group col-md-4 col-sm-12">
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
          </div>
          <div class="form-group col-md-4 col-sm-12">
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
          </div>
          <div class="form-group col-md-4 col-sm-12">
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
          </div>
        </div>
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <!-- Small boxes (Stat box) -->
        <grid :columns="columns" :options="options" ref="grid"></grid>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  computed,
  watch
} from 'vue';
import { baseUrl } from '@/api/apiclient';
import grid from '@/modules/shared/grid.vue';
import router from '@/router';
const $ = require('jquery');
const alertify = require('../../../assets/alertifyjs/alertify');
import { CourseServiceApi } from '@/api/services/admin/course-service';
import { SessionServiceApi } from '@/api/services/admin/session-service';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
import { useRoute } from 'vue-router';
// import { string } from 'yup/lib/locale';

export default defineComponent({
  components: { grid },
  setup() {
    const route = useRoute();
    let grades = ref([] as any);
    let currentGrade = ref(route.params.gradeId || '');
    let currentGroup = ref(route.params.groupId || '');
    let currentField = ref(route.params.fieldId || '');
    GradeServiceApi.getAll().then((res) => {
      res.data.data.forEach((data: any) => {
        grades.value.push(data);
      });
    });
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

    watch(currentGrade, (cur, prev) => {
      currentGroup.value = '';
      currentField.value = '';
      route.params.gradeId = currentGrade.value;
      grid.value.getDatatable().ajax.reload();
    });
    watch(currentGroup, (cur, prev) => {
      currentField.value = '';
      route.params.groupId = currentGroup.value;
      grid.value.getDatatable().ajax.reload();
    });
    watch(currentField, (cur, prev) => {
      route.params.fieldId = currentField.value;
      grid.value.getDatatable().ajax.reload();
    });
    watch(route.params, (cur, prev) => {
      currentGrade.value = route.params.gradeId;
      currentGroup.value = route.params.groupId;
      currentField.value = route.params.fieldId;
      grid.value.getDatatable().ajax.reload();
    });

    // ref
    const grid = ref();
    // Data

    const columns = reactive([
      {
        label: 'نام درس',
        data: 'title',
        responsivePriority: 1
        // type: () => {
        //   return typeof string;
        // },
        // searchPanes: {
        //   orthogonal: 'sp',
        //   show: true
        // }
      },
      {
        label: 'فصل ',
        data: 'sessions',
        responsivePriority: 1
      },
      { label: 'کد', data: 'code', responsivePriority: 3 },
      {
        label: 'رشته',
        data: (data) => {
          return data.field ? data.field.title : 'بدون رشته';
        },
        responsivePriority: 3
      },
      {
        className: 'edit-control',
        orderable: false,
        defaultContent: '',
        label: '',
        data: '_id',
        width: 100,
        action: 'read',
        render: function (data: any) {
          return `<button type="button" data-course-id="${data}" class="btn btn-default edit-button">فصل ها</button>`;
        },
        responsivePriority: 2
      },
      {
        className: 'edit-control',
        orderable: false,
        defaultContent: '',
        label: '',
        data: '_id',
        action: 'update',
        width: 100,
        render: function (data: any) {
          return `<button type="button" data-edit-id="${data}" class="btn btn-default edit-button">ویرایش</button>`;
        },
        responsivePriority: 1
      },
      {
        label: '',
        data: '_id',
        action: 'delete',
        width: 100,
        render: function (data: any) {
          return `<button type="button" data-delete-id="${data}" class="btn btn-danger edit-button">حذف</button>`;
        },
        responsivePriority: 1
      }
    ]);

    const options = reactive({
      gridName: 'course-grid',
      url: `${baseUrl}course`,
      type: 'GET',
      data: (d: any) => {
        d.filter = {};
        if (currentGrade.value) {
          d.filter.grade = currentGrade.value;
        }
        if (currentGroup.value) {
          d.filter.group = currentGroup.value;
        }
        if (currentField.value) {
          d.filter.field = currentField.value;
        }
      }
    });

    const editCourse = (course: any) => {
      router.push({
        name: 'course-edit',
        params: {
          courseId: course._id,
          gradeId: course.grade,
          groupId: course.group,
          fieldId: course.field._id
        }
      });
    };

    const deleteCourse = (course: any) => {
      const allQuestions = async () => {
        const Questions = await SessionServiceApi.getAll({
          course: { _id: course._id }
        })
          .then((res) => {
            return res.data.data.length > 0;
          })
          .then((res) => {
            return res;
          });
        return await Questions;
      };
      allQuestions().then((res) => {
        if (res === true) {
          alertify.defaults.glossary.ok = 'بله';
          alertify.alert('هشدار', 'لطفا اول فصل های این درس را حذف کنید');
        } else {
          alertify.defaults.glossary.ok = 'خیر';
          alertify.defaults.glossary.cancel = 'بله';
          alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
            if (e) {
              CourseServiceApi.delete(course._id).then((result) => {
                alertify.success(result.data.message);
                (grid.value as any).getDatatable().ajax.reload();
              });
            }
          });
        }
      });
    };

    const createCourse = () => {
      router.push({
        path: 'course-create',
        params: {
          gradeId: currentGrade.value,
          groupId: currentGroup.value,
          fieldId: currentField.value
        }
      });
    };

    onMounted(() => {
      if (grid.value.getDatatable()) {
        grid.value
          .getDatatableBody()
          .on('click', '[data-edit-id]', (e: any) => {
            let id = $(e.currentTarget).data().editId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) editCourse(filteredData[0]);
          });
        grid.value
          .getDatatableBody()
          .on('click', '[data-course-id]', (e: any) => {
            let id = $(e.currentTarget).data().courseId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) {
              let course = filteredData[0];
              router.push({
                name: 'session',
                params: {
                  courseId: id,
                  gradeId: course.grade,
                  groupId: course.group,
                  fieldId: course.field._id
                }
              });
            }
          });
        grid.value
          .getDatatableBody()
          .on('click', '[data-delete-id]', (e: any) => {
            let id = $(e.currentTarget).data().deleteId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) deleteCourse(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      createCourse,
      deleteCourse,
      editCourse,
      grid,
      currentGrade,
      currentGroup,
      currentField,
      filteredGroups,
      filteredFields,
      grades
    };
  }
});
</script>

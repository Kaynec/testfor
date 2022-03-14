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
              @click="createHamnavard()"
            >
              جدید
            </button>
          </div>
        </div>
        <!-- /.row -->

        <!--  !!!!   Hamnavard    !!!!  -->
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
                @blur="v$.hamnavard.$touch()"
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
                @blur="v$.hamnavard.$touch()"
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
                @blur="v$.hamnavard.$touch()"
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
import { HamnavardServiceApi } from '@/api/services/admin/hamnavard-service';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
// import { string } from 'yup/lib/locale';

export default defineComponent({
  components: { grid },
  setup() {
    let grades = ref([] as any);
    let currentGrade = ref('');
    let currentGroup = ref('');
    let currentField = ref('');
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
      grid.value.getDatatable().ajax.reload();
    });
    watch(currentGroup, (cur, prev) => {
      currentField.value = '';
      grid.value.getDatatable().ajax.reload();
    });
    watch(currentField, (cur, prev) => {
      grid.value.getDatatable().ajax.reload();
    });

    // ref
    const grid = ref();
    // Data

    const columns = reactive([
      {
        label: 'رشته',
        data: (data) => {
          if (data.field) return data.field.title;
          else return 'نا مشخص';
        },
        responsivePriority: 1
      },
      {
        label: 'تعداد ویدیو',
        data: (data) => {
          return data.videos ? data.videos.length : 0;
        },
        responsivePriority: 3
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
      gridName: 'hamnavard-grid',
      url: `${baseUrl}hamnavard`,
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

    const editHamnavard = (hamnavardId: any) => {
      router.push({
        name: 'hamnavard-edit',
        params: { hamnavardId: hamnavardId }
      });
    };

    const deleteHamnavard = (hamnavard: any) => {
      alertify.defaults.glossary.ok = 'خیر';
      alertify.defaults.glossary.cancel = 'بله';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          HamnavardServiceApi.delete(hamnavard._id).then((result) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const createHamnavard = () => {
      router.push({
        path: 'hamnavard-create',
        params: { hamnavard: JSON.stringify({}) }
      });
    };

    onMounted(() => {
      if (grid.value.getDatatable()) {
        grid.value
          .getDatatableBody()
          .on('click', '[data-edit-id]', (e: any) => {
            let id = $(e.currentTarget).data().editId;
            editHamnavard(id);
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
            if (filteredData.length > 0) deleteHamnavard(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      createHamnavard,
      deleteHamnavard,
      editHamnavard,
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

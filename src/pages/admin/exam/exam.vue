<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">آزمون ها</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createExam()"
            >
              جدید
            </button>
          </div>
        </div>
        <!-- /.row -->
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
import { defineComponent, ref, onMounted, reactive } from 'vue';
import { baseUrl } from '@/api/apiclient';
import grid from '@/modules/shared/grid.vue';
import router from '@/router';
import { ExamServiceApi } from '@/api/services/admin/exam-service';
const $ = require('jquery');
const alertify = require('../../../assets/alertifyjs/alertify');

export default defineComponent({
  components: { grid },

  setup() {
    const grid = ref();
    // Data
    const columns = reactive([
      {
        label: 'نام ',
        data: 'title',
        responsivePriority: 1,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },
      {
        label: 'مدت زمان ',
        data: 'duration',
        responsivePriority: 3,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },

      {
        label: 'تاریخ',
        data: 'date',
        responsivePriority: 3,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },
      {
        label: 'ساعت',
        data: 'time',
        responsivePriority: 3,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },
      {
        label: 'شرکت کننده',
        data: (data: any) => {
          return data.results.length;
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
        responsivePriority: 2
      },
      {
        className: 'calculate-control',
        orderable: false,
        defaultContent: '',
        label: '',
        data: '_id',
        action: 'calculate',
        width: 100,
        render: function (data: any) {
          return `<button type="button" data-calculate-id="${data}" class="btn btn-primary edit-button">محاسبه تراز</button>`;
        },
        responsivePriority: 2
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
      gridName: 'exam-grid',
      url: `${baseUrl}exam`,
      type: 'GET'
    });

    const editExam = (exam: any) => {
      router.push({
        name: 'exam-edit',
        params: { exam: JSON.stringify(exam) }
      });
    };

    const calculateExam = (exam: any) => {
      alertify.defaults.glossary.ok = 'خیر';
      alertify.defaults.glossary.cancel = 'بله';
      alertify.confirm('اتمام آزمون', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          ExamServiceApi.calculate(exam._id).then((result: any) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const deleteExam = (exam: any) => {
      alertify.defaults.glossary.ok = 'خیر';
      alertify.defaults.glossary.cancel = 'بله';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          ExamServiceApi.delete(exam._id).then((result: any) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const createExam = () => {
      router.push({
        name: 'exam-create',
        params: { exam: JSON.stringify({}) }
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
            if (filteredData.length > 0) editExam(filteredData[0]);
          });
        grid.value
          .getDatatableBody()
          .on('click', '[data-calculate-id]', (e: any) => {
            let id = $(e.currentTarget).data().calculateId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) calculateExam(filteredData[0]);
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
            if (filteredData.length > 0) deleteExam(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      createExam,
      grid
    };
  }
});
</script>

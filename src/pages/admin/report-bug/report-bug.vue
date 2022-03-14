<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">گزارشات خطا</h1>
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

import { ReportBugServiceApi } from '@/api/services/admin/report-bug-service';
import { useRoute } from 'vue-router';
const $ = require('jquery');
const alertify = require('../../../assets/alertifyjs/alertify');

export default defineComponent({
  components: { grid },

  setup() {
    const route = useRoute();
    // ref
    const grid = ref();

    const columns = reactive([
      {
        label: 'متن گزارش',
        data: (data) => {
          return data.message;
        },
        responsivePriority: 1
      },
      {
        label: 'فرستنده',
        data: 'student',
        responsivePriority: 3,
        render(data: any) {
          let text = data.firstname + ' ' + data.lastname;
          return `<span class="bug-sender">${text}</ span>`;
        }
      },
      {
        label: '',
        data: '_id',
        action: 'show',
        width: 100,
        render: function (data: any) {
          return `<button type="button" data-show-id="${data}" class="btn btn-info edit-button">نمایش</button>`;
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
        responsivePriority: 2
      }
    ]);

    const options = reactive({
      gridName: 'report-bug-grid',
      url: `${baseUrl}report-bug`,
      type: 'GET'
    } as any);

    const showMessage = (report: any) => {
      alertify.defaults.glossary.ok = 'باشه';
      alertify.alert(report.message);
    };

    const deleteReport = (question: any) => {
      alertify.defaults.glossary.cancel = 'بله';
      alertify.defaults.glossary.ok = 'خیر';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          ReportBugServiceApi.delete(question._id).then((result) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    onMounted(() => {
      if (grid.value.getDatatable()) {
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
            if (filteredData.length > 0) deleteReport(filteredData[0]);
          });
        grid.value
          .getDatatableBody()
          .on('click', '[data-show-id]', (e: any) => {
            let id = $(e.currentTarget).data().showId;
            let filteredData = grid.value
              .getDatatable()
              .data()
              .filter(function (value: any) {
                return value._id == id;
              });
            if (filteredData.length > 0) showMessage(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      grid
    };
  }
});
</script>

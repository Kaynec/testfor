<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">نوتیفیکیشن ها</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createNotification()"
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
import { NotificationServiceApi } from '@/api/services/admin/notification-service';
const $ = require('jquery');
const alertify = require('../../../assets/alertifyjs/alertify');

// import { string } from 'yup/lib/locale';

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
        label: 'متن ',
        data: 'description',
        responsivePriority: 3,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },

      {
        label: 'دریافت کنندگان ',
        data: 'receptor',
        responsivePriority: 3,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
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
      gridName: 'notification-grid',
      url: `${baseUrl}notification`,
      type: 'GET'
    });

    const editNotification = (notification: any) => {
      router.push({
        name: 'notification-edit',
        params: { notification: JSON.stringify(notification) }
      });
    };

    const deleteNotification = (notification: any) => {
      alertify.defaults.glossary.ok = 'خیر';
      alertify.defaults.glossary.cancel = 'بله';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          NotificationServiceApi.delete(notification._id).then(
            (result: any) => {
              alertify.success(result.data.message);
              (grid.value as any).getDatatable().ajax.reload();
            }
          );
        }
      });
    };

    const createNotification = () => {
      router.push({
        name: 'notification-create',
        params: { announcement: JSON.stringify({}) }
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
            if (filteredData.length > 0) editNotification(filteredData[0]);
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
            if (filteredData.length > 0) deleteNotification(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      createNotification,
      grid
    };
  }
});
</script>

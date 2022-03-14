<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">ادمین ها</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="CreateAdmin()"
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
const $ = require('jquery');
const alertify = require('../../../assets/alertifyjs/alertify');
import { AdminServiceApi } from '@/api/services/admin/admin-service';
// import { string } from 'yup/lib/locale';

export default defineComponent({
  components: { grid },
  setup() {
    // ref
    const grid = ref();
    // Data

    const columns = reactive([
      {
        label: 'نام کاربری',
        data: 'username',
        responsivePriority: 1,
        // type: () => {
        //   return typeof string;
        // },
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },
      { label: 'ایمیل', data: 'email' },
      { label: 'نام', data: 'firstname', responsivePriority: 3 },
      { label: 'نام خانوادگی', data: 'lastname', responsivePriority: 3 },
      {
        label: 'جنسیت',
        data: 'gender',
        render: function (data: string) {
          switch (data) {
            case 'male':
              return 'مرد';
            case 'female':
              return 'زن';
            default:
              return 'نا مشحص';
          }
        }
      },
      {
        label: 'تاریخ تولد',
        data: `birthdate`,
        responsivePriority: 3
      },
      {
        className: 'edit-control',
        orderable: false,
        defaultContent: '',
        label: '',
        data: '_id',
        action: 'update',
        render: function (data: any) {
          return `<button type="button" data-edit-id="${data}" class="btn btn-default edit-button">ویرایش</button>`;
        },
        responsivePriority: 2
      },
      {
        label: '',
        data: '_id',
        action: 'delete',
        render: function (data: any) {
          return `<button type="button" data-delete-id="${data}" class="btn btn-danger edit-button">حذف</button>`;
        },
        responsivePriority: 2
      }
    ]);

    const options = reactive({
      gridName: 'admin-grid',
      url: `${baseUrl}admin`,
      type: 'GET'
      // data: (d: any) =< {
      //   d.extra = 111;
      // }
    });

    const editAdmin = (admin: any) => {
      router.push({
        name: 'admin-edit',
        params: { adminId: admin._id }
      });
    };

    const deleteAdmin = (admin: any) => {
      alertify.defaults.glossary.cancel = 'بله';
      alertify.defaults.glossary.ok = 'خیر';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          AdminServiceApi.delete(admin._id).then((result) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const CreateAdmin = () => {
      router.push({
        name: 'admin-create',
        params: { admin: JSON.stringify({}) }
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
            if (filteredData.length > 0) editAdmin(filteredData[0]);
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
            if (filteredData.length > 0) deleteAdmin(filteredData[0]);
          });
      }
    });

    return { options, columns, CreateAdmin, deleteAdmin, editAdmin, grid };
  }
});
</script>

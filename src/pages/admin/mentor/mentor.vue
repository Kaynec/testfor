<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">مشاوران</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createMentor()"
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
import { MentorServiceApi } from '@/api/services/admin/mentor-service';
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
      gridName: 'mentor-grid',
      url: `${baseUrl}mentor`,
      type: 'GET'
      // data: (d: any) =< {
      //   d.extra = 111;
      // }
    });

    const editMentor = (mentor: any) => {
      mentor.birthdate = mentor.birthdate.split('T')[0];
      router.push({
        name: 'mentor-edit',
        params: { mentor: JSON.stringify(mentor) }
      });
    };

    const deleteMentor = (mentor: any) => {
      alertify.defaults.glossary.cancel = 'بله';
      alertify.defaults.glossary.ok = 'خیر';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          MentorServiceApi.delete(mentor._id).then((result) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const createMentor = () => {
      router.push({
        name: 'mentor-create',
        params: { mentor: JSON.stringify({}) }
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
            if (filteredData.length > 0) editMentor(filteredData[0]);
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
            if (filteredData.length > 0) deleteMentor(filteredData[0]);
          });
      }
    });

    return { options, columns, createMentor, deleteMentor, editMentor, grid };
  }
});
</script>

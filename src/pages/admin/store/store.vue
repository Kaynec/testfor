<template>
  <div class="panel panel-default">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">محصولات</h1>
          </div>
          <div class="col-sm-6">
            <button
              class="m-0 float-left btn btn-success"
              @click="createItem()"
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
import { StoreServiceApi } from '@/api/services/admin/store-service';
const alertify = require('../../../assets/alertifyjs/alertify');

// import { string } from 'yup/lib/locale';

export default defineComponent({
  components: { grid },

  setup() {
    StoreServiceApi.getAll().then((res) => {
      console.log(res);
    });
    // ref
    const grid = ref();
    // Data
    const columns = reactive([
      {
        label: 'عنوان محصول',
        data: 'title',
        responsivePriority: 1,
        searchPanes: {
          orthogonal: 'sp',
          show: true
        }
      },
      {
        label: 'نوع محصول',
        data: (data: any) => {
          return data.category.title;
        }
      },
      {
        label: 'قیمت ',
        data: 'price',
        responsivePriority: 3
      },
      {
        label: 'قیمت ویژه ',
        data: 'specialPrice'
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
        responsivePriority: 1
      }
    ]);
    const options = reactive({
      // gridName: 'session-grid',
      gridName: 'store-grid',
      url: `${baseUrl}product`,
      type: 'GET'
    });

    const editItem = (item: any) => {
      router.push({
        name: 'store-edit',
        params: { productId: item._id }
      });
    };

    const deleteItem = (item: any) => {
      alertify.defaults.glossary.ok = 'خیر';
      alertify.defaults.glossary.cancel = 'بله';
      alertify.confirm('حذف', 'آیا اطمینان دارید؟', function (e: any) {
        if (e) {
          StoreServiceApi.delete(item._id).then((result: any) => {
            alertify.success(result.data.message);
            (grid.value as any).getDatatable().ajax.reload();
          });
        }
      });
    };

    const createItem = () => {
      router.push({
        name: 'store-create'
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
            if (filteredData.length > 0) editItem(filteredData[0]);
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
            if (filteredData.length > 0) deleteItem(filteredData[0]);
          });
      }
    });

    return {
      options,
      columns,
      grid,
      createItem,
      deleteItem,
      editItem
    };
  }
});
</script>

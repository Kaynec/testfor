<template>
  <div class="history">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader goOnePageBack="MyProfile" title="سوابق خرید " />
    <!--  -->
    <div class="container">
      <div class="container-header">
        <span>کد پیگیری</span>
        <span>مبلغ خرید</span>
        <span>تاریخ</span>
      </div>
      <template v-if="!loading">
        <TableChild
          v-for="item in data"
          :key="item"
          :data="JSON.stringify(item)"
          typeOfComponent="purchase"
        />
      </template>

      <div class="loader-parent" v-else>
        <div class="loading1"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import TableChild from '@/modules/student-modules/table-child.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import router from '@/router';

export default defineComponent({
  components: { TableChild, MinimalHeader, DesktopMinimalHeader },
  setup() {
    let historyData = ref();
    const loading = ref(true);

    const goOnePageBack = () => {
      router.push({
        name: 'MyProfile'
      });
    };
    let data = ref({});

    StudentBasketApi.HistoryOfBoughtProducts().then((res) => {
      data.value = res.data.data;
      loading.value = false;
    });

    return { data, goOnePageBack, historyData, loading };
  }
});
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  max-width: 750px;
  // padding-top: 8vh;
  .container {
    width: 90%;
    margin: 1rem auto;

    .container-header {
      background-color: #ddd;
      width: 100%;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      padding-left: 2.5rem;
      span {
        font-size: 10px;
        font-weight: bold;
        color: #000;
      }
    }
    //
  }
}
</style>

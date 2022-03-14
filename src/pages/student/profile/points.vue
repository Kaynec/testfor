<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <div class="history">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="امتیازات" onePageBack="MyProfile" />
    <!--  -->
    <div class="container">
      <div class="container-header">
        <span> #</span>
        <span>امتیاز </span>
        <span>تاریخ</span>
      </div>
      <TableChild
        v-for="item in data"
        :key="item"
        :data="JSON.stringify(item)"
        typeOfComponent="point"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import router from '@/router';
import TableChild from '@/modules/student-modules/table-child.vue';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader, TableChild },
  setup() {
    const goOnePageBack = () => {
      router.push({
        name: 'MyProfile'
      });
    };

    const data = ref([]);

    StudentAuthServiceApi.getStudentPoints().then((res) => {
      data.value = res.data?.data;
    });

    return { data, goOnePageBack };
  }
});
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #f4f4f4;
  font-family: IRANSans;
  max-width: 750px;
  // padding-top: 8vh;

  .container {
    width: 99%;
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

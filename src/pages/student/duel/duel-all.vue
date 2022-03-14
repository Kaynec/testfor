<template>
  <div class="duel-all">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader onePageBack="Duel" title="مشاهده کلی رتبه ها " />
    <!--  -->
    <div class="list">
      <div class="list-header">
        <span class="right">کاربران</span>
        <div class="left">
          <span> امتیاز </span>
          <span class="star"> ⭐ </span>
        </div>
      </div>
      <!--  -->
      <div class="list-container animate__animatd animate__fadeIn">
        <div class="list-item" v-for="item in data" :key="item">
          <div :class="`right ${item.class}`">
            <img :src="item.img" alt="img of item" />
            <span class="name"> {{ item.name }} </span>
          </div>

          <div class="left">
            <span class="point"> {{ item.points }} </span>
            <span class="star">{{ item.star }} </span>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import router from '@/router';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    const goOnePageBack = () => router.go(-1);
    const data = ref([]);

    return {
      goOnePageBack,
      data
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable//Global.scss';
.duel-all {
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  position: relative;
  max-width: 750px;

  .list {
    width: 95%;
    margin: 0.3rem auto;

    .list-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .right {
        font-size: 9px;
        font-weight: bold;
        text-align: right;
        color: #949494;
        margin: 0;
        padding: 0;
      }
      .left {
        margin: 0;
        padding: 0;
        span {
          font-size: 9px;
          font-weight: bold;
          text-align: right;
          color: #949494;
        }
        .star {
          color: gold;
          font-size: 1rem;
          margin-right: 1.4rem;
        }
      }
    }
    //
    .list-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;

      .list-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-radius: 5px;
        margin-bottom: 0.2rem;
        .right {
          font-size: 9.8px;
          font-weight: bold;
          text-align: right;
          color: #000;
          img {
            width: 1.6rem;
            height: 1.6rem;
            border-radius: 50%;
            margin-right: 0.5rem;
            margin-left: 0.5rem;
          }
        }
        //
        .left {
          display: flex;
          align-items: center;

          .point {
            font-size: 8.8px;
            font-weight: bold;
            color: #000;
            margin-left: 0.5rem;
          }
          .star {
            font-size: 8.8px;
            padding: 12px;
            font-weight: bold;
            text-align: center;
            color: #000;
            background-color: #d3d7e0;
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
        }
      }
      //   Border Color Change
      .active {
        border-right: 3px solid #00d793;
      }
      .pending {
        border-right: 3px solid #e1bdba;
      }
      //
    }
  }
}
</style>

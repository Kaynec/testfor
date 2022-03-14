<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <main :class="`${isMobile() ? 'class ' : 'class pc '}`">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <SmallHeader goOnePageBack="Home" v-if="isMobile()" />

    <img src="@/assets/img/class/hero@3x.png" alt="hero img" class="hero" />
    <section class="grid animate__animated animate__fadeInUp">
      <div
        class="card"
        @click="toggleClassInfoAndCurrentItem(item)"
        v-for="item in data"
        :key="item._id"
      >
        <!-- <img :src="currentImg()" alt="colored img" /> -->
        <i class="fas fa-angle-left"></i>
        <div>
          <span> {{ item.title }}</span
          ><br />
          <span> {{ item.teacher }} </span>
        </div>
      </div>
    </section>
  </main>
  <!--  -->
  <ClassInfo
    v-if="classInfo"
    @convertBoolean="toggleClassInfo"
    :data="currentItem"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SmallHeader from '@/modules/student-modules/header/small-header.vue';
import ClassInfo from '@/modules/student-modules/class/class-info.vue';
import { StudentClassApi } from '@/api/services/student/student-class-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
export default defineComponent({
  components: { SmallHeader, ClassInfo, DesktopMinimalHeader },
  setup() {
    // Change THis With The Current Data
    const data = ref([]);
    const currentItem = ref({});
    StudentClassApi.getAll().then((res) => {
      data.value = res.data.data;
    });

    const images = [
      'class/purple@3x.png',
      'class/orange@3x.png',
      'class/pink@3x.png',
      'class/green@3x.png'
    ];

    const currentImg = () => {
      return require('../../../assets/img/' +
        images[Math.floor(Math.random() * images.length)]);
    };

    const classInfo = ref(false);
    const toggleClassInfo = () => (classInfo.value = !classInfo.value);
    const toggleClassInfoAndCurrentItem = (item) => {
      currentItem.value = item;
      classInfo.value = !classInfo.value;
    };

    return {
      classInfo,
      toggleClassInfo,
      data,
      images,
      currentImg,
      currentItem,
      toggleClassInfoAndCurrentItem
    };
  }
});
</script>

<style lang="scss" scoped>
.class {
  width: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
  position: relative;
  height: 100%;

  .hero {
    width: 100%;
    max-height: 35vh;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(1fr);
    grid-gap: 0.7rem;
    padding: 0.9rem;
    overflow-y: auto;
    height: 50vh;
    max-height: fit-content;

    .card {
      padding: 1.25rem;
      border-radius: 14.7px;
      box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.08);
      background-color: #fff;
      display: flex;
      flex-direction: row-reverse;
      font-family: IRANSans;
      justify-content: space-between;
      align-items: center;
      max-height: 6rem;
      text-align: center;
      width: 95%;
      margin: 0 auto;
      text-align: right;
      &:hover {
        cursor: pointer;
        background: rgba(255, 255, 255, 0.767);
      }

      img {
        width: 100%;
      }

      span {
        margin: 7px 0 0;
        font-family: IRANSans;
        font-size: 14.7px;
        line-height: 1.25;
        color: #646464;
      }
    }
  }
  .pencil {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 52px;
    max-height: 52px;
    margin-bottom: 1rem;
    margin-left: 1rem;
    object-fit: contain;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 15px;
  }
}

.pc {
  max-width: 750px;
  padding-top: 8vh;

  .hero {
    width: 97%;
    object-fit: cover;
    max-height: 270px;
    border-radius: 20px;
    margin: 0 auto;
    background-color: red;
    display: block;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(1fr);
    grid-gap: 0.7rem;
    padding: 0.9rem;
    overflow-y: auto;
    height: 50vh;
    max-height: fit-content;
    width: 100%;

    .card {
      width: 100%;
    }
  }
}
</style>

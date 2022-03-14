<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <main class="class" :style="`padding-top: ${isMobile() ? '' : '6vh'}`">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <SmallHeader v-if="isMobile()" onePageBack="Home" />

    <div class="hero" :style="`margin-top: ${isMobile() ? '' : '50px'}`">
      <img
        :src="`${
          isMobile()
            ? require('@/assets/img/selftest.png')
            : require('@/assets/img/selftest-pc@3x.png')
        }`"
        alt="header image of self test"
      />
    </div>

    <!-- <img src="../../../assets/img/selftest.png" alt="hero img" class="hero" /> -->
    <div class="grid animate__animated animate__fadeInUp">
      <div
        class="card animate__animated animate__fadeIn"
        v-for="course in allCourses"
        :key="course._id"
        @click="movetoRoadmap(course._id)"
      >
        <img :src="course.img" alt="course image" />
        <span> {{ course.title }}</span>
      </div>
    </div>
    <img
      src="@/assets/img/class/pencil.png"
      alt="pencil icon"
      class="pencil"
      @click="openNote"
    />

    <i class="fas fa-bookmark bookmarked" @click="openBookmarked"></i>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SmallHeader from '@/modules/student-modules/header/small-header.vue';
import router from '@/router';
import { StudentSelfTestApi } from '@/api/services/student/student-selftest-service';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';

export default defineComponent({
  components: { SmallHeader, DesktopMinimalHeader },
  setup() {
    // Change THis With The Current Data
    const allCourses = ref([] as any);

    (async () => {
      const res = await StudentSelfTestApi.AllCourses();
      allCourses.value = res.data.data;
      allCourses.value.forEach((element, idx) => {
        const imageUrl = `${baseUrl}course/download-image/${element.image}`;
        allCourses.value[idx].img = imageUrl;
      });
    })();

    const classInfo = ref(false);
    const toggleClassInfo = () => (classInfo.value = !classInfo.value);

    const openNote = () => {
      router.push({
        name: 'SelfTestNote'
      });
    };

    const movetoRoadmap = (id: string) => {
      router.push({ name: 'CustomGroupPage', params: { id: id } });
    };

    const openBookmarked = () => {
      router.push({ name: 'QuestionsChoosenList' });
    };

    return {
      classInfo,
      toggleClassInfo,
      openNote,
      allCourses,
      movetoRoadmap,
      openBookmarked
    };
  }
});
</script>

<style lang="scss" scoped>
.class {
  width: 100%;
  overflow-x: hidden;
  position: relative;
  height: 100%;
  overflow: hidden;
  max-width: 750px;
  .hero {
    width: 100%;
    max-width: 750px;
    max-height: 300px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: repeat(auto-fit, minmax(180px, 1fr));
    grid-gap: 0.7rem;
    padding: 0.9rem;
    overflow: scroll;
    height: 70vh;
    max-height: fit-content;
    padding-bottom: 8rem;

    .card {
      padding: 11px 36px 16.6px 38px;
      border-radius: 14.7px;
      box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.08);
      background-color: #fff;
      display: flex;
      flex-direction: column;
      font-family: IRANSans;
      align-items: center;
      transition: all 0.3s;

      &:hover {
        cursor: pointer;
        transform: scale(0.95);
      }

      img {
        width: 100%;
        height: 100%;
        max-width: 5rem;
        max-height: 5rem;
        aspect-ratio: 1;
      }

      span {
        margin: 7px 0 0;
        font-family: IRANSans;
        font-size: 0.715rem;
        color: #646464;
        text-align: center;
      }
    }
  }
  .pencil {
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 52px;
    max-height: 52px;
    margin-bottom: 2rem;
    margin-left: 1rem;
    object-fit: contain;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 15px;

    transition: 0.3s all;
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }

  .bookmarked {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-bottom: 1rem;
    margin-right: 1rem;
    border-radius: 15px;
    background: rgb(102, 15, 15);
    font-size: 1.75rem;
    padding: 1rem 1.25rem;
    color: white;

    transition: 0.3s all;
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }
}
</style>

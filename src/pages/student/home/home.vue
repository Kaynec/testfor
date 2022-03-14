<template>
  <DesktopMinimalHeader v-if="!isMobile()" />
  <div :class="`${isMobile() ? 'user-home' : 'user-home pc'}`">
    <Header v-if="isMobile()" />
    <!-- Header -->

    <div class="hero-container animate__animated animate__fadeIn">
      <img
        class="animate__animatd animate__fadeIn hero"
        :key="currentImg"
        :src="currentImg"
        alt="current slider img"
      />
      <div class="img-control">
        <span
          v-for="i in images.length"
          :key="i"
          :class="`${currentIndex + 1 == i ? 'rectangle' : 'dot'}`"
          @click="currentIndex = i - 1"
        >
        </span>
      </div>
    </div>
    <!-- Main Container -->
    <div
      class="Cart-container animate__animatd animate__fadeIn"
      :style="`${isMobile() ? 'center' : ''}`"
    >
      <div class="long">
        <img
          src="@/assets/img/home-icons/time-exam.png"
          @click="moveToSelfTest"
          alt="self test"
        />
      </div>

      <div class="long">
        <img
          src="@/assets/img/home-icons/duel.png"
          @click="MoveToDoul"
          alt="duel"
        />
      </div>

      <div class="Cart" v-show="isMobile()" @click="moveToBookList">
        <img src="@/assets/img/home-icons/book@2x.png" alt="booklist" />
      </div>

      <div class="Cart" v-show="isMobile()" @click="MoveToCLassRoom">
        <img src="@/assets/img/home-icons/class@2x.png" alt="class" />
      </div>

      <div class="Cart" v-show="isMobile()" @click="moveToSupport">
        <img src="@/assets/img/home-icons/support@2x.png" alt="support" />
      </div>

      <div class="Cart" v-show="isMobile()" @click="moveToComptest">
        <img src="@/assets/img/home-icons/azmoon@2x.png" alt="azmoon" />
      </div>

      <div class="Cart" v-show="isMobile()" @click="moveToSelfTest">
        <img src="@/assets/img/home-icons/lessons@2x.png" alt="lessons" />
      </div>

      <div class="Cart" v-show="isMobile()" @click="MoveToCalendar">
        <img src="@/assets/img/home-icons/calendar@2x.png" alt="calendar" />
      </div>
    </div>
  </div>
  <!-- Azmoon -->
  <Footer />
  <Azmoon v-if="showAzmoon" @convertBoolean="changeShowAzmoon(false)" />
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentproductApi } from '@/api/services/student/student-product';
import router from '@/router';
import Footer from '@/modules/student-modules/footer/footer.vue';
import Header from '@/modules/student-modules/header/header.vue';
import Azmoon from '@/modules/student-modules/azmoon/azmoon.vue';
import { useStudentStore } from '@/store';

@Options({
  components: {
    Footer,
    Header,
    Azmoon,
    DesktopMinimalHeader
  },
  computed: {
    currentImg: function () {
      return require('../../../assets/img/' +
        this.images[Math.abs(this.currentIndex) % this.images.length]);
    }
  }
})
export default class Login extends Vue {
  public showAzmoon = false;
  public timer = null as any;
  public currentIndex = 0;
  public id = '';
  public images = [
    'tech-training-purple@2x.png',
    'selftest.png',
    'comptest.png'
  ];
  async created() {
    const res = await StudentproductApi.getAllCategories();
    res.data.data.forEach((category) => {
      if (category.title == 'کتاب') this.id = category._id;
    });
  }
  mounted() {
    this.startSlide();
  }

  public startSlide() {
    this.timer = setInterval(this.next, 5000);
  }

  public next() {
    clearInterval(this.timer);
    this.timer = setInterval(this.next, 5000);
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
  public prev() {
    this.currentIndex = (this.currentIndex - 1) % this.images.length;
  }

  public MoveToCLassRoom(): void {
    setTimeout(() => {
      router.push({
        name: 'ClassRoom'
      });
    }, 100);
  }

  public moveToComptest(): void {
    setTimeout(() => {
      router.push({
        name: 'compTest'
      });
    }, 100);
  }

  public moveToSelfTest(): void {
    setTimeout(() => {
      router.push({
        name: 'SelfTest'
      });
    }, 100);
  }

  public MoveToDoul(): void {
    setTimeout(() => {
      router.push({
        name: 'Duel'
      });
    }, 100);
  }

  public moveToBookList(): void {
    setTimeout(() => {
      router.push({
        name: 'ShopBookList',
        params: { id: this.id }
      });
    }, 100);
  }

  public moveToSupport(): void {
    setTimeout(() => {
      router.push({
        name: 'ContactBackup'
      });
    }, 100);
  }

  public moveToGroup(): void {
    setTimeout(() => {
      router.push({
        name: 'StudentGroupPage'
      });
    }, 100);
  }

  public MoveToCalendar(): void {
    setTimeout(() => {
      router.push({
        name: 'Calendar'
      });
    }, 100);
  }

  public changeShowAzmoon(boolean: boolean): void {
    this.showAzmoon = boolean;
  }

  async logout() {
    await useStudentStore().dispatch(
      StudentActionTypes.LOG_OUT_STUDENT,
      undefined
    );
    this.$router.push('/student/login');
  }
}
</script>
<style lang="scss" scoped>
.desktop {
  height: 100%;
}

.user-home {
  width: 100%;
  height: 100%;
  font-family: IRANSans;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 8vh;

  .hero-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 0;
    padding: 0;
    .hero {
      width: 95%;
      object-fit: contain;
      margin: 1rem 0 0;
    }
    .img-control {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      .dot {
        height: 12px;
        width: 12px;
        background-color: rgba(237, 27, 36, 0.4);
        border-radius: 50%;
        display: inline-block;
        margin: 0 5px;
      }
      .rectangle {
        width: 36px;
        border-radius: 10px;
        background-color: #d21921;
        height: 12px;
      }
    }
  }
}
.Cart-container {
  width: 95%;
  margin: 0 auto;
  flex-grow: 1;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  padding-bottom: 4rem;

  .Cart {
    margin: 0.2rem 0;
    flex-basis: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    h5 {
      font-size: 0.65rem;
      font-weight: bold;
    }

    img {
      max-width: 80%;
      transition: 0.3s all;

      &:hover {
        cursor: pointer;
        transform: scale(0.95);
      }
    }
  }
  .long {
    margin: 0.7rem auto 0 auto;
    flex-basis: 50%;

    img {
      padding: 3%;
      border-radius: 0%;
      max-width: 100%;
      transition: 0.3s all;

      &:hover {
        cursor: pointer;
        transform: scale(0.95);
      }
    }
  }
}

.pc {
  width: clamp(35rem, 35vw, 750px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 10vh;

  .hero {
    width: 95%;
    object-fit: contain;
    border-radius: 1rem;
    margin: 1rem 0 0;
  }
}
</style>

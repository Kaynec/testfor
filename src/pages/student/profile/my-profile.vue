<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <DesktopMinimalHeader v-if="!isMobile()" />
  <div class="my-profile">
    <MinimalHeader title="پروفایل من" onePageBack="Home" />
    <!-- Red Div -->
    <div class="info animate__animated animate__fadeIn">
      <div class="right">
        <img :src="imageUrl" class="profile-image" alt="avatar picture" />
        <router-link class="edit" to="edit-profile">
          ویرایش
          <i class="fas fa-angle-left"></i>
        </router-link>
      </div>
      <div class="left">
        <!-- Change This Info Later -->
        <h4>{{ `${currentUser.firstname} ${currentUser.lastname}` }}</h4>
        <h6>{{ currentUser.point }} امتیاز</h6>
        <div class="left-info">
          <span>
            {{ gradeName }} :
            <br />
            شماره همراه :
          </span>
          <span>
            {{ groupName }} <br />
            {{ toPersianNumbers(currentUser.phone) }}
          </span>
        </div>
      </div>
    </div>
    <!-- Dialogs -->

    <div class="container animate__animated animate__fadeIn">
      <div
        ref="Dialog"
        class="dialog"
        v-for="item in data"
        :key="item"
        @touchstart="touchstart"
        @touchend="touchend"
        @click="clicked(item.component)"
      >
        <span> {{ item.label }} </span>
        <i class="fas fa-angle-left"></i>
      </div>
    </div>
    <!--  -->
    <Footer />
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import Footer from '@/modules/student-modules/footer/footer.vue';
import router from '@/router';
import { store } from '@/store';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';

export default defineComponent({
  components: { Footer, MinimalHeader, DesktopMinimalHeader },
  setup() {
    let currentUser = reactive(store.getters.getCurrentStudent);

    let groupName = ref(currentUser.group.title);
    let gradeName = ref(currentUser.grade.title);
    const toPersianNumbers = (number: any) => {
      var id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
      return number.toString().replace(/[0-9]/g, function (w: any) {
        return id[+w];
      });
    };

    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (currentUser && currentUser.profileImage) {
      imageUrl = `${baseUrl}student/getProfileImage/${currentUser.profileImage}`;
    }

    const goOnePageBack = () => router.go(-1);

    const data = reactive([
      {
        label: 'دعوت از دوستان',
        component: 'InviteFriends'
      },
      {
        label: ' سوابق خرید ',
        component: 'PurchaseHistory'
      },
      {
        label: '  امتیازات',
        component: 'ProfilePoints'
      },
      {
        label: ' پیام های دریافتی ',
        component: 'Inbox'
      },
      {
        label: 'تازه های کنکور',
        component: 'News'
      },
      {
        label: 'خروج از پنل کاربری',
        component: 'logOut'
      }
    ]);

    const touchstart = (e: any) => {
      e.target.classList.add('active');
    };

    const touchend = (e: any) => {
      e.target.classList.remove('active');
    };
    const clicked = (component: string) => {
      if (component != 'logOut')
        router.push({
          name: component
        });
      else logout();
    };

    const logout = () => {
      store.dispatch(StudentActionTypes.LOG_OUT_STUDENT).then((res) => {
        if (res) router.push({ name: 'StudentLogin' });
      });
    };

    return {
      data,
      touchstart,
      touchend,
      goOnePageBack,
      currentUser,
      logout,
      toPersianNumbers,
      groupName,
      gradeName,
      store,
      imageUrl,
      clicked
    };
  }
});
</script>

<style lang="scss" scoped>
body {
  overflow: hidden;
}
.my-profile {
  width: 100%;
  height: 100%;
  font-family: IRANSans;
  position: relative;
  flex-direction: column;
  overflow: hidden;
  display: flex;
  max-width: 750px;

  .info {
    width: 95%;
    overflow: hidden;
    margin: 0.9rem auto 0.3rem;
    height: fit-content;
    background: linear-gradient(
      to top left,
      rgb(189, 39, 43) 0%,
      rgb(189, 39, 43) 50%,
      rgba(189, 39, 43, 0.95) 50%,
      rgba(189, 39, 43, 0.95) 100%
    );
    display: flex;
    justify-content: center;
    justify-content: flex-start;
    align-items: center;
    border-radius: 15px;
    min-height: 15rem;
    height: auto;

    .right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      flex-basis: 35%;
      height: 100%;
      gap: 0.3rem;

      // fallback
      @supports not (aspect-ratio: auto) {
        img {
          position: absolute;
          transform: translate(-50%);
          left: 50%;
          top: 0%;
          width: 65%;
          height: 65%;
        }

        .edit {
          margin-top: 6rem;
        }
      }

      img {
        max-width: 8rem;
        border-radius: 50px;
        padding: 2px;
        border: solid 4.4px rgba(255, 255, 255, 0.21);
        width: 6rem;
        height: 6rem;
        aspect-ratio: 1;
      }

      .edit {
        border-radius: 50px;
        border: solid 0.8px #fff;
        text-decoration: none;
        position: relative;
        padding: 0.5rem 1.5rem;
        color: white;
        font-size: 9.2px;
        width: 5.5rem;
        // margin-top: 1rem;

        i {
          position: absolute;
          left: 0;
          top: 35%;
          margin-left: 10%;
        }
      }
    }

    .left {
      color: white;
      white-space: nowrap;
      margin-left: 0.7rem;
      margin-right: 0.7rem;

      h4 {
        font-size: 22px;
        font-weight: bold;
        text-align: right;
        color: #fff;
        margin-bottom: 1rem;
      }

      h6 {
        font-size: 18px;
        text-align: right;
        color: #fff;
        border-bottom: solid 1px rgba(225, 189, 186, 0.49);
        padding-bottom: 1rem;
      }

      .left-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        font-weight: 300;
        margin-top: 1rem;
        gap: 1rem;

        span {
          line-height: 1.8;
        }
      }
    }
  }

  .container {
    width: 100%;
    overflow-y: auto;
    padding-bottom: 5rem;

    .dialog {
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
      background-color: #fff;
      width: 100%;
      border-radius: 12px;
      color: #171717;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      margin: 0.5rem 0;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: rgba(255, 255, 255, 0.397);
        cursor: pointer;
      }

      span {
        font-size: 13px;
        font-weight: bold;
      }

      .fa-angle-left {
        color: black !important;
        font-size: 14px;
      }
      .label {
        font-family: IRANSans;
        font-size: 12px;
        font-weight: 500;
      }
    }
    .active {
      background-color: rgba(177, 16, 21, 0.96);
      color: #fff;

      .fa-angle-left {
        color: #fff !important;
      }
    }
  }
}
</style>

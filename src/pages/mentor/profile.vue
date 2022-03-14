<template>
  <MentorDesktopHeader v-if="!isMobile()" />
  <div class="my-profile" :style="`padding-top : ${!isMobile() ? '3rem' : ''}`">
    <MinimalHeader title="پروفایل من" onePageBack="MentorProfile" />
    <!-- Red Div -->
    <div class="info animate__animated animate__fadeIn">
      <div class="right">
        <img :src="imageUrl" class="profile-image" />
        <router-link class="edit" to="edit-profile">
          ویرایش
          <i class="fas fa-angle-left"></i>
        </router-link>
      </div>
      <div class="left">
        <!-- Change This Info Later -->
        <h4>{{ `${currentMentor.firstname} ${currentMentor.lastname}` }}</h4>
        <h6>{{ currentMentor.shortDescription }}</h6>
        <div class="left-info">
          <span> شماره همراه : </span>
          <span v-if="currentMentor.phone">
            {{ toPersianNumbers(currentMentor.phone) }}
          </span>
        </div>
        <span>
          {{ currentMentor.email }}
        </span>
      </div>
    </div>
    <!-- Dialogs -->

    <div class="container">
      <div
        ref="Dialog"
        class="dialog animate__animated animate__fadeIn"
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
    <!-- <Footer v-if="isMobile()" /> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import router from '@/router';
import { store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';

export default defineComponent({
  components: { MinimalHeader, MentorDesktopHeader },
  setup() {
    let currentMentor = reactive(store.getters.getCurrentMentor);
    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (currentMentor && currentMentor.profileImage) {
      imageUrl = `${baseUrl}mentor/getProfileImage/${currentMentor.profileImage}`;
    }

    const goOnePageBack = () => router.go(-1);

    const data = reactive([
      {
        label: 'ویرایش رزومه',
        component: 'EditCV'
      },
      {
        label: 'لیست کاربران',
        component: 'MentorStudents'
      },
      {
        label: 'مشاهده درخواست ها',
        component: 'Requests'
      },
      {
        label: 'خروج از پنل کاربری',
        component: 'LogOut'
      }
    ]);

    const touchstart = (e: any) => {
      e.target.classList.add('active');
    };

    const touchend = (e: any) => {
      e.target.classList.remove('active');
    };
    const clicked = (component: string) => {
      if (component != 'LogOut')
        router.push({
          name: component
        });
      else logout();
    };

    const logout = () => {
      store.dispatch(MentorActionTypes.LOG_OUT_MENTOR).then((res) => {
        if (res) router.push({ name: 'MentorLogin' });
      });
    };

    return {
      data,
      touchstart,
      touchend,
      goOnePageBack,
      currentMentor,
      logout,
      toPersianNumbers,
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
  max-width: 750px;
  font-family: IRANSans;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

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
        border: solid 2px #fff;
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
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        color: #fff;
        margin-bottom: 1rem;
      }

      h6 {
        font-size: 14px;
        text-align: right;
        color: #fff;
        border-bottom: solid 1px white;
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
        background: rgba(221, 214, 214, 0.432);
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

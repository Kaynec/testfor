<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="!data">
    <div class="loading1"></div>
  </div>
  <!--  -->

  <div
    class="contact-backup"
    v-else
    :style="`padding-top :${isMobile() ? '' : '8vh'}`"
  >
    <DesktopMinimalHeader v-if="!isMobile()" />
    <SmallHeader v-if="isMobile()" onePageBack="Home" />
    <h6>پشتیبان‌های فعال</h6>
    <!-- Change THis With Real Data Coming From Some Server-->
    <div
      class="flex animate__animated animate__fadeIn"
      :style="`grid-template-columns : ${!isMobile() ? 'repeat(2 , 1fr)' : ''}`"
    >
      <div class="card" v-for="item in data" :key="item._id">
        <div v-if="!item.img" class="loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <img
          :src="item.img"
          alt="Picture of a supporot person"
          class="person-img"
          @click="MoveToBackUpInfo(item)"
          v-else
        />

        <div class="child-flex animate__animated animate__fadeIn">
          <div>
            <h5>پشتیبان {{ item.firstname }} {{ item.lastname }}</h5>
            <h6>مشاوره تحصیلی</h6>
          </div>

          <div v-if="item.connect" class="icons">
            <img
              src="@/assets/img/contact/chat-red.png"
              @click="goToChatPage(item)"
              alt="chat red icon"
            />
            <img
              src="@/assets/img/contact/chat-green.png"
              alt="chat green icon"
            />
          </div>

          <div v-else-if="!item.connect && !item.request" class="icons">
            <img
              src="@/assets/img/contact/lock.png"
              alt="chat icon"
              @click="sendRequest(item)"
            />
          </div>

          <div v-else class="icons">
            <img
              src="@/assets/img/contact/chat-grey.png"
              @click="alarm(item)"
              alt="chat grey"
            />
            <img
              src="@/assets/img/contact/chat-green.png"
              alt="chat green icon"
              @click="alarm(item)"
            />
          </div>
        </div>
      </div>

      <!--  -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUpdated } from 'vue';
import SmallHeader from '@/modules/student-modules/header/small-header.vue';
import { StudentSupportApi } from '@/api/services/student/student-support-service';
import { returnProtectedImage } from '@/utilities/get-image-from-url';
import router from '@/router';
import { baseUrl } from '@/api/apiclient';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
const alertify = require('../../../assets/alertifyjs/alertify');

export default defineComponent({
  components: {
    SmallHeader,
    DesktopMinimalHeader
  },
  setup() {
    let data = ref();
    StudentSupportApi.getAll().then((res) => {
      console.log(res);
      data.value = res.data.data || 'empty';
    });

    const MoveToBackUpInfo = (supportPerson) => {
      router.push({
        name: 'ContactBackupInfo',
        params: { data: JSON.stringify(supportPerson) }
      });
    };

    // Images For The Categories
    let imageRefs = [] as any;
    const setImageRef = (el) => {
      if (el) imageRefs.push(el);
    };

    onUpdated(() => {
      data.value.forEach((mentor, idx) => {
        const imageUrl = `${baseUrl}mentor/getProfileImage/${mentor.profileImage}`;
        data.value[idx].img = imageUrl;
      });
    });

    const goToChatPage = (item) => {
      router.push({ name: 'ContactBackupChat', params: { id: item._id } });
    };

    const sendRequest = (item) => {
      StudentSupportApi.SendSupportRequest({
        mentorId: item._id
      }).then((res) => {
        if (res.data || res.data.status == 0) {
          alertify
            .alert('درخواست ارتباط شما ارسال شد')
            .set('basic', true)
            .set('onok', () => {
              console.log('');
            });
        }
      });
    };

    const alarm = (item) => {
      alertify
        .alert('درخواست ارتباط شما هنوز مورد تایید قرار نگرفته است')
        .set('basic', true)
        .set('onok', () => {
          console.log('');
        });
    };

    return {
      MoveToBackUpInfo,
      goToChatPage,
      data,
      setImageRef,
      imageRefs,
      returnProtectedImage,
      sendRequest,
      alarm
    };
  }
});
</script>

<style lang="scss" scoped>
.contact-backup {
  position: relative;
  background-color: #f4f4f4;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  max-width: 750px;

  h6 {
    margin: 20px;
    font-size: 20px;
    font-weight: bold;
    text-align: right;
    color: #171717;
  }
  .flex {
    margin: 0.5rem;
    display: grid;
    grid-auto-rows: minmax(225px, 265px);
    grid-gap: 0.5rem;

    .card {
      font-family: IRANSans;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      border-bottom-left-radius: 35px;
      border-bottom-right-radius: 35px;
      padding-bottom: 0.4rem;

      .icons {
        img {
          width: 2.6rem;
          max-width: 3rem;
        }
      }

      .child-flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;

        img {
          border-radius: 15px;
          object-fit: cover;
        }

        h5 {
          font-size: 0.875rem;
          margin: 0.75rem 0.4rem;
          font-weight: bold;
        }
        h6 {
          font-size: 0.725rem;
          margin: 0.5rem;
        }
      }
      .person-img {
        width: 100%;
        max-height: 70%;
        object-fit: cover;
      }
    }
  }
}
</style>

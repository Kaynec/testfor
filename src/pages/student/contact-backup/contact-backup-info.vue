<template>
  <div class="contact-backup-info">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="اطلاعات بیشتر" onePageBack="ContactBackup" />

    <div class="hero-container animate__animated animate__fadeIn">
      <img :src="model.img" alt="hero img" class="hero" @click="goToChatPage" />
      <div v-if="model.connect" class="icons">
        <img
          src="@/assets/img/contact/chat-red.png"
          alt="chat red icon"
          @click="goToChatPage(model)"
        />
        <img src="@/assets/img/contact/chat-green.png" />
      </div>

      <div v-else-if="!model.connect && !model.request" class="icons">
        <img
          src="@/assets/img/contact/lock.png"
          alt="chat icon"
          @click="sendRequest(model)"
        />
      </div>

      <div v-else class="icons">
        <img
          src="@/assets/img/contact/chat-grey.png"
          alt="chat grey icon"
          @click="alarm(model)"
        />
        <img
          src="@/assets/img/contact/chat-green.png"
          alt="chat green icon"
          @click="alarm(model)"
        />
      </div>
    </div>

    <div class="text">
      <h4>پشتیبان {{ model.firstname + model.lastname }}</h4>
      <p v-html="model.resume"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { store } from '@/store';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentSupportApi } from '@/api/services/student/student-support-service';

const alertify = require('@/assets/alertifyjs/alertify');

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  props: {
    data: { type: String, default: '{}' }
  },
  setup(props) {
    const model = ref(JSON.parse(props.data));

    if (props.data != '{}')
      store.commit(
        StudentMutationTypes.SET_CURRENT_SUPPORT_PERSON,
        model.value
      );

    model.value = store.getters.getCurrentSupportPerson;

    const goOnePageBack = () =>
      router.push({
        name: 'ContactBackup'
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

    const alarm = () => {
      alertify
        .alert('درخواست ارتباط شما هنوز مورد تایید قرار نگرفته است')
        .set('basic', true)
        .set('onok', () => {
          console.log('');
        });
    };

    return {
      goOnePageBack,
      goToChatPage,
      model,
      alarm,
      sendRequest
    };
  }
});
</script>

<style lang="scss" scoped>
.contact-backup-info {
  position: relative;
  background-color: #f4f4f4;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  max-width: 750px;

  .hero-container {
    width: 100%;
    height: 29vh;
    max-height: 500px;
    position: relative;

    .hero {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .icons {
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 9999;
      margin: 1rem;

      img {
        border-radius: 10px;
        width: 2.5rem;
        height: 2.5rem;
        margin-right: 0.2;
        margin-left: 0.2;
      }
    }
  }

  .text {
    width: 95%;
    margin: 20px auto;
    padding: 1.5rem;
    border-radius: 16.7px;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    background-color: #fff;
    font-family: IRANSans;

    h4 {
      font-size: 15.5px;
      font-weight: bold;
      text-align: right;
      color: #171717;
    }

    h5 {
      font-size: 13px;
      line-height: 1.43;
      text-align: right;
      color: #646464;
      margin: 25px 0 30px 0;
    }
    p {
      margin: 8.5px 0 0;
      font-size: 13px;
      line-height: 1.64;
      text-align: right;
      color: #646464;
    }
  }
}
</style>

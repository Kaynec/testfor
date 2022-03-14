<template>
  <MinimalHeader
    title="گفتگو کنید "
    v-if="isMobile()"
    onePageBack="ContactBackup"
  />
  <!-- Spinner -->
  <div class="loader-parent" v-if="isFetching">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div
    class="chat"
    v-else-if="!isFetching"
    :style="`padding-top: ${isMobile() ? '' : '5rem'}; max-height : ${
      !isMobile() ? `${maxHeight + 60}px` : ''
    }`"
    v-bind="$attrs"
  >
    <DesktopMinimalHeader v-if="!isMobile()" />
    <nav class="navbar" v-if="!isMobile()">
      <div class="right">
        <img :src="imageUrl" alt="avatar" />
        <div class="txt" v-if="mentor">
          <h4>
            پشتیبان {{ mentor.firstname }} {{ mentor.lastname }}
            <img src="@/assets/img/contact/chat-green.png" />
          </h4>
          <h5>{{ mentor.shortDescription }}</h5>
        </div>
      </div>
      <i
        @click="
          router.push({
            name: 'ContactBackup'
          })
        "
        class="fas fa-arrow-left"
      ></i>
    </nav>
    <!-- Messages -->
    <main class="chat-section" ref="chatSection">
      <div
        :class="`${item.sender === 'mentor' ? 'mentor msg' : 'msg'}`"
        v-for="item in Msgs"
        :key="item"
      >
        <p :class="{ supporter: item.sender == 'mentor' }">
          {{ item.message }}
        </p>
        <img v-if="item.sender == 'mentor'" alt="avatar" :src="imageUrl" />
      </div>
    </main>
    <!-- Keyboard -->
    <form :class="`${isMobile() ? 'toolbar' : 'pc-toolbar'}`">
      <div class="textarea">
        <textarea
          v-model="message"
          placeholder="پیام خود را اینجا بنویسید…"
          minlength="1"
        ></textarea>
      </div>
      <div class="icons">
        <i
          @click="sendMessage()"
          class="fa fa-paper-plane"
          aria-hidden="true"
        ></i>
        <!-- <i class="fas fa-smile"></i>
        <i class="fa fa-paperclip" aria-hidden="true"></i> -->
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUpdated, reactive, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { store } from '@/store';

import router from '@/router';
import { connection } from '@/main';
import { StudentSupportApi } from '@/api/services/student/student-support-service';
import { StudentChatApi } from '@/api/services/student/student-chat-service';
import { useRoute } from 'vue-router';
import { baseUrl } from '@/api/apiclient';
import methods from '@/mixins/detectMobile';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { DesktopMinimalHeader, MinimalHeader },
  setup() {
    const mentor = ref();
    const route = useRoute();
    const imageUrl = ref('');
    const isFetching = ref(true);
    const maxHeight = ref(0);
    const chatSection = ref();

    const firstView = true;

    onUpdated(() => {
      if (firstView && chatSection.value) {
        chatSection.value.scrollTop = chatSection.value.scrollHeight;
      }
    });

    StudentSupportApi.getByIdForStudent(route.params.id).then((res) => {
      mentor.value = res.data.data;
      if (mentor.value) {
        imageUrl.value = `${baseUrl}mentor/getProfileImage/${mentor.value.profileImage}`;
      } else {
        imageUrl.value = require('@/assets/img/contact/avatar.png');
      }
    });
    const Msgs = ref([] as any);
    StudentChatApi.getStudentAllChatByMentorId(route.params.id).then(
      (result) => {
        Msgs.value = result.data.data;
        isFetching.value = false;
      }
    );
    let currentUser = reactive(store.getters.getCurrentStudent);

    const goOnePageBack = () =>
      router.push({
        name: 'ContactBackup'
      });

    onUpdated(() => {
      if (!methods.methods.isMobile()) {
        maxHeight.value = document
          .querySelector('aside')!
          .getClientRects()[0].height;
      }
    });

    const message = ref('');
    const sockets = {
      connect: () => {
        console.log('socket connected');
      },
      customEmit: () => {
        console.log(
          'this method was fired by the socket server. eg: io.emit("customEmit", data)'
        );
      }
    };

    const sendMessage = () => {
      if (message.value.length < 1 || message.value.trim().length === 0) {
        return;
      }
      // $socket is socket.io-client instance
      let payload = {
        message: message.value,
        mentor: mentor.value,
        student: currentUser,
        sender: 'student',
        type: 'text'
      };
      connection.emit('send-message', payload);

      Msgs.value.push(payload);

      message.value = '';
    };
    return {
      Msgs,
      goOnePageBack,
      sockets,
      sendMessage,
      message,
      mentor,
      imageUrl,
      router,
      isFetching,
      maxHeight,
      chatSection
    };
  }
});
</script>

<style lang="scss" scoped>
.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  height: 100%;
  max-width: 750px;

  .navbar {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    .right {
      display: flex;

      .txt {
        margin-right: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: right;

        img {
          width: 27px;
          height: 27px;
          object-fit: cover;
        }

        h4 {
          font-size: 15.5px;
          font-weight: bold;
          text-align: right;
          color: #171717;
          margin: 0;
        }

        h5 {
          font-size: 13.6px;
          line-height: 1.43;
          text-align: right;
          color: #646464;
          margin: 0.5rem 0 0 0;
        }
      }
      img {
        width: 4rem;
        height: 4rem;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }

  .chat-section {
    width: 100%;
    overflow-y: auto;

    .msg {
      width: 100%;
      display: flex;
      padding: 0 0.5rem;

      img {
        width: clamp(70px, 80px, 95px);
        height: clamp(70px, 80px, 95px);
        aspect-ratio: 1;
        border-radius: 50%;
        object-fit: cover;
        margin: 66px 16px 0 0;
      }

      p {
        font-family: IRANSans;
        font-size: 14px;
        line-height: 1.43;
        text-align: right;
        color: #fff;
        background-color: #4ac367;
        padding: 19px 23px 21px 29px;
        border-radius: 22.5px;
        line-height: 1.8;
      }
    }

    .supporter {
      color: #171717c7 !important;
      background-color: #f0f7ff !important;
    }

    .mentor {
      justify-content: flex-end;
      align-content: flex-end;
    }
  }

  //
  .toolbar {
    position: fixed;
  }
  .pc-toolbar {
    position: sticky;
  }
  .toolbar,
  .pc-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 9.1px;
    box-shadow: 0 -14px 148px 0 rgba(0, 0, 0, 0.2);
    background-color: #f5f5f5;
    width: 100%;
    padding: 1rem;
    bottom: 0;

    .textarea {
      font-family: IRANSans;
      flex-basis: 70%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-grow: 1;
      margin-top: 1rem;

      textarea {
        border: none;
        outline: none;
        resize: none;
        font-size: 12px;
        color: #313131;
        width: 100%;
        background: transparent;
      }
    }

    .icons {
      color: #8f8d9a;
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: 0.95rem;
      margin-left: 0.25rem;
      font-size: 25px;
      flex-basis: 30%;

      .fa-paper-plane {
        color: #d21921 !important;
      }
    }
  }
  .pc-toolbar {
    max-width: 700px;
    border: 1px solid white;
    margin: 0 auto;
    margin-bottom: 0.75rem;
    padding: 0 1rem;
    border-radius: 9.1px;
    box-shadow: 0 -14px 148px 0 rgba(0, 0, 0, 0.2);
  }
}
</style>

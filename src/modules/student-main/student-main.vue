<template>
  <div
    :class="`${isMobile() ? 'st-wrapper' : 'st-wrapper pc'}`"
    :style="getMainStyle()"
  >
    <desktopRightSide
      v-show="
        !isMobile() &&
        store.getters.getStudentToken &&
        componentname != 'StudentGroupPage' &&
        componentname != 'CustomGroupPage'
      "
    />

    <router-view> </router-view>
  </div>
  <alert
    messages
    label="پیام ناخوانده"
    :text="`شما ${messages.length} پیام ناخوانده دارید`"
    @convertBoolean="toggleShowNotification"
    v-if="showNotification && messages.length"
  >
    <div class="btns">
      <button @click="redirectToChat">انتقال به صفحه چت</button>
    </div>
  </alert>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import desktopRightSide from '@/modules/desktop-rightside.vue';
import detectMobile from '@/mixins/detectMobile';
import { store } from '@/store';
import { ChatActionTypes } from '@/store/modules/chat/action-types';
import { ChatMutationTypes } from '@/store/modules/chat/mutation-types';
import router from '@/router';

@Options({
  components: { desktopRightSide },
  computed: {
    componentname() {
      return this.$route.name;
    }
  }
})
export default class Main extends Vue {
  public windowHeight = window.innerHeight;
  public store = store;
  public messages = [] as any;
  public showNotification = false;
  public ismobile = detectMobile.methods.isMobile();

  async mounted() {
    if (!store.getters.getStudentToken) return;

    store.commit(ChatMutationTypes.EMPTY_MESSAGES);

    // ChatMutationTypes.SOCKET_GET_Message()
    const wasSucceeded = await store.dispatch(ChatActionTypes.SOCKET_REGISTER);

    if (wasSucceeded) {
      store.getters.getMessages.forEach((message) => {
        if (message) {
          this.messages.push(message);
        }
      });

      if (this.messages.length > 0) {
        this.toggleShowNotification();
      }
    }

    // connection.on('new-message', () => {});
  }

  toggleShowNotification() {
    this.showNotification = !this.showNotification;
  }

  onResize(): void {
    (this as any).windowHeight = window.innerHeight;
  }

  redirectToChat(): void {
    this.toggleShowNotification();
    router.push({ name: 'ContactBackup' });
  }

  getMainStyle() {
    let fraction = '';

    // We Want One Part page on the roadmap pages
    if (
      !this.ismobile &&
      store.getters.getStudentToken &&
      this.$route.name != 'StudentGroupPage' &&
      this.$route.name != 'CustomGroupPage'
    ) {
      fraction = '40% 60%';
    } else {
      fraction = '1fr';
    }

    return {
      height: `${(this as any).windowHeight - 1}px`,
      'grid-template-columns': fraction
    };
  }
}
</script>
<style lang="scss">
.st-wrapper {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  background: #f4f4f4;
  display: grid;
  font-family: IRANSans;
}

.pc {
  width: 100vw;
  height: 100vh;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.75s ease-out;
}

.slide-enter-to {
  position: absolute;
  left: 0;
}

.slide-enter-from {
  position: absolute;
  left: -100%;
}

.slide-leave-to {
  position: absolute;
  right: -100%;
}

.slide-leave-from {
  position: absolute;
  right: 0;
}

.btns {
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 4.5rem;
  button {
    padding: 5% 18%;
    border-radius: 1rem;
    border: none;

    &:first-child {
      background-color: #4ac367;
      color: #fff;
      margin-left: 0.3rem;
    }

    &:last-child {
      background-color: #d3d7e0;
      color: #646464;
    }
  }
}
</style>

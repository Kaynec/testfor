<template>
  <div class="desktop" v-if="!isMobile()">
    <DesktopMinimalHeader />
    <!--  -->
    <div class="container animate__animated animate__fadeIn">
      <img
        src="@/assets/img/invite.png"
        class="container-img"
        alt="invite picture"
      />
      <h5>ما را به دوستان خود معرفی کنید</h5>
      <p>
        شما می توانید با معرفی کد دعوت خود به دیگران هم خود و هم دعوت شده در
        باشگاه امتیاز کسب کنید.
      </p>
      <div class="border-dashed">
        <span> https://devnirone.ir/student/signup?code={{ id }} </span>
      </div>
      <button @click="shareLink" class="button-linear">اشتراک گذاری</button>
    </div>
    <!--  -->
    <span class="back" @click="goOnePageBack()">
      برگشت

      <i class="fa fa-angle-right" aria-hidden="true"></i
    ></span>
    <!--  -->
  </div>
  <MinimalHeader title="پروفایل من" goOnePageBack="MyProfile" />
  <div class="invite" v-if="isMobile()">
    <!--  -->
    <div class="container animate__animated animate__fadeIn">
      <img
        src="@/assets/img/invite.png"
        class="container-img"
        alt="invite picture"
      />
      <h5>ما را به دوستان خود معرفی کنید</h5>
      <p>
        شما می توانید با معرفی کد دعوت خود به دیگران هم خود و هم دعوت شده در
        باشگاه امتیاز کسب کنید.
      </p>
      <div class="border-dashed">
        <span> https://devnirone.ir/student/signup?code={{ id }} </span>
      </div>
      <button @click="shareLink()" class="button-linear">اشتراک گذاری</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import router from '@/router';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { store } from '@/store';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    const goOnePageBack = () => router.go(-1);

    const id = ref('d548a');

    if (store.getters.getCurrentStudent) {
      id.value = store.getters.getCurrentStudent._id;
    }

    const shareLink = () => {
      if (navigator.share) {
        navigator
          .share({
            title: 'Share',
            text: 'Share Your Invite Link',
            url: `https://devnirone.ir/student/signup?code=${id.value}`
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }
    };

    return { goOnePageBack, toPersianNumbers, id, shareLink };
  }
});
</script>

<style lang="scss" scoped>
.invite,
.desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  background-color: #f4f4f4;
  font-family: IRANSans;
  height: 100%;
  padding-top: 8vh;
  .container {
    width: 90%;
    background: #fff;
    position: relative;
    padding: 5rem 1rem 2rem 1rem;
    color: #1c1c1c;
    border-radius: 15px;
    margin-top: 8rem;

    .container-img {
      position: absolute;
      margin-left: auto;
      margin-right: auto;
      left: 0;
      right: 0;
      top: -20vh;
      width: 55vw;
      max-width: 450px;
    }

    h5 {
      margin-top: 3rem;
      font-family: IRANSans;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }
    p {
      font-size: 13px;
      font-weight: 500;
      letter-spacing: -1.86px;
      text-align: center;
      color: #646464;
      margin: 1.5rem 0;
    }

    .border-dashed {
      padding: 15px 25px;
      border-radius: 30px;
      border: dashed 2px #ff5960;
      text-align: center;
      word-break: break-word;

      span {
        font-size: 20px;
        letter-spacing: 1.5px;
        color: #333;
      }
    }
    .button-linear {
      padding: 0.9rem 1.75rem;
      color: #fff;
    }
  }
}

.desktop {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(14, 5, 5, 0.884);
  z-index: 99999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .container {
    width: clamp(300px, 25vw, 750px);

    background: #fff;
    position: relative;
    padding: 1rem;
    color: #1c1c1c;
    border-radius: 15px;
    margin-top: 0;

    flex-direction: column;

    display: flex;
    align-items: center;
    justify-content: center;

    .button-linear,
    .border-dashed {
      span {
        font-size: 1rem;
      }

      width: 80%;
    }

    .container-img {
      position: relative;
      left: 0;
      right: 0;
      top: 0;
      width: 50%;
    }
  }
}

.back {
  color: #fff;
  font-size: 1.3rem;
  padding: 15px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  cursor: pointer;
  align-self: center;
  justify-self: flex-end;
  align-self: flex-start;
  width: clamp(450px, 40vw, 850px);

  i {
    font-size: 2rem;
    margin-left: 0.6rem;
  }
}
</style>

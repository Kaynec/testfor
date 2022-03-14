<template>
  <nav>
    <div class="right">
      <img :src="imgurl" />
      <span class="name">{{ mentor.firstname }} {{ mentor.lastname }}</span>
      <span>پشتیبان </span>
    </div>
    <i @click="showContent = !showContent" class="fas fa-bars"></i>
  </nav>
  <ul class="pc-content" v-if="showContent">
    <li>منوی کاربری</li>
    <li @click="showContactus()">ارتباط با ما</li>
    <li @click="logOut()">
      <i class="fas fa-power-off"> </i> خروج از پنل کاربری
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { store } from '@/store';
import { baseUrl } from '@/api/apiclient';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';
import router from '@/router';

export default defineComponent({
  setup() {
    let imgurl = '';

    const showContent = ref(false);

    let mentor = store.getters.getCurrentMentor;

    if (mentor.profileImage) {
      imgurl = `${baseUrl}mentor/getProfileImage/${mentor.profileImage}`;
    } else {
      imgurl =
        'data:image/png;base64,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';
    }

    const logOut = () => {
      store.dispatch(MentorActionTypes.LOG_OUT_MENTOR);
    };

    const showContactus = () => {
      console.log('CONTACT US');
      router.push({
        name: 'MentorContactUs'
      });
    };

    return { imgurl, mentor, showContent, logOut, showContactus };
  }
});
</script>

<style lang="scss" scoped>
nav {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  background-color: #171717;
  padding: 1rem;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09), 0 4px 6px 0 rgba(0, 0, 0, 0.49);
  z-index: 9999999;

  .right {
    display: flex;
    align-items: center;

    img {
      max-width: 30px;
      max-height: 30px;
      aspect-ratio: 1;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid #fff;
    }

    .name {
      font-size: 14px;
      font-weight: bold;
      text-align: right;
      color: #fff;
      margin: 0 10px 0 0;
      padding: 0 10px;
      border-left: 1px solid #fff;
    }
    span {
      font-size: 12px;
      text-align: right;
      color: #fff;
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  //

  i {
    color: #fff;
    margin-left: 1rem;
    font-size: 30px;
  }
}

.pc-content {
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.17);
  list-style: none;
  margin: 5.5rem 0 0 1rem;
  padding: 0;
  transition: 0.4s ease all;

  li {
    width: 100%;
    padding: 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.4s ease all;

    &:first-child {
      background-color: #646464;
      color: #fff;

      &::before {
        position: absolute;
        content: '';
        width: 0;
        height: 0;
        border-left: 15px solid transparent;
        border-right: 15px solid transparent;
        border-bottom: 20px solid #646464;
        top: -1rem;
        left: 1rem;
      }
    }

    &:nth-of-type(2) {
      color: #171717;
      background-color: #fff;
    }

    &:nth-of-type(3) {
      color: #ed1b24;
      background-color: #fff;
    }

    &:hover {
      background: #646464a8;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <nav :class="`${isMobile() ? 'nav sm-nav' : 'nav pc sm-nav'}`">
    <div>
      <img
        :src="imageUrl"
        class="profile-image animate__animated animate__fadeIn"
        alt="avatar"
      />
      <span class="user-parts">
        {{ `${currentUser.firstname} ${currentUser.lastname}` }} | امتیاز شما:
        {{ toPersianNumbers(`${point}`) }}
      </span>
    </div>
    <i class="fas fa-arrow-left" @click="goOnePageBack()"></i>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { baseUrl } from '@/api/apiclient';

export default defineComponent({
  props: {
    onePageBack: { type: String }
  },
  setup(props) {
    const goOnePageBack = () => {
      if (props.onePageBack) {
        router.push({
          name: props.onePageBack
        });
      } else {
        router.go(-1);
      }
    };

    const currentUser = ref(store.getters.getCurrentStudent);

    const point = ref(0);

    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (currentUser.value && currentUser.value.profileImage) {
      imageUrl = `${baseUrl}student/getProfileImage/${currentUser.value.profileImage}`;
    }

    if (currentUser.value && currentUser.value.point)
      point.value = currentUser.value.point;

    return {
      router,
      goOnePageBack,
      toPersianNumbers,
      currentUser,
      point,
      store,
      imageUrl
    };
  }
});
</script>

<style lang="scss" scoped>
.sm-nav {
  background-color: #171717;
  display: flex;
  color: #fff;
  justify-content: space-between;
  align-items: center;
  padding: 0.7rem;
  max-height: 8vh;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.09), 0 2px 4px 0 rgba(0, 0, 0, 0.19);
  position: sticky; /* Set the navbar to fixed position */
  top: 0; /* Position the navbar at the top of the page */
  width: 100%; /* Full width */
  z-index: 2;
  div {
    img {
      width: 29px;
      height: 28px;
      margin: 0 10px 0 0;
      border-radius: 8px;
      border: solid 2px #ddd;
      margin-left: 0.5rem;
    }

    span {
      font-family: IRANSans;
      font-size: 11px;
      font-weight: bold;
    }
  }
}

.pc {
  box-shadow: none;
  color: #000;
  background: transparent;
  max-width: 750px;
  margin-top: 5em;
  top: 0;
  padding: 0 20px;

  span {
    font-size: 14px;
  }

  i {
    font-size: 25px !important;
  }
}
</style>

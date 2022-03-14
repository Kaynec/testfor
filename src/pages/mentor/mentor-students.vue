<template>
  <MentorDesktopHeader v-if="!isMobile()" />
  <div
    class="
      show-dialog
      flex-column
      d-flex
      justify-content-center
      align-items-center
    "
    v-if="showDialog"
  >
    <div
      class="
        d-inline-flex
        flex-child flex-column
        justify-content-between
        align-items-center
        w-100
      "
    >
      <div
        style="
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        "
        class="
          d-inline-flex
          flex-column
          justify-content-center
          align-items-center
          w-100
        "
      >
        <MentorDialog
          componentName="MentorChat"
          label="گفتگو با کاربر"
          :params="currentStudent._id"
        />
        <MentorDialog
          componentName="Azmoon"
          label="آزمون های کاربر"
          :params="currentStudent._id"
        />
      </div>

      <!-- Img Icon -->
      <img
        src="../../assets/img/icons-raw-close.png"
        class="x-icon"
        @click="showDialog = false"
        alt="close icon"
      />
      <!--  -->
    </div>
  </div>

  <!-- Spinner -->
  <div class="loader-parent" v-if="isLoading">
    <div class="loading1"></div>
  </div>

  <div
    class="list"
    v-else
    :style="`padding-top : ${!isMobile() ? '3rem' : ''}`"
  >
    <MinimalHeader title="لیست کاربران" />
    <div class="container">
      <div
        class="Card animate__animated animate__fadeIn"
        @click="changeShowDialog(item)"
        v-for="item in data"
        :key="item._id"
      >
        <div class="img">
          <img :src="item.img" class="animate__animated animate__fadeIn" />
        </div>
        <div class="label">
          <h3>{{ item.firstname }} {{ item.lastname }}</h3>
          <h5>{{ item.grade.title }} {{ item.field.title }}</h5>
        </div>
        <i
          class="
            fas
            fa-angle-left
            position-absolute
            top-50
            start-0
            translate-middle
            ml-3
          "
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';
import { baseUrl } from '@/api/apiclient';
import MentorDialog from '@/modules/mentor-main/mentor-dialog.vue';
import { store } from '@/store';
import { MentorMutationTypes } from '@/store/modules/mentor/mutation-types';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';

export default defineComponent({
  components: { MinimalHeader, MentorDialog, MentorDesktopHeader },
  setup() {
    const isLoading = ref(true);
    const currentStudent = ref();
    const showDialog = ref(false);
    const data = ref();

    (async () => {
      const res = await MentorAuthServiceApi.getMentorStudents();
      data.value = res.data.data;
      data.value.forEach((student) => {
        let imageUrl;
        if (student.profileImage) {
          imageUrl = `${baseUrl}mentor/getProfileImage/${student.profileImage}`;
        } else {
          imageUrl =
            'data:image/png;base64,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';
        }

        student.img = imageUrl;
      });
      isLoading.value = false;
    })();

    const changeShowDialog = (item) => {
      currentStudent.value = item;
      store.commit(MentorMutationTypes.SET_CURRENT_STUDENT_CHAT, item);
      showDialog.value = true;
    };

    return { data, isLoading, showDialog, currentStudent, changeShowDialog };
  }
});
</script>

<style lang="scss" scoped>
.list {
  max-width: 750px;
  font-family: IRANSans;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .container {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(7rem, 10rem);
    grid-gap: 0.5rem;
    width: 98%;
    margin: 0 auto;
    height: 100%;
    max-height: 96%; //change here
    overflow: auto;
    /* width */
    &::-webkit-scrollbar {
      width: 10px;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }

    .Card {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      border-radius: 10px;
      position: relative;
      background-color: #fff;
      padding: 1rem;
      transition: 0.3s ease-in-out;

      &:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.411);
      }

      .img {
        margin-left: 1rem;
        flex-basis: 15%;

        img {
          width: 100%;
          border-radius: 25%;
        }
      }

      .label {
        align-self: center;
        flex-grow: 1;
        h3 {
          font-size: 1rem;
          font-weight: bold;
        }

        h5 {
          font-size: 0.83rem;
        }
      }
    }
  }
}

.show-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 9999;
}
.x-icon {
  padding: 4px;
  background: white;
  border-radius: 45%;
  display: block;
  position: fixed;
  margin-bottom: 7vh;
  margin-top: 3rem;
  bottom: 0;
  overflow: hidden;
}

.flex-child {
  width: 100%;
  max-width: 750px;
  z-index: 9999;
  overflow: hidden;
}
</style>

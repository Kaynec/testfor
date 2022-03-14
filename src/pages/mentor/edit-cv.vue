<template>
  <MentorDesktopHeader v-if="!isMobile()" />
  <div
    :class="`${isMobile() ? 'edit' : 'edit-pc'}`"
    :style="`padding-top : ${!isMobile() ? '3rem' : ''}`"
  >
    <MinimalHeader onePageBack="MentorProfile" title="رزومه" />
    <div class="wrapper animate__animated animate__fadeIn">
      <img :src="imageUrl" class="hero" v-if="isMobile()" />

      <div v-else class="img-btn">
        <img :src="imageUrl" />
        <button @click="submitCV()">ویرایش رزومه</button>
      </div>
      <!-- 
      <div class="textarea"> -->
      <textarea
        @input="v$.resume.$touch()"
        @blur="v$.resume.$touch()"
        v-model="model.resume"
      >
      </textarea>

      <p
        v-for="error in v$.resume.$errors"
        :key="error.id"
        style="margin: 1rem 0"
      >
        {{ error.$message }}
      </p>
      <button v-if="isMobile()" @click="submitCV()">ویرایش رزومه</button>
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, onUpdated } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { store } from '@/store';
import { helpers, minLength, required } from '@vuelidate/validators';
import { baseUrl } from '@/api/apiclient';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';

import router from '@/router';
import alertify from '@/assets/alertifyjs/alertify';
import { MentorActionTypes } from '@/store/modules/mentor/action-types';

export default defineComponent({
  // MentorDesktopHeader
  components: { MinimalHeader, MentorDesktopHeader },
  setup() {
    const model = reactive({
      resume: store.getters.getCurrentMentor.resume
    }) as any;

    let imageUrl =
      'https://images.vexels.com/media/users/3/129616/isolated/preview/fb517f8913bd99cd48ef00facb4a67c0-businessman-avatar-silhouette-by-vexels.png';
    if (
      store.getters.getCurrentMentor &&
      store.getters.getCurrentMentor.profileImage
    ) {
      imageUrl = `${baseUrl}mentor/getProfileImage/${store.getters.getCurrentMentor.profileImage}`;
    }

    onUpdated(() => {
      const el = document.querySelector('textarea')! as any;

      if (el) {
        el.height = el.scrollHeight + 'px';
      }
    });

    const rules = computed(() => ({
      resume: {
        required: helpers.withMessage('لطفا رزومه خود را وارد کنید', required),
        minLength: helpers.withMessage(
          'رزومه باید حداقل 10 حرف باشد',
          minLength(10)
        )
      }
    }));

    const submitCV = async () => {
      v$.value.$touch();

      if (!v$.value.$invalid) {
        const res = await MentorAuthServiceApi.editCv({
          resume: model.resume
        });

        if (res.data.data) {
          alertify.notify('رزومه شما با موفقیت ویرایش شد');
          router.push({ name: 'MentorProfile' });
          store.dispatch(MentorActionTypes.CURRENT_MENTOR);
        } else {
          alertify.error(
            'خطایی در فرآیند ویرایش رخ داد! لطفا دوباره امتحان کنید'
          );
          router.push({ name: 'MentorProfile' });
        }
      }
    };

    const v$ = useVuelidate(rules, model);

    return { v$, model, imageUrl, submitCV };
  }
});
</script>

<style lang="scss" scoped>
.edit {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .wrapper {
    overflow: scroll;
    width: 100%;
    height: 100%;
    max-height: 96%;
    padding-bottom: 3rem;

    textarea {
      width: 100%;
      height: 100%;
      max-height: 48vh;
    }
  }

  .hero {
    width: 100%;
    max-height: 30vh;
    margin: 0 auto;
    object-fit: cover;
  }
}

p {
  color: red;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
  margin-right: 1rem;
}

textarea {
  resize: none;
  border: 1px solid #e1bdba;
  border-radius: 20px;
  color: #646464;
  background: #fff;
  padding: 1rem;
}

button {
  background-color: red;
  color: #fff;
  border-radius: 10px;
  width: 90%;
  padding: 1rem 0;
  border: none;
  margin: 1rem auto 0;
  display: block;
}

.edit-pc {
  max-width: 750px;
  height: 100%;
  overflow: hidden;

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .img-btn {
      width: 48%;
      margin: 0 1rem;

      img {
        width: 100%;
        object-fit: contain;
      }

      button {
        width: 100%;
      }
    }

    textarea {
      width: 100%;
      height: 100%;
      max-height: 650px;
      padding: 1rem;
    }
  }
}
</style>

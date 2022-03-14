<template>
  <!-- Header -->
  <div class="class-note">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <MinimalHeader title="یادداشت ها " onePageBack="SelfTest" />
    <p
      v-if="store.getters.getCurrentStudent.note"
      class="currentNote animate__animated animate__fadeIn"
    >
      {{ store.getters.getCurrentStudent?.note?.trim() }}
    </p>
    <!-- Save Section -->
    <div class="save">
      <!-- Change This TO Real Data Later -->
      <span class="time" v-if="day && month && year && hour">
        آخرین تغییرات {{ day }} {{ month }} {{ year }} ساعت {{ hour }}
      </span>
      <span class="save-text" @click="updateNote"> ذخیره </span>
    </div>
    <!-- Text Area  -->
    <div class="textarea">
      <textarea v-model="noteText" placeholder="شروع به نوشتن کنید…"></textarea>
    </div>
    <!--  -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { store } from '@/store';
import router from '@/router';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { StudentActionTypes } from '@/store/modules/student/action-types';
import alertify from '@/assets/alertifyjs/alertify';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';

export default defineComponent({
  components: { MinimalHeader, DesktopMinimalHeader },
  setup() {
    store.dispatch(StudentActionTypes.CURRENT_STUDENT);

    const noteText = ref('');

    const goOnePageBack = () =>
      router.push({
        name: 'SelfTest'
      });

    let date;

    if (store.getters.getCurrentStudent?.noteUpdateAt) {
      date = new Intl.DateTimeFormat('fa', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric'
      }).format(new Date(store.getters.getCurrentStudent?.noteUpdateAt));
    }

    const day = date?.split(' ')[0];

    const month = date?.split(' ')[1];

    const year = date?.split(' ')[2];

    const hour = date?.split(' ')[3];

    const updateNote = async () => {
      const res = await StudentAuthServiceApi.updateNote({
        note: noteText.value
      });
      if (res.data) {
        const res = await store.dispatch(StudentActionTypes.CURRENT_STUDENT);
        if (res) {
          alertify.success('یادداشت شما با موفقیت ویرایش شد');
          router.push({
            name: 'SelfTest'
          });
        }
      }
    };

    return {
      goOnePageBack,
      store,
      day,
      hour,
      year,
      month,
      noteText,
      updateNote
    };
  }
});
</script>

<style lang="scss" scoped>
.class-note {
  width: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: IRANSans;
  max-width: 750px;

  .currentNote {
    padding: 0.9rem;
    font-size: 0.88rem;
  }

  .save {
    width: 100%;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    font-family: IRANSans;

    .time {
      font-size: 11px;
      color: #979797;
    }

    .save-text {
      font-size: 13px;
      line-height: 1.08;
      color: #4ac367;
      transition: 0.3s all;

      &:hover {
        cursor: pointer;
      }
    }
  }
  .textarea {
    width: 100%;
    flex-grow: 1;
    overflow: auto;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    textarea {
      border: none;
      outline: none;
      flex-grow: 1;
      background: transparent;
      resize: none;
      padding: 1.25rem 1.25rem 0 0;
      font-family: IRANSans;
      width: 100%;
      font-size: 14px;
      text-align: right;
      color: #313131;
    }
  }
}
</style>

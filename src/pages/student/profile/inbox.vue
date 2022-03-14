<template>
  <DesktopMinimalHeader v-if="!isMobile()" />
  <div class="inbox">
    <MinimalHeader goOnePageBack="MyProfile" title="پیام های دریافتی " />
    <!-- Container -->
    <div class="container">
      <div
        class="card animate__animatad animate__fadeIn"
        v-for="item in data"
        :key="item"
        @click="changeShowMessage(item)"
      >
        <span class="label"> {{ item.title }} </span>
        <img
          src="@/assets/img/shape.svg"
          class="position-absolute top-50 start-0 translate-middle ml-3"
          alt="angle left icon"
        />
        <div class="inner-child">
          <p class="clock">
            -*
            <span>
              <i class="far fa-clock"></i>
              {{ item.right }}
              <strong> | </strong>
              <span> ساعت {{ item.left }}</span>
            </span>
          </p>
          <!-- <p :class="item.isRead ? 'status' : 'status active'">
            {{ item.isRead ? 'خوانده نشده' : 'خوانده شده' }}
          </p> -->
        </div>
      </div>
    </div>
    <!-- Show Message Info -->
    <Message
      v-if="showMessage"
      @convertBoolean="changeShowMessage"
      :data="currentItem"
    />
  </div>
</template>

<script lang="ts">
import Message from '@/modules/student-modules/message/profile-message.vue';
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { defineComponent, ref } from 'vue';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';
import { compareAsc } from 'date-fns';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { add } from 'date-fns';

export default defineComponent({
  components: { Message, MinimalHeader, DesktopMinimalHeader },
  setup() {
    const showMessage = ref(false);
    // We Change This objects Information with the pressed div
    const currentItem = ref({});

    const goOnePageBack = () => router.go(-1);

    const changeShowMessage = (itemToBeShownUsingComponent = {}) => {
      showMessage.value = !showMessage.value;
      currentItem.value = itemToBeShownUsingComponent;
    };

    const data = ref([]) as any;
    // One Week Ago

    const oneWeekAgo = add(new Date(), {
      days: -7
    });

    (async () => {
      const res = await StudentAuthServiceApi.announcements();
      data.value = res.data.data;

      data.value.forEach((element) => {
        const iranDate = new Date(element.createdAt);
        const compareDate = compareAsc(iranDate, oneWeekAgo);
        (element.right = ''), (element.left = '');
        if (compareDate > 0) {
          element.right = `${iranDate.toLocaleDateString('fa-Fa', {
            weekday: 'long'
          })}
              ${iranDate.toLocaleDateString('fa-Fa', {
                day: 'numeric'
              })}
               ${iranDate.toLocaleDateString('fa-Fa', {
                 month: 'long'
               })}
              `;

          element.left = iranDate.toLocaleDateString('fa-Fa', {
            hour: 'numeric'
          });
        }
        //
        else if (compareDate < 0) {
          element.right = iranDate.toLocaleDateString('fa-Fa', {
            weekday: 'long'
          });

          element.left = iranDate.toLocaleDateString('fa-Fa', {
            hour: 'numeric'
          });
        }
        element.left = element.left.split(' ')[1];
      });
    })();

    return {
      goOnePageBack,
      data,
      changeShowMessage,
      showMessage,
      currentItem
    };
  }
});
</script>

<style lang="scss" scoped>
.inbox {
  width: 100%;
  height: 100%;
  // position: relative;
  max-width: 750px;
  // padding-top: 8vh;
  .container {
    width: 95%;
    // margin: 1.5rem auto;

    .card {
      padding: 0.5rem 1rem;
      padding-bottom: 0;
      border-radius: 15px;
      border: 3px solid #fff;

      .label {
        font-size: 12px;
        font-weight: bold;
        text-align: right;
        color: #171717;
      }

      .inner-child {
        display: flex;
        justify-content: space-between;
        margin-top: 1rem;

        .clock {
          font-size: 12px;
          letter-spacing: -1.1px;
          text-align: right;
          color: #979797;
        }
        .status {
          margin-left: 15%;
          font-size: 12px;
          letter-spacing: -1.1px;
          color: #979797;
        }
        .active {
          font-size: 12px;
          font-weight: bold;
          letter-spacing: -1.1px;
          color: #4ac367;
        }
      }
    }
  }
}
</style>

<template>
  <MentorDesktopHeader v-if="!isMobile()" />
  <div class="inbox" :style="`padding-top : ${!isMobile() ? '3rem' : ''}`">
    <MinimalHeader title="مشاهده درخواست ها" onePageBack="MentorProfile" />
    <!-- Container -->
    <div class="container">
      <div
        class="card animate__animated animate__fadeIn"
        v-for="item in data"
        :key="item"
        @click="changeShowMessage(item)"
      >
        <span class="label"> {{ item.firstname }} {{ item.lastname }} </span>
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
          <p :class="getClass(item)">
            {{ getText(item) }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="
        showMessage
        flex-column
        d-flex
        justify-content-end
        align-items-center
      "
      v-if="showMessage"
    >
      <div
        style="color: #fff; max-width: 600px"
        class="
          d-inline-flex
          flex-column
          justify-content-between
          align-items-center
          flex-child
        "
      >
        <div
          style="color: #fff; max-width: 600px"
          class="
            d-inline-flex
            flex-column
            justify-content-center
            align-items-center
          "
        >
          <AcceptRequest :data="currentItem" @convertBoolean="denyOrAccept" />
        </div>

        <img
          src="@/assets/img/icons-raw-close.png"
          class="x-icon"
          @click="showMessage = false"
        />
      </div>
    </div>

    <!-- Show Message Info -->
  </div>
</template>

<script lang="ts">
import router from '@/router';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { defineComponent, ref } from 'vue';
import { compareAsc } from 'date-fns';
import { add } from 'date-fns';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';
import AcceptRequest from '@/modules/mentor-main/accept-request.vue';
import alertify from '@/assets/alertifyjs/alertify';
import MentorDesktopHeader from '@/modules/mentor-main/mentor-header.vue';

export default defineComponent({
  components: { MinimalHeader, AcceptRequest, MentorDesktopHeader },
  setup() {
    const showMessage = ref(false);
    // We Change This objects Information with the pressed div
    const currentItem = ref({}) as any;

    const goOnePageBack = () =>
      router.push({
        name: 'MentorProfile'
      });

    const changeShowMessage = (itemToBeShownUsingComponent = {}) => {
      showMessage.value = !showMessage.value;
      currentItem.value = itemToBeShownUsingComponent;
    };

    const data = ref([]) as any;
    // One Week Ago

    const oneWeekAgo = add(new Date(), {
      days: -7
    });

    const denyOrAccept = async (item) => {
      const id = currentItem.value._id;

      const res = await MentorAuthServiceApi.changeRequestStatus({
        studentId: id,
        status: item
      });

      if (res.data) {
        alertify.success('درخواست شما با موفقیت انجام شد');
        showMessage.value = false;
        const resp = await MentorAuthServiceApi.requestsList();
        data.value = resp.data.data;
      }
    };

    (async () => {
      const res = await MentorAuthServiceApi.requestsList();
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

    const getClass = (item) => {
      if (item.status === 'accept') {
        return 'status active';
      } else if (item.status === 'pending') {
        return 'status pending';
      } else {
        return 'status reject';
      }
    };

    const getText = (item) => {
      if (item.status === 'accept') {
        return 'قبول شده';
      } else if (item.status === 'pending') {
        return 'درحال انتظار';
      } else {
        return 'رد شده';
      }
    };

    return {
      goOnePageBack,
      data,
      changeShowMessage,
      showMessage,
      currentItem,
      denyOrAccept,
      getClass,
      getText
    };
  }
});
</script>

<style lang="scss" scoped>
.inbox {
  width: 100%;
  height: 100%;
  font-family: IRANSans;
  position: relative;
  max-width: 750px;
  .container {
    width: 95%;
    margin: 1.5rem auto;

    .card {
      width: 100%;
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
        }
        .active {
          font-size: 12px;
          font-weight: bold;
          letter-spacing: -1.1px;
          color: #4ac367;
        }
        .pending {
          color: #979797;
        }
        .reject {
          color: rgb(122, 8, 8);
        }
      }
    }
  }
}

.showMessage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  background-repeat: no-repeat;
  background-attachment: fixed;
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
}

.flex-child {
  min-height: 60vh;
  max-height: 90%;
  overflow: hidden;
}
</style>

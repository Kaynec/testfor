<template>
  <main v-if="!isMobile()" class="contact-us-pc">
    <!--  -->
    <div class="contact-us-card animate__animated animate__fadeIn">
      <img
        src="@/assets/img/contact-us.png"
        alt="contact us img"
        class="hero"
      />

      <div class="first-section">
        <h6>تلفن های تماس</h6>
        <p>
          شما می‌توانید برای دریافت اطلاعات بیشتر با ما تماس بگیرید. کارشناسان
          ما با شما همراه خواهند بود تا مراحل لازم را به راحتی هر چه طی کنید...
        </p>
        <div class="flex">
          <h6>کارشناسی ارشد و دکتری</h6>
          <h6 class="green">۰۲۱-۸۸۴۸۲۱۲۷ ۰۲۱-۸۵۰۶</h6>
        </div>
        <div class="flex">
          <h6>دفتر انقلاب:</h6>
          <h6 class="green">۰۲۱-۶۶۴۷۷۴۲۴</h6>
        </div>
      </div>
      <div class="second-section">
        <h6>آدرس های دفتر</h6>
        <p>
          تهران، تقاطع ولیعصر - مطهری، پشت ایستگاه بی آر تی مطهری ، پلاک 2050
          دفتر انقلاب :ضلع جنوب شرقی میدان انقلاب ، جنب قنادی سینا ، پلاک ۵ طبقه
          دوم واحد ۵ موسسه ماهان
        </p>
        <h6>ایمیل و سایت ماهان</h6>
        <a href="info@mahan.ac.ir" target="_blank"> info@mahan.ac.ir </a>
        <a href="www.mahan.ac.ir" target="_blank"> www.mahan.ac.ir </a>
      </div>
    </div>

    <!--  -->
    <span @click="goOnepageBack()">
      برگشت

      <i class="fa fa-angle-right" aria-hidden="true"></i
    ></span>
    <!--  -->
  </main>

  <div class="contact-us" v-else>
    <SmallHeader />
    <img
      src="@/assets/img/contact-us.png"
      alt="contact us img"
      class="hero animate__animatd animate__fadeIn"
    />
    <div class="contact-us-card animate__animated animate__fadeIn">
      <div class="first-section">
        <h6>تلفن های تماس</h6>
        <p>
          شما می‌توانید برای دریافت اطلاعات بیشتر با ما تماس بگیرید. کارشناسان
          ما با شما همراه خواهند بود تا مراحل لازم را به راحتی هر چه طی کنید...
        </p>
        <div class="flex">
          <h6>کارشناسی ارشد و دکتری</h6>
          <h6 class="green">۰۲۱-۸۸۴۸۲۱۲۷ ۰۲۱-۸۵۰۶</h6>
        </div>
        <div class="flex">
          <h6>دفتر انقلاب:</h6>
          <h6 class="green">۰۲۱-۶۶۴۷۷۴۲۴</h6>
        </div>
      </div>
      <div class="second-section">
        <h6>آدرس های دفتر</h6>
        <p>
          تهران، تقاطع ولیعصر - مطهری، پشت ایستگاه بی آر تی مطهری ، پلاک 2050
          دفتر انقلاب :ضلع جنوب شرقی میدان انقلاب ، جنب قنادی سینا ، پلاک ۵ طبقه
          دوم واحد ۵ موسسه ماهان
        </p>
        <h6>ایمیل و سایت ماهان</h6>
        <a href="info@mahan.ac.ir" target="_blank"> info@mahan.ac.ir </a>
        <a href="www.mahan.ac.ir" target="_blank"> www.mahan.ac.ir </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SmallHeader from '@/modules/student-modules/header/small-header.vue';

import router from '@/router';

export default defineComponent({
  components: {
    SmallHeader
  },
  setup() {
    const goOnepageBack = () => {
      router.go(-1);
    };

    return { goOnepageBack };
  }
});
</script>

<style lang="scss" scoped>
.contact-us,
.pc {
  width: 100%;
  background-color: #f4f4f4;
  height: 100%;
  position: relative;

  .contact-us-card {
    margin: 15px 15px 0;
    box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
    h6 {
      font-weight: bold;
      font-family: IRANSans;
      font-size: 11px;
      color: #000;
    }
    p {
      font-size: 10px;
      text-align: right;
      color: #4a4f54;
    }

    .first-section {
      display: block;
      width: 100%;
      font-family: IRANSans;
      color: #000;
      background-color: #fff;
      margin-bottom: 0.3rem;
      padding: 10px 15px 49px 15px;
      border-radius: 16.7px;

      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .second-section {
      background-color: #fff;
      padding: 10px 15px 49px 15px;
      border-radius: 16.7px;

      h6 {
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1rem;
      }

      a {
        display: block;
        font-family: Roboto;
        font-size: 11.4px;
        letter-spacing: 0.66px;
        text-align: right;
        color: #007bff;
      }
    }
  }

  .hero {
    width: 100%;
    max-height: 35vh;
    object-fit: contain;
  }
}

.contact-us-pc {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #0e0505c5;
  z-index: 9999999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 8vh;

  span {
    display: inline-block;
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

  .contact-us-card {
    width: clamp(450px, 40vw, 850px);

    background: #fff;
    border-radius: 15px;

    .first-section {
      display: block;
      width: 100%;
      font-family: IRANSans;
      color: #000;
      background-color: #fff;
      margin-bottom: 0.3rem;
      padding: 10px 15px 49px 15px;
      border-radius: 16.7px;

      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .second-section {
      background-color: #fff;
      padding: 10px 15px 49px 15px;
      border-radius: 16.7px;

      h6 {
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 1rem;
      }

      a {
        display: block;
        font-family: Roboto;
        font-size: 13px;
        letter-spacing: 0.66px;
        text-align: right;
        color: #007bff;
      }
    }

    .hero {
      width: 100%;
      max-height: 35vh;
      object-fit: cover;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      display: block;

      .contact-us-card {
        width: 100%;
      }
    }
  }
}

.green {
  color: #4ac367;
}
</style>

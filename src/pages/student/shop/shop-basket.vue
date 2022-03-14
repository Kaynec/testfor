<template>
  <!-- <div class="desktop" v-if="!isMobile()"></div> -->
  <div class="shop-basket" v-if="isMobile()">
    <MinimalHeader title="سبد خرید شما" />

    <div class="error" v-if="basketItems.length < 0">
      <img src="@/assets/img/error.png" alt="error" />
      <h4>سبد خرید شما خالی است</h4>
    </div>

    <div class="container animate__animated animate__fadeIn">
      <!-- Change The Data -->
      <div class="text-flex">
        <span> شماره سفارش: {{ toPersianNumbers(`${purchaseId}`) }} </span>
        <span> {{ faDate }} </span>
      </div>

      <div class="basket-card" v-for="item in basketItems" :key="item._id">
        <div class="right">
          <img :src="item.img" alt="product img" />
          <div class="label">
            <span>
              {{
                `${item.product.title} ${
                  +item.quantity > 1 ? `تعداد (${item.quantity})` : ''
                }`
              }}
            </span>
            <span @click="removeItem(item)" style="display: block" class="red"
              >حذف محصول</span
            >
          </div>
        </div>
        <div class="left">
          <p v-if="item.product.specialPrice">
            {{ toPersianNumbers(`${item.product.specialPrice}`) }} تومان
          </p>
          <p :class="`${item.product.specialPrice ? 'red line-through' : ''}`">
            {{ toPersianNumbers(`${item.product.price}`) }} تومان
          </p>
        </div>
      </div>
      <!--  -->
      <div class="price">
        <div class="text">
          <p>هزینه سبد شما</p>
          <p>تخفیف</p>
        </div>
        <div class="number">
          <p>{{ toPersianNumbers(`${allPrice}`) }} تومان</p>
          <p>{{ toPersianNumbers(`${discount}`) }} تومان</p>
        </div>
      </div>
      <!--  -->
      <div class="paid-price">
        <span> مبلغ پرداختی شما </span>
        <span> {{ toPersianNumbers(paidPrice) }} تومان </span>
      </div>

      <!--  -->
      <div class="payment" ref="payment">
        <ChapterList
          :text="`پرداخت از امتیازات کسب شده : ${point}`"
          :chapterContainer="payment"
        />
        <ChapterList
          text="پرداخت از طریق درگاه بانکی"
          :chapterContainer="payment"
        />
      </div>
      <!-- Btn  -->
      <div class="continue" @touchstart="submitOrder">
        <i class="fas fa-arrow-right"></i>
        <span> ثبت و پرداخت نهایی </span>
      </div>
    </div>
  </div>

  <!--  -->
  <div class="shop-basket pc" v-if="!isMobile()">
    <DesktopMinimalHeader v-if="!isMobile()" />

    <div class="error" v-if="basketItems.length < 0">
      <img src="@/assets/img/error.png" alt="error img" />
      <h4>سبد خرید شما خالی است</h4>
    </div>

    <!--  -->

    <div class="container">
      <h1>سبد خرید شما</h1>
      <!-- Change The Data -->
      <section class="first">
        <div class="text-flex">
          <span> شماره سفارش: {{ toPersianNumbers(`${purchaseId}`) }} </span>
          <span> {{ faDate }} </span>
        </div>

        <div class="basket-card" v-for="item in basketItems" :key="item._id">
          <div class="right">
            <img :src="item.img" alt="product img" />
            <div class="label" style="margin-right: 0.5rem">
              {{
                `${item.product.title} ${
                  +item.quantity > 1 ? `تعداد (${item.quantity})` : ''
                }`
              }}
              <span @click="removeItem(item)" style="display: block" class="red"
                >حذف محصول</span
              >
            </div>
          </div>
          <div class="left">
            <p v-if="item.product.specialPrice">
              {{ toPersianNumbers(`${item.product.specialPrice}`) }}
              تومان
            </p>
            <p
              :class="`${item.product.specialPrice ? 'red line-through' : ''}`"
            >
              {{ toPersianNumbers(`${item.product.price}`) }} تومان
            </p>
          </div>
        </div>
        <!--  -->
      </section>
      <!--  -->
      <section class="price-container">
        <div class="price">
          <div class="text">
            <p>هزینه سبد شما</p>
            <p>تخفیف</p>
          </div>
          <div class="number">
            <p>{{ toPersianNumbers(`${allPrice}`) }} تومان</p>
            <p>{{ toPersianNumbers(`${discount}`) }} تومان</p>
          </div>
          <!--  -->
        </div>

        <div class="paid-price">
          <span> مبلغ پرداختی شما </span>
          <span> {{ toPersianNumbers(paidPrice) }} تومان </span>
        </div>
      </section>

      <div class="payment" ref="payment">
        <ChapterList
          :text="`پرداخت از امتیازات کسب شده : ${point}`"
          :chapterContainer="payment"
        />
        <ChapterList
          text="پرداخت از طریق درگاه بانکی"
          :chapterContainer="payment"
        />
      </div>
      <div class="continue" @touchstart="submitOrder">
        <i class="fas fa-arrow-right"></i>
        <span> ثبت و پرداخت نهایی </span>
      </div>
      <span class="back" @click="goOnepageBack()">
        برگشت

        <i class="fa fa-angle-right" aria-hidden="true"></i
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import ChapterList from '@/modules/student-modules/chapter-list.vue';
import router from '@/router';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import { store } from '@/store';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { baseUrl } from '@/api/apiclient';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';

export default defineComponent({
  components: {
    ChapterList,
    MinimalHeader,
    DesktopMinimalHeader
  },
  setup() {
    const date = new Date();
    const faDate = new Intl.DateTimeFormat('fa', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);

    const point = ref(store.getters.getCurrentStudent.point);
    const allPrice = ref(0);
    const allSpecialPrice = ref(0);
    const basketItems = ref([]) as any;
    const purchaseId = ref(0);

    (async () => {
      const resPromise = await fetch(`${baseUrl}shopping-cart/get`, {
        method: 'GET',
        headers: {
          token: store.getters.getStudentToken
        }
      });
      const res = await resPromise.json();

      const imgPromises = [] as any;

      purchaseId.value = res.data.data._id;
      res.data.data.items.forEach((item) => {
        const imageUrl = `${baseUrl}product/coverImage/${item.product._id}`;
        imgPromises.push(returnAProtectedUrl(imageUrl));
        if (item.product != null) {
          allPrice.value += item.product.price * item.quantity;
          allSpecialPrice.value += item.product.specialPrice * item.quantity;

          basketItems.value.push(item);
        }
      });

      Promise.all(imgPromises).then((imgs) => {
        imgs.forEach((img, idx) => {
          basketItems.value[idx].img = img;
        });
      });
    })();

    const payment = ref();

    const paidPrice = computed(() => {
      console.log(basketItems.value);
      let discountedPrice = discount.value;

      return allPrice.value - discountedPrice;
    });

    const discount = computed(() => {
      return basketItems.value.reduce((acc, item: any) => {
        let discount =
          (item.product.price - item.product.specialPrice) * item.quantity;
        acc += discount;
        return acc;
      }, 0);
    });

    const goOnePageBack = () => router.go(-1);

    const submitOrder = () => {
      StudentBasketApi.finalizeOrder().then((res) => {
        if (res.data || res.data.status == 0) {
          router.push({ name: 'ShopAddress' });
        }
      });
    };
    const removeItem = async (item) => {
      const tmpObject = {
        item: {
          product: { _id: item.product._id },
          quantity: -Math.abs(item.quantity)
        }
      };

      const res = await StudentBasketApi.add(tmpObject);

      if (res.data) {
        (basketItems.value = []), (allPrice.value = 0);
        store.commit(
          StudentMutationTypes.SET_BASKET_COUNT,
          store.getters.getBasketCount - item.quantity
        );
        const response = await StudentBasketApi.get();

        // Reset The data And fill Again

        allSpecialPrice.value = 0;

        response.data.data.items.forEach((item) => {
          if (!item.product) return;

          allPrice.value += item.product.price;

          basketItems.value.push(item);

          if (item.product.specialPrice)
            allSpecialPrice.value += item.product.specialPrice;
        });

        const imgPromises = [] as any;

        basketItems.value.forEach((item: any) => {
          const imageUrl = `${baseUrl}product/coverImage/${item.product._id}`;
          imgPromises.push(returnAProtectedUrl(imageUrl));
        });

        Promise.all(imgPromises).then((imgs) => {
          imgs.forEach((img, idx) => {
            basketItems.value[idx].img = img;
          });
        });
      }
    };

    const goOnepageBack = () => {
      router.go(-1);
    };

    (async () => {
      const res = await StudentBasketApi.get();
      let quantity = 0;

      res.data.data.items.forEach((item) => {
        quantity += item.quantity;
      });

      store.commit(StudentMutationTypes.SET_BASKET_COUNT, quantity);
    })();

    return {
      goOnePageBack,
      payment,
      submitOrder,
      toPersianNumbers,
      point,
      faDate,
      store,
      basketItems,
      allPrice,
      allSpecialPrice,
      paidPrice,
      discount,
      removeItem,
      purchaseId,
      goOnepageBack
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop-basket {
  position: relative;
  overflow: auto;
  background: #f4f4f4;
  font-family: IRANSans;
  width: 100%;
  height: 100%;

  .error {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    transform: translateY(30%);
    img {
      width: 18rem;
      max-width: 450px;
    }
    h4 {
      margin-top: 0.5rem;
      font-size: 1.2rem;
    }
  }

  .container {
    width: 95%;
    margin: 1rem auto;
    border-radius: 15px;
    background: #fff;
    padding: 0.7rem;

    .text-flex {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 0.25rem;
      border-bottom: solid 0.9px #eee;

      span {
        font-size: 12px;
        line-height: 1.67;
        color: #646464;
      }
    }

    .basket-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      border-bottom: solid 0.9px #eee;

      padding: 0.8rem 0.25rem;

      .right {
        display: flex;
        align-items: center;
        flex-basis: 65%;

        img {
          width: 20%;
        }
        span {
          font-size: 11.8px;
          color: #171717;
          display: inline-flex;
          margin: 0.6rem 0.2rem;
        }
      }
      .left {
        flex-basis: 35%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        margin-top: 0.8rem;

        p {
          font-size: 10.9px;
          font-weight: bold;
          color: #171717;
        }
      }
    }
    //
    .price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 0.9px #eee;
      padding: 0.8rem 0.25rem;

      p {
        margin: 0 0;
      }

      .text {
        font-size: 12px;
        line-height: 2.5;
        text-align: right;
        color: #313131;
      }

      .number {
        font-size: 12px;
        font-weight: bold;
        line-height: 2.5;
        color: #000;
        text-align: left;
      }
    }
    //
    .paid-price {
      display: flex;
      align-items: center;
      justify-content: space-between;

      border-bottom: solid 0.9px #eee;
      padding: 0.8rem 0.25rem;
      color: #4ac367;
      font-size: 13px;
      font-weight: bold;
    }
  }
  //
  .payment {
    width: 100%;
    margin: 1rem auto;
    border-bottom: solid 0.9px #eee;
    //   The CapterList Component
    .chapter {
      width: 100%;
      margin-bottom: 0.5rem;
      box-shadow: none;
      border: 2px solid white;
    }
  }
  //
  .continue {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 15px;
    background-image: $redish-background;
    width: 100%;
    height: 3.5rem;
    margin: 0 auto;

    i {
      background-color: #d21921;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      padding: 10px;
    }

    span {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      align-self: center;
      width: 50%;
    }
  }
}

.red {
  color: #ed1b24 !important;
  cursor: pointer;
}
.line-through {
  text-decoration: line-through;
}
.red.line-through {
  font-size: 9.1px !important;
}

.pc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.795);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  h1 {
    font-size: 19px;
    font-weight: bold;
    text-align: center;
    color: #fff;
    padding: 0.5rem;
  }

  .container {
    width: 100%;
    max-width: 500px;
    background-color: transparent;
    margin: 1rem 0 0 0;

    .paid-price {
      border-bottom: none;
      padding: 1rem;
    }

    .first {
      background: #fff;
      width: 100%;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      padding: 1rem;
    }
    .price-container {
      background: #fff;
      width: 100%;
      border-bottom-left-radius: 15px;
      border-bottom-right-radius: 15px;
      padding: 1rem;
    }

    .payment {
      border-bottom: none;
    }
  }
}
</style>

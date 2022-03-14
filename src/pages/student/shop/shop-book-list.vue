<template>
  <!-- Spinner -->
  <div class="loader-parent" v-if="JSON.stringify(data) === JSON.stringify({})">
    <div class="loading1"></div>
  </div>
  <!--  -->
  <div class="shop-book-list" v-else>
    <DesktopMinimalHeader v-if="!isMobile()" component="shop" />
    <MinimalHeader
      :title="`لیست محصولات ${title}  ( ${toPersianNumbers(
        title ? data.data.length : ''
      )} )`"
    />
    <main
      class="card-container animate__animated animate__fadeIn"
      v-if="isMobile()"
    >
      <section
        class="card animate__animated animate__fadeIn"
        v-for="product in data.data"
        :key="product"
        @click="openSingleBookPage(JSON.stringify(product))"
      >
        <div class="image-container">
          <div v-if="!product.img" class="loader">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <img
            :src="product.img"
            @click="sendToBookShopList(item._id, item.title)"
            class="animate__animated animate__fadeInDownBig"
            v-else
            alt="product img"
          />
        </div>
        <!--  -->
        <div class="text">
          <!-- <p class="name">{{ product.name || 'کارشناسی ارشد حقوق' }}</p> -->
          <p class="text-detail">
            {{ product.title }}
          </p>
          <p class="price line-t">
            قیمت : {{ toPersianNumbers(product.price) }} تومان
          </p>
          <p class="special-price line-t" v-if="product.specialPrice">
            تخفیف %{{
              toPersianNumbers(
                Math.round(
                  ((product.price - product.specialPrice) / product.price) * 100
                )
              )
            }}
            : {{ toPersianNumbers(product.specialPrice) }} تومان
            <span></span>
          </p>
        </div>
      </section>
    </main>

    <main class="card-container-pc" v-else>
      <section
        class="Card animate__animated animate__fadeIn"
        v-for="product in data.data"
        @click="openSingleBookPage(JSON.stringify(product))"
        :key="product"
      >
        <img
          class="animate__animated animate__fadeIn"
          v-if="product.img"
          :src="product.img"
          style="margin: 0.4rem"
          alt="product img"
        />
        <div class="txts" @click="openSingleBookPage(JSON.stringify(product))">
          <p class="title">{{ product.title }}</p>
          <p class="price">
            قیمت : {{ toPersianNumbers(product.price) }} تومان
          </p>
          <p class="special-price">
            تخفیف %{{
              toPersianNumbers(
                Math.round(
                  ((product.price - product.specialPrice) / product.price) * 100
                )
              )
            }}
            :
            {{ toPersianNumbers(product.specialPrice) }} تومان
          </p>
        </div>

        <div class="plus">
          <img
            src="@/assets/img/shop/pluss.png"
            @click.stop="addToBasket(product)"
            alt="plus"
          />
          <select v-model="product.quantity">
            <option v-for="i in 10" :key="i" :value="i">
              {{ toPersianNumbers(i) }} عدد
            </option>
          </select>
        </div>
      </section>
    </main>

    <section v-if="!data.data.length" class="error">
      <img src="@/assets/img/error.png" alt="error" />
      <h4>هیچ اطلاعاتی برای نمایش ندارید</h4>
    </section>

    <ShopFooter />
  </div>
</template>

<script lang="ts">
// Get All The Books The Relate To This Genre And List It In The Template
import { defineComponent, ref } from 'vue';
import { StudentproductApi } from '@/api/services/student/student-product';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
import router from '@/router';
import ShopFooter from '@/modules/student-modules/footer/shop-footer.vue';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { useRoute } from 'vue-router';
import { baseUrl } from '@/api/apiclient';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import { StudentBasketApi } from '@/api/services/student/student-basket-service';
import { StudentMutationTypes } from '@/store/modules/student/mutation-types';
import { store } from '@/store';
import alertify from '@/assets/alertifyjs/alertify';

export default defineComponent({
  props: { id: { type: String } },
  components: { ShopFooter, MinimalHeader, DesktopMinimalHeader },
  setup() {
    const data = ref({} as any);
    const route = useRoute();
    let title = ref('');

    const openSingleBookPage = (item) => {
      router.push({ name: 'SingleBookInfo', params: { item } });
    };

    const goOnePageBack = () => {
      router.push({
        name: 'studentShop'
      });
    };

    (async () => {
      const getAllProducts = await StudentproductApi.getAllProducts(
        route.params.id
      );
      data.value = getAllProducts.data;

      const imgPromises = [] as any;

      data.value.data.forEach((data) => {
        // Setting The Initial Quantity

        data.quantity = 1;

        const imageUrl = `${baseUrl}product/coverImage/${data._id}`;
        // For Each Data Element Set It's Image to Returned Image from DB
        imgPromises.push(returnAProtectedUrl(imageUrl));
      });

      const promises = await Promise.all(imgPromises);
      promises.forEach((img, idx) => {
        data.value.data[idx].img = img;
      });

      // We Want to Get the Id of the current Category
      const idOfCurrentSubcategory = data.value.data[0].category;
      StudentproductApi.getAllCategories().then((Res) => {
        const find = Res.data.data.find((el) => {
          return el._id == idOfCurrentSubcategory;
        });
        title.value = find.title || '';
      });

      // making a list of promises for images and appending them to their list
    })();

    const addToBasket = (product) => {
      const itemToSend = {
        item: {
          product: { _id: product._id },
          quantity: product.quantity
        }
      };

      StudentBasketApi.add(itemToSend).then((res) => {
        if (res.data) {
          store.commit(
            StudentMutationTypes.SET_BASKET_COUNT,
            store.getters.getBasketCount + product.quantity
          );

          alertify.success('محصول مورد نظر به سبد شما اضافه شد');
        }
      });
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
      data,
      openSingleBookPage,
      goOnePageBack,
      toPersianNumbers,
      title,
      addToBasket
    };
  }
});
</script>

<style lang="scss" scoped>
@import '@/css-variable/Global.scss';
.shop-book-list {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background: #f4f4f4;
  width: 100%;
  height: 100%;
  font-family: IRANSans;
  max-width: 750px;
  .card-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;

    .card {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;

      width: 90%;
      padding: 0.3rem;
      min-height: 8rem;
      border: 1px solid #fff;
      border-radius: 10px;
      box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
      background-color: #fff;

      &:last-child {
        margin-bottom: 4rem;
      }

      .image-container {
        min-width: 30%;
        max-width: 40%;
        display: flex;
        align-items: center;
        justify-items: center;

        img {
          width: 100%;
          object-fit: contain;
        }
      }

      p {
        margin: 10px 10px;
      }

      .name {
        font-size: 10px;
        text-align: right;
        color: #646464;
      }
      .text-detail {
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        color: #171717;
      }

      .price {
        font-size: 12px;
        text-align: right;
        color: #d21921;
        font-weight: bold;
      }
      .special-price {
        font-weight: bold;
      }
    }

    .line-t {
      position: relative;
      display: inline-block;
      font-size: 12.5px;
      color: #ed1b24;
      white-space: nowrap;
      span {
        position: absolute;
        width: 100%;
        border-top: 2px solid red;
        left: 0;
        top: 50%;
        opacity: 0.2;
      }
    }
  }
}

.card-container-pc {
  width: 100%;
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(2, 1fr);

  .Card {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    padding-bottom: 5rem;
    transition: all 0.3 ease;
    background: #fff;

    &:hover {
      cursor: pointer;
      background: rgba(255, 255, 255, 0.404);
    }

    .plus {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: space-between;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #4ac367;
      border-bottom-right-radius: 14.5px;
      border-bottom-left-radius: 14.5px;
      padding: 0 1rem;
      cursor: pointer;

      img {
        width: 50%;
        z-index: 1;
        object-fit: right;
        position: absolute;
        right: 0;
      }

      select {
        z-index: 10;
        background: #313131;
        color: #fff;
        border-radius: 12px;
        margin-right: 65%;
      }
    }

    .txts {
      flex-grow: 1;
      display: grid;
      flex-direction: column;
      align-items: start;
      justify-content: start;
      grid-gap: 0.3rem;

      .title {
        font-size: 15.5px;
        font-weight: bold;
        text-align: right;
        color: #171717;
      }

      .price {
        font-size: 10px;
        text-align: right;
        color: #d21921;
        text-decoration: line-through;
        word-break: normal;
        white-space: nowrap;
      }

      .special-price {
        font-size: 10.5px;
        font-weight: bold;
        color: #ed1b24;
        white-space: nowrap;
      }
    }

    img {
      flex-basis: 25%;
      width: 30%;
    }
  }
}

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
</style>

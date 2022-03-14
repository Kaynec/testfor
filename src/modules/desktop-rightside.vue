<template>
  <div class="container animate__animated animate__fadeIn">
    <div class="wrapper">
      <aside>
        <img
          @click="moveToComponent('Home')"
          src="@/assets/img/logo@2x.png"
          class="header"
          alt="header"
        />
        <div class="cart-container">
          <div class="Cart" @click="moveToComponent('ShopBookList')">
            <img
              src="@/assets/img/home-icons/book.png"
              :class="`${componentname == 'ShopBookList' ? 'active' : ''}`"
              alt="ShopBookList"
            />
          </div>

          <div class="Cart" @click="moveToComponent('ClassRoom')">
            <img
              src="@/assets/img/home-icons/class.png"
              :class="`${componentname == 'ClassRoom' ? 'active' : ''}`"
              alt="class"
            />
          </div>

          <div class="Cart" @click="moveToComponent('ContactBackup')">
            <img
              src="@/assets/img/home-icons/support.png"
              :class="`${componentname == 'ContactBackup' ? 'active' : ''}`"
              alt="backup"
            />
          </div>

          <div class="Cart" @click="moveToComponent('compTest')">
            <img
              src="@/assets/img/home-icons/azmoon.png"
              :class="`${componentname == 'compTest' ? 'active' : ''}`"
              alt="azmoon"
            />
          </div>

          <div class="Cart" @click="moveToComponent('SelfTest')">
            <img
              src="@/assets/img/home-icons/lessons.png"
              :class="`${componentname == 'SelfTest' ? 'active' : ''}`"
              alt="selftest"
            />
          </div>

          <div class="Cart" @click="moveToComponent('Calendar')">
            <img
              src="@/assets/img/home-icons/calendar.png"
              :class="`${componentname == 'Calendar' ? 'active' : ''}`"
              alt="calendar"
            />
          </div>

          <div class="Cart" @click="moveToComponent('StudentGroupPage')">
            <img
              src="@/assets/img/home-icons/group.png"
              :class="`${componentname == 'Duel' ? 'active' : ''}`"
              alt="roadmap"
            />
          </div>

          <div class="Cart" @click="moveToComponent('studentShop')">
            <img
              :class="`${componentname == 'studentShop' ? 'active' : ''}`"
              src="@/assets/img/home-icons/shop.png"
              alt="shop"
            />
          </div>
        </div>
      </aside>
      <img src="@/assets/img/footer-image@2x.png" alt="footer" class="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { StudentproductApi } from '@/api/services/student/student-product';
import router from '@/router';
import { computed, defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { store } from '@/store';

export default defineComponent({
  setup() {
    let id = ref('');
    const route = useRoute();
    const componentname = computed(() => {
      return route.name;
    });

    const moveToComponent = (componentName: string) => {
      StudentproductApi.getAllCategories().then((res) => {
        res.data.data.forEach((category) => {
          if (category.title == 'کتاب') id.value = category._id;
        });
      });
      if (componentName == 'ShopBookList') {
        router.push({ name: componentName, params: { id: id.value } });
        return;
      } else {
        router.push({ name: componentName });
      }
    };

    return { moveToComponent, componentname };
  }
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: IRANSans;
  padding-top: 6vh;
  z-index: 10;

  .wrapper {
    min-width: 18rem;
    max-width: 20rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer {
    max-width: 12rem;
    margin-top: 1rem;
  }
}
aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: white;
  padding: 1rem;
  border-bottom-left-radius: 60px;
  border-bottom-right-radius: 60px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  .header {
    max-width: 20rem;
    object-fit: contain;
    border-bottom: solid 1px #cfcfcf;
    padding: 1rem;
    &:hover {
      cursor: pointer;
      transform: scale(1.05);
    }
  }

  .cart-container {
    width: 100%;
    height: 100%;
    margin: 2rem auto;
    display: grid;
    grid-template-columns: repeat(2, 35%);
    align-content: center;
    justify-content: center;
    grid-gap: 1rem;
    .Cart {
      img {
        max-width: 100%;
        object-fit: cover;
      }
      .active {
        border-radius: 50%;
        border: 2px solid #d21921;
      }
    }

    .Duel {
      background: #efefef;
      border: 1px solid #b1b1b123;
      box-shadow: 0 5px 8px -3px gray;
      border-radius: 50%;
      aspect-ratio: 1;

      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      h4 {
        font-size: 0.65rem;
        font-weight: bold;
      }

      img {
        width: 50%;
        max-width: 100%;
        object-fit: cover;
        margin-bottom: 0.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

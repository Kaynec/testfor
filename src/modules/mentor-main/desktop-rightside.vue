<template>
  <div class="container">
    <div class="wrapper">
      <aside>
        <img src="@/assets/img/logo@2x.png" class="header" />
        <div class="cart-container">
          <img
            @click="moveToComponent('Requests')"
            src="@/assets/img/mentor/requests@3x.png"
            :class="`${routerName == 'Requests' ? 'active' : ''} `"
          />

          <img
            @click="moveToComponent('EditCV')"
            src="@/assets/img/mentor/resume@3x.png"
            :class="`${routerName == 'EditCV' ? 'active' : ''} `"
          />

          <img
            @click="moveToComponent('MentorStudents')"
            src="@/assets/img/mentor/students@3x.png"
            :class="`${routerName == 'MentorStudents' ? 'active' : ''} `"
          />

          <img
            @click="moveToComponent('MentorProfile')"
            src="@/assets/img/mentor/profile@3x.png"
            :class="`${routerName == 'MentorProfile' ? 'active' : ''} `"
          />
        </div>
      </aside>
      <img src="@/assets/img/footer-image@2x.png" class="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router';
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default defineComponent({
  setup() {
    const route = useRoute();

    const routerName = computed(() => {
      return route.name;
    });

    const moveToComponent = (componentName: string) => {
      router.push({ name: componentName });
    };

    return { moveToComponent, routerName };
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
  z-index: 20;

  .wrapper {
    min-width: 18rem;
    max-width: 22rem;
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
  min-height: 80%;
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
  }

  .cart-container {
    width: 100%;
    height: 100%;
    margin: 2rem auto;
    display: flex;
    align-content: start;
    justify-content: center;
    grid-gap: 1rem;
    padding-top: 2rem;
    flex-wrap: wrap;

    img {
      width: 35%;
      image-rendering: -moz-crisp-edges; /* Firefox */
      image-rendering: -o-crisp-edges; /* Opera */
      image-rendering: -webkit-optimize-contrast; /* Webkit (non-standard naming) */
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor; /* IE (non-standard property) */
      object-fit: contain;
    }

    .active {
      border: solid 2px #d21921;
      border-radius: 100%;
    }
  }
}
</style>

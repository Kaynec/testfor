<template>
  <footer class="footer" v-if="isMobile()">
    <router-link
      :to="`home`"
      class="nav-link"
      exact
      exact-active-class="active"
    >
      <img src="@/assets/img/home@3x.png" class="footer-icon" alt="home" />
    </router-link>

    <router-link
      :to="`group`"
      class="nav-link"
      exact
      exact-active-class="active"
    >
      <img src="@/assets/img/group@3x.png" class="footer-icon" alt="roadmap" />
    </router-link>

    <router-link
      :to="`shop`"
      class="nav-link"
      exact
      exact-active-class="active"
    >
      <img src="@/assets/img/shop@3x.png" class="footer-icon" alt="shop" />
    </router-link>
    <router-link
      :to="`setting`"
      class="nav-link"
      exact
      exact-active-class="active"
    >
      <img
        src="@/assets/img/setting@3x.png"
        class="footer-icon"
        alt="setting"
      />
    </router-link>
  </footer>
</template>
<style scoped lang="scss">
// @import '@/css-variable/Global.scss';
.footer {
  width: 100%;
  height: clamp(4rem, 4rem, 4rem);
  flex-basis: clamp(10%, 12.5%, 17.5%);
  position: fixed;
  bottom: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  background-image: linear-gradient(to right, #880e13 7%, #ec3538);
  z-index: 4;
  .footer-icon {
    object-fit: contain;
    width: 25vw;
    max-width: 5rem;
  }
}
.nav-link {
  padding: 0;
  transition: ease 0.3s;
}
.active {
  transform: scale(1.25);
}
</style>

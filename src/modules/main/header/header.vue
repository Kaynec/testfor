<template>
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <button class="nav-link" role="button" @click="onToggleMenuSidebar">
          <i class="fas fa-bars"></i>
        </button>
      </li>
    </ul>

    <ul class="navbar-nav ml-auto">
      <messages-dropdown></messages-dropdown>
      <notifications-dropdown></notifications-dropdown>
      <user-dropdown></user-dropdown>
      <!-- <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                <i class="fas fa-expand-arrows-alt"></i>
            </a>
        </li> -->
    </ul>
  </nav>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Messages from './messages/messages.vue';
import Notifications from './notifications/notifications.vue';
import Languages from './languages/languages.vue';
import User from './user/user.vue';

@Options({
  components: {
    'messages-dropdown': Messages,
    'notifications-dropdown': Notifications,
    'languages-dropdown': Languages,
    'user-dropdown': User
  }
})
export default class Header extends Vue {
  public onToggleMenuSidebar(): void {
    this.$emit('toggle-menu-sidebar');
  }
}
</script>
<style lang="scss"></style>

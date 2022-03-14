<template>
  <li class="nav-item dropdown user-menu" ref="dropdown">
    <button
      @click="toggleDropdown"
      class="nav-link dropdown-toggle"
      data-toggle="dropdown"
    >
      <img
        src="../../../../assets/img/default-profile.png"
        class="user-image img-circle elevation-2"
        alt="User Image"
      />
    </button>
    <ul
      class="dropdown-menu dropdown-menu-lg dropdown-menu-right"
      :class="{ show: isDropdownOpened }"
    >
      <!-- User image -->
      <li class="user-header bg-primary">
        <img
          src="../../../../assets/img/default-profile.png"
          class="img-circle elevation-2"
          alt="User Image"
        />

        <p>
          {{ currentUser.firstname + ' ' + currentUser.lastname }}
        </p>
      </li>
      <!-- Menu Body -->
      <!-- <li class="user-body">
            <div class="row">
                <div class="col-4 text-center">
                    <a href="#">Followers</a>
                </div>
                <div class="col-4 text-center">
                    <a href="#">Sales</a>
                </div>
                <div class="col-4 text-center">
                    <a href="#">Friends</a>
                </div>
            </div>
        </li> -->
      <!-- Menu Footer-->
      <li class="user-footer">
        <router-link
          to="/admin/profile"
          class="btn btn-default btn-flat"
          @click="isDropdownOpened = false"
        >
          پروفایل
        </router-link>
        <button @click="logout" class="btn btn-default btn-flat float-right">
          خروج
        </button>
      </li>
    </ul>
  </li>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useAdminStore } from '@/store';
import { AdminActionTypes } from '@/store/modules/admin/action-types';
import { UserDocuments } from '@/@types';

@Options({})
export default class User extends Vue {
  private isDropdownOpened = false;

  public mounted(): void {
    document.addEventListener('click', this.documentClick);
  }

  public unmounted(): void {
    document.removeEventListener('click', this.documentClick);
  }

  private toggleDropdown() {
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  private documentClick(event: Event) {
    const el: HTMLElement = this.$refs.dropdown as HTMLElement;
    const target: HTMLElement = event.target as HTMLElement;
    if (el !== target && !el.contains(target)) {
      this.isDropdownOpened = false;
    }
  }

  private async logout() {
    await useAdminStore().dispatch(AdminActionTypes.LOG_OUT, undefined);
    this.$router.push('/admin/login');
  }

  get currentUser(): UserDocuments | null {
    return useAdminStore().getters.getCurrentUser;
  }
}
</script>
<style lang="scss">
.user-menu {
  .user-image {
    width: 1.6rem !important;
    height: 1.6rem !important;
  }
}
</style>

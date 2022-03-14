<template>
  <div class="login-box">
    <!-- /.login-logo -->
    <div class="card card-outline card-primary">
      <div class="card-header text-center">
        <a href="../../index2.html" class="h1"
          ><img src="../../assets/img/logo.png" alt="login img"
        /></a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">ورود به پنل ماهان</p>

        <form action="../../index3.html" method="post">
          <div class="input-group mb-3">
            <input
              type="email"
              class="form-control"
              placeholder="Email"
              v-model="email"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              v-model="password"
            />
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-8">
              <div class="icheck-primary">
                <input type="checkbox" id="remember" />
                <label for="remember"> مرا بخاطر بسپار </label>
              </div>
            </div>
            <!-- /.col -->
            <div class="col-4">
              <button
                type="button"
                class="btn btn-primary btn-block"
                @click="login"
              >
                ورود
              </button>
            </div>
            <!-- /.col -->
          </div>
        </form>
        <!-- 
        <p class="mb-1">
          <router-link to="/forgot-password"> فراموشی رمز </router-link>
        </p>
        <p class="mb-0">
          <router-link to="/register" class="text-center">
            ثبت نام
          </router-link>
        </p> -->
      </div>
      <!-- /.card-body -->
    </div>
    <!-- /.card -->
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useAdminStore } from '@/store';
import { AdminActionTypes } from '@/store/modules/admin/action-types';

@Options({})
export default class Login extends Vue {
  private appElement: HTMLElement | null = null;

  public data(): any {
    return {
      email: '',
      password: ''
    };
  }

  public mounted(): void {
    this.appElement = document.getElementById('app') as HTMLElement;
    this.appElement.classList.add('login-page');
  }

  public unmounted(): void {
    (this.appElement as HTMLElement).classList.remove('login-page');
  }

  public async login(): Promise<any> {
    const data: any = this.$data;
    const res = await useAdminStore().dispatch(
      AdminActionTypes.AUTH_REQUEST_ADMIN,
      {
        username: data.email,
        password: data.password
      }
    );
    if (res) {
      await useAdminStore().dispatch(AdminActionTypes.CURRENT_USER, undefined);
      this.$router.push('/admin');
    }
  }

  public loginByFacebook(): void {
    this.$router.push('/admin');
  }

  public loginByGoogle(): void {
    this.$router.push('/admin');
  }
}
</script>
<style lang="scss"></style>

<template>
  <div class="container-login">
    <div class="container-logo">
      <h1 class="logo"><span>Zuni</span> Forty Fourth</h1>
    </div>
    <div class="container-form">
      <Login />
      <router-link to="/forgot-password">Forgot Password</router-link>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: "LoginView",
  components: {
    Login,
  },
};
</script>

<style lang="scss" scoped>
.container-login {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  max-width: 1000px;
  margin: 0 auto;

  @media only screen and (min-width: $desktop) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.container-logo {
  @media only screen and (min-width: $desktop) {
    width: 50%;
  }
}

.container-form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 20px auto 0;

  @media only screen and (min-width: $desktop) {
    width: 50%;
  }

  a {
    @media only screen and (min-width: $tablet) {
      margin-left: 3%;
    }
  }
}
</style>

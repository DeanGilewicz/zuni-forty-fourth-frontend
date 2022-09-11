<template>
  <div class="container-forgot-password">
    <div class="container-logo">
      <h1 class="logo"><span>Zuni</span> Forty Fourth</h1>
    </div>
    <div class="container-form">
      <ForgotPassword />
      <router-link to="/">Login</router-link>
    </div>
  </div>
</template>

<script>
import ForgotPassword from "@/components/ForgotPassword.vue";

export default {
  name: "ForgotPassword",
  components: {
    ForgotPassword,
  },
};
</script>

<style lang="scss" scoped>
.container-forgot-password {
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
    height: 90vh;
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
    color: $yellow;
    font-weight: 400;
    @media only screen and (min-width: $tablet) {
      margin-left: 3%;
    }
  }
}
</style>

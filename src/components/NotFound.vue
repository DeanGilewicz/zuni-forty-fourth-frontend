<template>
  <div class="not-found">
    <header>
      <nav id="nav">&nbsp;</nav>
    </header>
    <main>
      <div class="container-logo">
        <h1 class="logo small"><span class="small">Zuni</span> Forty Fourth</h1>
      </div>
      <div class="container-content">
        <h2>Opps...</h2>
        <p>You must be looking in the wrong neighborhood!</p>
        <p>Let's get you back home.</p>
        <p>
          <router-link exact to="/" class="btn">Home</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style lang="scss" scoped>
header {
  background-color: $yellow-dark;
}

#nav {
  max-width: $container;
  margin: 0 auto;
  padding: 20px 10px;
  font-family: $font-stack-heading;
  font-weight: 700;

  @media only screen and (min-width: $mobile-landscape) {
    padding: 22px 12px;
  }

  @media only screen and (min-width: $tablet) {
    padding: 26px 16px;
  }

  @media only screen and (min-width: $desktop) {
    padding: 30px 20px;
  }

  @media only screen and (min-width: $desktop-large) {
    padding: 34px 24px;
  }
}

.container-content {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 30px;
  padding-bottom: 30px;

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .btn {
    display: inline-block;
    text-decoration: none;
    margin-top: 30px;
  }
}
</style>

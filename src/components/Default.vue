<template>
  <div>
    <div v-if="$route.path === '/app'">
      <h2>WELCOME</h2>
      <div class="container-content">
        <div class="container-img">
          <img src="@/assets/zuni44.jpg" alt="a rendered drawing of Zuni Forty Fourth" />
        </div>
        <div class="container-text">
          <p>Established in 2018, Zuni Forty Fourth is comprised of 11 modern town homes in the Sunnyside neighborhood.</p>
          <p>With great walkability and proximity to shops, restaurants and parks, our homes are ideally located to take advantage of all Denver has to offer.</p>
          <p>Explore the site to discover more about your community.</p>
        </div>
      </div>
    </div>
    <router-view :currentUserRole="currentUserRole" />
    <nav>
      <router-link to="/app/neighbors">Neighbors</router-link>
      <router-link to="/app/events">Events</router-link>
      <router-link to="/app/contacts">Contacts</router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: "default",
  props: {
    currentUserRole: String
  },
  data() {
    return {
      secondaryNavOpen: false
    };
  }
};
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: $yellow-dark;

  @media only screen and (min-width: $tablet) {
    top: 50%;
    transform: translateY(-50%);
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 320px;
    writing-mode: vertical-lr;
  }

  @media only screen and (min-width: $desktop) {
    height: 350px;
  }

  @media only screen and (min-width: $desktop-large) {
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    justify-content: center;
    align-items: stretch;
    width: 100%;
    height: auto;
    writing-mode: horizontal-tb;
  }

  a {
    display: inline-block;
    margin: 5px 5px;
    padding: 5px 8px;
    text-decoration: none;
    text-transform: uppercase;
    color: $white-off;

    &:active,
    &:focus {
      color: $blue-grey-very-dark;
    }

    @media only screen and (min-width: $tablet) {
      margin: 0;
      padding: 8px 0;
    }

    @media only screen and (min-width: $desktop) {
      padding: 12px 0;
    }

    @media only screen and (min-width: $desktop-large) {
      padding: 14px 0;
      margin: 0 50px;
    }
  }
}

.container-content {
  margin-bottom: 50px;

  @media only screen and (min-width: $tablet) {
    display: flex;
    align-items: center;
    margin-top: 50px;
    margin-bottom: 50px;
    padding-left: 50px;
    padding-right: 50px;
  }

  @media only screen and (min-width: $desktop) {
    margin-top: 60px;
    margin-bottom: 90px;
  }

  @media only screen and (min-width: $desktop-large) {
    margin-top: 70px;
    margin-bottom: 110px;
  }

  .container-img {
    @media only screen and (min-width: $tablet) {
      width: 50%;
      margin-right: 10px;
    }

    img {
      border-radius: 10px;
    }
  }

  .container-text {
    line-height: 1.4;

    @media only screen and (min-width: $tablet) {
      width: 50%;
      margin-left: 10px;
    }
  }
}
</style>
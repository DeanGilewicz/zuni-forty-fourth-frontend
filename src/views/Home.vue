<template>
  <div class="home">
    <header>
      <nav id="nav">
        <label for="show-menu" class="mobile-menu-trigger" v-on:click="toggleMobileMenu($event)">
          <span>Menu</span>
          <div class="lines"></div>
        </label>
        <ul>
          <li>
            <router-link exact to="/app">Home</router-link>
          </li>
          <li v-if="currentUserRole === 'Admin'">
            <router-link to="/app/admin">Admin Area</router-link>
          </li>
          <li v-if="currentUserRole === 'Owner'">
            <router-link :to="{name: 'manageUsers'}">Manage Users</router-link>
          </li>
          <li>
            <router-link to="/app/profile">My Profile</router-link>
          </li>
          <li class="logout">
            <a href="/" @click.prevent="logOut">Logout</a>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <div class="container-logo">
        <h1 class="logo small">
          <span class="small">Zuni</span> Forty Fourth
        </h1>
      </div>
      <router-view :currentUserRole="currentUserRole" />
    </main>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import axios from "axios";
import Cookie from "js-cookie";
import jwtDecode from "../utils/jwtDecode";
export default {
  name: "home",
  data() {
    return {
      currentUserRole: jwtDecode(Cookie.get("token")).role,
      currentUserId: jwtDecode(Cookie.get("token")).userId
    };
  },
  mounted() {
    this.bodyEl = document.querySelector("body");
    this.mobileMenuTriggerEl = document.querySelector(
      "#nav .mobile-menu-trigger"
    );
    window.addEventListener("resize", this.debounce(this.resetMobileMenu, 300));
  },
  beforeDestroy() {
    this.bodyEl = null;
    this.mobileMenuTriggerEl = null;
    window.removeEventListener(
      "resize",
      this.debounce(this.resetMobileMenu, 300)
    );
  },
  watch: {
    $route() {
      this.mobileMenuTriggerEl.classList.remove("active"); // close mobile menu
      if (this.bodyEl) this.bodyEl.classList.remove("no-scroll"); // allow body scroll
    }
  },
  methods: {
    debounce(func, wait, immediate) {
      var timeout;
      return function executedFunction() {
        var context = this;
        var args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    resetMobileMenu() {
      if (this.bodyEl) this.bodyEl.classList.remove("no-scroll");
      if (this.mobileMenuTriggerEl)
        this.mobileMenuTriggerEl.classList.remove("active");
    },
    toggleMobileMenu($event) {
      $event.currentTarget.classList.toggle("active");
      if (this.bodyEl) this.bodyEl.classList.toggle("no-scroll");
    },
    logOut() {
      const url = "/api/logout";
      const axiosData = {};
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .post(url, axiosData, axiosConfig)
        // .then(response => {
        .then(() => {
          // clear token
          Cookie.remove("token", { path: "" });
          // Stop Loader
          EventBus.$emit("STOP_LOADING");
          this.$router.push("/");
        })
        .catch(error => HandleError(error));
    }
  }
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

  .mobile-menu-trigger {
    position: relative;
    z-index: 15;
    display: block;
    text-transform: uppercase;
    color: $white-off;
    text-align: center;
    cursor: pointer;

    @media only screen and (min-width: $tablet) {
      display: none;
    }

    &.active + ul {
      transform: translateX(0);
    }

    span {
      font-size: 1.3rem;
    }

    .lines {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      border-bottom: 12px double #f8f8f8;
      border-top: 4px solid #f8f8f8;
    }
  }

  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    margin: 0;
    padding: 60px 10px 0;
    background-color: $yellow-dark;
    transform: translateX(100%);
    transition: transform 0.4s ease-in-out;

    @media only screen and (min-width: $mobile-landscape) {
      padding: 20px 12px 0;
    }

    @media only screen and (min-width: $tablet) {
      position: static;
      flex-direction: row;
      justify-content: flex-start;
      top: 0;
      padding: 0;
      transform: none;
      transition: none;
    }

    li {
      margin-top: 20px;
      font-size: 1rem;

      @media only screen and (min-width: $tablet) {
        margin-top: 0;
        margin-right: 30px;
        font-size: 1.1rem;
      }

      @media only screen and (min-width: $desktop) {
        font-size: 1.2rem;
      }

      &:last-of-type {
        @media only screen and (min-width: $tablet) {
          margin-right: 0;
        }
      }
    }
  }

  a {
    text-decoration: none;
    text-transform: uppercase;
    color: $white-off;

    &.router-link-active,
    &.router-link-exact-active {
      color: $blue-grey-very-dark;
    }
  }

  .logout {
    @media only screen and (min-width: $tablet) {
      margin-left: auto;
    }
  }
}
</style>

<template>
  <div>
    <form action="/api/login" method="post" @submit.prevent="logUserIn">
      <div class="field">
        <input v-model="emailAddress" type="email" id="emailLogin" name="email_address" required />
        <label for="emailLogin" :class="{ active: isFilledEmail }">
          Email Address
          <sup>*</sup>
        </label>
      </div>
      <div class="field">
        <input v-model="password" type="password" id="passwordLogin" name="password" required />
        <label for="passwordLogin" :class="{ active: isFilledPassword }">
          Password
          <sup>*</sup>
        </label>
      </div>
      <div class="field submit">
        <input type="submit" class="btn login" value="Login" />
      </div>
    </form>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      emailAddress: "",
      password: ""
    };
  },
  computed: {
    isFilledEmail() {
      if (this.emailAddress !== "") {
        return true;
      }
      return false;
    },
    isFilledPassword() {
      if (this.password !== "") {
        return true;
      }
      return false;
    }
  },
  methods: {
    logUserIn() {
      if (this.emailAddress !== "" && this.password !== "") {
        const url = "/api/login";
        const axiosData = {
          emailAddress: this.emailAddress,
          password: this.password
        };
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
            // Stop Loader
            EventBus.$emit("STOP_LOADING");
            // change route to app home page
            this.$router.push("app");
          })
          .catch(error => HandleError(error));
      } else {
        HandleError({ message: "Please complete all fields" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  .field.submit {
    @media only screen and (min-width: $tablet) {
      margin-top: 32px;
      margin-bottom: 32px;
    }
  }
}
</style>
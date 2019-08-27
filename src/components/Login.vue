<template>
  <div>
    <form action="/api/login" method="post" @submit.prevent="logUserIn">
      <div class="field">
        <input v-model="emailAddress" type="email" id="emailLogin" name="email_address" />
        <label for="emailLogin" :class="{ active: isFilledEmail }">
          Email Address
          <sup>*</sup>
        </label>
      </div>
      <div class="field">
        <input v-model="password" type="password" id="passwordLogin" name="password" />
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
.field {
  display: flex;
  flex-direction: column-reverse;
  margin-top: 15px;
  margin-bottom: 15px;

  &.submit {
    margin-top: 35px;
    margin-bottom: 35px;
  }
}

label {
  margin-bottom: 4px;
  font-size: 0.9em;
  transform: translate(10px, 24px);
  color: $blue-grey-placeholder;
  transition: transform 0.4s ease-in-out, color 0.4s ease-in-out;

  @media only screen and (min-width: $tablet) {
    font-size: 0.8em;
    transform: translate(10px, 25px);
  }

  @media only screen and (min-width: $desktop) {
    font-size: 0.7em;
    transform: translate(10px, 26px);
  }
}
input:focus + label,
input + label.active {
  transform: translate(0, 0);
  color: $blue-grey;
}
.btn {
  width: 100%;
  font-size: 1em;

  @media only screen and (min-width: $tablet) {
    font-size: 0.9em;
  }

  @media only screen and (min-width: $desktop) {
    font-size: 0.9em;
  }
}
</style>

<template>
  <div class="registration-user">
    <header>
      <nav id="nav">&nbsp;</nav>
    </header>
    <main>
      <div class="container-logo">
        <h1 class="logo small">
          <span class="small">Zuni</span> Forty Fourth
        </h1>
      </div>
      <div class="container-content">
        <h2>USER REGISTRATION CONFIRMATION</h2>
        <div class="container-form">
          <form
            action
            method="post"
            @submit.prevent="registrationConfirmationConfirmationModal"
            class="form__registration-user"
          >
            <div class="field">
              <input
                v-model="emailAddress"
                type="email"
                id="emailAddress"
                name="email_address"
                required
              />
              <label for="emailAddress" :class="{ active: isEmail }">
                Email Address
                <sup>*</sup>
              </label>
            </div>
            <div class="field">
              <input v-model="verifyCode" type="text" id="verifyCode" name="verify_code" required />
              <label for="verifyCode" :class="{ active: isVerifyCode }">
                Verification Code
                <sup>*</sup>
              </label>
            </div>
            <div class="field">
              <input
                v-model="tempPassword"
                type="password"
                id="tempPassword"
                name="tempPassword"
                required
              />
              <label for="tempPassword" :class="{ active: isTempPassword }">
                Temp Password
                <sup>*</sup>
              </label>
            </div>
            <div class="field submit">
              <input type="submit" class="btn" value="Submit" />
            </div>
          </form>
          <div v-if="isRegistered" class="field">
            <router-link class="btn-link" to="/">Login Now</router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
export default {
  name: "userRegistrationConfirmation",
  data() {
    return {
      emailAddress: "",
      verifyCode: "",
      tempPassword: "",
      isRegistered: false
    };
  },
  computed: {
    isEmail() {
      if (this.emailAddress !== "") {
        return true;
      }
      return false;
    },
    isVerifyCode() {
      if (this.verifyCode !== "") {
        return true;
      }
      return false;
    },
    isTempPassword() {
      if (this.tempPassword !== "") {
        return true;
      }
      return false;
    }
  },
  methods: {
    registrationConfirmationConfirmationModal() {
      if (
        this.emailAddress !== "" &&
        this.verifyCode !== "" &&
        this.tempPassword !== ""
      ) {
        const message = `All information is correct?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.registrationConfirmation.bind(this),
          cancelFn: this.resetForm.bind(this)
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    resetForm() {
      this.emailAddress = "";
      this.verifyCode = "";
      this.tempPassword = "";
      this.isRegistered = false;
    },
    registrationConfirmation() {
      const url = "/api/confirmation-user";
      const axiosData = {
        emailAddress: this.emailAddress,
        verifyCode: this.verifyCode,
        tempPassword: this.tempPassword
      };
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .post(url, axiosData, axiosConfig)
        .then(response => {
          // reset vue form model
          this.resetForm();
          // show home (log in now) cta
          this.isRegistered = true;
          // UPDATE UI
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} has been successfully registered as a user`
          );
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
}

.form__registration-user {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}

.router-link-active.btn-link,
.btn-link {
  border: none;
  background-color: transparent;
  text-transform: none;
  text-decoration: underline;
  font-weight: 400;
  color: $yellow-dark;
}
</style>
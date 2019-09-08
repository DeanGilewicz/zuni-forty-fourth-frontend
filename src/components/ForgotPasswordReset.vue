<template>
  <div class="password-reset">
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
        <h2>FORGOT PASSWORD RESET</h2>
        <div class="container-form">
          <form
            action
            method="post"
            @submit.prevent="forgotPasswordResetConfirmationModal"
            class="form__password-reset"
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
                Reset Code
                <sup>*</sup>
              </label>
            </div>
            <div class="field">
              <input
                v-model="newPassword"
                type="password"
                id="newPassword"
                name="new_password"
                required
              />
              <label for="newPassword" :class="{ active: isNewPassword }">
                New Password
                <sup>*</sup>
              </label>
            </div>
            <div class="field">
              <input
                v-model="confirmPassword"
                type="password"
                id="confirmPassword"
                name="confirm_password"
                required
              />
              <label for="confirmPassword" :class="{ active: isConfirmPassword }">
                Confirm Password
                <sup>*</sup>
              </label>
            </div>
            <div class="field submit">
              <input type="submit" value="Reset Password" />
            </div>
          </form>
          <div v-if="isPasswordReset" class="field">
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
  name: "forgotPasswordReset",
  data() {
    return {
      emailAddress: "",
      newPassword: "",
      confirmPassword: "",
      verifyCode: "",
      isPasswordReset: false
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
    isNewPassword() {
      if (this.newPassword !== "") {
        return true;
      }
      return false;
    },
    isConfirmPassword() {
      if (this.confirmPassword !== "") {
        return true;
      }
      return false;
    }
  },
  methods: {
    forgotPasswordResetConfirmationModal() {
      if (
        this.emailAddress !== "" &&
        this.newPassword !== "" &&
        this.confirmPassword !== "" &&
        this.verifyCode !== ""
      ) {
        const message = `Are you sure you want to reset your password?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.forgotPasswordReset.bind(this),
          cancelFn: this.resetForm.bind(this)
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    resetForm() {
      this.emailAddress = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.verifyCode = "";
      this.isPasswordReset = false;
    },
    forgotPasswordReset() {
      const url = "/api/forgot-password-reset";
      const axiosData = {
        emailAddress: this.emailAddress,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword,
        verifyCode: this.verifyCode
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
          this.isPasswordReset = true;
          // UPDATE UI
          HandleSuccess("Your password has been reset");
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

.form__password-reset {
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
<template>
  <div class="registration-owner">
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
        <h2>OWNER REGISTRATION CONFIRMATION</h2>
        <div class="container-form">
          <form
            action
            method="post"
            @submit.prevent="registrationConfirmationConfirmationModal"
            class="form__registration-owner"
          >
            <div class="field">
              <input v-model="emailAddress" type="email" id="emailAddress" name="email_address" />
              <label for="emailAddress" :class="{ active: isEmail }">
                Email Address
                <sup>*</sup>
              </label>
            </div>
            <div class="field">
              <input v-model="verifyCode" type="text" id="verifyCode" name="verify_code" />
              <label for="verifyCode" :class="{ active: isVerifyCode }">
                Verification Code
                <sup>*</sup>
              </label>
            </div>
            <div class="field">
              <input v-model="tempPassword" type="password" id="tempPassword" name="tempPassword" />
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
  name: "ownerRegistrationConfirmation",
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
    },
    registrationConfirmation() {
      const url = "/api/confirmation-owner";
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
            `${response.data.result.firstName} ${response.data.result.lastName} has been successfully registered as an owner`
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

h2 {
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;

  @media only screen and (min-width: $tablet) {
    margin-top: 30px;
    margin-bottom: 30px;
  }
}

.container-form {
  max-width: 400px;
  margin: 0 auto;

  @media only screen and (min-width: $tablet) {
    max-width: 800px;
  }
}
.form__registration-owner {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}
.field {
  display: flex;
  flex-direction: column-reverse;
  margin-top: 15px;
  margin-bottom: 15px;

  @media only screen and (min-width: $tablet) {
    flex-basis: 44%;
    margin-left: 3%;
    margin-right: 3%;
  }

  &.submit {
    margin-top: 35px;
    margin-bottom: 35px;

    @media only screen and (min-width: $tablet) {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}

label {
  margin-bottom: 4px;
  font-size: 0.9em;
  transform: translate(10px, 24px);
  color: $blue-grey-placeholder;
  transition: transform 0.4s ease-in-out, color 0.4s ease-in-out;
  pointer-events: none;

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

<template>
  <div>
    <h2>CHANGE PASSWORD</h2>
    <router-link class="a-link" to="/app/profile">My Profile</router-link>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="changeUserPasswordConfirmationModal"
        class="form_change_password"
      >
        <div class="field">
          <input
            v-model="currentPassword"
            type="password"
            id="currentPassword"
            name="current_password"
            required
          />
          <label for="currentPassword" :class="{ active: isCurrentPassword }">
            Current Password
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
            Verify Password
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Change Password" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";

export default {
  name: "changePassword",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  },
  computed: {
    isCurrentPassword() {
      if (this.currentPassword !== "") {
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
    },
    passwordsMatch() {
      return this.newPassword === this.confirmPassword;
    }
  },
  methods: {
    changeUserPasswordConfirmationModal() {
      if (
        typeof this.currentPassword !== "" &&
        typeof this.newPassword !== "" &&
        this.confirmPassword !== ""
      ) {
        if (!this.passwordsMatch) {
          HandleError({ message: "Passwords do not match!" });
          return;
        }
        const message = "Are you sure you want to change your password?";
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.changeUserPassword.bind(this),
          cancelFn: this.resetForm.bind(this)
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    changeUserPassword() {
      if (this.newPassword !== "") {
        const url = "/api/user/current/change-password";
        const axiosData = {
          password: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        };
        const axiosConfig = {
          crossDomain: true,
          withCredentials: true
        };
        // Start Loader
        EventBus.$emit("START_LOADING");
        axios
          .put(url, axiosData, axiosConfig)
          .then(response => {
            // UPDATE UI
            HandleSuccess("Password has been successfully updated");
          })
          .catch(error => HandleError(error));
      } else {
        HandleError({ message: "Password cannot be empty" });
      }
    },
    resetForm() {
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.a-link {
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 30px;
  border: none;
  background-color: transparent;
  text-transform: none;
  font-weight: 400 !important;
  text-decoration: underline;
  color: $yellow-dark !important;
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

.form_change_password {
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
      margin: 15px auto;
    }
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
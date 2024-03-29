<template>
  <div>
    <h2>CHANGE PASSWORD</h2>
    <router-link class="a-link" to="/app/profile">My Profile</router-link>
    <div class="container-form">
      <form
        action
        method="post"
        class="form_change_password"
        @submit.prevent="changeUserPasswordConfirmationModal"
      >
        <div class="field">
          <input
            id="currentPassword"
            v-model="currentPassword"
            type="password"
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
            id="newPassword"
            v-model="newPassword"
            type="password"
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
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
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
  name: "ChangePassword",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
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
    },
  },
  methods: {
    changeUserPasswordConfirmationModal() {
      if (
        this.currentPassword !== "" &&
        this.newPassword !== "" &&
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
          cancelFn: this.resetForm.bind(this),
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
          confirmPassword: this.confirmPassword,
        };
        const axiosConfig = {
          crossDomain: true,
          withCredentials: true,
        };
        // Start Loader
        EventBus.$emit("START_LOADING");
        axios
          .put(url, axiosData, axiosConfig)
          .then(() => {
            // UPDATE UI
            HandleSuccess("Password has been successfully updated");
          })
          .catch((error) => HandleError(error));
      } else {
        HandleError({ message: "Password cannot be empty" });
      }
    },
    resetForm() {
      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    },
  },
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

.form_change_password {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}

.field.submit {
  @media only screen and (min-width: $tablet) {
    margin: 15px auto;
  }
}
</style>

<template>
  <div>
    <h2>EDIT USER</h2>
    <div class="container-form">
      <form
        action
        method="post"
        class="form__edit-user"
        @submit.prevent="updateUserConfirmationModal"
      >
        <div class="field">
          <input
            id="fname"
            v-model="user.firstName"
            type="text"
            name="first_name"
            required
          />
          <label for="fname" :class="{ active: isFirstName }">
            First Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            id="lname"
            v-model="user.lastName"
            type="text"
            name="last_name"
            required
          />
          <label for="lname" :class="{ active: isLastName }">
            Last Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            id="phoneNumber"
            v-model="user.phoneNumber"
            type="tel"
            name="phone_number"
            required
          />
          <label for="phoneNumber" :class="{ active: isPhoneNumber }">
            Phone Number
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Update User" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "EditUser",
  props: {
    userId: Number,
  },
  data() {
    return {
      user: {},
      rollbackUser: {},
    };
  },
  computed: {
    isFirstName() {
      if (this.user.firstName !== "") {
        return true;
      }
      return false;
    },
    isLastName() {
      if (this.user.lastName !== "") {
        return true;
      }
      return false;
    },
    isPhoneNumber() {
      if (this.user.phoneNumber !== "") {
        return true;
      }
      return false;
    },
  },
  created() {
    const url = "/api/user";
    const axiosData = {
      userId: this.userId,
    };
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true,
    };
    // Start Loader
    EventBus.$emit("START_LOADING");
    axios
      .post(url, axiosData, axiosConfig)
      .then((response) => {
        // Stop Loader
        EventBus.$emit("STOP_LOADING");
        this.user = response.data.result;
        this.rollbackUser = { ...response.data.result };
      })
      .catch((error) => HandleError(error));
  },
  methods: {
    updateUserConfirmationModal() {
      if (
        this.user.firstName !== "" &&
        this.user.lastName !== "" &&
        this.user.phoneNumber !== ""
      ) {
        const message = `Are you sure you want to update ${capitalizeFirstLetter(
          this.rollbackUser.firstName
        )} ${capitalizeFirstLetter(this.rollbackUser.lastName)}`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.updateUser.bind(this),
          cancelFn: this.resetUser.bind(this),
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    updateUser() {
      const url = "/api/user/update";
      const axiosData = {
        user: this.user,
      };
      const axiosConfig = {
        crossDomain: true,
        withCredentials: true,
      };
      // Start Loader
      EventBus.$emit("START_LOADING");
      axios
        .put(url, axiosData, axiosConfig)
        .then((response) => {
          this.user = response.data.result;
          this.$emit("updateUser", response.data.result);
        })
        .catch((error) => HandleError(error));
    },
    resetUser() {
      this.user = { ...this.rollbackUser };
    },
  },
};
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 10px;
}

.form__edit-user {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

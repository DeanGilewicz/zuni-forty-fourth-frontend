<template>
  <div>
    <h2>EDIT USER</h2>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="updateUserConfirmationModal"
        class="form__edit-user"
      >
        <div class="field">
          <input v-model="user.firstName" type="text" id="fname" name="first_name" />
          <label for="fname" :class="{ active: isFirstName }">
            First Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="user.lastName" type="text" id="lname" name="last_name" />
          <label for="lname" :class="{ active: isLastName }">
            Last Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="user.phoneNumber" type="tel" id="phoneNumber" name="phone_number" />
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
  name: "editUser",
  props: {
    userId: Number
  },
  data() {
    return {
      user: {},
      rollbackUser: {}
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
    }
  },
  created() {
    const url = "/api/user";
    const axiosData = {
      userId: this.userId
    };
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, axiosData, axiosConfig)
      .then(response => {
        this.user = response.data.result;
        this.rollbackUser = { ...response.data.result };
      })
      .catch(error => HandleError(error));
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
          cancelFn: this.resetUser.bind(this)
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    updateUser() {
      const url = "/api/user/update";
      const axiosData = {
        user: this.user
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
          this.user = response.data.result;
          this.$emit("updateUser", response.data.result);
        })
        .catch(error => HandleError(error));
    },
    resetUser() {
      this.user = { ...this.rollbackUser };
    }
  }
};
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 10px;
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

.form__edit-user {
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
input + label.active,
select + label.active {
  transform: translate(0, 0);
  color: $blue-grey;
}
</style>
<template>
  <div>
    <h2>ADD USER</h2>
    <p class="property-name">{{ property.streetAddress }}</p>
    <button class="btn-link" @click="showManageUsers">Manage Users</button>
    <div class="container-form">
      <form
        action
        method="post"
        class="form__add-user"
        @submit.prevent="addUserConfirmationModal"
      >
        <div class="field">
          <input
            id="fname"
            v-model="firstName"
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
            v-model="lastName"
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
            id="email"
            v-model="emailAddress"
            type="email"
            name="email_address"
            required
          />
          <label for="email" :class="{ active: isEmail }">
            Email Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" value="Register User" />
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
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "AddUserByOwner",
  props: {
    property: Object,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      emailAddress: "",
    };
  },
  computed: {
    isFirstName() {
      if (this.firstName !== "") {
        return true;
      }
      return false;
    },
    isLastName() {
      if (this.lastName !== "") {
        return true;
      }
      return false;
    },
    isEmail() {
      if (this.emailAddress !== "") {
        return true;
      }
      return false;
    },
  },
  methods: {
    showManageUsers() {
      this.$emit("showManageUsers");
    },
    addUserConfirmationModal() {
      if (
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.emailAddress !== ""
      ) {
        const message = `Are you sure you want to add ${capitalizeFirstLetter(
          this.firstName
        )} ${capitalizeFirstLetter(this.lastName)} as a user for ${
          this.property.streetAddress
        }?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.addUser.bind(this),
          cancelFn: this.resetForm.bind(this),
        });
      } else {
        // handle UI validation messages
        HandleError({ message: "Please complete all fields." });
      }
    },
    resetForm() {
      this.firstName = "";
      this.lastName = "";
      this.emailAddress = "";
    },
    addUser() {
      const url = "/api/register-user";
      const axiosData = {
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddress: this.emailAddress,
        propertyId: this.property.id,
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
          // clear vue form
          this.resetForm();
          // emit event to update ui when going back to all properties view
          this.$emit("addUser", response.data.result);
          // UPDATE UI
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} has been invited as a user`
          );
        })
        .catch((error) => HandleError(error));
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-link {
  margin-top: 20px;
  margin-bottom: 10px;
  border: none;
  padding: 0;
  background-color: transparent;
  text-transform: none;
  text-decoration: underline;
  color: $yellow-dark;
}

.property-name {
  font-size: 1.2rem;
  text-align: center;
}

.form__add-user {
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

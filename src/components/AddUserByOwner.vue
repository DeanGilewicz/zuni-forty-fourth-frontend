<template>
  <div>
    <h2>ADD USER</h2>
    <p class="property-name">{{property.streetAddress}}</p>
    <button @click="showManageUsers" class="btn-link">Manage Users</button>
    <div class="container-form">
      <form action method="post" @submit.prevent="addUserConfirmationModal" class="form__add-user">
        <div class="field">
          <input v-model="firstName" type="text" id="fname" name="first_name" required />
          <label for="fname" :class="{ active: isFirstName }">
            First Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="lastName" type="text" id="lname" name="last_name" required />
          <label for="lname" :class="{ active: isLastName }">
            Last Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="emailAddress" type="email" id="email" name="email_address" required />
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
  name: "addUserByOwner",
  props: {
    property: Object
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      emailAddress: ""
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
    }
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
          cancelFn: this.resetForm.bind(this)
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
        propertyId: this.property.id
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
          // UPDATE UI
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} has been invited as a user`
          );
        })
        .catch(error => HandleError(error));
    }
  }
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
.vdatetime + label.active {
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
<template>
  <div>
    <h2>ADD OWNER</h2>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="addOwnerConfirmationModal"
        class="form__add-owner"
      >
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
          <select v-model="propertyId" id="property" name="property_id" required>
            <option value></option>
            <option
              v-for="property in properties"
              :key="property.id"
              :value="property.id"
            >{{property.streetAddress}}</option>
          </select>
          <label for="property" :class="{ active: isPropertyId }">
            Property
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
          <input type="submit" class="btn" value="Register Owner" />
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
  name: "addOwner",
  data() {
    return {
      properties: [],
      firstName: "",
      lastName: "",
      emailAddress: "",
      propertyId: ""
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
    isPropertyId() {
      if (this.propertyId !== "") {
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
  created() {
    const url = "/api/properties/no-owner";
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, {}, axiosConfig)
      .then(response => {
        this.properties = response.data;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    addOwnerConfirmationModal() {
      if (
        this.propertyId !== "" &&
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.emailAddress !== ""
      ) {
        const selectedProperty = this.properties.filter(
          property => property.id === this.propertyId
        );
        const message = `Are you sure you want to add ${capitalizeFirstLetter(
          this.firstName
        )} ${capitalizeFirstLetter(this.lastName)} as an owner for ${
          selectedProperty[0].streetAddress
        }?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.addOwner.bind(this),
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
      this.propertyId = "";
    },
    addOwner() {
      const url = "/api/register-owner";
      const axiosData = {
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddress: this.emailAddress,
        propertyId: this.propertyId
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
          // clear vue form
          this.resetForm();
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} has been invited as an owner`
          );
        })
        .catch(error => HandleError(error));
    }
  }
};
</script>

<style lang="scss" scoped>
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

.form__add-owner {
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

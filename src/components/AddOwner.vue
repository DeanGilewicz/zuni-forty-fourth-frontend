<template>
  <div>
    <h2>ADD OWNER</h2>
    <div class="container-form">
      <form
        action
        method="post"
        class="form__add-owner"
        @submit.prevent="addOwnerConfirmationModal"
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
          <select
            id="property"
            v-model="propertyId"
            name="property_id"
            required
          >
            <option value></option>
            <option
              v-for="property in properties"
              :key="property.id"
              :value="property.id"
            >
              {{ property.streetAddress }}
            </option>
          </select>
          <label for="property" :class="{ active: isPropertyId }">
            Property
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
  name: "AddOwner",
  data() {
    return {
      properties: [],
      firstName: "",
      lastName: "",
      emailAddress: "",
      propertyId: "",
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
    },
  },
  created() {
    const url = "/api/properties/no-owner";
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true,
    };
    // Start Loader
    EventBus.$emit("START_LOADING");
    axios
      .post(url, {}, axiosConfig)
      .then((response) => {
        // Stop Loader
        EventBus.$emit("STOP_LOADING");
        this.properties = response.data;
      })
      .catch((error) => HandleError(error));
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
          (property) => property.id === this.propertyId
        );
        const message = `Are you sure you want to add ${capitalizeFirstLetter(
          this.firstName
        )} ${capitalizeFirstLetter(this.lastName)} as an owner for ${
          selectedProperty[0].streetAddress
        }?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.addOwner.bind(this),
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
      this.propertyId = "";
    },
    addOwner() {
      const url = "/api/register-owner";
      const axiosData = {
        firstName: this.firstName,
        lastName: this.lastName,
        emailAddress: this.emailAddress,
        propertyId: this.propertyId,
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
          this.$emit(
            "addOwner",
            response.data.result,
            response.data.result.propertyId
          );
          HandleSuccess(
            `${response.data.result.firstName} ${response.data.result.lastName} has been invited as an owner`
          );
        })
        .catch((error) => HandleError(error));
    },
  },
};
</script>

<style lang="scss" scoped>
.form__add-owner {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}
form {
  .field.submit {
    @media only screen and (min-width: $tablet) {
      margin-top: 32px;
      margin-bottom: 32px;
    }
  }
}
</style>

<template>
  <div>
    <form
      action="/api/forgot-password"
      method="post"
      @submit.prevent="forgotPasswordConfirmationModal"
    >
      <div class="field">
        <input v-model="firstName" type="text" id="firstName" name="first_name" required />
        <label for="firstName" :class="{ active: isFilledFirstName }">
          First Name
          <sup>*</sup>
        </label>
      </div>
      <div class="field">
        <input v-model="lastName" type="text" id="lastName" name="last_name" required />
        <label for="lastName" :class="{ active: isFilledLastName }">
          Last Name
          <sup>*</sup>
        </label>
      </div>
      <div class="field">
        <input v-model="emailAddress" type="email" id="emailAddress" name="email_address" required />
        <label for="emailAddress" :class="{ active: isFilledEmail }">
          Email Address
          <sup>*</sup>
        </label>
      </div>
      <div class="field custom-select">
        <select v-model="propertyId" id="property" name="property_id" required>
          <option value></option>
          <option
            v-for="property in properties"
            :key="property.id"
            :value="property.id"
          >{{property.streetAddress}}</option>
        </select>
        <label for="property" :class="{ active: isFilledPropertyId }">
          Property
          <sup>*</sup>
        </label>
      </div>
      <div class="field submit">
        <input type="submit" class="btn reset-password" value="Reset Password" />
      </div>
    </form>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
export default {
  name: "forgotPassword",
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
    isFilledFirstName() {
      if (this.firstName !== "") {
        return true;
      }
      return false;
    },
    isFilledLastName() {
      if (this.firstName !== "") {
        return true;
      }
      return false;
    },
    isFilledEmail() {
      if (this.emailAddress !== "") {
        return true;
      }
      return false;
    },
    isFilledPropertyId() {
      if (this.propertyId !== "") {
        return true;
      }
      return false;
    }
  },
  created() {
    const url = "/api/properties";
    axios
      .get(url)
      .then(response => {
        this.properties = response.data;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    forgotPasswordConfirmationModal() {
      if (
        this.emailAddress !== "" &&
        this.verifyCode !== "" &&
        this.tempPassword !== "" &&
        this.propertyId !== ""
      ) {
        const message = `Are you sure you want to reset your password?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.forgotPassword.bind(this),
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
    forgotPassword() {
      const url = "/api/forgot-password";
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
          // reset form
          this.resetForm();
          // UPDATE UI
          HandleSuccess("Your password reset has been sent");
        })
        .catch(error => HandleError(error));
    }
  }
};
</script>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column-reverse;
  margin-top: 15px;
  margin-bottom: 15px;

  &.custom-select {
    position: relative;

    // arrow
    &::after {
      content: "\25BC";
      position: absolute;
      top: 24px;
      font-size: 14px;
      right: 0;
      padding: 0 1em;
      cursor: pointer;
      pointer-events: none;
      color: $blue-grey-very-dark;
    }
  }

  &.submit {
    margin-top: 35px;
    margin-bottom: 35px;
  }
}

label {
  align-self: start;
  margin-bottom: 4px;
  font-size: 0.9em;
  color: $blue-grey-placeholder;
  transform: translate(10px, 24px);
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
select:focus + label,
select + label.active {
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

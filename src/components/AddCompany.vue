<template>
  <div>
    <h2>ADD COMPANY</h2>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="addCompanyConfirmationModal"
        class="form__company"
      >
        <div class="field">
          <select v-model="type" id="cType" name="cType" required>
            <option value></option>
            <option value="electrical">Electrical</option>
            <option value="builder">Builder</option>
            <option value="plumbing">Plumbing</option>
            <option value="internet-tv">Internet and TV</option>
          </select>
          <label for="cType" :class="{ active: isCompanyType }">
            Company Type
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="name" type="text" id="cName" name="cName" required />
          <label for="cName" :class="{ active: isCompanyName }">
            Company Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="email" type="email" id="cEmail" name="cEmail" required />
          <label for="cEmail" :class="{ active: isCompanyEmail }">
            Email Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="contactNumber" type="tel" id="cNumber" name="cNumber" required />
          <label for="cNumber" :class="{ active: isCompanyNumber }">
            Contact Number
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="website" type="text" id="cWebsite" name="cWebsite" required />
          <label for="cWebsite" :class="{ active: isCompanyWebsite }">
            Company Website
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="address" type="text" id="cAddress" name="cAddress" required />
          <label for="cAddress" :class="{ active: isCompanyAddress }">
            Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="city" type="text" id="cCity" name="cCity" required />
          <label for="cCity" :class="{ active: isCompanyCity }">
            City
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <select v-model="state" type="text" id="cState" name="cState" required>
            <option value></option>
            <option value="CO">Colorado</option>
          </select>
          <label for="cState" :class="{ active: isCompanyState }">
            State
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="zipCode" type="text" id="cZipCode" name="cZipCode" required />
          <label for="cZipCode" :class="{ active: isCompanyZip }">
            Zip
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Create Company" />
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
  name: "addCompany",
  data() {
    return {
      type: "",
      name: "",
      email: "",
      contactNumber: "",
      website: "",
      address: "",
      city: "",
      state: "",
      zipCode: ""
    };
  },
  computed: {
    isCompanyType() {
      if (this.type !== "") {
        return true;
      }
      return false;
    },
    isCompanyName() {
      if (this.name !== "") {
        return true;
      }
      return false;
    },
    isCompanyEmail() {
      if (this.email !== "") {
        return true;
      }
      return false;
    },
    isCompanyNumber() {
      if (this.contactNumber !== "") {
        return true;
      }
      return false;
    },
    isCompanyWebsite() {
      if (this.website !== "") {
        return true;
      }
      return false;
    },
    isCompanyAddress() {
      if (this.address !== "") {
        return true;
      }
      return false;
    },
    isCompanyCity() {
      if (this.city !== "") {
        return true;
      }
      return false;
    },
    isCompanyState() {
      if (this.state !== "") {
        return true;
      }
      return false;
    },
    isCompanyZip() {
      if (this.zipCode !== "") {
        return true;
      }
      return false;
    }
  },
  methods: {
    showAllCompanies() {
      this.$emit("showAllCompanies");
    },
    addCompanyConfirmationModal() {
      if (
        this.type !== "" &&
        this.name !== "" &&
        this.email !== "" &&
        this.contactNumber !== "" &&
        this.website !== "" &&
        this.address !== "" &&
        this.city !== "" &&
        this.state !== "" &&
        this.zipCode !== ""
      ) {
        const message = "Are you sure you want to create this contact?";
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.addCompany.bind(this),
          cancelFn: this.resetForm.bind(this)
        });
      } else {
        HandleError({ message: "Please complete all fields" });
      }
    },
    resetForm() {
      this.type = "";
      this.name = "";
      this.email = "";
      this.contactNumber = "";
      this.website = "";
      this.address = "";
      this.city = "";
      this.state = "CO";
      this.zipCode = "";
    },
    addCompany(e) {
      const url = "/api/company/create";
      const axiosData = {
        type: this.type,
        name: this.name,
        email: this.email,
        contactNumber: this.contactNumber,
        website: this.website,
        address: this.address,
        city: this.city,
        state: this.state,
        zipCode: this.zipCode
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
          // update vue modal with additional event
          this.$emit("updateVueCompanies", response.data.result);
          // reset vue form model
          this.resetForm();
          // reset form
          // e.target.reset();
          // UI success message
          HandleSuccess(
            `The ${response.data.result.name} event has been created`
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

.form__company {
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
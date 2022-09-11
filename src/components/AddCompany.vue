<template>
  <div>
    <h2>ADD COMPANY</h2>
    <div class="container-form">
      <form
        action
        method="post"
        class="form__company"
        @submit.prevent="addCompanyConfirmationModal"
      >
        <div class="field">
          <select id="cType" v-model="type" name="cType" required>
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
          <input id="cName" v-model="name" type="text" name="cName" required />
          <label for="cName" :class="{ active: isCompanyName }">
            Company Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input id="cEmail" v-model="email" type="email" name="cEmail" />
          <label for="cEmail" :class="{ active: isCompanyEmail }">
            Email Address
          </label>
        </div>
        <div class="field">
          <input
            id="cNumber"
            v-model="contactNumber"
            type="tel"
            name="cNumber"
          />
          <label for="cNumber" :class="{ active: isCompanyNumber }">
            Contact Number
          </label>
        </div>
        <div class="field">
          <input id="cWebsite" v-model="website" type="text" name="cWebsite" />
          <label for="cWebsite" :class="{ active: isCompanyWebsite }">
            Company Website
          </label>
        </div>
        <div class="field">
          <input
            id="cAddress"
            v-model="address"
            type="text"
            name="cAddress"
            required
          />
          <label for="cAddress" :class="{ active: isCompanyAddress }">
            Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input id="cCity" v-model="city" type="text" name="cCity" required />
          <label for="cCity" :class="{ active: isCompanyCity }">
            City
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <select
            id="cState"
            v-model="state"
            type="text"
            name="cState"
            required
          >
            <option value></option>
            <option value="CO">Colorado</option>
          </select>
          <label for="cState" :class="{ active: isCompanyState }">
            State
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            id="cZipCode"
            v-model="zipCode"
            type="text"
            name="cZipCode"
            required
          />
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
  name: "AddCompany",
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
      zipCode: "",
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
    },
  },
  methods: {
    showAllCompanies() {
      this.$emit("showAllCompanies");
    },
    addCompanyConfirmationModal() {
      if (
        this.type !== "" &&
        this.name !== "" &&
        this.address !== "" &&
        this.city !== "" &&
        this.state !== "" &&
        this.zipCode !== ""
      ) {
        const message = "Are you sure you want to create this contact?";
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.addCompany.bind(this),
          cancelFn: this.resetForm.bind(this),
        });
      } else {
        HandleError({ message: "Please complete all required fields" });
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
    addCompany() {
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
        zipCode: this.zipCode,
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
          // update vue modal with additional company
          this.$emit("updateVueCompanies", response.data.result);
          // reset vue form model
          this.resetForm();
          // reset form
          // e.target.reset();
          // UI success message
          HandleSuccess(
            `The ${response.data.result.name} company has been created`
          );
        })
        .catch((error) => HandleError(error));
    },
  },
};
</script>

<style lang="scss" scoped>
.form__company {
  @media only screen and (min-width: $tablet) {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

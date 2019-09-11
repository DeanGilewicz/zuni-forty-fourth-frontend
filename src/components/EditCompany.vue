<template>
  <div>
    <h2>EDIT COMPANY</h2>
    <div class="container-form">
      <form
        action
        method="post"
        @submit.prevent="updateCompanyConfirmationModal"
        class="form__company"
      >
        <div class="field">
          <select v-model="theCompany.type" id="cType" name="cType" required>
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
          <input v-model="theCompany.name" type="text" id="cName" name="cName" required />
          <label for="cName" :class="{ active: isCompanyName }">
            Company Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theCompany.email" type="email" id="cEmail" name="cEmail" />
          <label for="cEmail" :class="{ active: isCompanyEmail }">
            Email Address
          </label>
        </div>
        <div class="field">
          <input v-model="theCompany.contactNumber" type="tel" id="cNumber" name="cNumber" />
          <label for="cNumber" :class="{ active: isCompanyNumber }">
            Contact Number
          </label>
        </div>
        <div class="field">
          <input v-model="theCompany.website" type="text" id="cWebsite" name="cWebsite" />
          <label for="cWebsite" :class="{ active: isCompanyWebsite }">
            Company Website
          </label>
        </div>
        <div class="field">
          <input v-model="theCompany.address" type="text" id="cAddress" name="cAddress" required />
          <label for="cAddress" :class="{ active: isCompanyAddress }">
            Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theCompany.city" type="text" id="cCity" name="cCity" required />
          <label for="cCity" :class="{ active: isCompanyCity }">
            City
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <select v-model="theCompany.state" type="text" id="cState" name="cState" required>
            <option value="CO" selected>Colorado</option>
          </select>
          <label class="active" for="cState">
            State
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theCompany.zipCode" type="text" id="cZipCode" name="cZipCode" required />
          <label for="cZipCode" :class="{ active: isCompanyZip }">
            Zip
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Update Company" />
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
  name: "editCompany",
  props: {
    company: Object
  },
  data() {
    return {
      theCompany: this.company,
      rollbackCompany: { ...this.company }
    };
  },
  computed: {
    isCompanyType() {
      if (this.theCompany.type !== "") {
        return true;
      }
      return false;
    },
    isCompanyName() {
      if (this.theCompany.name !== "") {
        return true;
      }
      return false;
    },
    isCompanyEmail() {
      if (this.theCompany.email !== "") {
        return true;
      }
      return false;
    },
    isCompanyNumber() {
      if (this.theCompany.contactNumber !== "") {
        return true;
      }
      return false;
    },
    isCompanyWebsite() {
      if (this.theCompany.website !== "") {
        return true;
      }
      return false;
    },
    isCompanyAddress() {
      if (this.theCompany.address !== "") {
        return true;
      }
      return false;
    },
    isCompanyCity() {
      if (this.theCompany.city !== "") {
        return true;
      }
      return false;
    },
    // isCompanyState() {
    //   if( this.theCompany.state !== "" ) {
    //     return true;
    //   }
    //   return false;
    // },
    isCompanyZip() {
      if (this.theCompany.zipCode !== "") {
        return true;
      }
      return false;
    }
  },
  methods: {
    showAllCompanies() {
      this.$emit("showAllCompanies");
    },
    updateCompanyConfirmationModal() {
      if (
        this.theCompany.address !== "" &&
        this.theCompany.city !== "" &&
        this.theCompany.name !== "" &&
        this.theCompany.state !== "" &&
        this.theCompany.type !== "" &&
        this.theCompany.zipCode !== ""
      ) {
        const message = `Are you sure you want to update ${capitalizeFirstLetter(
          this.rollbackCompany.name
        )}?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.updateCompany.bind(this),
          cancelFn: this.resetCompany.bind(this)
        });
      } else {
        HandleError({ message: "Please complete all fields" });
      }
    },
    resetCompany() {
      this.theCompany = { ...this.rollbackCompany };
    },
    updateCompany(e) {
      const url = "/api/company/update";
      const axiosData = {
        company: this.theCompany
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
          // update vue modal with additional event
          this.$emit("updateVueCompany", response.data.result);
          // UI success message
          HandleSuccess(`${response.data.result.name} has been updated`);
        })
        .catch(error => HandleError(error));
    }
  }
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
<template>
  <div class="contacts">
    <button
      v-if="showComponent !== 'showAllCompanies'"
      @click="showAllCompanies"
      class="btn-link"
    >All Companies</button>
    <button
      v-if="showComponent !== 'showAddCompany' && currentUserRole === 'Admin'"
      @click="showAddCompany"
      class="btn-link"
    >Add Company</button>
    <AllCompanies
      v-if="showComponent === 'showAllCompanies'"
      :currentUserRole="currentUserRole"
      :companies="companies"
      @onEditCompany="onEditCompany"
      @onDeleteCompany="deleteCompanyConfirmationModal"
    />
    <AddCompany
      v-if="showComponent === 'showAddCompany' && currentUserRole === 'Admin'"
      @showAllCompanies="showAllCompanies"
      @updateVueCompanies="AddCreatedCompany"
    />
    <EditCompany
      v-if="showComponent === 'showEditCompany' && currentUserRole === 'Admin'"
      :company="company"
      @showAllCompanies="showAllCompanies"
      @updateVueCompany="updateCompany"
    />
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
import AllCompanies from "@/components/AllCompanies.vue";
import AddCompany from "@/components/AddCompany.vue";
import EditCompany from "@/components/EditCompany.vue";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "Contacts",
  props: {
    currentUserRole: String
  },
  data() {
    return {
      showComponent: "showAllCompanies",
      companies: [],
      company: null
    };
  },
  created() {
    const url = "/api/companies";
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    // Start Loader
    EventBus.$emit("START_LOADING");
    axios
      .post(url, {}, axiosConfig)
      .then(response => {
        // Stop Loader
        EventBus.$emit("STOP_LOADING");
        this.companies = response.data.result;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    showAllCompanies() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAllCompanies";
    },
    showAddCompany() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAddCompany";
    },
    AddCreatedCompany(createdCompany) {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.companies.push(createdCompany);
    },
    onEditCompany(company) {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      // set company
      this.company = company;
      // show component
      this.showComponent = "showEditCompany";
    },
    updateCompany(updatedCompany) {
      // find company in companies array
      const companyIndex = this.companies.findIndex(
        company => company.id === updatedCompany.id
      );
      // set comapny
      this.companies[companyIndex] = updatedCompany;
    },
    deleteCompanyConfirmationModal(companyToDelete) {
      const message = `Are you sure you want to delete ${capitalizeFirstLetter(
        companyToDelete.name
      )}?`;
      EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
        message,
        confirmFn: this.deleteEvent.bind(this, companyToDelete)
      });
    },
    deleteEvent(companyToDelete) {
      if (typeof companyToDelete !== "undefined") {
        const url = "/api/company/delete";
        const axiosData = {
          company: companyToDelete
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
            if (this.companies.length > 0) {
              const deletedCompanyId = response.data.result.id;
              const companyPos = this.$data.companies
                .map(company => company.id)
                .indexOf(deletedCompanyId);
              const beforeDeletedCompany = this.$data.companies.slice(
                0,
                companyPos
              );
              const afterDeletedCompany = this.$data.companies.slice(
                companyPos + 1
              );
              this.companies = [
                ...beforeDeletedCompany,
                ...afterDeletedCompany
              ];
              // success message UI
              HandleSuccess(`${response.data.result.name} has been deleted`);
            }
          })
          .catch(error => HandleError(error));
      } else {
        HandleError({ message: "Contact not able to be deleted" });
      }
    }
  },
  components: {
    AllCompanies,
    AddCompany,
    EditCompany
  }
};
</script>

<style lang="scss" scoped>
.contacts {
  @media only screen and (min-width: $tablet) {
    padding-left: 50px;
    padding-right: 50px;
  }
}

.btn-link {
  margin-top: 20px;
  margin-bottom: 10px;
  border: none;
  padding: 0;
  background-color: transparent;
  text-transform: none;
  text-decoration: underline;
  color: $yellow-dark;

  &:nth-child(2) {
    margin-left: 30px;
  }
}
</style>
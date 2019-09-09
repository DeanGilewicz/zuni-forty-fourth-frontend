<template>
  <div>
    <h2>CONTACTS</h2>
    <ul class="container-companies">
      <li v-for="company in companies" :key="company.id" class="container-company">
        <h4>{{company.name}}</h4>
        <p>{{company.address}}, {{company.city}}, {{company.state}} {{company.zipCode}}</p>
        <p v-if="company.email">
          <a :href="`mailto:${company.email}`">{{company.email}}</a>
        </p>
        <p v-if="company.contactNumber">
          <a :href="`tel:${company.contactNumber}`">{{phoneNumberFormatted(company.contactNumber)}}</a>
        </p>
        <p v-if="company.website">
          <a :href="company.website">{{company.website}}</a>
        </p>
        <div v-if="currentUserRole === 'Admin'" class="admin-only">
          <button class="btn-edit" @click="onEditCompany(company)">Edit Company</button>
          <button class="btn-delete" @click="onDeleteCompany(company)">Delete Company</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { formatPhoneNumber } from "../utils/formatters";

export default {
  name: "allCompanies",
  props: {
    companies: Array,
    currentUserRole: String
  },
  methods: {
    onEditCompany(company) {
      this.$emit("onEditCompany", company);
    },
    onDeleteCompany(company) {
      this.$emit("onDeleteCompany", company);
    },
    phoneNumberFormatted(phoneNumber) {
      return formatPhoneNumber(phoneNumber);
    }
  }
};
</script>

<style lang="scss" scoped>
.container-companies {
  list-style-type: none;
  margin: 0;
  padding: 0 0 40px;
}

.container-company {
  border-top: 1px solid $white-off;
  padding-top: 20px;
  padding-bottom: 20px;

  a {
    text-decoration: none;
  }
}

.admin-only {
  display: flex;
  justify-content: center;
  text-align: center;

  .btn-edit,
  .btn-delete {
    margin: 20px 10px 10px;

    @media only screen and (min-width: $tablet) {
      margin: 20px 30px 10px;
    }
  }
}
</style>
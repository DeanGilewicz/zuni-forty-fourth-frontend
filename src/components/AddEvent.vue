<template>
  <div>
    <h2>ADD EVENT</h2>
    <div class="container-form">
      <form
        action
        method="post"
        class="form__event"
        @submit.prevent="addEventConfirmationModal"
      >
        <div class="field">
          <input id="eName" v-model="name" type="text" name="name" required />
          <label for="eName" :class="{ active: isEventName }">
            Event Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input id="cost" v-model="cost" type="text" name="cost" required />
          <label for="cost" :class="{ active: isEventCost }">
            Cost
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <datetime
            v-model="start"
            type="datetime"
            :minute-step="15"
          ></datetime>
          <label for="start" :class="{ active: isEventStart }">
            Start Day / Time
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <datetime
            v-model="end"
            type="datetime"
            :minute-step="15"
            :min-datetime="start"
          ></datetime>
          <label for="end" :class="{ active: isEventEnd }">
            End Day / Time
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            id="address"
            v-model="address"
            type="text"
            name="address"
            required
          />
          <label for="address" :class="{ active: isEventAddress }">
            Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input id="city" v-model="city" type="text" name="city" required />
          <label for="city" :class="{ active: isEventCity }">
            City
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input id="state" v-model="state" type="text" name="state" required />
          <label for="state" :class="{ active: isEventState }">
            State
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input
            id="zipCode"
            v-model="zipCode"
            type="text"
            name="zipCode"
            required
          />
          <label for="zipCode" :class="{ active: isEventZip }">
            Zip
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Create Event" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import "vue-datetime/dist/vue-datetime.css";
import { Datetime } from "vue-datetime";
import axios from "axios";

export default {
  name: "AddEvent",
  components: {
    Datetime,
  },
  data() {
    return {
      address: "",
      city: "",
      cost: "",
      end: "",
      name: "",
      start: "",
      state: "",
      zipCode: "",
    };
  },
  computed: {
    isEventName() {
      if (this.name !== "") {
        return true;
      }
      return false;
    },
    isEventCost() {
      if (this.cost !== "") {
        return true;
      }
      return false;
    },
    isEventStart() {
      if (this.start !== "") {
        return true;
      }
      return false;
    },
    isEventEnd() {
      if (this.end !== "") {
        return true;
      }
      return false;
    },
    isEventAddress() {
      if (this.address !== "") {
        return true;
      }
      return false;
    },
    isEventCity() {
      if (this.city !== "") {
        return true;
      }
      return false;
    },
    isEventState() {
      if (this.state !== "") {
        return true;
      }
      return false;
    },
    isEventZip() {
      if (this.zipCode !== "") {
        return true;
      }
      return false;
    },
  },
  methods: {
    showAllEvents() {
      this.$emit("showAllEvents");
    },
    addEventConfirmationModal() {
      if (
        this.address !== "" &&
        this.city !== "" &&
        this.cost !== "" &&
        this.end !== "" &&
        this.name !== "" &&
        this.start !== "" &&
        this.state !== "" &&
        this.zipCode !== ""
      ) {
        const message = "Are you sure you want to create this event?";
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.addEvent.bind(this),
          cancelFn: this.resetForm.bind(this),
        });
      } else {
        HandleError({ message: "Please complete all fields" });
      }
    },
    resetForm() {
      this.address = "";
      this.city = "";
      this.cost = "";
      this.end = "";
      this.name = "";
      this.start = "";
      this.state = "";
      this.zipCode = "";
    },
    addEvent() {
      const url = "/api/event/create";
      const axiosData = {
        address: this.address,
        city: this.city,
        cost: this.cost,
        end: this.end,
        name: this.name,
        start: this.start,
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
          // update vue modal with additional event
          this.$emit("updateVueEventModel", response.data.result);
          // reset vue form model
          this.resetForm();
          // reset form
          // e.target.reset();
          // UI success message
          HandleSuccess(
            `The ${response.data.result.name} event has been created`
          );
        })
        .catch((error) => HandleError(error));
    },
  },
};
</script>

<style lang="scss" scoped>
.form__event {
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

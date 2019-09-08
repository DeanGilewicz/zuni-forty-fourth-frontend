<template>
  <div>
    <h2>EDIT EVENT</h2>
    <div class="container-form">
      <form action method="post" @submit.prevent="updateEventConfirmationModal" class="form__event">
        <div class="field">
          <input v-model="theEvent.name" type="text" id="eName" name="name" required />
          <label for="eName" :class="{ active: isEventName }">
            Event Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theEvent.cost" type="text" id="cost" name="cost" required />
          <label for="cost" :class="{ active: isEventCost }">
            Cost
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <datetime type="datetime" v-model="formattedStartDateTime" :minute-step="15"></datetime>
          <label for="start" class="active">
            Start Day / Time
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <datetime
            type="datetime"
            v-model="formattedEndDateTime"
            :minute-step="15"
            :min-datetime="formattedStartDateTime"
          ></datetime>
          <label for="end" class="active">
            End Day / Time
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theEvent.address" type="text" id="address" name="address" required />
          <label for="address" :class="{ active: isEventAddress }">
            Street Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theEvent.city" type="text" id="city" name="city" required />
          <label for="city" :class="{ active: isEventCity }">
            City
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theEvent.state" type="text" id="state" name="state" required />
          <label for="state" :class="{ active: isEventState }">
            State
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="theEvent.zipCode" type="text" id="zipCode" name="zipCode" required />
          <label for="zipCode" :class="{ active: isEventZip }">
            Zip
            <sup>*</sup>
          </label>
        </div>
        <div class="field submit">
          <input type="submit" class="btn" value="Update Event" />
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
import HandleLocalDateTime from "../utils/handleLocalDateTime";
import axios from "axios";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "editEvent",
  props: {
    event: Object
  },
  data() {
    return {
      theEvent: this.event,
      rollbackEvent: { ...this.event }
    };
  },
  computed: {
    formattedStartDateTime: {
      get() {
        return HandleLocalDateTime(this.theEvent.start);
      },
      set(newValue) {
        this.theEvent.start = HandleLocalDateTime(newValue);
      }
    },
    formattedEndDateTime: {
      get() {
        return HandleLocalDateTime(this.theEvent.end);
      },
      set(newValue) {
        this.theEvent.end = HandleLocalDateTime(newValue);
      }
    },
    isEventName() {
      if (this.theEvent.name !== "") {
        return true;
      }
      return false;
    },
    isEventCost() {
      if (this.theEvent.cost !== "") {
        return true;
      }
      return false;
    },
    isEventAddress() {
      if (this.theEvent.address !== "") {
        return true;
      }
      return false;
    },
    isEventCity() {
      if (this.theEvent.city !== "") {
        return true;
      }
      return false;
    },
    isEventState() {
      if (this.theEvent.state !== "") {
        return true;
      }
      return false;
    },
    isEventZip() {
      if (this.theEvent.zipCode !== "") {
        return true;
      }
      return false;
    }
  },
  methods: {
    showAllEvents() {
      this.$emit("showAllEvents");
    },
    updateEventConfirmationModal() {
      if (
        this.theEvent.address !== "" &&
        this.theEvent.city !== "" &&
        this.theEvent.cost !== "" &&
        this.theEvent.end !== null &&
        this.theEvent.name !== "" &&
        this.theEvent.start !== null &&
        this.theEvent.state !== "" &&
        this.theEvent.zipCode !== ""
      ) {
        const message = `Are you sure you want to update the ${capitalizeFirstLetter(
          this.rollbackEvent.name
        )} event?`;
        EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
          message,
          confirmFn: this.updateEvent.bind(this),
          cancelFn: this.resetEvent.bind(this)
        });
      } else {
        HandleError({ message: "Please complete all fields" });
      }
    },
    resetEvent() {
      this.theEvent = { ...this.rollbackEvent };
    },
    updateEvent() {
      const url = "/api/event/update";
      const axiosData = {
        event: this.theEvent
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
          this.$emit("updateVueEvent", response.data.result);
          // UI success message
          HandleSuccess(
            `The ${response.data.result.name} event has been updated`
          );
        })
        .catch(error => HandleError(error));
    }
  },
  components: {
    Datetime
  }
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
<template>
  <div>
    <h2>ADD EVENT</h2>
    <div class="container-form">
      <form action method="post" @submit.prevent="addEventConfirmationModal" class="form__event">
        <div class="field">
          <input v-model="name" type="text" id="eName" name="name" />
          <label for="eName" :class="{ active: isEventName }">
            Event Name
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="cost" type="text" id="cost" name="cost" />
          <label for="cost" :class="{ active: isEventCost }">
            Cost
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <datetime type="datetime" v-model="start" :minute-step="15"></datetime>
          <label for="start" :class="{ active: isEventStart }">
            Start Day / Time
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <datetime type="datetime" v-model="end" :minute-step="15" :min-datetime="start"></datetime>
          <label for="end" :class="{ active: isEventEnd }">
            End Day / Time
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="address" type="text" id="address" name="address" />
          <label for="address" :class="{ active: isEventAddress }">
            Address
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="city" type="text" id="city" name="city" />
          <label for="city" :class="{ active: isEventCity }">
            City
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="state" type="text" id="state" name="state" />
          <label for="state" :class="{ active: isEventState }">
            State
            <sup>*</sup>
          </label>
        </div>
        <div class="field">
          <input v-model="zipCode" type="text" id="zipCode" name="zipCode" />
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
  name: "addEvent",
  data() {
    return {
      address: "",
      city: "",
      cost: "",
      end: "",
      name: "",
      start: "",
      state: "",
      zipCode: ""
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
    }
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
          cancelFn: this.resetForm.bind(this)
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
    addEvent(e) {
      const url = "/api/event/create";
      const axiosData = {
        address: this.address,
        city: this.city,
        cost: this.cost,
        end: this.end,
        name: this.name,
        start: this.start,
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
        .catch(error => HandleError(error));
    }
  },
  components: {
    Datetime
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

.form__event {
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
      margin-left: auto;
      margin-right: auto;
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
.vdatetime + label.active {
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
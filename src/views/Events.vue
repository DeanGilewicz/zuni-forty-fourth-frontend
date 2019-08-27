<template>
  <div class="events">
    <button
      v-if="showComponent !== 'showAllEvents'"
      @click="showAllEvents"
      class="btn-link"
    >All Events</button>
    <button
      v-if="showComponent !== 'showAddEvent' && currentUserRole === 'Admin'"
      @click="showAddEvent"
      class="btn-link"
    >Add Event</button>
    <AllEvents
      v-if="showComponent === 'showAllEvents'"
      :currentUserRole="currentUserRole"
      :events="events"
      @onEditEvent="onEditEvent"
      @onDeleteEvent="deleteEventConfirmationModal"
    />
    <AddEvent
      v-if="showComponent === 'showAddEvent' && currentUserRole === 'Admin'"
      @showAllEvents="showAllEvents"
      @updateVueEventModel="AddCreatedEvent"
    />
    <EditEvent
      v-if="showComponent === 'showEditEvent' && currentUserRole === 'Admin'"
      :event="event"
      @showAllEvents="showAllEvents"
      @updateVueEvent="updateEvent"
    />
  </div>
</template>

<script>
import EventBus from "../eventBus";
import HandleError from "../utils/handleError";
import HandleSuccess from "../utils/handleSuccess";
import axios from "axios";
import AllEvents from "../components/AllEvents";
import AddEvent from "../components/AddEvent";
import EditEvent from "@/components/EditEvent.vue";
import { capitalizeFirstLetter } from "../utils/formatters";
export default {
  name: "events",
  props: {
    currentUserRole: String
  },
  data() {
    return {
      showComponent: "showAllEvents",
      events: [],
      event: null
    };
  },
  created() {
    const url = "/api/events";
    const axiosConfig = {
      crossDomain: true,
      withCredentials: true
    };
    axios
      .post(url, {}, axiosConfig)
      .then(response => {
        this.events = response.data.result;
      })
      .catch(error => HandleError(error));
  },
  methods: {
    showAllEvents() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAllEvents";
    },
    showAddEvent() {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.showComponent = "showAddEvent";
    },
    AddCreatedEvent(createdEvent) {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      this.events.push(createdEvent);
    },
    onEditEvent(event) {
      EventBus.$emit("RESET_ERRORS_MESSAGES_MODAL");
      // set event
      this.event = event;
      // show component
      this.showComponent = "showEditEvent";
    },
    updateEvent(updatedEvent) {
      // find event in events array
      const eventIndex = this.events.findIndex(
        event => event.id === updatedEvent.id
      );
      // set event
      this.events[eventIndex] = updatedEvent;
    },
    deleteEventConfirmationModal(eventToDelete) {
      const message = `Are you sure you want to delete the ${capitalizeFirstLetter(
        eventToDelete.name
      )} event?`;
      EventBus.$emit("OPEN_CONFIRMATION_MODAL", {
        message,
        confirmFn: this.deleteEvent.bind(this, eventToDelete)
      });
    },
    deleteEvent(eventToDelete) {
      if (typeof eventToDelete !== "undefined") {
        const url = "/api/event/delete";
        const axiosData = {
          event: eventToDelete
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
            if (this.events.length > 0) {
              const deletedEventId = response.data.result.id;
              const eventPos = this.events
                .map(event => event.id)
                .indexOf(deletedEventId);
              const beforeDeletedEvent = this.events.slice(0, eventPos);
              const afterDeletedEvent = this.events.slice(eventPos + 1);
              this.events = [...beforeDeletedEvent, ...afterDeletedEvent];
              // success message UI
              HandleSuccess(
                `The ${response.data.result.name} event has been deleted`
              );
            }
          })
          .catch(error => HandleError(error));
      } else {
        HandleError({ message: "User not able to be deleted" });
      }
    }
  },
  components: {
    AllEvents,
    AddEvent,
    EditEvent
  }
};
</script>

<style lang="scss" scoped>
.events {
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
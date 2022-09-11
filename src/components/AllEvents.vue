<template>
  <div>
    <h2>EVENTS</h2>
    <ul class="container-events">
      <li v-for="event in events" :key="event.id" class="container-event">
        <div class="event-info">
          <div class="event-times">
            <p>{{ formatDate(event.start) }} {{ formatTime(event.start) }}</p>
            <p>{{ formatDate(event.end) }} {{ formatTime(event.end) }}</p>
            <p>{{ event.cost === 0 ? "Free" : "$" + event.cost }}</p>
          </div>
          <div class="event-address">
            <h4>{{ event.name }}</h4>
            <p>{{ event.address }}</p>
            <p>{{ event.city }}, {{ event.state }} {{ event.zipCode }}</p>
          </div>
        </div>
        <div v-if="currentUserRole === 'Admin'" class="admin-only">
          <div class="btn-edit-container">
            <button class="btn-edit" @click="onEditEvent(event)">
              Edit Event
            </button>
          </div>
          <div class="btn-delete-container">
            <button class="btn-delete" @click="onDeleteEvent(event)">
              Delete Event
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AllEvents",
  props: {
    events: Array,
    currentUserRole: String,
  },
  methods: {
    onEditEvent(event) {
      this.$emit("onEditEvent", event);
    },
    onDeleteEvent(event) {
      this.$emit("onDeleteEvent", event);
    },
    formatTime(dateTime) {
      if (dateTime) {
        var dt = new Date(dateTime);
        var hours = dt.getHours();
        var minutes = dt.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + ampm;
        return strTime;
      }
    },
    formatDate(dateTime) {
      if (dateTime) {
        var dt = new Date(dateTime);
        var months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container-events {
  list-style-type: none;
  margin: 0;
  padding: 0 0 40px;
}

.container-event {
  border-top: 1px solid $white-off;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;

  @media only screen and (min-width: $tablet) {
    padding-top: 30px;
    padding-bottom: 30px;
    text-align: left;
  }

  h4,
  p {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .event-times {
    @media only screen and (min-width: $tablet) {
      flex-basis: 50%;
      padding-right: 30px;
      text-align: right;
    }

    @media only screen and (min-width: $desktop) {
    }

    p:first-child {
      font-weight: 600;
    }

    p:last-of-type {
      margin-top: 16px;
    }
  }

  .event-address {
    @media only screen and (min-width: $tablet) {
      flex-basis: 50%;
      padding-left: 30px;
    }

    @media only screen and (min-width: $desktop) {
    }

    h4 {
      font-size: 1.1rem;
    }
  }
}

.event-info {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;

  @media only screen and (min-width: $tablet) {
    flex-direction: row;
  }
}

.admin-only {
  display: flex;

  .btn-edit-container,
  .btn-delete-container {
    flex-basis: 50%;
  }

  .btn-edit-container {
    text-align: right;
  }

  .btn-edit,
  .btn-delete {
    margin: 20px 10px 10px;

    @media only screen and (min-width: $tablet) {
      margin: 20px 30px 10px;
    }
  }
}
</style>

<template>
  <div>
    <q-select
      v-if="!isMedic"
      filled
      v-model="selectedMedics"
      multiple
      :options="optionsMedics"
      use-chips
      stack-label
      use-input
      @filter="filterMedics"
      input-debounce="0"
      label="Medics selected"
    />
    <q-select
      filled
      v-if="isMedic"
      v-model="selectedPatients"
      multiple
      :options="optionsPatients"
      use-chips
      stack-label
      use-input
      @filter="filterPatients"
      input-debounce="0"
      label="Patients selected"
    />
    <q-separator /><q-select
      filled
      v-model="selectedServices"
      multiple
      :options="optionsServices"
      use-chips
      use-input
      input-debounce="0"
      stack-label
      @filter="filterServices"
      label="Services selected"
    />
    <q-separator />
    <q-checkbox v-model="onlyHis" label="Only my appointments" />
    <div class="row justify-center q-mb-md">
      <q-btn filled label="Prev" @click="calendarPrev" />
      <q-separator vertical />
      <q-select filled v-model="view" :options="viewOptions" />
      <q-separator vertical />
      <q-btn filled label="Next" @click="calendarNext" />
    </div>

    <q-separator />

    <q-calendar
      v-if="isMedic"
      ref="calendar"
      v-model="selectedDate"
      :view="view.value"
      locale="en-us"
      :enable-outside-days="true"
      animated
      :bordered="true"
      @click:time2="onClickTime"
      @click:day2="onClickTime"
      :interval-height="50"
      :interval-start="8"
      :interval-count="10"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      class="calendar-container medic"
      transition-prev="slide-right"
      transition-next="slide-left"
      ><template #day-header="{ timestamp }">
        <div class="row justify-center">
          <template v-for="(event, index) in eventsMap[timestamp.date]">
            <q-badge
              v-if="!event.time"
              :key="index"
              style="width: 100%; cursor: pointer;"
              :class="badgeClasses(event, 'header')"
              :style="badgeStyles(event, 'header')"
            >
              <q-icon
                v-if="event.icon"
                :name="event.icon"
                class="q-mr-xs"
              ></q-icon
              ><span class="ellipsis">{{ event.title }}</span>
            </q-badge>
            <q-badge
              v-else
              :key="index"
              class="q-ma-xs"
              :class="badgeClasses(event, 'header')"
              :style="badgeStyles(event, 'header')"
              style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"
            />
          </template>
        </div>
      </template>
      <template #day="{ timestamp }">
        <template v-for="(event, index) in getEvents(timestamp.date)">
          <q-badge
            :key="index"
            style="width: 100%; cursor: pointer; height: 16px; max-height: 16px"
            :class="badgeClasses(event, 'day')"
            :style="badgeStyles(event, 'day')"
            @click="onEventClick(event)"
          >
            <q-icon
              v-if="event.icon"
              :name="event.icon"
              class="q-mr-xs"
            ></q-icon
            ><span class="ellipsis">{{ event.title }}</span>
          </q-badge>
        </template>
      </template>
      <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
        <template v-for="(event, index) in getEvents(timestamp.date)">
          <q-badge
            v-if="event.time"
            :key="index"
            class="my-event justify-center "
            :class="badgeClasses(event, 'body')"
            style="cursor: pointer;"
            @click="onEventClick(event)"
            :style="
              badgeStyles(event, 'body', timeStartPos, timeDurationHeight)
            "
          >
            <q-icon
              v-if="event.icon"
              :name="event.icon"
              class="q-mr-xs"
            ></q-icon
            ><span class="ellipsis">{{ event.title }}</span>
          </q-badge>
        </template>
      </template>
    </q-calendar>
    <q-calendar
      v-else
      ref="calendar"
      v-model="selectedDate"
      :view="view.value"
      locale="en-us"
      animated
      :bordered="true"
      :interval-height="50"
      :interval-start="8"
      :interval-count="10"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      class="calendar-container patient"
      transition-prev="slide-right"
      transition-next="slide-left"
      ><template #day-header="{ timestamp }">
        <div class="row justify-center">
          <template v-for="(event, index) in eventsMap[timestamp.date]">
            <q-badge
              v-if="!event.time"
              :key="index"
              style="width: 100%; cursor: pointer;"
              :class="badgeClasses(event, 'header')"
              :style="badgeStyles(event, 'header')"
            >
              <q-icon
                v-if="event.icon"
                :name="event.icon"
                class="q-mr-xs"
              ></q-icon
              ><span class="ellipsis">{{ event.title }}</span>
            </q-badge>
            <q-badge
              v-else
              :key="index"
              class="q-ma-xs"
              :class="badgeClasses(event, 'header')"
              :style="badgeStyles(event, 'header')"
              style="width: 10px; max-width: 10px; height: 10px; max-height: 10px"
            />
          </template>
        </div>
      </template>
      <template #day="{ timestamp }">
        <template v-for="(event, index) in getEvents(timestamp.date)">
          <q-badge
            :key="index"
            style="width: 100%; cursor: pointer; height: 16px; max-height: 16px"
            :class="badgeClasses(event, 'day')"
            :style="badgeStyles(event, 'day')"
            @click="onEventClick(event)"
          >
            <q-icon
              v-if="event.icon"
              :name="event.icon"
              class="q-mr-xs"
            ></q-icon
            ><span class="ellipsis">{{ event.title }}</span>
          </q-badge>
        </template>
      </template>
      <template #day-body="{ timestamp, timeStartPos, timeDurationHeight }">
        <template v-for="(event, index) in getEvents(timestamp.date)">
          <q-badge
            v-if="event.time"
            :key="index"
            class="my-event justify-center "
            :class="badgeClasses(event, 'body')"
            style="cursor: pointer;"
            @click="onEventClick(event)"
            :style="
              badgeStyles(event, 'body', timeStartPos, timeDurationHeight)
            "
          >
            <q-icon
              v-if="event.icon"
              :name="event.icon"
              class="q-mr-xs"
            ></q-icon
            ><span class="ellipsis">{{ event.title }}</span>
          </q-badge>
        </template>
      </template>
    </q-calendar>

    <q-dialog v-model="confirm">
      <q-card style="width:80%">
        <q-toolbar class="q-mt-md row">
          <q-avatar>
            <q-icon name="local_hospital" size="lg" />
          </q-avatar>

          <q-toolbar-title class="text-weight-bold"
            >Appointment reservation
          </q-toolbar-title>
          <div class="row justify-center items-center" v-if="selectedUrl">
            <q-toolbar-title> Join room </q-toolbar-title>
            <q-btn
              icon="videocam"
              color="primary"
              size="lg"
              fill
              type="a"
              round
              target="_blank"
              @click="onClickUrl(selectedUrl)"
              dense
            />
          </div>
        </q-toolbar>
        <div class="row ">
          <q-card-section class="column"
            ><p class="q-ml-sm  q-ma-xs text-body1 text-weight-bold">
              Service details:
            </p>
            <p class="q-ml-xl q-ma-none">
              Name: <b>{{ selectedEvent.service.name }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Category: <b>{{ selectedEvent.service.category }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Description: <b>{{ selectedEvent.service.description }}</b>
            </p> </q-card-section
          ><q-card-section class="q-ml-xl column"
            ><p class="q-ml-sm  q-ma-xs text-body1 text-weight-bold">
              Reservation details:
            </p>
            <p class="q-ml-xl q-ma-none">
              Date: <b>{{ selectedEvent.date }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Time: <b>{{ selectedEvent.time }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Duration: <b>{{ selectedEvent.duration }} minutes</b>
            </p>
          </q-card-section>
        </div>
        <q-card-section v-if="isHis">
          <q-input
            class="q-ml-sm"
            v-model="selectedObservation"
            filled
            :readonly="!isMedic"
            label="Observations"
            autogrow
        /></q-card-section>
        <q-card-section class=" column" v-if="!isMedic || !isHis">
          <p class="q-ml-sm  q-ma-xs text-body1 text-weight-bold">
            Medic details:
          </p>
          <p class="q-ml-xl q-ma-none">
            Name:
            <b
              >{{ selectedEvent.medic.firstName }}
              {{ selectedEvent.medic.lastName }}</b
            >
          </p>
          <p class="q-ml-xl q-ma-none">
            Phone: <b>{{ selectedEvent.medic.phone }}</b>
          </p>
          <p class="q-ml-xl q-ma-none">
            Email: <b>{{ selectedEvent.medic.email }}</b>
          </p>
          <p class="q-ml-xl q-ma-none">
            City: <b>{{ selectedEvent.medic.city }}</b>
          </p>
          <q-input
            class="q-ml-xl q-ma-none"
            style="width:80%"
            outlined
            v-model="selectedEvent.medic.info"
            :dense="true"
            readonly
          />
        </q-card-section>
        <q-card-section class=" column" v-if="isMedic && isHis">
          <p class="q-ml-sm  q-ma-xs text-body1 text-weight-bold">
            Patient details:
          </p>
          <div v-if="selectedPatientInfo">
            <p class="q-ml-xl q-ma-none">
              Name:
              <b
                >{{ selectedPatientInfo.firstName }}
                {{ selectedPatientInfo.lastName }}</b
              >
            </p>
            <p class="q-ml-xl q-ma-none">
              Phone: <b>{{ selectedPatientInfo.phone }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Email: <b>{{ selectedPatientInfo.email }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              City: <b>{{ selectedPatientInfo.city }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Birth date: <b>{{ selectedPatientInfo.birthDate }}</b>
            </p>
            <q-input
              class="q-ml-xl q-ma-none"
              style="width:80%"
              outlined
              v-model="selectedPatientInfo.info"
              :dense="true"
              readonly
            />
          </div>
          <p class="q-ml-xl  q-ma-xs" v-else>Not reserved yet</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            v-if="!isMedic"
            fill
            :label="
              selectedEvent.status != 'OPEN' && isHis ? 'UNRESERVE' : 'RESERVE'
            "
            :disabled="selectedEvent.status != 'OPEN' && !isHis"
            :color="selectedEvent.status != 'OPEN' && isHis ? 'red' : 'primary'"
            @click="executeReserve()"
            v-close-popup
          />
          <q-btn
            v-if="isMedic && isHis"
            fill
            label="Delete"
            color="red"
            @click="confirmDelete = true"
          />
          <q-btn
            v-if="isMedic && isHis"
            fill
            label="Update"
            color="primary"
            @click="executeUpdate()"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-toolbar class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm"
            >Deleting an appointment is an irreversible command. Be
            cautious.</span
          >
        </q-toolbar>
        <q-card-section
          >Are you sure you want to delete the appointment of
          <b>{{ selectedEvent.service.name }}</b> from <br />
          <b>Date: {{ selectedEvent.date }} at {{ selectedEvent.time }}</b
          >?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            fill
            label="Confirm delete"
            color="red"
            @click="executeDeleteAppointment()"
          />
        </q-card-actions> </q-card
    ></q-dialog>
    <q-dialog v-model="dialog">
      <q-card style="width:100%">
        <q-toolbar>
          <q-toolbar-title class="text-weight-bold"
            >Create an appointment
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section>
          <q-select
            flat
            v-model="newEvent.service"
            :options="medicServices"
            label="Service"
          />
        </q-card-section>
        <q-card-section
          ><div class="q-gutter-md row justify-around">
            <q-date v-model="newEvent.dateTime" mask="YYYY-MM-DDTHH:mm" />
            <q-time v-model="newEvent.dateTime" mask="YYYY-MM-DDTHH:mm" />
          </div>
        </q-card-section>
        <q-card-section>
          <q-item>
            <q-item-section avatar>
              <p>
                Duration: <b>{{ newEvent.duration }} minutes</b>
              </p>
            </q-item-section>
            <q-item-section>
              <q-slider
                label
                markers
                :step="10"
                v-model="newEvent.duration"
                :min="10"
                :max="120"
              />
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newEvent.url" flat type="url" label="URL" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn fill label="Add" color="primary" @click="executeAddEvent()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="q-mt-md row justify-around" v-if="isMedic">
      <q-badge class="q-pa-sm" color="blue">
        Other medics appointment with no reservation </q-badge
      ><q-badge class="q-pa-sm" color="grey">
        Other medics appointment reserved already </q-badge
      ><q-badge class="q-pa-sm" color="teal">
        My appointment without reservation yet </q-badge
      ><q-badge class="q-pa-sm" color="green">
        My appointment with reservation
      </q-badge>
    </div>
    <div class="q-mt-md row justify-around" v-else>
      <q-badge class="q-pa-sm" color="blue">
        Appointments available to reserve </q-badge
      ><q-badge class="q-pa-sm" color="grey">
        Other patients already reserved appointments </q-badge
      ><q-badge class="q-pa-sm" color="green">
        My reserved appointments
      </q-badge>
    </div>
  </div>
</template>

<script>
import { openURL } from "quasar";
import QCalendar from "@quasar/quasar-ui-qcalendar"; // ui is aliased from '@quasar/quasar-ui-qcalendar'

function hexToRgb(hex) {
  if (typeof hex !== "string") {
    throw new TypeError("Expected a string");
  }

  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  } else if (hex.length === 4) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }

  const num = parseInt(hex, 16);

  return hex.length > 6
    ? {
        r: (num >> 24) & 255,
        g: (num >> 16) & 255,
        b: (num >> 8) & 255,
        a: Math.round((num & 255) / 2.55)
      }
    : { r: num >> 16, g: (num >> 8) & 255, b: num & 255 };
}

function luminosity(color) {
  if (typeof color !== "string" && (!color || color.r === undefined)) {
    throw new TypeError("Expected a string or a {r, g, b} object as color");
  }

  const rgb = typeof color === "string" ? hexToRgb(color) : color,
    r = rgb.r / 255,
    g = rgb.g / 255,
    b = rgb.b / 255,
    R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}
export default {
  name: "Appointment",
  data() {
    return {
      confirmDelete: false,
      onlyHis: false,
      selectedMedics: [],
      selectedServices: [],
      selectedPatients: [],
      optionsServices: [],
      optionsMedics: [],
      optionsPatients: [],
      dialog: false,
      newEvent: {
        duration: 20,
        dateTime: "",
        url: "",
        service: { label: "", value: "" }
      },

      selectedEvent: {
        id: 3,
        duration: 20,
        date: "2021-05-25",
        time: "10:10",
        medic: {
          id: 1,
          firstName: "George",
          lastName: "Vasile",
          info: null,
          email: "george.vasile2@gmail.com",
          phone: "0722222222",
          city: "Bucharest"
        },
        service: {
          id: 1,
          name: "ceva",
          category: "analiza",
          description: "altceva",
          createdAt: "2021-05-23T22:51:58.000Z",
          updatedAt: "2021-05-23T22:51:58.000Z"
        },
        status: "OPEN"
      },
      selectedObservation: "",
      selectedDate: "",
      confirm: false,
      title: "",
      view: { value: "month", label: "MONTH" },
      viewOptions: [
        { value: "day", label: "DAY" },
        { value: "week", label: "WEEK" },
        { value: "month", label: "MONTH" }
      ]
    };
  },
  beforeMount() {
    const user = this.$q.localStorage.getItem("user");
    if (!user) {
      this.$router.push("/auth");
    } else {
      this.$store.dispatch("data/loadAppointments");
      this.$store.dispatch("data/loadMedicServices");
      this.$store.dispatch("data/loadServices");
      if (user.type == "medic") {
        this.$store.dispatch("data/loadMedicAppointments");
      } else {
        this.$store.dispatch("data/loadPatientAppointments");
      }
    }
  },
  methods: {
    executeDeleteAppointment() {
      this.$axios
        .put(`/api/appointments/medic/${this.selectedEvent.id}`, {
          cancel: true
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadAppointments");
          this.$store.dispatch("data/loadMedicServices");

          this.$store.dispatch("data/loadMedicAppointments");

          this.confirm = false;
          this.confirmDelete = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 401: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
              this.confirmDelete = false;
            }
          }
        });
    },
    executeUpdate() {
      this.$axios
        .put(`/api/appointments/medic/${this.selectedEvent.id}`, {
          observation: this.selectedObservation
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadAppointments");
          this.$store.dispatch("data/loadMedicServices");

          this.$store.dispatch("data/loadMedicAppointments");
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 401: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
        });
    },
    filterServices(val, update) {
      if (val === "") {
        update(() => {
          this.optionsServices = this.services;

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optionsServices = this.services.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterMedics(val, update) {
      if (val === "") {
        update(() => {
          this.optionsMedics = this.medics;

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optionsMedics = this.medics.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterPatients(val, update) {
      if (val === "") {
        update(() => {
          this.optionsPatients = this.patients;

          // with Quasar v1.7.4+
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.optionsPatients = this.patients.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },

    executeAddEvent() {
      this.$axios
        .post(`/api/appointments/medic`, {
          url: this.newEvent.url,
          date: new Date(Date.parse(this.newEvent.dateTime)),
          duration: this.newEvent.duration,
          serviceId: this.newEvent.service.value
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.dialog = false;
          this.$store.dispatch("data/loadAppointments");
          this.$store.dispatch("data/loadMedicServices");

          this.$store.dispatch("data/loadMedicAppointments");
        })
        .catch(error => {
          switch (error.response.status) {
            case 401: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
        });
    },
    onEventClick(event) {
      if (!this.dialog) {
        this.selectedEvent = { ...event };
        this.confirm = true;
      }
    },
    executeReserve() {
      this.$axios
        .put(`/api/appointments/${this.selectedEvent.id}`)
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadAppointments");
          this.$store.dispatch("data/loadPatientAppointments");
        })
        .catch(error => {
          switch (error.response.status) {
            case 401: {
              error.response.data.errors.forEach(element => {
                this.$q.notify({
                  color: "negative",
                  message: element
                });
              });
              break;
            }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
          this.$store.dispatch("data/loadAppointments");
        });
    },
    onClickTime(data) {
      if (!this.confirm) {
        this.dialog = true;
        this.newEvent.dateTime = `${data.scope.timestamp.date}T${
          data.scope.timestamp.time ? data.scope.timestamp.time : "08:00"
        }`;
      }
    },

    //utils

    calendarNext() {
      this.$refs.calendar.next();
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    },
    isCssColor(color) {
      return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
    },

    badgeClasses(event, type) {
      const cssColor = this.isCssColor(event.bgcolor);
      const isHeader = type === "header";
      return {
        [`text-white bg-${event.bgcolor}`]: !cssColor,
        "full-width": !isHeader && (!event.side || event.side === "full"),
        "left-side": !isHeader && event.side === "left",
        "right-side": !isHeader && event.side === "right"
      };
    },

    badgeStyles(event, type, timeStartPos, timeDurationHeight) {
      const s = {};
      if (this.isCssColor(event.bgcolor)) {
        s["background-color"] = event.bgcolor;
        s.color = luminosity(event.bgcolor) > 0.5 ? "black" : "white";
      }
      if (timeStartPos) {
        s.top = timeStartPos(event.time) + "px";
      }
      if (timeDurationHeight) {
        s.height = timeDurationHeight(event.duration) + "px";
      }
      s["align-items"] = "flex-start";
      return s;
    },

    getEvents(dt) {
      const currentDate = QCalendar.parseTimestamp(dt);
      const events = [];
      for (let i = 0; i < this.events.length; ++i) {
        let added = false;
        if (this.events[i].date === dt) {
          if (this.events[i].time) {
            if (events.length > 0) {
              // check for overlapping times
              const startTime = QCalendar.parseTimestamp(
                this.events[i].date + " " + this.events[i].time
              );
              const endTime = QCalendar.addToDate(startTime, {
                minute: this.events[i].duration
              });
              for (let j = 0; j < events.length; ++j) {
                if (events[j].time) {
                  const startTime2 = QCalendar.parseTimestamp(
                    events[j].date + " " + events[j].time
                  );
                  const endTime2 = QCalendar.addToDate(startTime2, {
                    minute: events[j].duration
                  });
                  if (
                    QCalendar.isBetweenDates(startTime, startTime2, endTime2) ||
                    QCalendar.isBetweenDates(endTime, startTime2, endTime2)
                  ) {
                    events[j].side = "left";
                    this.events[i].side = "right";
                    events.push(this.events[i]);
                    added = true;
                    break;
                  }
                }
              }
            }
          }
          if (!added) {
            this.events[i].side = undefined;
            events.push(this.events[i]);
          }
        } else if (this.events[i].days) {
          // check for overlapping dates
          const startDate = QCalendar.parseTimestamp(this.events[i].date);
          const endDate = QCalendar.addToDate(startDate, {
            day: this.events[i].days
          });
          if (QCalendar.isBetweenDates(currentDate, startDate, endDate)) {
            events.push(this.events[i]);
            added = true;
          }
        }
      }
      return events;
    },
    isHisById(id) {
      return this.$q.localStorage.getItem("user").type == "medic"
        ? !!this.medicEvents.find(e => e.id == id)
        : !!this.patientEvents.find(e => e.id == id);
    },
    onClickUrl: function(link) {
      openURL(link);
    }
  },
  computed: {
    isHis() {
      return this.$q.localStorage.getItem("user").type == "medic"
        ? !!this.medicEvents.find(e => e.id == this.selectedEvent.id)
        : !!this.patientEvents.find(e => e.id == this.selectedEvent.id);
    },
    isMedic() {
      return this.$q.localStorage.getItem("user")
        ? this.$q.localStorage.getItem("user").type == "medic"
        : false;
    },
    eventsMap() {
      const map = {};
      this.events.forEach(event =>
        (map[event.date] = map[event.date] || []).push(event)
      );
      return map;
    },
    medicEvents() {
      return this.$store.getters["data/getMedicAppointments"];
    },

    patientEvents() {
      return this.$store.getters["data/getPatientAppointments"];
    },
    selectedPatientInfo() {
      const x = this.medicEvents.find(item => item.id == this.selectedEvent.id);
      this.selectedObservation = x.observation;
      return x ? x.patient : {};
    },

    selectedUrl() {
      if (this.isHis) {
        const x = this.isMedic
          ? this.medicEvents.find(item => item.id == this.selectedEvent.id)
          : this.patientEvents.find(item => item.id == this.selectedEvent.id);
        if (x && !this.isMedic) this.selectedObservation = x.observation;
        return x ? x.url : "";
      } else return "";
    },

    events() {
      return this.$store.getters["data/getAppointments"]
        .filter(item => {
          if (this.selectedMedics.length == 0) return true;
          else return this.selectedMedics.find(it => it.value == item.medic.id);
        })
        .filter(item => {
          if (this.selectedPatients.length == 0) return true;
          else {
            const event = this.medicEvents.find(it => it.id == item.id);
            if (!event || !event.patient) return false;
            else
              return this.selectedPatients.find(
                it => it.value == event.patient.id
              );
          }
        })
        .filter(item => {
          if (this.selectedServices.length == 0) return true;
          else
            return this.selectedServices.find(
              it => it.value == item.service.id
            );
        })
        .filter(item => {
          if (!this.onlyHis) return true;
          else {
            return this.isHisById(item.id);
          }
        })
        .map(item => {
          let bgcolor = null;
          const isHis =
            this.$q.localStorage.getItem("user").type == "medic"
              ? !!this.medicEvents.find(e => e.id == item.id)
              : !!this.patientEvents.find(e => e.id == item.id);
          if (item) {
            if (item.status != "OPEN" && !isHis) bgcolor = "#696969";
            //grey
            else if (item.status != "OPEN" && isHis) bgcolor = "#006400";
            //green
            else if (item.status == "OPEN" && !isHis) bgcolor = "#027be3";
            //blue
            else if (item.status == "OPEN" && isHis) bgcolor = "#009688"; //teal
          }
          return {
            ...item,
            title: `${item.service.name} - ${item.medic.firstName} ${
              item.medic.lastName
            }`,
            bgcolor
          };
        });
    },
    medicServices() {
      const user = this.$q.localStorage.getItem("user");

      const list = this.$store.getters["data/getMedicServices"].find(
        item => item.id == user.id
      );

      return list
        ? list.services.map(item => ({ value: item.id, label: item.name }))
        : [];
    },
    services() {
      return this.$store.getters["data/getServices"].map(item => ({
        label: `${item.name}`,
        value: item.id
      }));
    },
    medics() {
      return this.$store.getters["data/getMedicServices"].map(item => ({
        label: `${item.firstName} ${item.lastName}`,
        value: item.id
      }));
    },
    patients() {
      return this.$store.getters["data/getMedicAppointments"]
        .map(item => item.patient)
        .filter(item => !!item)
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        .map(item => ({
          label: `${item.firstName} ${item.lastName}`,
          value: item.id
        }));
    }
  }
};
</script>
<style lang="sass">
.calendar-container
  position: relative


.medic .q-calendar-daily__day-interval:hover
  background-color:#F5F5F5
.medic .q-calendar-daily__day-interval
  cursor: pointer;




.medic .q-calendar-weekly__day:hover
  background-color:#F5F5F5

.medic .q-calendar-weekly__day
  cursor: pointer;

.my-event
  width: 100%
  position: absolute
  font-size: 12px

.full-width
  left: 0
  width: 100%

.left-side
  left: 0
  width: 49.75%

.right-side
  left: 50.25%
  width: 49.75%


.q-dialog__inner--minimized > div
  @media (min-width: 600px)
    max-width: 700px


.bg-grey
  background: #696969 !important

.bg-green
  background: #006400 !important

.bg-blue
  background: #027be3 !important

.bg-teal
  background: #009688 !important
</style>

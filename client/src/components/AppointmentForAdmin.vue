<template>
  <div>
    <q-table
      title="All appointments"
      :data="events"
      :filter="filter"
      :columns="columns"
      row-key="id"
      style="margin:50px"
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            class="button"
            outline
            style="margin-right:20px"
            @click="viewAppointment(props.row)"
            round
            color="primary"
            icon="read_more"
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="card">
      <q-card style="width:80%">
        <q-toolbar class="q-mt-md row">
          <q-avatar>
            <q-icon name="local_hospital" size="lg" />
          </q-avatar>

          <q-toolbar-title class="text-weight-bold"
            >Appointment reservation
          </q-toolbar-title>
          <div class="row justify-center items-center" v-if="selectedEvent.url">
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
        <q-card-section>
          <q-input
            class="q-ml-sm"
            v-model="selectedEvent.observation"
            filled
            readonly
            label="Observations"
            autogrow
        /></q-card-section>
        <q-card-section class=" column">
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
        <q-card-section class=" column">
          <p class="q-ml-sm  q-ma-xs text-body1 text-weight-bold">
            Patient details:
          </p>
          <div v-if="selectedEvent.patient">
            <p class="q-ml-xl q-ma-none">
              Name:
              <b
                >{{ selectedEvent.patient.firstName }}
                {{ selectedEvent.patient.lastName }}</b
              >
            </p>
            <p class="q-ml-xl q-ma-none">
              Phone: <b>{{ selectedEvent.patient.phone }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Email: <b>{{ selectedEvent.patient.email }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              City: <b>{{ selectedEvent.patient.city }}</b>
            </p>
            <p class="q-ml-xl q-ma-none">
              Birth date: <b>{{ selectedEvent.patient.birthDate }}</b>
            </p>
            <q-input
              class="q-ml-xl q-ma-none"
              style="width:80%"
              outlined
              v-model="selectedEvent.patient.info"
              :dense="true"
              readonly
            />
          </div>
          <p class="q-ml-xl  q-ma-xs" v-else>Not reserved yet</p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "Service",
  data() {
    return {
      state: "VIEW",
      filter: "",
      card: false,
      selectedEvent: {
        id: 3,
        duration: 20,
        date: "2021-05-25T04:36:27.000Z",
        url: "un link ceva",
        observation: null,
        medic: {
          id: 1,
          firstName: "George",
          lastName: "Vasile",
          info: "Hellow there",
          email: "george.vasile2@gmail.com",
          phone: "0722222222",
          city: "Bucharest"
        },
        patient: {
          id: 2,
          firstName: "George",
          lastName: "Pacientul",
          info: "ceva",
          email: "george.vasile@gmail.com",
          phone: "0722222222",
          city: "Bucharest",
          birthDate: "1999/12/12"
        },
        service: {
          id: 1,
          name: "Tratament 1",
          category: "analiza",
          description: "altceva",
          createdAt: "2021-05-23T22:51:58.000Z",
          updatedAt: "2021-05-25T02:18:56.000Z"
        }
      },
      columns: [
        {
          name: "dateTime",
          required: true,
          label: "Date Time",
          align: "left",
          field: row => row.date,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "medic",
          required: true,
          label: "Medic",
          align: "left",
          field: row => row.medic,
          format: val => `${val.firstName} ${val.lastName}`,
          sortable: true
        },
        {
          name: "patient",
          required: false,
          label: "Patient",
          align: "left",
          field: row => row.patient,
          format: val => (val ? `${val.firstName} ${val.lastName}` : "N/A"),
          sortable: true
        },
        {
          name: "service",
          required: true,
          label: "Service",
          align: "left",
          field: row => row.service,
          format: val => `${val.name}`,
          sortable: true
        },
        {
          name: "actions",
          label: "Action"
        }
      ]
    };
  },
  beforeMount() {
    const user = this.$q.localStorage.getItem("user");
    if (!user) {
      this.$router.push("/auth");
    } else {
      this.$store.dispatch("data/loadServices");
      this.$store.dispatch("data/loadAdminAppointments");
      this.$store.dispatch("data/loadMedicServices");
    }
  },
  methods: {
    viewAppointment(event) {
      this.card = true;
      this.selectedEvent = {
        ...event
      };
    },
    onClickUrl: function(link) {
      openURL(link);
    }
  },
  computed: {
    events() {
      return this.$store.getters["data/getAdminAppointments"];
    }
  }
};
</script>

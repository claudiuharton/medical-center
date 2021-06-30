<template>
  <q-page class>
    <navbar />
    <q-tabs
      v-model="tab"
      dense
      align="justify"
      class="bg-grey-2 text-primary shadow-2"
      :breakpoint="0"
    >
      <q-tab name="services" v-if="isAdmin || isMedic" label="Services" />
      <q-tab name="appointments" label="Appointments" />
      <q-tab
        name="subscriptions"
        label="Subscriptions"
        v-if="isAdmin || !isMedic"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="services" v-if="isAdmin || isMedic">
        <service />
      </q-tab-panel>
      <q-tab-panel name="appointments">
        <appointment-for-admin v-if="isAdmin" />
        <appointment v-else />
      </q-tab-panel>
      <q-tab-panel name="subscriptions" v-if="isAdmin || !isMedic">
        <subscriptions-for-admin v-if="isAdmin" />
        <subscriptions v-else />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<style>
.q-tab-panels {
  background: none;
}
</style>

<script>
import AppointmentForAdmin from "../components/AppointmentForAdmin.vue";
import Appointment from "../components/Appointment.vue";
import Navbar from "../components/Navbar.vue";
import Service from "../components/Service.vue";
import SubscriptionsForAdmin from "../components/SubscriptionsForAdmin.vue";
import Subscriptions from "../components/Subscriptions.vue";
export default {
  components: {
    SubscriptionsForAdmin,
    Service,
    Navbar,
    Appointment,
    AppointmentForAdmin,
    Subscriptions
  },
  name: "MainPage",
  data() {
    return {
      tab: "appointments"
    };
  },
  beforeMount() {
    const user = this.$q.localStorage.getItem("user");
    if (user.type == "admin") {
      this.tab = "services";
    }
  },
  methods: {},
  computed: {
    isMedic() {
      return this.$q.localStorage.getItem("user")
        ? this.$q.localStorage.getItem("user").type == "medic"
        : false;
    },
    isAdmin() {
      return this.$q.localStorage.getItem("user")
        ? this.$q.localStorage.getItem("user").type == "admin"
        : false;
    }
  }
};
</script>

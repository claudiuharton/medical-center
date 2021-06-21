<template>
  <q-page class>
    <navbar />
    <q-tabs
      v-if="isMedic"
      v-model="tab"
      dense
      align="justify"
      class="bg-grey-2 text-primary shadow-2"
      :breakpoint="0"
    >
      <q-tab name="services" label="Services" />
      <q-tab name="appointments" label="Appointments" />
    </q-tabs>
    <q-tab-panels v-if="isMedic" v-model="tab" animated>
      <q-tab-panel name="services">
        <service />
      </q-tab-panel>
      <q-tab-panel name="appointments">
        <appointment />
      </q-tab-panel>
    </q-tab-panels>
    <admin v-if="isAdmin" />

    <appointment v-if="!isMedic && !isAdmin" />
  </q-page>
</template>

<style></style>

<script>
import Admin from "../components/Admin.vue";
import Appointment from "../components/Appointment.vue";
import Navbar from "../components/Navbar.vue";
import Service from "../components/Service.vue";
export default {
  components: { Service, Navbar, Appointment, Admin },
  name: "MainPage",
  data() {
    return {
      tab: "appointments"
    };
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

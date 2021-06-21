<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="absolute-center"
          >Aplicatie pentru administrarea facturilor</q-toolbar-title
        >
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      :width="250"
      bordered
      :show-if-above="true"
      content-class="bg-primary"
    >
      <q-list dark>
        <q-item-label header>Meniu</q-item-label>
        <q-item
          v-for="nav in navs"
          :key="nav.label"
          :to="nav.to"
          class="text-grey-3"
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section v-if="nav.label !== 'Logout'">
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
          <q-item-section @click="logout" v-else>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style>
@media (min-width: 768px) {
  .q-footer {
    display: none;
  }
}

.q-drawer .q-router-link--exact-active {
  color: white !important;
}
</style>

<script>
import { LocalStorage } from "quasar";

export default {
  name: "Layout",
  beforeMount() {
    if (!LocalStorage.getItem("loggedIn")) {
      this.$router.push({ name: "Login" });
    } else {
      this.$store.dispatch("data/loadSuppliers");
      this.$store.dispatch("data/loadCategories");
      this.$store.dispatch("data/loadInvoices");
      if (LocalStorage.getItem("user").isAdmin) {
        this.$store.dispatch("data/loadUsers");
      }
    }
  },
  data() {
    return {
      leftDrawerOpen: false,
      navs: [
        {
          label: "Acasa",
          icon: "list",
          to: "/"
        },
        {
          label: "Profil",
          icon: "perm_identity",
          to: "/profile"
        },
        {
          label: "Furnizori",
          icon: "group",
          to: "/suppliers"
        },
        {
          label: "Plati",
          icon: "payment",
          to: "/payments"
        },
        {
          label: "Facturi",
          icon: "note",
          to: "/invoices"
        },

        {
          label: "Logout",
          icon: "exit_to_app",
          to: "/login"
        }
      ]
    };
  },
  methods: {
    logout() {
      this.$axios
        .get("/api/auth/logout")
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          LocalStorage.set("loggedIn", false);
          this.$router.push({ name: "Login" });
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",

            message: error.response.data.message,
            icon: "report_problem"
          });
        });
    }
  }
};
</script>

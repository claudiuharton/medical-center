<template>
  <div>
    <q-table
      title="Available subscriptions"
      :data="subscriptions"
      :filter="filter"
      :columns="columns"
      row-key="name"
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
            @click="editSubscription(props.row)"
            round
            color="primary"
            icon="create"
          />
          <q-btn
            class="button"
            outline
            @click="removeSubscription(props.row)"
            round
            color="negative"
            icon="delete"
          />
        </q-td>
      </template>

      <template v-slot:top-left>
        <q-btn color="primary" label="ADD" outline @click="addSubscription" />

        <q-space />
      </template>
    </q-table>

    <q-dialog v-model="card" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" v-if="state === 'ADD'">
            Add subscription
          </div>
          <div class="col-3 text-grey" v-else>Edit subscription</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Name:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedSubscription.type"
              dense
              label="Type"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Price percent:</div>
            <q-input
              class="col-9"
              type="number"
              outlined
              v-model="selectedSubscription.pricePercent"
              dense
              label="Price percent"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Count:</div>

            <q-input
              class="col-9"
              type="number"
              outlined
              v-model="selectedSubscription.count"
              dense
              label="Count"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn
              icon="add"
              outline
              color="primary"
              @click="executeAddSubscription"
              v-if="state === 'ADD'"
              >Add</q-btn
            >
            <q-btn
              icon="create"
              outline
              color="primary"
              v-else
              @click="executeSaveSubscription"
              >Edit</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: "Subscription",
  data() {
    return {
      state: "VIEW",
      tab: "subscriptions",
      filter: "",
      card: false,
      editMedicSubscription: "",
      selectedSubscription: {},
      categoryOptions: [
        "consultație fizica",
        "consultație online",
        "recoltare analize",
        "interpretare analize"
      ],
      subscriptionsOptions: [
        "Cardiologie",
        "Dermatologie",
        "Endocrinologie",
        "Gastroenterologie",
        "Medicina de familie",
        "Nefrologie",
        "Ofltalmologie",
        "Orl",
        "Ortopedie",
        "Psihologie"
      ],
      descriptionOptions: [
        "Pentru toate persoanele",
        "Pentru adulti",
        "Pentru copii"
      ],
      columns: [
        {
          name: "type",
          required: true,
          label: "Type",
          align: "left",
          field: row => row.type,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "pricePercent",
          required: true,
          label: "Price percent (%)",
          align: "left",
          field: row => row.pricePercent,
          format: val => `${val}%`,
          sortable: true
        },
        {
          name: "count",
          required: true,
          label: "Count",
          align: "left",
          field: row => row.count,
          format: val => `${val}`,
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
      this.$store.dispatch("data/loadSubscriptions");
    }
  },
  methods: {
    addSubscription() {
      this.state = "ADD";
      this.card = true;
      this.selectedSubscription = {
        type: "",
        pricePercent: "",
        count: ""
      };
    },
    editSubscription(subscription) {
      this.state = "EDIT";
      this.card = true;
      this.selectedSubscription = {
        ...subscription
      };
    },
    removeSubscription(subscription) {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Do you want to delete ${subscription.name}?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete(`/api/subscriptions/${subscription.id}`)
            .then(response => {
              this.$q.notify({
                color: "primary",

                message: response.data.message,
                icon: "arrow_forward"
              });
              this.$store.dispatch("data/loadSubscriptions");
              this.$store.dispatch("data/loadAllExperiences");
            })
            .catch(error => {
              switch (error.response.status) {
                case 400: {
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
        });
    },
    executeSaveSubscription() {
      this.$axios
        .put(`/api/subscriptions/${this.selectedSubscription.id}`, {
          ...this.selectedSubscription
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadSubscriptions");
          this.$store.dispatch("data/loadMedicSubscriptions");
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 400: {
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

    executeAddSubscription() {
      this.$axios
        .post("/api/subscriptions", {
          ...this.selectedSubscription
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadSubscriptions");
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
            case 400: {
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
    }
  },
  computed: {
    subscriptions() {
      return this.$store.getters["data/getSubscriptions"];
    }
  }
};
</script>

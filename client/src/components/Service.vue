<template>
  <div>
    <q-table
      title="Available services"
      :data="services"
      :filter="filter"
      :columns="
        isAdmin
          ? columns.filter(item => item.name != 'offer')
          : columns.filter(item => item.name != 'actions')
      "
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
            @click="editService(props.row)"
            round
            color="primary"
            icon="create"
          />
          <q-btn
            class="button"
            outline
            @click="removeService(props.row)"
            round
            color="negative"
            icon="delete"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-offer="props">
        <q-td :props="props">
          <div class="text-pre-wrap">
            <q-toggle
              checked-icon="check"
              unchecked-icon="clear"
              v-model="props.row.offer"
              @input="updateOffer(props.row.id)"
            />
          </div>
        </q-td>
      </template>

      <template v-slot:top-left v-if="isAdmin">
        <q-btn color="primary" label="ADD" outline @click="addService" />

        <q-space />
      </template>
    </q-table>

    <q-dialog v-model="card" style="width:60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div class="col-3 text-grey" v-if="state === 'ADD'">
            Add service
          </div>
          <div class="col-3 text-grey" v-else>Edit service</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Name:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedService.name"
              dense
              label="Name"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Description:</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedService.description"
              dense
              label="Description"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Category:</div>

            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="selectedService.category"
              dense
              label="Category"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Price:</div>

            <q-input
              class="col-9"
              type="number"
              outlined
              v-model="selectedService.price"
              dense
              label="Price"
            />
          </div>
        </q-card-section>
        <q-card-section>
          <q-card-actions align="around">
            <q-btn
              icon="add"
              outline
              color="primary"
              @click="executeAddService"
              v-if="state === 'ADD'"
              >Add</q-btn
            >
            <q-btn
              icon="create"
              outline
              color="primary"
              v-else
              @click="executeSaveService"
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
  name: "Service",
  data() {
    return {
      state: "VIEW",
      tab: "services",
      filter: "",
      card: false,
      editMedicService: "",
      selectedService: {},
      categoryOptions: [
        "consultație fizica",
        "consultație online",
        "recoltare analize",
        "interpretare analize"
      ],
      servicesOptions: [
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
          name: "name",
          required: true,
          label: "Name",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "description",
          required: true,
          label: "Description",
          align: "left",
          field: row => row.description,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "category",
          required: true,
          label: "Category",
          align: "left",
          field: row => row.category,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "price",
          required: true,
          label: "Price",
          align: "left",
          field: row => row.price,
          format: val => `${val} EUR`,
          sortable: true
        },
        {
          name: "offer",
          required: true,
          label: "Offering this service?",
          align: "left",
          field: row => this.medicServices.find(item => item.id == row.id),
          format: val => `${val ? "YES" : "NO"}`,
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
      this.$store.dispatch("data/loadMedicServices");
    }
  },
  methods: {
    addService() {
      this.state = "ADD";
      this.card = true;
      this.selectedService = {
        name: "",
        description: "",
        category: ""
      };
    },
    editService(service) {
      this.state = "EDIT";
      this.card = true;
      this.selectedService = {
        ...service
      };
    },
    removeService(service) {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Do you want to delete ${service.name}?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete(`/api/services/${service.id}`)
            .then(response => {
              this.$q.notify({
                color: "primary",

                message: response.data.message,
                icon: "arrow_forward"
              });
              this.$store.dispatch("data/loadServices");
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
    executeSaveService() {
      this.$axios
        .put(`/api/services/${this.selectedService.id}`, {
          ...this.selectedService
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadServices");
          this.$store.dispatch("data/loadMedicServices");
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

    executeAddService() {
      this.$axios
        .post("/api/services", {
          ...this.selectedService
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$store.dispatch("data/loadServices");
          this.$store.dispatch("data/loadMedicServices");
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
    updateOffer(id) {
      this.$axios
        .put("/api/services/medic", {
          serviceId: id
        })
        .then(response => {
          this.$store.dispatch("data/loadMedicServices");
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
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

    hasOffer(id) {
      return !!this.medicServices.find(item => item.id == id);
    }
  },
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
    },
    services() {
      return this.$store.getters["data/getServices"].map(item => {
        return { ...item, offer: this.hasOffer(item.id) };
      });
    },
    medicServices() {
      const user = this.$q.localStorage.getItem("user");

      const list = this.$store.getters["data/getMedicServices"].find(
        item => item.id == user.id
      );

      return list ? list.services : [];
    }
  }
};
</script>

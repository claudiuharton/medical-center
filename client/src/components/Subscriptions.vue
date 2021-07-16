<template>
  <div>
    <q-table
      title="My subscriptions"
      :data="patientSubscriptions"
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
            @click="viewSubscription(props.row)"
            round
            color="primary"
            icon="read_more"
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
          <div class="col-3 text-grey" v-else>
            Subscription details [{{
              selectedSubscription.active ? "ACTIVE" : "NOT ACTIVE"
            }}]
          </div>
        </q-card-section>
        <q-card-section v-if="state == 'ADD'">
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Service category:</div>
            <q-select
              class="col-9"
              outlined
              v-model="selectedSubscription.service.category"
              dense
              :options="categoryOptions"
              label="Category"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Service name:</div>
            <q-select
              class="col-9"
              outlined
              v-model="selectedSubscription.service"
              dense
              :options="serviceOptions"
              label="Name"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Subscription:</div>
            <q-select
              class="col-9"
              outlined
              v-model="selectedSubscription.subscription.type"
              dense
              @input="updateOnType"
              :options="subscriptionsOptions"
              label="Subscription"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Appointment counts:</div>

            <q-select
              class="col-9"
              outlined
              v-model="selectedSubscription.subscription"
              dense
              :options="countOptions"
              label="Appointment counts"
            />
          </div> </q-card-section
        ><q-card-section v-if="state == 'ADD'">
          <div class="row justify-around">
            <p class="text-h5  row justify-center">
              Service: {{ selectedSubscription.service.label }}
            </p>
            <p class="text-h5  row justify-center">
              Price: {{ selectedSubscription.service.price }}

              EUR
            </p>
          </div>
          <div class="row justify-around">
            <p class="text-h5  row justify-center">
              Quantity: {{ selectedSubscription.subscription.label }}
            </p>
            <p class="text-h5  row justify-center">
              Discount:
              {{
                selectedSubscription.service.price *
                  selectedSubscription.subscription.value -
                  selectedSubscription.service.price *
                    selectedSubscription.subscription.value *
                    (selectedSubscription.subscription.pricePercent / 100)
              }}
              EUR
            </p>
          </div>

          <p
            class="text-h4  row justify-center"
            v-if="
              selectedSubscription.service.price &&
                selectedSubscription.subscription
            "
          >
            Total price:
            {{
              selectedSubscription.service.price *
                selectedSubscription.subscription.value *
                (selectedSubscription.subscription.pricePercent / 100)
            }}
            EUR
          </p>
          <p></p
        ></q-card-section>

        <q-card-section
          v-if="state == 'VIEW'"
          class="row full-width justify-around "
          ><div class="column full-height ">
            <div class="col-3 text-black text-h5">Subscription</div>

            <div class="col-3 text-grey">
              Type: {{ selectedSubscription.subscription.type }}
            </div>
            <div class="col-3 text-grey">
              No. of appointments: {{ selectedSubscription.count }} /
              {{ selectedSubscription.subscription.count }}
            </div>
            <div class="col-3 text-grey">
              Total cost:
              {{
                selectedSubscription.service.price *
                  selectedSubscription.subscription.count *
                  (selectedSubscription.subscription.pricePercent / 100)
              }}
              EUR
            </div>
            <div class="col-3 text-grey">
              Amount to be paid: {{ selectedSubscription.amountToBePaid }} EUR
            </div>
            <div class="col-3 text-grey">
              Due date:
              {{
                selectedSubscription.dueDate &&
                  selectedSubscription.dueDate.substring(0, 10)
              }}
            </div>
          </div>
          <div class="column full-height ">
            <div class="col-3 text-black text-h5">Service</div>
            <div class="col-3 text-grey">
              Category: {{ selectedSubscription.service.category }}
            </div>
            <div class="col-3 text-grey">
              Name: {{ selectedSubscription.service.name }}
            </div>
            <div class="col-3 text-grey">
              Description: {{ selectedSubscription.service.description }}
            </div>
            <div class="col-3 text-grey">
              Default price: {{ selectedSubscription.service.price }} EUR
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="state == 'VIEW'"
          ><div>Past payments:</div>
          <div
            class="col-3 text-grey row justify-start"
            v-for="payment in payments"
            :key="payment.id"
          >
            <div>Amount: {{ payment.amount }} EUR</div>
            <div style="margin-left:50px">
              Date:
              {{ payment.createdAt && payment.createdAt.substring(0, 10) }}
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="state == 'VIEW' && toPay">
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Amount to be paid:</div>
            <q-input
              class="col-9"
              type="number"
              outlined
              v-model="payment.amount"
              dense
              label="Amount"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Card number</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="payment.cardNumber"
              dense
              label="Card number"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Card owner name</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="payment.ownerName"
              dense
              label="Card owner name"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Security code</div>
            <q-input
              class="col-9"
              type="text"
              outlined
              v-model="payment.securityCode"
              dense
              label="Security code"
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
            ><q-btn
              outline
              color="primary"
              @click="toPay = !toPay"
              v-if="
                state === 'VIEW' &&
                  selectedSubscription.amountToBePaid > 0 &&
                  !toPay
              "
              >START PAYMENT</q-btn
            >
            <q-btn
              outline
              color="primary"
              @click="executePayment"
              v-if="state === 'VIEW' && toPay"
              >PAY</q-btn
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
      toPay: false,
      viewMedicSubscription: "",
      selectedSubscription: {
        service: { category: "", label: "", value: "", price: "", id: "" },
        subscription: {
          label: "",
          value: "",
          type: "",
          pricePercent: "",
          id: ""
        }
      },
      payment: {
        cardNumber: "",
        securityCode: "",
        ownerName: "",
        amount: "",
        userSubscriptionId: ""
      },

      columns: [
        {
          name: "type",
          required: true,
          label: "Type",
          align: "left",
          field: row => row.subscription.type,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "serviceName",
          required: true,
          label: "Service",
          align: "left",
          field: row => row.service.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "serviceCategory",
          required: true,
          label: "Category",
          align: "left",
          field: row => row.service.category,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "appointmentsLeft",
          required: true,
          label: "Appointments left",
          align: "left",
          field: row => row.count,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "availability",
          required: true,
          label: "Availability",
          align: "left",
          field: row => row.active,
          format: val => (val ? "ACTIVE" : "NOT ACTIVE"),
          sortable: true
        },
        {
          name: "amountToBePaid",
          required: true,
          label: "Amount to be paid",
          align: "left",
          field: row => row.amountToBePaid,
          format: val => `${val} EUR`,
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
      this.$store.dispatch("data/loadPatientSubscriptions");
      this.$store.dispatch("data/loadPayments");
    }
  },
  methods: {
    updateOnType() {
      this.selectedSubscription.subscription = this.subscriptions
        .map(item => ({
          value: item.count,
          label: item.count,
          type: item.type,
          pricePercent: item.pricePercent,
          id: item.id
        }))
        .find(item => item.type == this.selectedSubscription.subscription.type);
    },
    addSubscription() {
      this.state = "ADD";
      this.card = true;
      this.toPay = false;
      this.selectedSubscription = {
        service: { category: "", label: "", value: "", price: "", id: "" },
        subscription: {
          label: "",
          value: "",
          type: "",
          pricePercent: "",
          id: ""
        }
      };
    },
    viewSubscription(subscription) {
      this.state = "VIEW";
      this.card = true;
      this.selectedSubscription = {
        ...subscription
      };
    },
    removeSubscription(subscription) {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Do you want to delete ${
            subscription.subscription.type
          } for ${subscription.service.name}?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .post(`/api/subscriptions/user`, {
              subscriptionId: subscription.subscription.id,
              serviceId: subscription.service.id,
              unsubscribe: true
            })
            .then(response => {
              this.$q.notify({
                color: "primary",

                message: response.data.message,
                icon: "arrow_forward"
              });

              this.$store.dispatch("data/loadPatientSubscriptions");
              this.$store.dispatch("data/loadPayments");
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

    executeAddSubscription() {
      this.$axios
        .post("/api/subscriptions/user", {
          subscriptionId: this.selectedSubscription.subscription.id,
          serviceId: this.selectedSubscription.service.id
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });

          this.$store.dispatch("data/loadPatientSubscriptions");
          this.$store.dispatch("data/loadPayments");
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
            // case 400: {
            //   error.response.data.errors.forEach(element => {
            //     this.$q.notify({
            //       color: "negative",
            //       message: element
            //     });
            //   });
            //   break;
            // }
            default: {
              this.$q.notify({
                color: "negative",
                message: error.response.data.message
              });
            }
          }
        });
    },
    executePayment() {
      this.$axios
        .post("/api/payments", {
          ...this.payment,
          userSubscriptionId: this.selectedSubscription.id
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });

          this.$store.dispatch("data/loadPatientSubscriptions");
          this.$store.dispatch("data/loadPayments");
          this.toPay = false;
          this.card = false;
        })
        .catch(error => {
          switch (error.response.status) {
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
    services() {
      return this.$store.getters["data/getServices"];
    },
    categoryOptions() {
      return [
        ...new Set(
          this.$store.getters["data/getServices"].map(item => item.category)
        )
      ];
    },
    serviceOptions() {
      return this.$store.getters["data/getServices"]
        .filter(item =>
          this.selectedSubscription.service.category
            ? item.category == this.selectedSubscription.service.category
            : true
        )
        .map(item => ({
          value: item.id,
          label: item.name,
          price: item.price,
          category: item.category,
          id: item.id
        }));
    },

    countOptions() {
      return this.$store.getters["data/getSubscriptions"].map(item => ({
        value: item.count,
        label: item.count,
        type: item.type,
        id: item.id,
        pricePercent: item.pricePercent
      }));
    },

    subscriptionsOptions() {
      return [
        ...new Set(
          this.$store.getters["data/getSubscriptions"].map(item => item.type)
        )
      ];
    },

    subscriptions() {
      return this.$store.getters["data/getSubscriptions"];
    },
    patientSubscriptions() {
      return this.$store.getters["data/getPatientSubscriptions"];
    },
    payments() {
      return this.$store.getters["data/getPayments"].filter(item =>
        this.selectedSubscription.id
          ? item.userSubscriptionId == this.selectedSubscription.id
          : true
      );
    }
  }
};
</script>

<template>
  <div>
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>Medical Center</q-toolbar-title>
        <q-btn
          color="white"
          text-color="primary"
          label="Profile"
          @click="
            userEdit = false;
            profile = true;
          "
          style="margin-right: 50px"
        />
        <q-btn
          color="white"
          text-color="black"
          label="Log out"
          @click="onLogout"
        />
      </q-toolbar>
    </q-header>
    <q-dialog v-model="profile" style="width: 60%">
      <q-card class="my-card full-width">
        <q-card-section class="row text-h5 ellipsis">
          <div
            class="col-3 text-grey text-uppercase text-bold"
            style="width: 83%"
          >
            {{ user.type }}
          </div>
          <div class="col-2" align="right">
            <q-btn
              color="primary"
              round
              outline
              icon="create"
              v-if="!userEdit"
              @click="
                userEdit = true;
                isPassword = false;
              "
            />
            <q-btn
              color="primary"
              round
              outline
              v-else
              icon="clear"
              @click="
                userEdit = false;
                isPassword = false;
              "
            />
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">First name:</div>
            <div class="col-9 text-dark" v-if="!userEdit">
              {{ user.firstName }}
            </div>
            <q-input
              v-else
              class="col-9"
              type="text"
              outlined
              v-model="user.firstName"
              dense
              label="First name"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">Last name:</div>
            <div class="col-9 text-dark" v-if="!userEdit">
              {{ user.lastName }}
            </div>
            <q-input
              v-else
              class="col-9"
              type="text"
              outlined
              v-model="user.lastName"
              dense
              label="Last name"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Email:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.email }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.email"
              dense
              label="Email"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Phone:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.phone }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              mask="0### ### ###"
              v-model="user.phone"
              dense
              label="Phone"
            />
          </div>

          <div class="row q-mb-md">
            <div class="col-3 text-grey">City:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.city }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.city"
              dense
              label="City"
            />
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Birth date:</div>
            <div class="col-9 text-dark" v-if="!userEdit">
              {{ user.birthDate }}
            </div>
            <q-input
              class="col-9"
              type="text"
              v-else
              mask="date"
              outlined
              v-model="user.birthDate"
              dense
              :rules="['date']"
              label="Birth date"
              ><template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="user.birthDate">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon> </template
            ></q-input>
          </div>
          <div class="row q-mb-md">
            <div class="col-3 text-grey">Info:</div>
            <div class="col-9 text-dark" v-if="!userEdit">{{ user.info }}</div>
            <q-input
              class="col-9"
              type="text"
              v-else
              outlined
              v-model="user.info"
              dense
              autogrow
              label="Info"
            />
          </div>
          <div class="row q-mb-md" v-if="isPassword">
            <div class="col-3 text-grey">Password:</div>

            <q-input
              v-model="password"
              outlined
              label="Password"
              class="col-9"
              dense
              :type="isPwd ? 'password' : 'text'"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-section>
          <q-card-actions v-if="userEdit" align="around">
            <q-btn
              outline
              v-if="!isPassword"
              color="primary"
              @click="isPassword = true"
              >Change password</q-btn
            >
            <q-btn
              icon="clear"
              outline
              color="primary"
              v-else
              @click="isPassword = false"
              >Password</q-btn
            >
            <q-btn icon="save" outline color="primary" @click="executeSaveUser"
              >Save changes</q-btn
            >
          </q-card-actions>
          <q-card-actions v-else align="around">
            <q-btn outline color="negative" @click="deleteAccount()"
              >Delete account</q-btn
            >
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isPassword: false,
      isPwd: true,
      password: "",
      profile: false,
      user: {},
      userEdit: false,
      state: "VIEW"
    };
  },
  beforeMount() {
    this.user = this.$q.localStorage.getItem("user");
    if (!this.user) {
      this.$router.push("/auth");
    }
  },
  methods: {
    deleteAccount() {
      this.$q
        .dialog({
          title: "Confirmation",
          message: `Are you sure you want to delete your account?`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$axios
            .delete("/api/user")
            .then(response => {
              this.$q.notify({
                color: "primary",

                message: response.data.message,
                icon: "arrow_forward"
              });
              this.$q.localStorage.set("user", false);
              this.$router.push("/auth");
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

    executeSaveUser() {
      this.$axios
        .put(`/api/user`, {
          ...this.user,
          password: this.password,
          changePassword: this.isPassword
        })
        .then(response => {
          this.$q.notify({
            color: "primary",

            message: response.data.message,
            icon: "arrow_forward"
          });
          this.$q.localStorage.set("user", response.data.user);
          this.user = response.data.user;
          this.userEdit = false;
          this.isPassword = false;
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

    onLogout() {
      this.$axios
        .get("/api/logout")
        .then(response => {
          this.$q.notify({
            color: "primary",
            message: response.data.message
          });

          this.$q.localStorage.set("user", false);
          this.$router.push("/auth");
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message
          });
        });
    }
  }
};
</script>

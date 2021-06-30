<template>
  <q-card class="container login" v-if="!isRegister">
    <q-img :ratio="16 / 9" src="./../assets/img.png" />

    <q-card-section class="row items-center">
      <div class="text-h6">Login</div>
    </q-card-section>
    <div class="q-pa-md">
      <q-card-section class="q-gutter-md">
        <q-input filled v-model="login.email" label="Email" />

        <q-input
          v-model="login.password"
          filled
          label="Password"
          :type="isPwd2 ? 'password' : 'text'"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd2 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd2 = !isPwd2"
            />
          </template>
        </q-input>
      </q-card-section>
    </div>
    <q-card-actions class="bg-white text-primary flex flex-center">
      <q-btn color="primary" label="LOGIN" @click="onLogin" />
      <q-btn label="REGISTER" @click="isRegister = true" />
    </q-card-actions>
  </q-card>
  <q-card class="container" v-else>
    <q-card-section class="row items-center">
      <div class="text-h6">Register</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>
    <div class="q-pa-md">
      <q-card-section class="q-gutter-md">
        <q-input filled v-model="register.firstName" label="First Name" />
        <q-input filled v-model="register.lastName" label="Last Name" />
        <q-input
          filled
          mask="0### ### ###"
          v-model="register.phone"
          label="Phone"
        />
        <q-input filled v-model="register.email" label="Email" />
        <q-input
          v-model="register.password"
          filled
          label="Password"
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
        <q-input filled v-model="register.city" label="City" />
        <q-input
          filled
          v-model="register.birthDate"
          mask="date"
          label="Birth date"
          :rules="['date']"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="qDateProxy"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="register.birthDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input v-model="register.info" filled autogrow label="Info" />
        <q-select
          class="text-capitalize"
          filled
          v-model="register.type"
          :options="options"
          label="Type"
        />
      </q-card-section>
    </div>
    <q-card-actions class="bg-white text-primary flex flex-center">
      <q-btn color="primary" label="REGISTER" @click="onRegister" />
      <q-btn label="BACK" @click="isRegister = false" />
    </q-card-actions>
  </q-card>
</template>

<style>
.container {
  width: 500px;
}
.enter.q-btn {
  width: 100%;
  margin-top: 20px;
}

.q-input {
  width: 100%;
}
</style>

<script>
export default {
  name: "Auth",
  data() {
    return {
      options: ["patient", "medic"],
      isPwd: true,
      isPwd2: true,
      firstName: "",
      lastName: "",
      accessCode: "",
      email: "",

      login: {
        email: "",
        password: ""
      },
      register: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        birthDate: "",
        city: "",
        info: "",
        phone: "",
        type: ""
      },
      isRegister: false
    };
  },
  beforeMount() {
    if (this.$q.localStorage.getItem("user")) {
      this.$router.push("/");
    }
  },
  methods: {
    onLogin() {
      this.$axios
        .post("/api/login", {
          email: this.login.email,
          password: this.login.password
        })
        .then(response => {
          this.$q.notify({
            color: "primary",
            message: "login successful"
          });
          this.$q.localStorage.set("user", response.data);
          this.$router.push("/");
        })
        .catch(error => {
          this.$q.notify({
            color: "negative",
            message: error.response.data.message
          });
        });
    },
    onRegister() {
      this.$axios
        .post("/api/register", this.register)
        .then(response => {
          this.$q.notify({
            color: "primary",
            message: response.data.message
          });

          this.isRegister = false;
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
  }
};
</script>

import Axios from "axios";

export async function loadServices({ commit }) {
  const response = await Axios.get("/api/services");
  commit("SET_SERVICES", response.data);
}

export async function loadMedicServices({ commit }) {
  const response = await Axios.get("/api/services/medic");
  commit("SET_MEDIC_SERVICES", response.data);
}

export async function loadAppointments({ commit }) {
  const response = await Axios.get("/api/appointments");
  commit("SET_APPOINTMENTS", response.data);
}

export async function loadMedicAppointments({ commit }) {
  const response = await Axios.get("/api/appointments/medic");
  commit("SET_MEDIC_APPOINTMENTS", response.data);
}

export async function loadPatientAppointments({ commit }) {
  const response = await Axios.get("/api/appointments/patient");
  commit("SET_PATIENT_APPOINTMENTS", response.data);
}

export async function loadAdminAppointments({ commit }) {
  const response = await Axios.get("/api/appointments/admin");
  commit("SET_ADMIN_APPOINTMENTS", response.data);
}

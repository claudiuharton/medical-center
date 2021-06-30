export function SET_SERVICES(state, payload) {
  state.services = payload;
}
export function SET_MEDIC_SERVICES(state, payload) {
  state.medicServices = payload;
}
export function SET_APPOINTMENTS(state, payload) {
  state.appointments = payload;
}
export function SET_SUBSCRIPTIONS(state, payload) {
  state.subscriptions = payload;
}

export function SET_PATIENT_APPOINTMENTS(state, payload) {
  state.patientAppointments = payload;
}

export function SET_MEDIC_APPOINTMENTS(state, payload) {
  state.medicAppointments = payload;
}
export function SET_ADMIN_APPOINTMENTS(state, payload) {
  state.appointmentsAsAdmin = payload;
}

export function SET_PATIENT_SUBSCRIPTIONS(state, payload) {
  state.patientSubscriptions = payload;
}

export function SET_PAYMENTS(state, payload) {
  state.payments = payload;
}

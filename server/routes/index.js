const express = require("express");
const router = express.Router();
const { auth, reset, service, appointment } = require("../controllers");

//reset
router.get("/reset", reset.reset);

//user
router.post("/login", auth.login);
router.get("/logout", auth.middleware.checkLogin, auth.logout);
router.post("/register", auth.register);
router.put("/user", auth.middleware.checkLogin, auth.editUser);
router.delete("/user", auth.middleware.checkLogin, auth.deleteAccount);

//service
router.post("/services", auth.middleware.checkMedic, service.addService);
router.get("/services", auth.middleware.checkLogin, service.getServices);
router.put(
  "/services/medic",
  auth.middleware.checkMedic,
  service.updateMedicService
);
router.get(
  "/services/medic",
  auth.middleware.checkLogin,
  service.getMedicServices
);
router.put("/services/:id", auth.middleware.checkMedic, service.editService);
router.delete(
  "/services/:id",
  auth.middleware.checkMedic,
  service.deleteService
);

//appointments
router.post(
  "/appointments/medic",
  auth.middleware.checkMedic,
  appointment.addEmptyAppointment
);
router.put(
  "/appointments/:id",
  auth.middleware.checkPatient,
  appointment.reserveOrCancelAppointment
);
router.get(
  "/appointments",
  auth.middleware.checkLogin,
  appointment.getAppointments
);

router.get(
  "/appointments/admin",
  auth.middleware.checkAdmin,
  appointment.getAppointmentsAsAdmin
);

router.get(
  "/appointments/patient",
  auth.middleware.checkPatient,
  appointment.getAppointmentsAsPatient
);

router.get(
  "/appointments/medic",
  auth.middleware.checkMedic,
  appointment.getAppointmentsAsMedic
);

router.put(
  "/appointments/medic/:id",
  auth.middleware.checkMedic,
  appointment.updateAppointment
);

module.exports = router;

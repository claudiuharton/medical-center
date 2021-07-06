const express = require("express");
const router = express.Router();
const {
  auth,
  reset,
  service,
  appointment,
  subscription,
} = require("../controllers");

//reset
router.get("/reset", reset.reset);

//user
router.post("/login", auth.login);
router.get("/logout", auth.middleware.checkLogin, auth.logout);
router.post("/register", auth.register);
router.put("/user", auth.middleware.checkLogin, auth.editUser);
router.delete("/user", auth.middleware.checkLogin, auth.deleteAccount);

//service
router.post("/services", auth.middleware.checkAdmin, service.addService);
router.get("/services", service.getServices);
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
router.put("/services/:id", auth.middleware.checkAdmin, service.editService);
router.delete(
  "/services/:id",
  auth.middleware.checkAdmin,
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

//subscription

router.get("/subscriptions", subscription.getSubscriptions);

router.get("/payments", auth.middleware.checkLogin, subscription.getPayments);

router.post(
  "/subscriptions",
  auth.middleware.checkAdmin,
  subscription.addSubscription
);

router.post(
  "/payments",
  auth.middleware.checkLogin,
  subscription.executePayment
);

router.post(
  "/subscriptions/user",
  auth.middleware.checkLogin,
  subscription.makeSubscription
);

router.get(
  "/subscriptions/user",
  auth.middleware.checkLogin,
  subscription.getHisSubscriptions
);

router.put(
  "/subscriptions/:id",
  auth.middleware.checkAdmin,
  subscription.editSubscription
);
router.delete(
  "/subscriptions/:id",
  auth.middleware.checkAdmin,
  subscription.deleteSubscription
);
module.exports = router;

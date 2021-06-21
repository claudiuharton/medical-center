const sequelize = require("../config/db");

const User = sequelize.import("./user");
const Appointment = sequelize.import("./appointment");
const Service = sequelize.import("./service");
const MedicService = sequelize.import("./medicService");
const Payment = sequelize.import("./payment");
const Subscription = sequelize.import("./subscription");
const UserSubscription = sequelize.import("./userSubscription");

User.hasMany(MedicService, { onDelete: "Cascade" });
Service.hasMany(MedicService, { onDelete: "Cascade" });
MedicService.hasMany(Appointment, { onDelete: "Cascade" });
User.hasMany(Appointment, { onDelete: "Cascade" });

module.exports = {
  UserSubscription,
  Payment,
  Subscription,
  Service,
  User,
  MedicService,
  Appointment,
  sequelize,
};

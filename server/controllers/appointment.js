const { Appointment, User, Service, MedicService } = require("../models");
const Sequelize = require("sequelize");

const Op = Sequelize.Op;

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const controller = {
  addEmptyAppointment: async (req, res) => {
    try {
      const { duration, date, url, serviceId } = req.body;
      const { id } = req.session;

      const now = new Date();
      const appointmentDate = new Date(date);

      if (now > appointmentDate) {
        res.status(400).send({
          message: `Invalid date for a new appointment`,
        });
      } else {
        const medicService = await MedicService.findOne({
          where: { userId: id, serviceId },
          raw: true,
        });

        if (!medicService) {
          res.status(404).send({
            message: `Service not available for medic`,
          });
        } else {
          await Appointment.create({
            duration,
            date,
            url,
            medicServiceId: medicService.id,
          });
          res.status(201).send({
            message: `Empty appointment was created`,
          });
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  reserveOrCancelAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.id;

      const appointment = await Appointment.findOne({
        where: { id },
      });

      if (!appointment) {
        res.status(404).send({
          message: `Appointment not found`,
        });
      } else {
        if (appointment.userId && appointment.userId != userId) {
          res.status(400).send({
            message: `Appointment already reserved`,
          });
        } else if (!appointment.userId) {
          await appointment.update({ ...appointment, userId });
          res.status(200).send({
            message: `Appointment reserverd`,
          });
        } else {
          const now = new Date();
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(appointmentDate.getHours() + 24);
          if (now > appointmentDate) {
            res.status(400).send({
              message: `Appointment can't be canceled (max 24h before)`,
            });
          } else {
            await appointment.update({ ...appointment, userId: null });
            res.status(200).send({
              message: `Appointment canceled`,
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getAppointments: async (req, res) => {
    try {
      const rawAppointments = await Appointment.findAll({ raw: true });

      const appointments = await Promise.all(
        rawAppointments.map(async (appointment) => {
          const medicService = await MedicService.findOne({
            where: { id: appointment.medicServiceId },
            raw: true,
          });
          const medic = await User.findOne({
            attributes: [
              "id",
              "firstName",
              "lastName",
              "info",
              "email",
              "phone",
              "city",
            ],
            where: { id: medicService.userId },
            raw: true,
          });

          const service = await Service.findOne({
            where: { id: medicService.serviceId },
            raw: true,
          });

          return {
            id: appointment.id,
            duration: appointment.duration,
            date: formatDate(appointment.date),
            time: appointment.date.toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }),
            // url: appointment.url,
            medic,
            service,
            status: appointment.userId ? "RESERVED" : "OPEN",
          };
        })
      );

      res.status(200).send(appointments);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getAppointmentsAsPatient: async (req, res) => {
    try {
      const rawAppointments = await Appointment.findAll({
        where: {
          userId: req.session.id,
        },
        raw: true,
      });

      const appointments = await Promise.all(
        rawAppointments.map(async (appointment) => {
          const medicService = await MedicService.findOne({
            where: { id: appointment.medicServiceId },
            raw: true,
          });
          const medic = await User.findOne({
            attributes: [
              "id",
              "firstName",
              "lastName",
              "info",
              "email",
              "phone",
              "city",
            ],
            where: { id: medicService.userId },
            raw: true,
          });

          const service = await Service.findOne({
            where: { id: medicService.serviceId },
            raw: true,
          });

          return {
            id: appointment.id,
            duration: appointment.duration,
            date: appointment.date,
            url: appointment.url,
            observation: appointment.observation,
            medic,
            service,
          };
        })
      );

      res.status(200).send(appointments);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },

  getAppointmentsAsAdmin: async (req, res) => {
    try {
      const rawAppointments = await Appointment.findAll({
        raw: true,
      });

      const appointments = await Promise.all(
        rawAppointments.map(async (appointment) => {
          const medicService = await MedicService.findOne({
            where: { id: appointment.medicServiceId },
            raw: true,
          });
          const medic = await User.findOne({
            attributes: [
              "id",
              "firstName",
              "lastName",
              "info",
              "email",
              "phone",
              "city",
            ],
            where: { id: medicService.userId },
            raw: true,
          });

          const patient = await User.findOne({
            attributes: [
              "id",
              "firstName",
              "lastName",
              "info",
              "email",
              "phone",
              "city",
              "birthDate",
            ],
            where: { id: appointment.userId },
            raw: true,
          });

          const service = await Service.findOne({
            where: { id: medicService.serviceId },
            raw: true,
          });

          return {
            id: appointment.id,
            duration: appointment.duration,
            date: appointment.date,
            url: appointment.url,
            observation: appointment.observation,
            medic,
            patient,
            service,
          };
        })
      );

      res.status(200).send(appointments);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getAppointmentsAsMedic: async (req, res) => {
    try {
      const medicServicesId = (
        await MedicService.findAll({
          attributes: ["id", "userId"],
          where: { userId: req.session.id },
          raw: true,
        })
      ).map((item) => item.id);

      const rawAppointments = await Appointment.findAll({
        raw: true,
        where: {
          medicServiceId: {
            [Op.or]: medicServicesId,
          },
        },
      });

      const appointments = await Promise.all(
        rawAppointments.map(async (appointment) => {
          const medicService = await MedicService.findOne({
            where: { id: appointment.medicServiceId },
            raw: true,
          });
          const patient = await User.findOne({
            attributes: [
              "id",
              "firstName",
              "lastName",
              "info",
              "email",
              "phone",
              "city",
              "birthDate",
            ],
            where: { id: appointment.userId },
            raw: true,
          });

          const service = await Service.findOne({
            where: { id: medicService.serviceId },
            raw: true,
          });

          return {
            id: appointment.id,
            duration: appointment.duration,
            date: appointment.date,
            url: appointment.url,
            observation: appointment.observation,
            patient,
            service,
          };
        })
      );

      res.status(200).send(appointments);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const { observation, cancel } = req.body;

      const appointment = await Appointment.findOne({
        where: { id },
      });

      if (!appointment) {
        res.status(404).send({
          message: `Appointment not found`,
        });
      } else {
        if (cancel === true) {
          const now = new Date();
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(appointmentDate.getHours() + 24);
          if (now > appointmentDate) {
            res.status(400).send({
              message: `Invalid date for cancel an appointment (max 24h before)`,
            });
          } else {
            await appointment.destroy();
            res.status(200).send({
              message: `Appointment was canceled`,
            });
          }
        } else {
          appointment.update({ ...appointment, observation });
          res.status(200).send({
            message: `Appointment observation updated`,
          });
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;

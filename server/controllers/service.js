const { Service, MedicService, User } = require("../models");

const controller = {
  addService: async (req, res) => {
    try {
      const { name, description, category } = req.body;

      await Service.create({ name, description, category });

      res.status(201).send({
        message: `Service ${name} was created`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getServices: async (req, res) => {
    try {
      const services = await Service.findAll({ raw: true });

      res.status(200).send(services);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  editService: async (req, res) => {
    try {
      const { name, description, category } = req.body;
      const { id } = req.params;

      const service = await Service.findOne({ where: { id } });

      if (!service) {
        res.status(404).send({
          message: `Service not found`,
        });
      } else {
        await service.update({ ...service, name, description, category });
        res.status(200).send({
          message: `Service ${name} updated`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      const service = await Service.findOne({ where: { id } });

      if (!service) {
        res.status(404).send({
          message: `Service not found`,
        });
      } else {
        await service.destroy();
        res.status(200).send({
          message: `Service ${service.name} deleted`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  updateMedicService: async (req, res) => {
    try {
      const { serviceId } = req.body;
      const { id } = req.session;
      const service = await Service.findOne({ where: { id: serviceId } });

      if (!service) {
        res.status(404).send({
          message: `Service not found`,
        });
      } else {
        const medicService = await MedicService.findOne({
          where: { userId: id, serviceId },
        });

        if (medicService) {
          await medicService.destroy();
          res.status(200).send({
            message: `Medic unregistred service`,
          });
        } else {
          await MedicService.create({
            userId: id,
            serviceId,
          });
          res.status(200).send({
            message: `Medic registred service`,
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
  getMedicServices: async (req, res) => {
    try {
      const rawMedicServices = await MedicService.findAll({ raw: true });

      const medicServices = await Promise.all(
        rawMedicServices.map(async (medicService) => {
          const user = await User.findOne({
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
          return { user: { ...user, services: [] }, service };
        })
      );

      const medics = [];

      medicServices.forEach((item) => {
        const pos = medics.findIndex((medic) => medic.id == item.user.id);
        if (pos == -1) {
          item.user.services.push(item.service);
          medics.push(item.user);
        } else {
          medics[pos].services.push(item.service);
        }
      });

      res.status(200).send(medics);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
};

module.exports = controller;

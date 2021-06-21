const { User } = require("../models");
const { Op } = require("sequelize");

const middleware = {
  checkLogin: async (req, res, next) => {
    const { token, id } = req.session;
    if (!token || !id) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      const user = await User.findOne({ where: { token, id }, raw: true });

      if (!user) {
        res.status(403).send({ message: "Forbidden" });
      } else {
        next();
      }
    }
  },
  checkAdmin: async (req, res, next) => {
    const { token, id } = req.session;
    if (!token || !id) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      const user = await User.findOne({ where: { token, id }, raw: true });

      if (!user || user.type != "admin") {
        res.status(403).send({ message: "Forbidden" });
      } else {
        next();
      }
    }
  },
  checkMedic: async (req, res, next) => {
    const { token, id } = req.session;
    if (!token || !id) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      const user = await User.findOne({ where: { token, id }, raw: true });

      if (!user || user.type != "medic") {
        res.status(403).send({ message: "Forbidden" });
      } else {
        next();
      }
    }
  },
  checkPatient: async (req, res, next) => {
    const { token, id } = req.session;
    if (!token || !id) {
      res.status(403).send({ message: "Forbidden" });
    } else {
      const user = await User.findOne({ where: { token, id }, raw: true });

      if (!user || user.type != "patient") {
        res.status(403).send({ message: "Forbidden" });
      } else {
        next();
      }
    }
  },
};

const controller = {
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "token",
        "birthDate",
        "city",
        "type",
        "info",
        "phone",
      ],
      where: { email, password },
      raw: true,
    });

    if (!user) {
      res.status(403).send({ message: "Incorrect email or password" });
    } else {
      if (req.session.id) {
        res.status(202).send({ message: "Already logged it" });
      } else {
        req.session.id = user.id;
        req.session.token = user.token;
        res.status(200).send({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          info: user.info,
          birthDate: user.birthDate,
          city: user.city,
          phone: user.phone,
          type: user.type,
        });
      }
    }
  },
  register: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        birthDate,
        city,
        info,
        phone,
        type,
      } = req.body;

      const errors = [];

      if (!firstName) {
        errors.push("First name is empty");
      }
      if (!lastName) {
        errors.push("Last name is empty");
      }

      if (!birthDate) {
        errors.push("Birthdate is empty");
      }
      if (!city) {
        errors.push("City is empty");
      }
      if (!phone) {
        errors.push("Phone is empty");
      }

      if (!type) {
        errors.push("Type is empty");
      }

      if (!email) {
        errors.push("Email is empty");
      } else if (
        !email.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        )
      ) {
        errors.push("Email is not valid");
      } else if (await User.findOne({ where: { email }, raw: true })) {
        errors.push("Email already used");
      }
      if (!password) {
        errors.push("Password is empty");
      }

      if (errors.length === 0) {
        await User.create({
          firstName,
          lastName,
          email,
          password,
          type,
          phone,
          info,
          city,
          birthDate,
          token: Math.random().toString(36),
        });
        res.status(201).send({
          message: `User ${firstName} ${lastName} was sucessfull created`,
        });
      } else {
        res.status(400).send({ errors });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  logout: async (req, res) => {
    req.session.reset();
    res.status(200).send({ message: "Successful logout" });
  },
  editUser: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        changePassword,
        birthDate,
        city,
        phone,
        info,
        type,
      } = req.body;

      const errors = [];
      const user = await User.findOne({ where: { id: req.session.id } });
      if (!user) {
        errors.push("user not exists");
      }

      if (!firstName) {
        errors.push("First name is empty");
      }
      if (!lastName) {
        errors.push("Last name is empty");
      }

      if (!birthDate) {
        errors.push("Birthdate is empty");
      }
      if (!city) {
        errors.push("City is empty");
      }
      if (!phone) {
        errors.push("Phone is empty");
      }

      if (!type) {
        errors.push("Type is empty");
      }

      if (!email) {
        errors.push("Email is empty");
      } else if (
        !email.match(
          /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
        )
      ) {
        errors.push("Email is not valid");
      } else if (
        await User.findOne({
          where: { email, id: { [Op.ne]: req.session.id } },
          raw: true,
        })
      ) {
        errors.push("Email already used");
      }
      if (changePassword && !password) {
        errors.push("Password is empty");
      }

      if (errors.length === 0) {
        const u = await user.update({
          ...user,
          firstName,
          lastName,
          email,
          birthDate,
          city,
          phone,
          type,
          info,
          password: changePassword ? password : user.password,
        });
        res.status(201).send({
          message: `User ${firstName} ${lastName} was sucessfull edited`,
          user: {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            birthDate: u.birthDate,
            city: u.city,
            phone: u.phone,
            info: u.info,
            type: u.type,
          },
        });
      } else {
        res.status(400).send({ errors });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  deleteAccount: async (req, res) => {
    try {
      const errors = [];
      const user = await User.findOne({ where: { id: req.session.id } });
      if (!user) {
        errors.push("user not exists");
      }

      if (errors.length === 0) {
        const { firstName, lastName } = user;
        await user.destroy();
        req.session.reset();
        res.status(201).send({
          message: `User ${firstName} ${lastName} was sucessfull deleted`,
        });
      } else {
        res.status(400).send({ errors });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  middleware,
};

module.exports = controller;

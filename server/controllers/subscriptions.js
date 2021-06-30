const { Op } = require("sequelize");

const {
  Service,
  Subscription,
  UserSubscription,
  Payment,
} = require("../models");

const tomorrow = () => {
  // Creating the date instance
  let d = new Date();
  // Adding one date to the present date
  d.setDate(d.getDate() + 1);

  let year = d.getFullYear();
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());

  // Adding leading 0 if the day or month
  // is one digit value
  month = month.length == 1 ? month.padStart("2", "0") : month;

  day = day.length == 1 ? day.padStart("2", "0") : day;

  // Printing the present date
  return `${year}-${month}-${day}`;
};

const controller = {
  addSubscription: async (req, res) => {
    try {
      const { pricePercent, type, count } = req.body;

      await Subscription.create({ pricePercent, type, count });

      res.status(201).send({
        message: `Subscription was created`,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  getSubscriptions: async (req, res) => {
    try {
      const subscriptions = await Subscription.findAll({ raw: true });

      res.status(200).send(subscriptions);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },

  getPayments: async (req, res) => {
    try {
      const userSubscriptions = await UserSubscription.findAll({
        where: { userId: req.session.id },
        raw: true,
      });
      const rawPayments = await Payment.findAll({
        where: { userSubscriptionId: userSubscriptions.map((item) => item.id) },
        raw: true,
      });

      const payments = await Promise.all(
        rawPayments.map(async (payment) => {
          const userSubscription = await UserSubscription.findOne({
            where: { id: payment.userSubscriptionId },
            raw: true,
          });
          const service = await Service.findOne({
            where: { id: userSubscription.serviceId },
            raw: true,
          });

          return { ...payment, service };
        })
      );

      res.status(200).send(payments);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },

  executePayment: async (req, res) => {
    try {
      const {
        cardNumber,
        securityCode,
        ownerName,
        amount,
        userSubscriptionId,
      } = req.body;

      const userSubscription = await UserSubscription.findOne({
        where: { id: userSubscriptionId },
      });

      if (!userSubscription) {
        res.status(404).send({
          message: `Subscription not found`,
        });
      } else if (userSubscription.userId != req.session.id) {
        res.status(404).send({
          message: `Subscription not found`,
        });
      } else if (userSubscription.amountToBePaid <= 0) {
        res.status(400).send({
          message: `Subscription already paid`,
        });
      } else if (amount > userSubscription.amountToBePaid) {
        res.status(400).send({
          message: `Too much amount: Subscription value is ${userSubscription.amountToBePaid}`,
        });
      } else {
        await Payment.create({
          cardNumber,
          securityCode,
          amount,
          ownerName,
          userSubscriptionId,
        });
        await userSubscription.update({
          ...userSubscription,
          amountToBePaid: userSubscription.amountToBePaid - amount,
        });

        res.status(201).send({
          message: `Payment of  ${amount} was made`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },

  makeSubscription: async (req, res) => {
    try {
      const { serviceId, subscriptionId, unsubscribe } = req.body;
      const { id } = req.session;
      const service = await Service.findOne({
        where: { id: serviceId },
        raw: true,
      });
      const subscription = await Subscription.findOne({
        where: { id: subscriptionId },
        raw: true,
      });

      if (!service || !subscription) {
        res.status(404).send({
          message: `Service/Subscription not found`,
        });
      } else {
        const userSubscription = await UserSubscription.findOne({
          where: { userId: id, serviceId, subscriptionId },
        });
        const serviceSubscription = await UserSubscription.findOne({
          where: { userId: id, serviceId, count: { [Op.gt]: 0 } },
        });

        if (userSubscription && unsubscribe) {
          await userSubscription.destroy();
          res.status(200).send({
            message: `Unsubscribed from service`,
          });
        } else if (serviceSubscription) {
          res.status(400).send({
            message: `Already having the service`,
          });
        } else {
          await UserSubscription.create({
            userId: id,
            serviceId,
            subscriptionId,
            active: true,
            dueDate: tomorrow(),
            count: subscription.count,
            amountToBePaid:
              service.price *
              subscription.count *
              (subscription.pricePercent / 100),
          });
          res.status(200).send({
            message: `Succesfully subscribed to a service`,
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
  getHisSubscriptions: async (req, res) => {
    try {
      const { id } = req.session;
      const rawUserSubscription = await UserSubscription.findAll({
        where: { userId: id },
        raw: true,
      });

      const userSubscriptions = await Promise.all(
        rawUserSubscription.map(async (userSubscription) => {
          const service = await Service.findOne({
            where: { id: userSubscription.serviceId },
            raw: true,
          });
          const subscription = await Subscription.findOne({
            where: { id: userSubscription.subscriptionId },
            raw: true,
          });
          return { ...userSubscription, service, subscription };
        })
      );
      res.status(200).send(userSubscriptions);
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },

  editSubscription: async (req, res) => {
    try {
      const { type, pricePercent, count } = req.body;
      const { id } = req.params;

      const subscription = await Subscription.findOne({ where: { id } });

      if (!subscription) {
        res.status(404).send({
          message: `Subscription not found`,
        });
      } else {
        await subscription.update({
          ...subscription,
          type,
          pricePercent,
          count,
        });
        res.status(200).send({
          message: `Subscription updated`,
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: "Error",
      });
    }
  },
  deleteSubscription: async (req, res) => {
    try {
      const { id } = req.params;
      const subscription = await Subscription.findOne({ where: { id } });

      if (!subscription) {
        res.status(404).send({
          message: `Subscription not found`,
        });
      } else {
        await subscription.destroy();
        res.status(200).send({
          message: `Subscription deleted`,
        });
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

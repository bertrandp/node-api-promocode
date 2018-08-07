'use strict';

const Promocode = require('./../models/promocode');
const promocodeService = require('./../services/promocode');

const promocodes = [];

module.exports = {
  getAll: (req, res, next) => {
    res.send(promocodes);
  },

  addPromocode: (req, res, next) => {
    const { name, avantage, restrictions } = req.body;

    if (promocodes.find(promocode => promocode.name === name)) {
      return res.status(409).send('Promocode ' + name + ' already exists');
    }

    const promocode = new Promocode(name, avantage, restrictions);
    promocodes.push(promocode);
    res.send(promocode);
    next();
  },

  validateDiscount: (req, res, next) => {
    const { promocode_name, args } = req.body;
    const promocode = promocodes.find(promocode => promocode.name === promocode_name);
    if (!promocode) {
      return res.status(404).send('Promocode ' + promocode_name + ' not found');
    }

    promocodeService.validateDiscount(promocode, args)
      .then(response => {
        res.send(response);
        next();
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
};

'use strict';

const weatherClient = require('./../clients/weather');
const moment = require('moment');
const Promise = require('bluebird');

module.exports = {

  validateDiscount: (promocode, args) => {

    const validateAll = restrictions => Promise.all(restrictions.map(restriction => evaluateNode(restriction)));

    const validateAny = restrictions => Promise.any(restrictions.map(restriction => evaluateNode(restriction)));

    const evaluateNode = restriction => {
      if (restriction.name === 'meteo') {
        return validateWeather(restriction.data);
      } else if (restriction.name === 'date') {
        return validateDate(restriction.data);
      } else if (restriction.name === 'age') {
        return validateAge(restriction.data);
      } else if (restriction.name === 'or') {
        return validateAny(restriction.restrictions);
      } else if (restriction.name === 'and') {
        return validateAll(restriction.restrictions);
      }
    };

    const validateWeather = data => weatherClient.get(args.meteo.town)
      .then(weather => {
        if (weather.temp < data.temp.gt || weather.is.toUpperCase() !== data.is.toUpperCase()) {
          throw new Error('Temperature must be above ' + data.temp.gt + ' (' + weather.temp + ') ' +
            'and weather must be ' + data.is + ' but it\'s ' + weather.is);
        }
      });

    const validateDate = Promise.method(data => {
      const currentDate = moment();
      if (currentDate < moment(data.after) || currentDate > moment(data.before)) {
        throw new Error('Date must be between ' + data.after + ' and ' + data.before);
      }
    });

    const validateAge = Promise.method(data => {
      if (data.eq) {
        if (data.eq !== args.age) {
          throw new Error('Age must be equal to ' + data.eq);
        }
      } else if (data.lt && data.gt) {
        if (args.age > data.lt || args.age < data.gt) {
          throw new Error('Age must be between ' + data.lt + ' and ' + data.gt);
        }
      }
    });

    return validateAll(promocode.restrictions)
      .then(() => ({
        promocode_name: promocode.name,
        status: 'accecpted',
        avantage: promocode.avantage
      }))
      .catch(error => {
        let reasons = {};
        if (error.name === 'Error') {
          reasons = error.message;
        } else if (error.name === 'AggregateError') {
          reasons = error.map(error => error.message);
        } else {
          reasons = error;
        }
        return {
          promocode_name: promocode.name,
          status: 'denied',
          reasons
        };
      });
  }
};

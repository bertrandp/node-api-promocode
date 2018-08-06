'use strict';

const promocodecontroller = require('./../controllers/promocode');

module.exports = router => {
  /**
  * get all promocodes
  */
  router
    .route('/promocodes')
    .get(promocodecontroller.getAll);

  /**
  * add a promocode with the following data structure:
  *
  * {
  *   "name": "WeatherCode",
  *   "avantage": {
  *      "percent": 20
  *   },
  *   "restrictions": [
  *       {
  *           "name": "or",
  *           "restrictions": [
  *               {
  *                  "name": "age",
  *                  "data": {
  *                      "eq": 40
  *                  }
  *               },
  *               {
  *                  "name": "age",
  *                  "data": {
  *                      "lt": 30,
  *                      "gt": 15
  *                  }
  *               }
  *           ]
  *       },
  *       {
  *           "name": "date",
  *           "data": {
  *               "after": "2017-05-02",
  *               "before": "2018-09-02"
  *           }
  *       },
  *       {
  *           "name": "meteo",
  *           "data": {
  *               "is": "clear",
  *               "temp": {
  *                   "gt": "15"
  *               }
  *           }
  *       }
  *   ]
  * }
  */
  router
    .route('/promocodes')
    .post(promocodecontroller.addPromocode);

  /**
  * ask for a discount :
  *
  * {
  *   "promocode_name": "WeatherCode",
  *   "args": {
  *     "age": 210,
  *     "meteo": {
  *       "town": "Tokyo"
  *     }
  * }
  */
  router
    .route('/promocodes/validateDiscount')
    .post(promocodecontroller.validateDiscount);

};

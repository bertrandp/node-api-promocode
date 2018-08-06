const weatherClient = require('./../clients/weather')
const moment = require('moment')
var Promise = require("bluebird");

module.exports = {
    
    validateDiscount: (promocode, arguments) => {

        const validateAll = (restrictions, arguments) => {
            return Promise.all(restrictions.map(restriction => evaluateNode(restriction, arguments)))
        }

        const validateAny = (restrictions, arguments) => {
            return Promise.any(restrictions.map(restriction => evaluateNode(restriction, arguments)))
        }

        const evaluateNode = (restriction, arguments) => {
            if (restriction.name === 'meteo') {
                return validateWeather(restriction.data, arguments)
            } else if (restriction.name === 'date') {
                return validateDate(restriction.data)
            } else if (restriction.name === 'age') {
                return validateAge(restriction.data, arguments)
            } else if (restriction.name === 'or') {
                return validateAny(restriction.restrictions, arguments)
            } else if (restriction.name === 'and') {
                return validateAll(restriction.restrictions, arguments)
            }
        }

        const validateWeather = (data, arguments) => {
            return weatherClient.get(arguments.meteo.town)
                .then(weather => {
                    if(weather.temp < data.temp.gt || weather.is.toUpperCase() !== data.is.toUpperCase()) {
                        throw 'Temperature must be above ' + data.temp.gt + ' (' + weather.temp + ') and weather must be ' + data.is + ' but it\'s ' + weather.is;
                    }
                })
        }

        const validateDate = Promise.method((data) => {
            const currentDate = moment()
            if(currentDate < moment(data.after) || currentDate > moment(data.before)) {
                throw 'Date must be between ' + data.after + ' and ' + data.before
            }
        })

        const validateAge =  Promise.method((data, arguments) => {
            if (data.eq) {
                if(data.eq !== arguments.age) {
                    throw 'Age must be equal to ' + data.eq
                }
            } else if (data.lt && data.gt) {
                if(arguments.age > data.lt || arguments.age < data.gt) {
                    throw 'Age must be between ' + data.lt + ' and ' + data.gt
                }
            }
        })

        return validateAll(promocode.restrictions, arguments)
            .then(() => {
                return {
                    promocode_name: promocode.name,
                    status: 'accecpted',
                    avantage: promocode.avantage
                }
            })
            .catch(error => {
                return {
                    promocode_name: promocode.name, 
                    status: 'denied',
                    reasons: error
                }
            })
    }
}
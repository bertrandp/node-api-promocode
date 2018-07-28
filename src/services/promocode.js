const weatherClient = require('./../clients/weather')
const moment = require('moment')

module.exports = {
    
    validateDiscount: (promocode, arguments, callback) => {
        weatherClient.get(arguments.meteo.town, (err, weather) => {
            if(err) {
                return res.send(err)
            }

            const validateAll = (restrictions) => {
                return restrictions.every(restriction => evaluateNode(restriction))
            }
            
            const validateAny = (restrictions) => {
                return restrictions.some(restriction => evaluateNode(restriction))
            }
    
            const evaluateNode = (restriction) => {
                if (restriction.name === 'meteo') {
                    return validateWeather(restriction.data)
                } else if (restriction.name === 'date') {
                    return validateDate(restriction.data)
                } else if (restriction.name === 'age') {
                    return validateAge(restriction.data)
                } else if (restriction.name === 'or') {
                    return validateAny(restriction.restrictions)
                } else if (restriction.name === 'and') {
                    return validateAll(restriction.restrictions)
                }
            }
    
            const validateWeather = (data) => {
                if(weather.temp > data.temp.gt && weather.is.toUpperCase() === data.is.toUpperCase()) {
                    return true
                }
                errors.push('Temperature must be above ' + data.temp.gt + ' (' + weather.temp + ') and weather must be ' + data.is + ' but it\'s ' + weather.is)
                return false;
            }
    
            const validateDate = (data) => {
                const currentDate = moment()
                if(currentDate > moment(data.after) && currentDate < moment(data.before)) {
                    return true
                }
                errors.push('Date must be between ' + data.after + ' and ' + data.before)
                return false
            }
    
            const validateAge =  (data) => {
                if(!arguments.age) {
                    return false
                } else if (data.eq) {
                    if(data.eq === arguments.age) {
                        return true
                    }
                    errors.push('Age not equal ' + data.eq)
                    return false
                } else if (data.lt && data.gt) {
                    if(arguments.age < data.lt && arguments.age > data.gt) {
                        return true
                    }
                    errors.push('Age must be between ' + data.lt + ' and ' + data.gt)
                    return false
                }
                return false;
            }
    
            const errors = []

            result = validateAll(promocode.restrictions)

            const response = result ? {
                promocode_name: promocode.name, 
                status: 'accecpted',
                avantage: promocode.avantage
            } : {
                promocode_name: promocode.name, 
                status: 'denied',
                reasons: errors
            }
    
            callback(err, response)
        })
    }
}
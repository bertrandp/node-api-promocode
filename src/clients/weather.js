const request = require('request');

module.exports = {
  get: (city, callback) => {
    const option = {
      method: 'GET',
      uri: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=d0562f476913da692a065c608d0539f6',
      json: true
    }

    request(option, (error, response, body) => {
      callback (error, {
        temp: body.main.temp,
        is: body.weather[0].main
      })
    })
  }
}
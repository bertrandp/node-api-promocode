var rp = require('request-promise');

module.exports = {
  get: city => {
    const option = {
      method: 'GET',
      uri: 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&APPID=d0562f476913da692a065c608d0539f6',
      json: true
    }

    return rp(option)
      .then(response => {
        return {
          temp: response.main.temp,
          is: response.weather[0].main
        }
      })
  }
}
const Promocode = require('./../models/promocode')
const promocodeService = require('./../services/promocode')

const promocodes = [];

module.exports = {
    getAll: (req, res, next) => {
        res.send(promocodes)
    },

    addPromocode: (req, res, next) => {
        let { name, avantage, restrictions } = req.body

        if(promocodes.find(promocode => promocode.name === name)) {
            return res.status(409).send('Promocode ' + name + ' already exists')
        }

        const promocode = new Promocode(name, avantage, restrictions)
        promocodes.push(promocode)
        res.send(promocode)
        next()
    },
    
    validateDiscount: (req, res, next) => {
        let { promocode_name, arguments } = req.body
        const promocode = promocodes.find(promocode => promocode.name === promocode_name)
        if(!promocode) {
            return res.status(404).send('Promocode ' + name + ' not found')
        }

        promocodeService.validateDiscount(promocode, arguments, (err, result) => {
            if(err) {
                res.status(500).send(err)
            }
            res.send(result)
            next()
        })
    }
}
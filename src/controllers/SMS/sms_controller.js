const batchSend = require('./sms')


async function broadcastSMS(req, res, next) {

   try {

      batchSend.allSMS(req.body.group, req.body.messageBody)

   } catch (error) {

   }

};

module.exports = { broadcastSMS };
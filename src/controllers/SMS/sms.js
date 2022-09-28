
const credentials = {
    apiKey: 'a91687fa7fc223b293868d2f52b645f5523d73a4acc89c22e01afcdba8686aac',         // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};

const Africastalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = Africastalking.SMS

async function sendSMS(id,num) {
    
    try {
        const result=await sms.send({
             // Set the numbers you want to send to in international format
      //  to: ['+2349037137077', '+254733YYYZZZ'],
          to: num, 
          message: `Welcome to SOPA-ERETO. Please save this number ${id} as this is your ID,you can access and verify your information using this ID by dailing *384*63450*3#`,
          from: 'Sopa-Ereto'
        });
       // console.log(result.SMSMessageData['Recipients']);

      } catch(ex) {
        console.error(ex);
      } 

};


async function allSMS(group,messageBody){
    
  try {
      const result=await sms.send({
        to: group, 
        message: messageBody,
        from: 'Sopa-Ereto'
      });
    // console.log(result.SMSMessageData);

    } catch(ex) {
      console.error(ex);
    } 

};

module.exports = {sendSMS,
allSMS}
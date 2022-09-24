const express=require('express');
const router=express.Router();
const controller=require('../controllers/ussd/ussd')
const homeController=require('../controllers/home')
const smsController=require('../controllers/SMS/sms_controller')




 router.post('/',controller.ussdStarter);

 router.get('/', homeController.home)
 router.post('/sendSMS', smsController.broadcastSMS)



module.exports=router;
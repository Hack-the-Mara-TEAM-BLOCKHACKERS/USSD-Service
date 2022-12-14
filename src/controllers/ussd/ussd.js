
const { v4: uuidv4 } = require('uuid');
const ID = require("nodejs-unique-numeric-id-generator");
const axios = require('axios');
const UssdMenu = require('ussd-builder');
const { encrypt, compare } = require('../../services/crypto');
const { generateOTP } = require('../../services/OTP');
let menu = new UssdMenu()
var gg = '';

let yourID = '';
var name = "";
var surname = "";
var middleName = "";
let responseData = {};
const sendSMS = require('../SMS/sms');
var acct = "";
var saveData = {};
var saveData2 = {};
var payload = {};
var stat = 0;
const ussdStarter = (req, res, next) => {


    // Define menu states
    menu.startState({
        run: async () => {
            // use menu.con() to send response without terminating session      
            menu.con('Welcome,  Sopa Ereto User:' +
                '\n1. Registration' +
                '\n2. View your details' +
                '\n3. Donations history' +
                '\n4. Get Support');




            // //const hashedPassword = await encrypt(password);
            // const otpGenerated = generateOTP();
            // console.log(otpGenerated)


        },
        // next object links to next state based on user input
        next: {


            '1': 'register',
            '2': 'viewDetails',
            '3': 'donations',
            '4': 'support',
        }
    });



    //REGISTRATION
    menu.state('register', {
        run: () => {
            // use menu.con() to send response without terminating session      
            menu.con('Welcome. Sopa Ereto User Registration:' +
                '\n1. Land owner' +
                '\n2. Ranger');
        },
        // next object links to next state based on user input
        next: {
            '1': 'owner',
            '2': 'ranger'
        }
    });





    //LANDOWNER
    menu.state('owner', {
        run: () => {
            stat = 1;
            // use menu.con() to send response without terminating session      
            menu.con('Please enter your National ID number:');

            var id = Number(menu.val);


        },
        next: {
            //append user input details to next state
            '*\\d+': 'validate_owner'
        }
    });



    //RANGER
    menu.state('ranger', {
        run: () => {
            stat = 2;
            // use menu.con() to send response without terminating session      
            menu.con('Please enter your National ID number to verify your identity:');

            var id = Number(menu.val);


        },
        next: {
            //append user input to next state
            '*\\d+': 'validate_ranger'
        }
    });





    //VALIDATE NATIONAL IDENTITY NUMBER
    menu.state('validate_ranger', {
        run: async () => {
            //var id = "237721480";
            //get user iput and set as id
            var NID = menu.val
            try {
                await axios({
                    method: "post",
                    url: `http://api.sandbox.youverify.co/v2/api/identity/ke/national-id`,
                    data: {
                        "id": NID,
                        "isSubjectConsent": true
                    },
                    headers: {
                        token: 'hEGOABo0.axF4vmsgeE2RxDPyF2UDIrU1ls0eG5L7jL0G',
                    },
                }).then((response) => {
                    responseData = response.data;
                    const removeSpaces = str => str.replace(/\s/g, '');
                    //console.log(responseData);
                    //console.log(response.data["data"]['status']);
                    if (responseData["data"]['status'] == 'found') {
                        // console.log(response.data['success']);
                        name = responseData["data"]['firstName'];
                        middleName = removeSpaces(responseData["data"]['middleName'].trim());
                        surname = responseData["data"]['lastName'];
                        // console.log(middleName);
                        try {
                            axios({
                                method: "post",
                                url: `https://sopa-ereto-diam.herokuapp.com/mcs2/validate-Ranger`,
                                data: { "firstName": name, "lastName": surname, "middleName": middleName },

                            }).then((response) => {
                                saveData = response.data['data'];
                                //console.log(saveData);

                                let code = response.data["status"]
                                // console.log(response.data);
                                if (code == 'SE200') {
                                    // console.log(response['success']);
                                    let getEncrypt = uuidv4();
                                    yourID = ID.generate(new Date().toJSON());
                                    userID = `${getEncrypt}${yourID}`;
                                    var newName = response.data["data"]["firstName"]
                                    var newsurname = response.data["data"]["lastName"]
                                    var newMiddleName = response.data["data"]["middleName"]

                                    let fullName = `${newName} ${newMiddleName} ${newsurname}`

                                    menu.con('Hello ' + fullName + ' select an account type to recieve payments:' +
                                        '\n1. Mpesa' +
                                        '\n2. Bank Account');
                                } if (code == 'SE404') {
                                    menu.end('Looks like something is wrong!, we could not find your data on the company records.');
                                }
                            })
                        } catch (error) {

                        }

                    }

                });

            } catch (error) {
                if (error.response['data']['success'] == false) {
                    // console.log(error.response['data'])
                    menu.con('Looks like something is wrong!, we could not find your National ID.' +
                        '\n Enter it again');

                }
            }
        },


        next: {
            //get account type
            '1': 'Mpesa_r',
            '2': 'Bank_r'
        }
    });




    //VALIDATE NATIONAL IDENTITY NUMBER
    menu.state('validate_owner', {
        run: async () => {
            //var id = "237721480";
            //get user iput and set as id
            var NID = menu.val
            try {
                await axios({
                    method: "post",
                    url: `http://api.sandbox.youverify.co/v2/api/identity/ke/national-id`,
                    data: {
                        "id": NID,
                        "isSubjectConsent": true
                    },
                    headers: {
                        token: 'hEGOABo0.axF4vmsgeE2RxDPyF2UDIrU1ls0eG5L7jL0G',
                    },
                }).then((response) => {
                    responseData = response.data;
                    const removeSpaces = str => str.replace(/\s/g, '');
                    //console.log(responseData);
                    //console.log(response.data["data"]['status']);
                    if (responseData["data"]['status'] == 'found') {
                        // console.log(response.data['success']);
                        name = responseData["data"]['firstName'];
                        middleName = removeSpaces(responseData["data"]['middleName'].trim());
                        surname = responseData["data"]['lastName'];
                        // console.log(middleName);
                        try {
                            axios({
                                method: "post",
                                url: `https://sopa-ereto-diam.herokuapp.com/mcs2/validate-LandOwner`,
                                data: { "firstName": name, "lastName": surname, "middleName": middleName },

                            }).then((response) => {
                                saveData2 = response.data['data'];
                                //console.log(saveData);

                                let code = response.data["status"]
                                // console.log(response.data);
                                if (code == 'SE200') {
                                    // console.log(response['success']);
                                    let getEncrypt = uuidv4();
                                    yourID = ID.generate(new Date().toJSON());
                                    userID = `${getEncrypt}${yourID}`;
                                    var newName = response.data["data"]["firstName"]
                                    var newsurname = response.data["data"]["lastName"]
                                    var newMiddleName = response.data["data"]["middleName"]

                                    let fullName = `${newName} ${newMiddleName} ${newsurname}`

                                    menu.con('Hello ' + fullName + ' select an account type to recieve payments:' +
                                        '\n1. Mpesa' +
                                        '\n2. Bank Account');
                                } if (code == 'SE404') {
                                    menu.end('Looks like something is wrong!, we could not find your data on the company records.');
                                }
                            })
                        } catch (error) {

                        }

                    }

                });

            } catch (error) {
                if (error.response['data']['success'] == false) {
                    // console.log(error.response['data'])
                    menu.con('Looks like something is wrong!, we could not find your National ID.' +
                        '\n Enter it again');

                }
            }
        },


        next: {
            //get account type
            '1': 'Mpesa_o',
            '2': 'Bank_o'
        }
    });

    //mpesa
    menu.state('Mpesa_r', {
        run: () => {
            menu.con('Enter your Mpesa Phone Number:');


        },
        next: {
            // using regex to match user input to next state
            '*\\d+': 'Result_r'
        }
    });



    //bank
    menu.state('Bank_r', {
        run: () => {
            menu.con('Enter your Bank Account Number:');


        },
        next: {
            // using regex to match user input to next state
            '*\\d+': 'Result_r'
        }
    });




    //mpesa
    menu.state('Mpesa_o', {
        run: () => {
            menu.con('Enter your Mpesa Phone Number:');


        },
        next: {
            // using regex to match user input to next state
            '*\\d+': 'Result_o'
        }
    });



    //bank
    menu.state('Bank_o', {
        run: () => {
            menu.con('Enter your Bank Account Number:');


        },
        next: {
            // using regex to match user input to next state
            '*\\d+': 'Result_o'
        }
    });



    // nesting states
    menu.state('Result_r', {
        run: async () => {
            acct = Number(menu.val);
            let userPhone = menu.args.phoneNumber;
            menu.end(`Successful Registration! Your user ID is ${yourID}. Welcome to Sopa-Ereto.`);
            let newData=  {
                "_id": yourID.toString(),
                "address": 'Mara',
                "gender": saveData['gender'].toString(),
                "dob": saveData['dateOfBirth'].toString(),
                "phone": saveData['phone'].toString(),
                "middleName": saveData['middleName'].toString(),
                "firstName": saveData['firstName'].toString(),
                "lastName": saveData['lastName'].toString(),
                "account": acct.toString(),
                "fullName": saveData['fullName'].toString()

            };
            console.log(newData);
            try {
                // console.log(name);
                await axios({
                    method: "post",
                    url: `https://sopa-ereto-diam.herokuapp.com/mcs2/save-Ranger`,
                     data:newData
                   

                }).then((response) => {
                    if (response.data['status'] == 'SE200') {
                        try {

                            sendSMS.sendSMS(yourID, userPhone);
                        } catch (error) {

                        }

                    } else {

                    }




                })
            } catch (error) {
                console.log(error.data);
            }


        }
    });




    // nesting states
    menu.state('Result_o', {
        run: async () => {

            acct = Number(menu.val);
            let userPhone = menu.args.phoneNumber;
            

console.log(saveData2)


let newData2={
    "_id": yourID.toString(),
    "middleName": saveData2['middleName'].toString(),
    "firstName": saveData2['firstName'].toString(),
    "lastName": saveData2['lastName'].toString(),
    "address": saveData2['userAddress'].toString(),
    "gender": saveData2['gender'].toString(),
    "dob": saveData2['dateOfBirth'].toString(),
    "phone": userPhone.toString(),
    "account": acct.toString(),
    "acreSize": saveData2['acreSize'].toString(),
    "fullName": saveData2['fullName'].toString(),
    "conservancy": saveData2['conservancy'].toString(),

};
console.log(newData2)
           menu.end(`Successful Registration! Your user ID is ${yourID}. Welcome to Sopa-Ereto.`);
            try {
                // console.log(name);
                await axios({
                    method: "post",
                    url: `https://sopa-ereto-diam.herokuapp.com/mcs2/save-LandOwner`,
                     data:newData2,
                    
                }).then((response) => {

                     console.log(response.data)
                    if (response.data['status'] == 'SE200') {
                        try {

                            sendSMS.sendSMS(yourID, userPhone);
                        } catch (error) {

                        }

                    } else {

                    }
                })
            } catch (error) {
                console.log(error.data);
            }


        }
    });










    //VIEW DETAILS
    menu.state('viewDetails', {
        run: () => {
            // use menu.con() to send response without terminating session      
            menu.con('Please enter your Sopa-Ereto user ID number:');

            var id = Number(menu.val);


        },
        next: {
            //append user input details to next state
            '*\\d+': 'check'
        }

    });

    //check user details
    menu.state('check', {
        run: async () => {
            // use menu.con() to send response without terminating session      
            menu.con('Please enter your pin:');





        },
        next: {
            //append user input details to next state
            '*\\d+': 'getDetail'
        }


    });


    //check user details
    menu.state('getDetail', {
        run: async () => {

            let pin = Number(menu.val);
            console.log(pin);

            let userPin = 1553;


            if (pin === userPin) {
                await sendSMS(yourID);
                menu.end('You will recieve a text message shortly.');

            }


            else
                menu.con('Sorry the pin is incorrect:' + '\n Enter it again');






        },




    });







    //Donations
    menu.state('donations', {
        run: () => {
            // use menu.con() to send response without terminating session      
            menu.con('Please enter your Sopa-Ereto user ID number:');

            var id = Number(menu.val);


        },
        next: {
            //append user input details to next state
            '*\\d+': 'myDonations'
        }

    });

    //check user details
    menu.state('myDonations', {
        run: () => {
            // use menu.con() to send response without terminating session      
            menu.end('This service is almost here, just hold on');




        }

    });




    //SUPPORT
    menu.state('support', {
        run: () => {
            menu.end('We are sorry that you\'re having difficulties using our service. Please contact the tourism organization you registered with for more enquires.');
        },


    });







    menu.run(req.body, ussdResult => {
        res.send(ussdResult);
    });
}

module.exports = {
    ussdStarter

};
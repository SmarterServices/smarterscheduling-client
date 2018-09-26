'use strict';

const Client = require('./index');
const credential = {
  host: 'http://localhost:8013'
};
const client = new Client();


const listLocation = {
  accountSid: 'PA3cacf5fc6e024b39823a3f31f7eb096b',
  limit: 1,
  offset: 1
};

const addLocation = {
  accountSid: 'SA3cacf5fc6e024b39823a3f31f7eb096b',
  title: 'MA Location',
  seatManagement: 'basic'
};

client
  .listLocation(Object.assign(credential, listLocation))
  //.addLocation(Object.assign(credential, addLocation))
  .then(response => {
    console.log(JSON.stringify(response, null, 2));

  })
  .catch(err => {
    console.error(JSON.stringify(err, null, 2));
  });

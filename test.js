'use strict';

const Client = require('./index');
const credential = {
  host: 'http://localhost:8013'
};
const client = new Client();


const listLocation = {
  params: {accountSid: 'SA3cacf5fc6e024b39823a3f31f7eb096b'},
  query: {limit: 1, offset: 1}
};

const addLocation = {
  params: {accountSid: 'SA3cacf5fc6e024b39823a3f31f7eb096b'},
  payload: {
    title: 'MA Location',
    seatManagement: 'basic'
  }
};

client
//.listLocation(Object.assign(credential, listLocation))
  .addLocation(Object.assign(credential, addLocation))
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });

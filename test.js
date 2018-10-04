'use strict';

//set to 'dev' to validate function arguments
process.env.NODE_ENV = 'dev';

const Client = require('./index');
const credential = {
  host: 'http://localhost:8013',
  authorizationToken: 'dummyToken'
};
const client = new Client();

const accountSid = 'SAb81222e1f38c4a9695269b76c9f20466';
const locationSid = 'SLc74e37c2dbf147698dfd889a6e3d9200';
const calendarSid = 'CL3e1a5ab28e23496898415721238cc560';
const scheduleSid = 'SCb6d8f752815a40788502652bc9263305';
const exclusionSid = 'AE82320ed5e13449a39fc0351fa1f32da1';

const queryParams = {
  limit: 1,
  offset: 1
};

const listAccount = {
  limit: 1,
  offset: 1
};

const addAccount = {
  title: 'Account of MA',
  externalId: '111'
};

const getAccount = {
  accountSid
};

const listLocation = {
  accountSid
};

const addLocation = {
  accountSid,
  title: 'MA Location',
  seatManagement: 'basic'
};

const addCalendar = {
  accountSid,
  locationSid,
  title: 'MA Calendar',
  interval: 10,
  endBuffer: 0,
  numberOfSeats: 5
};

const listCalendar = {
  accountSid,
  locationSid
};

const getCalendar = {
  accountSid,
  locationSid,
  calendarSid
};

const addExclusion = {
  accountSid,
  locationSid,
  scheduleSid,
  title: 'Test Title',
  startDate: '2018-09-18',
  dayOfWeek: 2,
  startTime: '13:49',
  endTime: '22:49',
  recurring: 'weekly'
};

const listExclusion = {
  accountSid,
  locationSid
};

const getExclusion = {
  accountSid,
  exclusionSid
};

const updateExclusion = {
  accountSid,
  exclusionSid,
  title: 'Test Title',
  startDate: '2018-09-18',
  dayOfWeek: 2,
  startTime: '13:49',
  endTime: '22:49',
  recurring: 'weekly'
};

const deleteExclusion = {
  accountSid,
  exclusionSid
};

const listAvailability = {
  accountSid,
  scheduleSid
};

const listAppointmentAvailability = {
  accountSid,
  startDateTime: '2018-09-24T06:13:30.595Z',
  endDateTime: '2018-09-24T06:13:30.595Z',
  duration: 45,
  calendarSid
};

const addAvailability = {
  accountSid,
  scheduleSid,
  create: [
    {
      startDate: '2018-09-26T10:21:06.764Z',
      dayOfWeek: 0,
      startTime: '01:00',
      endTime: '02:00',
      recurring: 'weekly'
    }
  ],
  update: [
    {
      sid: 'AV8b72ce979a634c96976b272cb302774e',
      startDate: '2018-09-26T10:21:06.764Z',
      dayOfWeek: 0,
      startTime: '01:00',
      endTime: '02:00',
      recurring: 'weekly'
    }
  ]
};

const listCalendarAvailability = {
  accountSid,
  calendarSid,
  startDate: '2018-09-26',
  endDate: '2018-10-26'
};


client
// .addAccount(Object.assign({}, credential, addAccount))
// .listAccount(Object.assign({}, credential, listAccount, queryParams))
  .getAccount(Object.assign({}, credential, getAccount))
//   .listLocation(Object.assign({}, credential, listLocation, queryParams))
//   .addLocation(Object.assign({}, credential, addLocation))
//   .addCalendar(Object.assign({}, credential, addCalendar))
//   .getCalendar(Object.assign({}, credential, getCalendar))
//   .addExclusion(Object.assign({}, credential, addExclusion))
//   .listExclusion(Object.assign({}, credential, listExclusion))
// .getExclusion(Object.assign({}, credential, getExclusion))
// .updateExclusion(Object.assign({}, credential, updateExclusion))
// .deleteExclusion(Object.assign({}, credential, deleteExclusion))
// .addAvailability(Object.assign({}, credential, addAvailability))
// .listAvailability(Object.assign({}, credential, listAvailability))
// .listAppointmentAvailability(Object.assign({}, credential, listAppointmentAvailability))
//   .listCalendarAvailability(Object.assign({}, credential, listCalendarAvailability))
  .then(response => {
    console.log(JSON.stringify(response, null, 2));

  })
  .catch(err => {
    console.error(err);
  });

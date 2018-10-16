'use strict';

const nock = require('nock');
const Client = require('./../../index');
const mockData = require('./../data/mock.json');
const expect = require('chai').expect;
const schedulingMock = require('./mock');

describe('Client', function testClient() {
  const config = mockData.config;
  let client;

  before('Mock', function () {
    nock.disableNetConnect();
  });

  after('Mock', function () {
    nock.enableNetConnect();
    schedulingMock.reset();
  });

  afterEach('Reset Mock', function () {
    schedulingMock.removeInterceptor();
  });

  it('Should create new client', function testCreateNewClient() {
    client = new Client();
    expect(client).instanceof(Client);
  });

  describe('Add Account', function testClient() {
    const apiName = 'addAccount';

    before('Create Mocker', function () {
      schedulingMock.postEndpointMocker(apiName);
    });

    it('Should Add Account', () => {
      return client
        .addAccount(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Add Account', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.postEndpointMocker(apiName, 'fail');

      return client
        .addAccount(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Account', function testClient() {
    const apiName = 'listAccount';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Account', () => {
      return client
        .listAccount(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Account', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listAccount(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Location', function testClient() {
    const apiName = 'listLocation';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker('listLocation');
    });

    it('Should list location', () => {
      return client
        .listLocation(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to list location', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker('listLocation', 'fail');

      return client
        .listLocation(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Add Location', function testClient() {
    const apiName = 'addLocation';

    before('Create Mocker', function () {
      schedulingMock.postEndpointMocker('addLocation');
    });

    it('Should add location', () => {
      return client
        .addLocation(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to add location', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.postEndpointMocker('addLocation', 'fail');

      return client
        .addLocation(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Add Calendar', function testClient() {
    const apiName = 'addCalendar';

    before('Create Mocker', function () {
      schedulingMock.postEndpointMocker(apiName);
    });

    it('Should Add Calendar', () => {
      return client
        .addCalendar(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Add Calendar', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.postEndpointMocker(apiName, 'fail');

      return client
        .addCalendar(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Calendar', function testClient() {
    const apiName = 'listCalendar';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Calendar', () => {
      return client
        .listCalendar(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Calendar', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listCalendar(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Get Calendar', function testClient() {
    const apiName = 'getCalendar';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should Get Calendar', () => {
      return client
        .getCalendar(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Get Calendar', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .getCalendar(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Add Exclusion', function testClient() {
    const apiName = 'addExclusion';

    before('Create Mocker', function () {
      schedulingMock.postEndpointMocker(apiName);
    });

    it('Should Add Exclusion', () => {
      return client
        .addExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Add Exclusion', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.postEndpointMocker(apiName, 'fail');

      return client
        .addExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Exclusion', function testClient() {
    const apiName = 'listExclusion';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Exclusion', () => {
      return client
        .listExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Exclusion', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Get Exclusion', function testClient() {
    const apiName = 'getExclusion';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should Get Exclusion', () => {
      return client
        .getExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Get Exclusion', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .getExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Update Exclusion', function testClient() {
    const apiName = 'updateExclusion';

    before('Create Mocker', function () {
      schedulingMock.updateEndpointMocker(apiName);
    });

    it('Should Update Exclusion', () => {
      return client
        .updateExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Update Exclusion', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.updateEndpointMocker(apiName, 'fail');

      return client
        .updateExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Delete Exclusion', function testClient() {
    const apiName = 'deleteExclusion';

    before('Create Mocker', function () {
      schedulingMock.deleteEndpointMocker(apiName);
    });

    it('Should Delete Exclusion', () => {
      return client
        .deleteExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Delete Exclusion', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.deleteEndpointMocker(apiName, 'fail');

      return client
        .deleteExclusion(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Add Availability', function testClient() {
    const apiName = 'addAvailability';

    before('Create Mocker', function () {
      schedulingMock.postEndpointMocker(apiName);
    });

    it('Should Add Availability', () => {
      return client
        .addAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to add Availability', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.postEndpointMocker(apiName, 'fail');

      return client
        .addAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Availability', function testClient() {
    const apiName = 'listAvailability';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Availability', () => {
      return client
        .listAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Availability', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Appointment Availability', function testClient() {
    const apiName = 'listAppointmentAvailability';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Appointment Availability', () => {
      return client
        .listAppointmentAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Appointment Availability', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listAppointmentAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Calendar Availability', function testClient() {
    const apiName = 'listCalendarAvailability';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Calendar Availability', () => {
      return client
        .listCalendarAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Calendar Availability', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listCalendarAvailability(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Add Appointment', function testClient() {
    const apiName = 'addAppointment';

    before('Create Mocker', function () {
      schedulingMock.postEndpointMocker(apiName);
    });

    it('Should Add Appointment', () => {
      return client
        .addAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Add Appointment', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.postEndpointMocker(apiName, 'fail');

      return client
        .addAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('List Appointment', function testClient() {
    const apiName = 'listAppointment';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should List Appointment', () => {
      return client
        .listAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to List Appointment', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .listAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Get Appointment', function testClient() {
    const apiName = 'getAppointment';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker(apiName);
    });

    it('Should Get Appointment', () => {
      return client
        .getAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Get Appointment', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker(apiName, 'fail');

      return client
        .getAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

  describe('Patch Appointment', function testClient() {
    const apiName = 'patchAppointment';

    before('Create Mocker', function () {
      schedulingMock.patchEndpointMocker(apiName);
    });

    it('Should Patch Appointment', () => {
      return client
        .patchAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to Patch Appointment', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.patchEndpointMocker(apiName, 'fail');

      return client
        .patchAppointment(Object.assign({}, config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

});

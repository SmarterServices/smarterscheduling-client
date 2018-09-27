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
      schedulingMock.getEndpointMocker('addLocation', 'fail');

      return client
        .listLocation(Object.assign({}, config, mockData[apiName].parameters))
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

});

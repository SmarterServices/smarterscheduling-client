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

  it('Should create new client', function testCreateNewClient() {
    client = new Client();
    expect(client).instanceof(Client);
  });

  describe('List Location', function testClient() {
    const apiName = 'listLocation';

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker('listLocation');
    });

    it('Should list location', () => {
      return client
        .listLocation(Object.assign(config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to list location', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker('listLocation', 'fail');

      return client
        .listLocation(Object.assign(config, mockData[apiName].parameters))
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
        .addLocation(Object.assign(config, mockData[apiName].parameters))
        .then((response) => {
          expect(response).to.eql(mockData[apiName].response.valid);
        });
    });

    it('Should fail to add location', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker('addLocation', 'fail');

      return client
        .listLocation(Object.assign(config, mockData[apiName].parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData[apiName].response.fail);
        });
    });

  });

});

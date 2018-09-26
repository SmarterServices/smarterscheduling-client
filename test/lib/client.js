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

    before('Create Mocker', function () {
      schedulingMock.getEndpointMocker('listLocation');
    });

    it('Should list location', () => {
      return client
        .listLocation(Object.assign(config, mockData.listLocation.parameters))
        .then((response) => {
          expect(response).to.eql(mockData.listLocation.response.valid);
        });
    });

    it('Should fail to list location', () => {

      schedulingMock.removeInterceptor();
      schedulingMock.getEndpointMocker('listLocation', 'fail');

      return client
        .listLocation(Object.assign(config, mockData.listLocation.parameters))
        .then(Promise.reject)
        .catch((error) => {
          expect(error).to.eql(mockData.listLocation.response.fail);
        });
    });

  });

});

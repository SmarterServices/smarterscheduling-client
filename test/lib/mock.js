'use strict';
const nock = require('nock');
const mockData = require('./../data/mock');
const SCHEDULING_HOST = mockData.config.host;
const apiList = require('./../../data/api-list');
const endpointRegex = /^\/.*/;

const ProctorUMocker = {
  activeMocks: [],

  /**
   * Mock get endpoint by methodName
   * @param {String} methodName
   * @param {String} [responseType]
   * @returns {*}
   */
  getEndpointMocker: function (methodName, responseType = 'valid') {

    let scope = nock(SCHEDULING_HOST)
      .persist()
      .get(endpointRegex)
      .query(true)
      .reply(function () {
        let statusCode = 200;
        if (responseType === 'fail') {
          statusCode = 404;
        }
        return [statusCode, mockData[methodName].response[responseType]];
      });
    this.activeMocks.push(scope);
    return scope;
  },

  postEndpointMocker: function (methodName, responseType = 'valid') {

    let scope = nock(SCHEDULING_HOST)
      .persist()
      .post(endpointRegex)
      .reply(function () {
        let statusCode = 200;

        if (responseType === 'fail') {
          statusCode = 404;
        }
        return [statusCode, mockData[methodName].response[responseType]];
      });
    this.activeMocks.push(scope);
    return scope;
  },

  updateEndpointMocker: function (methodName, responseType = 'valid') {

    let scope = nock(SCHEDULING_HOST)
      .persist()
      .put(endpointRegex)
      .reply(function () {
        let statusCode = 200;

        if (responseType === 'fail') {
          statusCode = 404;
        }
        return [statusCode, mockData[methodName].response[responseType]];
      });
    this.activeMocks.push(scope);
    return scope;
  },

  deleteEndpointMocker: function (methodName, responseType = 'valid') {

    let scope = nock(SCHEDULING_HOST)
      .persist()
      .delete(endpointRegex)
      .reply(function () {
        let statusCode = 200;

        if (responseType === 'fail') {
          statusCode = 404;
        }
        return [statusCode, mockData[methodName].response[responseType]];
      });
    this.activeMocks.push(scope);
    return scope;
  },

  reset: nock.cleanAll,

  /**
   * Removes All interceptor
   */
  removeInterceptor: function removeInterceptor() {
    this.activeMocks.forEach(scope => {
      scope.interceptors.forEach(interceptor => nock.removeInterceptor(interceptor));
    });
    this.activeMocks = [];
  }
};

module.exports = ProctorUMocker;

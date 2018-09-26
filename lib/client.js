'use strict';

const _ = require('lodash');
const joi = require('joi');
const requestPromise = require('request-promise');
const apiList = require('../data/api-list.json');
const payloadSchema = require('../schema/payload-schema');
const utils = require('./helpers/utils');

const CREDENTIAL_PROPERTIES = [
  'host'
];

class Client {
  /**
   * Configure the client
   * @private
   */
  constructor() {
  }

  /**
   * Modifies host string to remove unnecessary part
   * @param {string} host - Host name for request
   * @returns {string} modifiedHost - Modified name of the host
   * @private
   */
  _sanitizeHost(host) {
    let modifiedHost = host;
    if (host.endsWith('/')) {
      //if host ends with a slash,
      //drop that since there is one in apiList
      modifiedHost = host.slice(0, host.length - 1);
    }
    return modifiedHost;
  }

  /**
   * Send the actual request with method, url and payload
   * @param {string} url - Url to request with
   * @param {string} method - HTTP method to request with
   * @param {string} [payload] - The payload to send as form
   * @return {Promise} - response
   * @memberof Client
   * @private
   */
  _send(url, method, payload) {

    const requestOptions = {
      url,
      method,
      json: true,
      form: payload,
      resolveWithFullResponse: false
    };

    return requestPromise(requestOptions);
  }

  /**
   * Returns url and method for request
   * @param {string} endpointName - Name of the endpoint
   * @param {Object} credentials - Necessary credentials
   * @param {string} credentials.host - Host name for request
   * @param {string} credentials.authorizationToken - Api Token to send in header
   * @param {Object} [params] - Param values
   * @param {Object} [query] - Query values
   * @returns {Object} - Url and method to request with
   * @private
   * @memberof Client
   */
  _getUrlAndMethod(endpointName, credentials, params = {}, query) {
    const host = this._sanitizeHost(credentials.host);
    const urlTemplate = host + apiList[endpointName].endpoint;
    const method = apiList[endpointName].method;

    const url = utils.buildUrl(urlTemplate, params, query);
    return {url, method};
  }

  /**
   * Validates request payload against joi schema
   * @param {string} methodName - Request method name
   * @param {Object} payload - Request payload
   * @returns {Promise}
   * @private
   */
  _validateData(methodName, payload) {
    let schema = payloadSchema[methodName] || {};

    return new Promise(function (resolve, reject) {
      joi.validate(payload, schema, function (error, data) {
        if (error) {
          return reject(_.get(error, 'details[0].message'));
        }
        resolve();
      });
    });
  }

  /**
   * Validate options provided in the API method
   * and returns validated Objects
   * @param {string} apiName - API name in API list
   * @param {Object} options - The options object
   * @returns {Promise<Object>} - Credentials and payload
   * @resolves {{credentials:Object, payload:Object}}
   * @private
   */
  _validateOptions(apiName, options) {
    const credentials = _.pick(options, CREDENTIAL_PROPERTIES);
    const parameters = _.omit(options, CREDENTIAL_PROPERTIES);


    return this
      ._validateData('credential', credentials)
      .then(() => this._validateData(apiName, parameters))
      .then(() => {
        return Promise.resolve({credentials, parameters});
      });
  }

  _sendRequest(apiName, options) {
    return this
      ._validateOptions(apiName, options)
      .then(({credentials, parameters}) => {
        const {params, query, payload} = parameters;
        const {url, method} = this._getUrlAndMethod(apiName, credentials, params, query);
        return this._send(url, method, payload);
      });
  }

  /**
   * Returns  list of locations
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {Object} options.params - Param values
   * @params {string} options.params.accountSid - Account Sid
   * @params {Object} [options.query] - Optional query for list
   * @returns {Promise} - List of locations
   */
  listLocation(options) {
    const apiName = 'listLocation';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Adds location
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {Object} options.params - Param values
   * @params {string} options.params.accountSid - Account Sid
   * @params {Object} options.payload - Payload to add
   * @returns {Promise} - Added location
   */
  addLocation(options) {
    const apiName = 'addLocation';
    return this
      ._sendRequest(apiName, options);
  }
}

module.exports = Client;

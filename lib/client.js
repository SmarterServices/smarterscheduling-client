'use strict';

const _ = require('lodash');
const joi = require('joi');
const requestPromise = require('request-promise');
const apiList = require('../data/api-list.json');
const joiSchema = require('../schema/payload-schema');
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

    return requestPromise(requestOptions)
      .catch((error) => {
        error = _.get(error, 'response.body', error);
        return Promise.reject(error);
      });
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
   * @returns {Promise} - Validated data
   * @private
   */
  _validateData(methodName, payload) {
    let schema = joiSchema[methodName] || {};

    return new Promise(function (resolve, reject) {
      joi.validate(payload, schema, function (error, data) {
        if (error) {
          return reject(_.get(error, 'details[0].message'));
        }
        resolve(data);
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
    const parameters = this._getParameters(apiName, options);

    return this
      ._validateData('credential', credentials)
      .then(() => this._validateData(apiName, parameters))
      .then((data) => {
        return Promise.resolve({credentials, parameters: data});
      });
  }

  /**
   * Returns formatted parameter
   * @param {string} apiName - Name of the api
   * @param {Object} options - Options that came as request
   * @return {Object} - An object containing params, payload, query
   * @private
   */
  _getParameters(apiName, options) {
    const schema = joiSchema[apiName] || {};

    const paramSchema = this._getSchema(schema, 'params');
    const querySchema = this._getSchema(schema, 'query');
    const payloadSchema = this._getSchema(schema, 'payload');

    const params = this._getFields(options, paramSchema);
    const query = this._getFields(options, querySchema);
    const payload = this._getFields(options, payloadSchema);

    return {params, query, payload};
  }

  /**
   * Returns schema for given name
   * @param {Object} schema - Joi schema
   * @param {string} name - Params or payload or query
   * @return {Object} - Joi schema
   * @private
   */
  _getSchema(schema, name) {
    if (!schema || !schema.isJoi) {
      return {};
    }

    const children = schema._inner.children;

    for (let index = 0; index < children.length; index++) {
      if (children[index].key === name) {
        return children[index].schema;
      }
    }
    return {};
  }

  /**
   * Returns fields with the key matched with schema
   * @param {Object} options - Payload that came in request
   * @param {Object} schema - joi schema
   * @return {Object} - Picked object with matched key
   * @private
   */
  _getFields(options, schema) {
    let fields;
    const keys = this._getKeysFromJoi(schema);

    fields = _.pick(options, keys);
    return fields;
  }

  /**
   * Returns key list fetched from schema
   * @param {Object} schema - Joi schema
   * @return {Array<string>} - List of keys
   * @private
   */
  _getKeysFromJoi(schema) {
    const keyNames = [];
    if (!schema || !schema.isJoi) {
      return [];
    }
    for (const item of schema._inner.children) {
      keyNames.push(item.key);
    }
    return keyNames;
  }

  /**
   * Sends request after processing
   * @param {string} apiName - Name for the api request
   * @param {Object} options - Necessary options to request
   * @return {Promise<Object>} - Response
   * @private
   */
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
   * List account
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {Object} options.params - Param values
   * @params {string} options.params.accountSid - Account Sid
   * @params {Object} options.payload - Payload to add
   * @returns {Promise} - List of account
   */
  listAccount(options) {
    const apiName = 'listAccount';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns  list of locations
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {Object} [options.limit] - Limit for list
   * @params {Object} [options.offset] - offset for list
   * @params {Object} [options.sortKyes] - Sort keys to sort data
   * @params {Object} [options.sortOrder] - Ordering of sort
   * @params {Object} [options.externalId] - External id to filter the data by
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

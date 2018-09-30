'use strict';

const _ = require('lodash');
const joi = require('joi');
const requestPromise = require('request-promise');
const apiList = require('../data/api-list.json');
const joiSchema = require('../schema/payload-schema');
const utils = require('./helpers/utils');

const CREDENTIAL_PROPERTIES = [
  'host',
  'authorizationToken'
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
    utils.validateArguments(arguments, ['string.required']);

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
   * @param {string} authorizationToken - The authorization Token to assign in header
   * @param {string} [payload] - The payload to send as form
   * @return {Promise} - response
   * @memberof Client
   * @private
   */
  _send(url, method, authorizationToken, payload) {
    utils.validateArguments(arguments, ['string.required', 'string.required']);

    const requestOptions = {
      url,
      method,
      json: true,
      body: payload,
      headers: {
        'Authorization-Token': authorizationToken
      },
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
    utils.validateArguments(arguments, ['string.required', {host: 'string.required'}]);

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
    utils.validateArguments(arguments, ['string.required']);

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
    utils.validateArguments(arguments, ['string.required']);

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
    utils.validateArguments(arguments, ['string.required']);

    const parameters = {};
    let unknownFields = {};

    const schema = joiSchema[apiName] || {};

    const paramSchema = this._getSchema(schema, 'params');
    const querySchema = this._getSchema(schema, 'query');
    const payloadSchema = this._getSchema(schema, 'payload');

    const params = this._getFields(options, paramSchema);
    const query = this._getFields(options, querySchema);
    const payload = this._getFields(options, payloadSchema);

    const paramKeys = Object.keys(params);
    const queryKeys = Object.keys(query);
    const payloadKeys = Object.keys(payload);

    unknownFields = _.omit(options, CREDENTIAL_PROPERTIES.concat(paramKeys, payloadKeys, queryKeys));

    if (paramKeys.length) {
      parameters.params = params;
    }

    if (queryKeys.length) {
      parameters.query = query;
    }

    if (payloadKeys.length) {
      parameters.payload = payload;
    }

    if (Object.keys(unknownFields).length) {
      Object.assign(parameters, unknownFields);
    }
    return parameters;
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

    utils.validateArguments(arguments, [{}, 'string.required']);

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
    utils.validateArguments(arguments, ['string.required']);

    return this
      ._validateOptions(apiName, options)
      .then(({credentials, parameters}) => {
        const {params, query, payload} = parameters;
        const {url, method} = this._getUrlAndMethod(apiName, credentials, params, query);
        const {authorizationToken}  = credentials;
        return this._send(url, method, authorizationToken, payload);
      });
  }

  /**
   * Adds account
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.title - Title of the account
   * @params {string} [options.externalId] - External ID
   * @returns {Promise<Object>} - Added account
   */
  addAccount(options) {
    const apiName = 'addAccount';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * List account
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {number} [options.limit] - Limit for list
   * @params {number} [options.offset] - Offset for list
   * @params {Array<string>} [options.sortKeys] - Sort keys to sort data
   * @params {string} [options.sortOrder] - Ordering of sort
   * @returns {Promise<Object>} - List of account
   */
  listAccount(options) {
    const apiName = 'listAccount';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns list of locations
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {number} [options.limit] - Limit for list
   * @params {number} [options.offset] - Offset for list
   * @params {Array<string>} [options.sortKeys] - Sort keys to sort data
   * @params {string} [options.sortOrder] - Ordering of sort
   * @params {Object} [options.externalId] - External id to filter the data by
   * @returns {Promise<Object>} - List of locations
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
   * @params {string} options.accountSid - Account Sid
   * @params {string} options.title - Title of the location
   * @params {string} [options.externalId] - External Id
   * @params {string} [options.seatManagement]- Seat management
   * @returns {Promise<Object>} - Added location
   */
  addLocation(options) {
    const apiName = 'addLocation';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Adds calendar
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid -  Account Sid
   * @params {string} options.locationSid -  Location Sid
   * @params {string} options.title -  Title
   * @params {number} [options.numberOfSeats] -  Number of seats
   * @params {number} [options.interval] -  Interval
   * @params {number} [options.endBuffer] -  End buffer
   * @returns {Promise<Object>} - Added calendar
   */
  addCalendar(options) {
    const apiName = 'addCalendar';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns list of calendar
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid -  Account Sid
   * @params {string} options.locationSid -  Location Sid
   * @params {number} options.offset -  Offset for the list
   * @params {number} options.limit -  Number of items to return
   * @params {Array<string>} options.sortKeys -  Keys to sort the data
   * @params {string} options.sortOrder -  Sort order
   * @returns {Promise<Object>} - List of calendar
   */
  listCalendar(options) {
    const apiName = 'listCalendar';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns a single calendar
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid -  Account Sid
   * @params {string} options.locationSid -  Location Sid
   * @params {string} options.calendarSid -  Calendar Sid
   * @returns {Promise<Object>} - A calendar object
   */
  getCalendar(options) {
    const apiName = 'getCalendar';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Adds exclusion
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid -  Account Sid
   * @params {string} [options.locationSid] -  Scheduling Location Sid
   * @params {string} [options.scheduleSid] -  Schedule Sid
   * @params {string} options.title -  Title
   * @params {date} options.startDate -  Start Date
   * @params {date} [options.endDate] -  End Date
   * @params {number} [options.dayOfWeek] -  Day Of Week
   * @params {date} options.startTime -  Start Time
   * @params {date} options.endTime -  End Time
   * @params {string} options.recurring -  Recurring
   * @params {string} [options.externalSystem] -  External System
   * @params {string} [options.externalId] -  External ID
   * @returns {Promise<Object>} - Added exclusion object
   */
  addExclusion(options) {
    const apiName = 'addExclusion';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns list of exclusion
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {number} [options.limit] - Limit for list
   * @params {number} [options.offset] - Offset for list
   * @params {Array<.string>} [options.sortKeys] - Keys to sort data
   * @params {string} [options.sortOrder] - Ordering of sort
   * @params {string} [options.locationSid] -  Scheduling Location Sid
   * @params {string} [options.scheduleSid] -  Schedule Sid
   * @returns {Promise<Object>} - List of exclusion
   */
  listExclusion(options) {
    const apiName = 'listExclusion';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns a single exclusion
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid -  Account Sid
   * @params {string} options.exclusionSid -  Exclusion Sid
   * @returns {Promise<Object>} - An exclusion object
   */
  getExclusion(options) {
    const apiName = 'getExclusion';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Updates Exclusion
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {string} options.exclusionSid - Exclusion Sid
   * @params {string} [options.locationSid] - Scheduling Location Sid
   * @params {string} [options.scheduleSid] - Schedule Sid
   * @params {string} options.title -  Title
   * @params {date} options.startDate -  Start Date
   * @params {date} [options.endDate] -  End Date
   * @params {number} [options.dayOfWeek] -  Day Of Week
   * @params {date} options.startTime -  Start Time
   * @params {date} options.endTime -  End Time
   * @params {string} options.recurring -  Recurring
   * @params {string} [options.externalSystem] -  External System
   * @params {string} [options.externalId] -  External ID
   * @returns {Promise<Object>} - Updated exclusion
   */
  updateExclusion(options) {
    const apiName = 'updateExclusion';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Deletes an exclusion
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {string} options.exclusionSid - Exclusion Sid
   * @returns {Promise<Object>} - Succces Response
   */
  deleteExclusion(options) {
    const apiName = 'deleteExclusion';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Adds availability
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {string} options.scheduleSid - Schedule Sid
   * @params {Array<Object>} [options.create] - Availabilities to create
   * @params {Array<Object>} [options.update] - Availabilities to update
   * @params {Array<Object>} [options.delete] - Availabilities to delete
   * @params {date} options.create[].startDate - Start Date
   * @params {date} [options.create[].endDate] - End Date
   * @params {number} options.create[].dayOfWeek - Day of the week
   * @params {string} options.create[].startTime - Start Time
   * @params {string} options.create[].endTime - End Time
   * @params {string} [options.create[].recurring] - Recurring
   * @params {string} [options.update[].sid] - Sid of the availability to update
   * @params {date} options.update[].startDate - Start Date
   * @params {date} [options.update[].endDate] - End Date
   * @params {number} options.update[].dayOfWeek - Day of the week
   * @params {string} options.update[].startTime - Start Time
   * @params {string} options.update[].endTime - End Time
   * @params {string} [options.update[].recurring] - Recurring
   * @params {string} [options.delete[].sid] - Sid of the availability to delete
   * @returns {Promise<Object>} - List of availability under given schedule
   */
  addAvailability(options) {
    const apiName = 'addAvailability';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns List of availability
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {string} options.scheduleSid - Schedule Sid
   * @params {number} [options.limit] - Limit for list
   * @params {number} [options.offset] - Offset for list
   * @params {Array<.string>} [options.sortKeys] - Keys to sort data
   * @params {string} [options.sortOrder] - Ordering of sort
   * @returns {Promise<Object>} - List of Availability
   */
  listAvailability(options) {
    const apiName = 'listAvailability';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns List of appointment availability
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {date} options.startDateTime - Start Date to list
   * @params {date} options.endDateTime - End Date to list
   * @params {string} options.calendarSid - Calendar Sid
   * @params {number} options.duration - Duration
   * @returns {Promise<Object>} - List of appointment availability
   */
  listAppointmentAvailability(options) {
    const apiName = 'listAppointmentAvailability';
    return this
      ._sendRequest(apiName, options);
  }

  /**
   * Returns list of calendar availability
   * @params {Object} options - Params to request with
   * @param {string} options.host - Host name for request
   * @params {string} options.accountSid - Account Sid
   * @params {string} options.calendarSid - Calendar Sid
   * @params {date} options.startDate - Start Date to list
   * @params {date} options.endDate - End Date to list
   * @returns {Promise<Object>} - List of calendar availability
   */
  listCalendarAvailability(options) {
    const apiName = 'listCalendarAvailability';
    return this
      ._sendRequest(apiName, options);
  }

}

module.exports = Client;

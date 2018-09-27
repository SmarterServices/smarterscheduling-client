'use strict';

const joi = require('joi');
const utils = require('./../lib/helpers/utils');

const allowUnknownAndStrip = {allowUnknown: true, stripUnknown: true};
const skipAllowUnknown = {allowUnknown: false, stripUnknown: false};

const commonSchemaForList = joi
  .object()
  .keys({
    offset: joi
      .number()
      .integer()
      .min(0)
      .description('Offset for the list'),
    limit: joi
      .number()
      .integer()
      .min(0)
      .description('Number of items to return'),
    sortKeys: joi
      .array()
      .items(joi
        .string()
        .valid('createdDate')
      )
      .single()
      .description('Keys to sort the data'),
    sortOrder: joi
      .string()
      .valid('ASC', 'DESC')
      .description('Sort order')
  })
  .options(skipAllowUnknown);

const schema = {
  credential: joi
    .object({
      host: joi
        .string()
        .required()
        .description('Host url')
    })
    .required()
    .description('credential schema'),
  listAccount: joi
    .object({
      query: commonSchemaForList
    })
    .options(allowUnknownAndStrip)
    .description('List account schema'),
  listLocation: joi
    .object({
    params: joi
      .object({
        accountSid: joi
          .string()
          .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
          .required()
          .description('Account Sid')
      })
      .options(skipAllowUnknown)
      .required(),
    query: commonSchemaForList
      .keys({
        externalId: joi
          .string()
          .description('External id to filter the data by')
      })
  })
    .options(allowUnknownAndStrip),
  addLocation: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid')
        })
        .required()
        .options(skipAllowUnknown)
        .description('Location params'),
      payload: joi.object({
        title: joi
          .string()
          .required()
          .description('Title'),
        externalId: joi
          .string()
          .max(255)
          .allow(null)
          .description('External ID'),
        seatManagement: joi
          .string()
          .valid('basic', 'advanced')
          .default('basic')
          .allow(null)
          .description('Seat Management')
      })
        .required()
        .options(skipAllowUnknown)
        .description('Location payload')
    })
    .options(allowUnknownAndStrip)
};

module.exports = schema;

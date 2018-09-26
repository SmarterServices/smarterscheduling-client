'use strict';

const joi = require('joi');
const utils = require('./../lib/helpers/utils');
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
  });

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
  listLocation: joi
    .object()
    .keys({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^SA[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid')
        })
        .required(),
      query: commonSchemaForList
        .keys({
          externalId: joi
            .string()
            .description('External id to filter the data by')
        })
    })
    .required(),
  addLocation: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^SA[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid')
        })
        .required()
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
        .description('Location payload')
    })
    .required()
};

module.exports = schema;

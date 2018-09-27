'use strict';

const joi = require('joi');


//Predefined schema for validation
const schemaDefinitions = {
  sid: joi
    .string()
    .regex(/^[A-Z]{2}[a-f0-9]{32}$/, 'Sid'),
  utcTime: joi.string()
    .isoDate()
    .regex(/.*Z/, 'ISO time format in utc zone')
};

module.exports = schemaDefinitions;

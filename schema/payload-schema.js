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
  })
  .description('List query');

const baseAvailabilitySchema = joi
  .object()
  .keys({
    startDate: joi
      .date()
      .required()
      .description('Start Date'),
    endDate: joi
      .date()
      .min(joi.ref('startDate'))
      .allow(null)
      .description('End Date'),
    dayOfWeek: joi
      .number()
      .integer()
      .required()
      .min(0)
      .max(6)
      .description('Day Of Week'),
    startTime: joi
      .date()
      .format('HH:mm')
      .required()
      .description('Start Time'),
    endTime: joi
      .date()
      .format('HH:mm')
      .min(joi.ref('startTime'))
      .required()
      .description('End Time'),
    recurring: joi
      .string()
      .valid('weekly')
      .default('weekly')
      .description('Recurring'),
  })
  .raw();//keeping the startTime and endTime as input format

const schema = {
  credential: joi
    .object({
      host: joi
        .string()
        .required()
        .description('Host url'),
      authorizationToken: joi
        .string()
        .required()
        .description('Access Token')
    })
    .required()
    .description('credential schema'),
  listAccount: joi
    .object({
      query: commonSchemaForList
    })
    .description('List account schema'),
  addAccount: joi
    .object({
      payload: joi.object({
        title: joi
          .string()
          .required()
          .description('Title of the account'),
        externalId: joi
          .string()
          .allow(null)
          .max(255)
          .description('External ID')
      })
        .required()
        .description('Account payload')
    })
    .description('Add Account schema'),
  getAccount: joi
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
    }),
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
        .required(),
      query: commonSchemaForList
        .keys({
          externalId: joi
            .string()
            .description('External id to filter the data by')
        })
    }),
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
    .description('Add Location schema'),
  addCalendar: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid'),
          locationSid: joi
            .string()
            .regex(/^(SL)|(PL)[a-f0-9]{32}$/, 'Location Sid')
            .required()
            .description('Location Sid')
        })
        .required()
        .description('Calendar params'),
      payload: joi.object({
        title: joi
          .string()
          .max(255)
          .required()
          .description('Title'),
        numberOfSeats: joi
          .number()
          .integer()
          .positive()
          .description('Number of seats'),
        interval: joi
          .number()
          .integer()
          .default(10)
          .min(0)
          .max(999)
          .description('Interval'),
        endBuffer: joi
          .number()
          .integer()
          .default(0)
          .min(0)
          .max(999)
          .description('End buffer'),
      })
        .required()
        .description('Calendar payload')
    })
    .description('Add Calendar schema'),
  listCalendar: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid'),
          locationSid: joi
            .string()
            .regex(/^(SL)|(PL)[a-f0-9]{32}$/, 'Location Sid')
            .required()
            .description('Location Sid')
        }),
      query: commonSchemaForList
    })
    .description('List Calendar schema'),
  getCalendar: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid'),
          locationSid: joi
            .string()
            .regex(/^(SL)|(PL)[a-f0-9]{32}$/, 'Location Sid')
            .required()
            .description('Location Sid'),
          calendarSid: joi
            .string()
            .regex(/^CL[a-f0-9]{32}$/, 'Calendar Sid')
            .required()
            .description('Calendar Sid')
        })
    })
    .description('Get Calendar schema'),
  addExclusion: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid')
        }),
      payload: joi.object({
        locationSid: joi
          .string()
          .regex(/^SL[a-f0-9]{32}$/)
          .allow(null)
          .description('Scheduling Location Sid'),
        scheduleSid: joi
          .string()
          .regex(/^SC[a-f0-9]{32}$/)
          .allow(null)
          .description('Schedule Sid'),
        title: joi
          .string()
          .required()
          .description('Title'),
        startDate: joi
          .date()
          .required()
          .description('Start Date'),
        endDate: joi
          .date()
          .min(joi.ref('startDate'))
          .allow(null)
          .description('End Date'),
        dayOfWeek: joi
          .number()
          .integer()
          .required()
          .min(0)
          .max(6)
          .description('Day Of Week'),
        startTime: joi
          .date()
          .format('HH:mm')
          .required()
          .description('Start Time'),
        endTime: joi
          .date()
          .format('HH:mm')
          .min(joi.ref('startTime'))
          .required()
          .description('End Time'),
        recurring: joi
          .string()
          .valid('weekly')
          .allow(null)
          .description('Recurring'),
        externalSystem: joi
          .string()
          .max(255)
          .allow(null)
          .description('External System'),
        externalId: joi
          .string()
          .max(255)
          .allow(null)
          .description('External ID')
      })
        .raw()//keeping the startTime and endTime as input format
        .required()
        .description('Exclusion payload')
    })
    .description('Add Exclusion schema'),
  listExclusion: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid')
        }),
      query: commonSchemaForList
        .keys({
          locationSid: joi
            .string()
            .regex(/^SL[a-f0-9]{32}$/)
            .description('Scheduling Location Sid'),
          scheduleSid: joi
            .string()
            .regex(/^SC[a-f0-9]{32}$/)
            .description('Schedule Sid')
        })
    })
    .description('List Exclusion schema'),
  getExclusion: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid'),
          exclusionSid: joi
            .string()
            .regex(/^AE[a-f0-9]{32}$/, 'Exclusion Sid')
            .required()
            .description('Exclusion Sid')
        })
    })
    .description('Get Exclusion schema'),
  updateExclusion: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'Account Sid')
            .required()
            .description('Account Sid'),
          exclusionSid: joi
            .string()
            .regex(/^AE[a-f0-9]{32}$/, 'Exclusion Sid')
            .required()
            .description('Exclusion Sid')
        }),
      payload: joi.object({
        title: joi
          .string()
          .required()
          .description('Title'),
        startDate: joi
          .date()
          .required()
          .description('Start Date'),
        endDate: joi
          .date()
          .min(joi.ref('startDate'))
          .allow(null)
          .description('End Date'),
        dayOfWeek: joi
          .number()
          .integer()
          .required()
          .min(0)
          .max(6)
          .description('Day Of Week'),
        startTime: joi
          .date()
          .format('HH:mm')
          .required()
          .description('Start Time'),
        endTime: joi
          .date()
          .format('HH:mm')
          .min(joi.ref('startTime'))
          .required()
          .description('End Time'),
        recurring: joi
          .string()
          .valid('weekly')
          .allow(null)
          .description('Recurring'),
        externalSystem: joi
          .string()
          .max(255)
          .allow(null)
          .description('External System'),
        externalId: joi
          .string()
          .max(255)
          .allow(null)
          .description('External ID')
      })
        .raw()//keeping the startTime and endTime as input format
        .required()
        .description('Exclusion payload')
    })
    .description('Update Exclusion schema'),
  deleteExclusion: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid'),
          exclusionSid: joi
            .string()
            .regex(/^AE[a-f0-9]{32}$/, 'Account Sid')
            .required()
            .description('Exclusion Sid')
        })
    })
    .description('Delete Exclusion schema'),
  addAvailability: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid'),
          scheduleSid: joi
            .string()
            .regex(/^SC[a-f0-9]{32}$/, 'Schedule Sid')
            .required()
            .description('Schedule Sid')
        }),
      payload: joi.object({
        create: joi
          .array()
          .items(
            baseAvailabilitySchema
          )
          .default([])
          .description('Availability to create'),
        update: joi
          .array()
          .items(
            baseAvailabilitySchema
              .keys({
                sid: joi
                  .string()
                  .regex(/^AV[a-f0-9]{32}$/, 'availability Sid')
                  .required()
                  .description('availability Sid')
              })
          )
          .default([])
          .description('Availability to update'),
        delete: joi
          .array()
          .items(
            joi
              .object({
                sid: joi
                  .string()
                  .regex(/^AV[a-f0-9]{32}$/, 'availability Sid')
                  .required()
                  .description('availability Sid')
              })
              .options({ //allow unknown attributes other than sid and remove them
                allowUnknown: true,
                stripUnknown: true
              })
          )
          .default([])
          .description('Availability to delete')
      })
        .required()
        .description('Availability payload')
    })
    .description('Add Availability schema'),
  listAvailability: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'Account Sid')
            .required()
            .description('Account Sid'),
          scheduleSid: joi
            .string()
            .regex(/^SC[a-f0-9]{32}$/, 'Schedule Sid')
            .required()
            .description('Schedule Sid')
        }),
      query: commonSchemaForList
    })
    .description('List Availability schema'),
  listAppointmentAvailability: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'accountSid')
            .required()
            .description('Account Sid')
        }),
      query: joi
        .object()
        .keys({
          startDateTime: joi
            .string()
            .isoDate()
            .regex(/.*Z/, 'ISO time format in utc zone')
            .example(utils.dateTemplate(), 'date template')
            .required()
            .description('The timestamp when the appointment is to be started'),
          endDateTime: joi
            .string()
            .isoDate()
            .regex(/.*Z/, 'ISO time format in utc zone')
            .example(utils.dateTemplate(), 'date template')
            .required()
            .description('The timestamp when the appointment is to be ended'),
          duration: joi
            .number()
            .integer()
            .positive()
            .required()
            .description('Duration'),
          calendarSid: joi
            .string()
            .regex(/^CL[a-f0-9]{32}$/, 'calendarSid')
            .required()
            .description('Identifier of Calendar')
        })
    })
    .description('List Appointment Availability schema'),
  listCalendarAvailability: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'Account Sid')
            .required()
            .description('Account Sid'),
          calendarSid: joi
            .string()
            .regex(/^CL[a-f0-9]{32}$/, 'Calendar Sid')
            .required()
            .description('Schedule Sid')
        }),
      query:joi
        .object({
          startDate: joi
            .date()
            .format('YYYY-MM-DD')
            .required()
            .description('Start Date'),
          endDate: joi
            .date()
            .format('YYYY-MM-DD')
            .min(joi.ref('startDate'))
            .required()
            .description('End Date')
        })
        .required()
        .raw()//keeping the startTime and endTime as input format
        .description('Query to get data')
    })
    .description('List Calendar Availability schema'),
  addAppointment: joi
    .object({
      params: joi
        .object({
          accountSid: joi
            .string()
            .regex(/^(SA)|(PA)[a-f0-9]{32}$/, 'Account Sid')
            .required()
            .description('Account Sid')
        }),
      payload: joi.object({
        seatSid: joi
          .string()
          .regex(/^SE[a-f0-9]{32}$/, 'SeatSid')
          .optional()
          .description('Seat Sid'),
        calendarSid: joi
          .string()
          .regex(/^CL[a-f0-9]{32}$/, 'Calendar Sid')
          .required()
          .description('Calendar Sid'),
        startDateTime: joi
          .string()
          .isoDate()
          .regex(/.*Z/, 'ISO time format in utc zone')
          .example(utils.dateTemplate(), 'date template')
          .required()
          .description('Start Date'),
        duration: joi
          .number()
          .integer()
          .positive()
          .required()
          .description('Duration of Exam'),
        externalId: joi
          .string()
          .allow(null, '')
          .max(255)
          .empty('')
          .default(null)
          .description('External ID'),
        externalSystem: joi
          .string()
          .allow(null, '')
          .max(255)
          .empty('')
          .default(null)
          .description('External System'),
        firstName: joi
          .string()
          .required()
          .description('The first name of the person making the reservation'),
        lastName: joi
          .string()
          .required()
          .description('The last name of the person making the reservation'),
        email: joi
          .string()
          .email()
          .required()
          .description('Email'),
        phone: joi
          .string()
          .allow(null, '')
          .empty('')
          .default(null)
          .description('Phone'),
        notes: joi
          .string()
          .allow(null, '')
          .empty('')
          .default(null)
          .description('Notes'),
        metadata: joi
          .object()
          .options({allowUnknown: true, stripUnknown: false})
          .raw()
          .empty('')
          .default(null)
          .description('Metadata')
      })
        .required()
        .description('Appointment payload')
    })
    .description('Add Appointment schema')
};

module.exports = schema;

'use strict';
const _ = require('lodash');

const utils = {

  /**
   * Build an URL from url template
   * @param {String} urlTemplate
   * @param {Object} params
   * @param {Object} [query]
   * @return {String}
   */
  buildUrl: function (urlTemplate, params, query) {
    let paramRegex = new RegExp('\{(.+?)\}', 'gm');
    let paramNames;
    let tempUrl = urlTemplate;
    let url;

    do {
      //Get the matching params
      paramNames = paramRegex.exec(urlTemplate);

      //If there is a match and has a param value for the match
      //Using hasOwnProperty because param might also have null or 0 values which might result in false
      if (paramNames && params.hasOwnProperty(paramNames[1])) {

        //Replace and update the tempUrl
        //should not modify the template
        //as it will create problem to match
        tempUrl = tempUrl.replace(paramNames[0], params[paramNames[1]]);
      }
    } while (paramNames);

    url = tempUrl;

    if (query) {
      // flag for first key
      let first = true;

      for (let queryKey in query) {
        // if first key use '?' as delimiter, '&' otherwise
        let delimiter = (first) ? '?' : '&';
        first = false;
        // append the query key-value pairs with original url
        let isObjectKey = typeof query[queryKey] === 'object';
        let queryValue = (isObjectKey) ?
          JSON.stringify(query[queryKey]) :
          query[queryKey];

        url = url + delimiter + queryKey + '=' + queryValue;
      }
    }

    return url;
  },

  /**
   * Provides the date/time template that is used in payload
   * @returns {string}
   */
  dateTemplate: function dateTemplate() {
    return new Date(0).toISOString();
  },

  /**
   * Sets allowUnknown true in joi upper schema and disables it for inner schema
   * @param {Object} schemaList
   */
  setAllowUnknown(schemaList) {
    const keys = Object.keys(schemaList);

    keys.forEach((key) => {
      let schema = schemaList[key];
      schema = schema.options({
        allowUnknown: true,
        stripUnknown: true
      });

      const children = schema._inner.children;
      for (let index = 0; index < children.length; index++) {
        let childSchema = children[index].schema;
        const allowUnknown = _.get(childSchema, '_settings.allowUnknown', false);
        const stripUnknown = _.get(childSchema, '_settings.stripUnknown', false);

        childSchema = childSchema.options({allowUnknown, stripUnknown});
        children[index].schema = childSchema;
      }
      schemaList[key] = schema;
    });
  }
};

module.exports = utils;

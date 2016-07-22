import _   from 'lodash';
import Joi from 'joi';

function mapKey(key, attribute) {
    switch (key) {
        // NUMBER TYPES
        case 'BIGINT':
        case 'INTEGER':
            return Joi.number().integer();

        case 'DECIMAL':
        case 'DOUBLE':
        case 'FLOAT':
            return Joi.number();

        // STRING TYPES
        case 'STRING':
        case 'TEXT':
            return Joi.string();

        case 'ENUM':
            return Joi.string().allow(attribute.values);

        case 'DATEONLY':
        case 'DATE':
            return Joi.date();

        // OTHER TYPES
        case 'BLOB':
            return Joi.any();
        case 'BOOLEAN':
            return Joi.boolean();
        case 'JSON':
        case 'JSONB':
            return Joi.object();
    }
}

function mapValidator(joi, validator, key) {
    if (validator === false) { return; }

    switch (key) {
        case 'is':
            return joi.regex(validator);
        case 'isEmail':
            return joi.email();
        case 'isUrl':
            return joi.uri();
        case 'isIP':
            return joi.ip();
        case 'isIPv4':
            return joi.ip({ version: ['ipv4'] });
        case 'isIPv6':
            return joi.ip({ version: ['ipv6'] });
        case 'min':
            return joi.minimum(validator);
        case 'max':
            return joi.maximum(validator);
    }
}

export default function (attribute) {
    if (!attribute || !attribute.key) {
        return;
    }

    let joi = mapKey(attribute.key, attribute);

    // Add model comments to schema description
    if (attribute.comment) {
        joi.description(attribute.comment);
    }

    if (attribute.allowNull === false) {
        joi.required();
    }

    if (attribute.defaultValue && !_.isObject(attribute.defaultValue) && !_.isFunction(attribute.defaultValue)) {
        joi.default(attribute.defaultValue);
    }

    _.each(attribute.validate, mapValidator.bind(null, joi));

    return joi;
}

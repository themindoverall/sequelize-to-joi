import { expect } from 'chai';
import Sequelize  from 'sequelize';
import Joi        from 'joi';

import sequelizeToJoi from '../src';

describe('sequelize-to-joi', () => {
    let sequelize;

    before(() => {
        sequelize = new Sequelize('test', '', null, { dialect: 'sqlite' });

        sequelize.define('Basic', {
            name: Sequelize.STRING,
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isEmail: true
                }
            },
            count: Sequelize.INTEGER
        });
    });

    it('should exist and be a function', () => {
        expect(sequelizeToJoi).to.exist.and.be.a('function');
    });

    it('should throw TypeError if model is not instance of Sequelize Model', () => {
        expect(sequelizeToJoi).to.throw(TypeError);
    });

    it('should validate Basic model', () => {
        let schema = sequelizeToJoi(sequelize.models.Basic);
        let test = {
            id: 1,
            name: 'test',
            email: 'a@b.co',
            count: 10,
            createdAt: (new Date()).toISOString(),
            updatedAt: (new Date()).toISOString()
        };

        let result1 = Joi.validate(test, schema);
        expect(result1.error).to.not.exist;
        expect(result1.value).to.contain.all.keys(test);

        test.email = 'invalid';
        let result2 = Joi.validate(test, schema);
        expect(result2.error).to.exist;
        expect(result2.error.message).to.contain('email');
    });
});

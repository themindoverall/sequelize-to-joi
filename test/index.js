import { expect } from 'chai';
import Sequelize  from 'sequelize';

import sequelizeToJoi from '../src';

describe('middleware/joi', () => {
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


});

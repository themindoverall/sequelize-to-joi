# Sequelize to Joi

Takes a Sequelize model and constructs a Joi validator from it

## Usage

```
import sequelizeToJoi from '@revolttv/sequelize-to-joi';

let model = sequelize.define('YourModel', {
    name: Sequelize.STRING
});

let validator = sequelizeToJoi(model);

Joi.validate({ name: 'wow', nope: 'failure' }, validator, (err, result) => {
    console.log(err); // will error out about `nope` key
})
```

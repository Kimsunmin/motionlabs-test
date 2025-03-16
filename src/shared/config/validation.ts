import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('local', 'development', 'production', 'test')
    .default('local'),
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
});

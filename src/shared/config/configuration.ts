export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
});

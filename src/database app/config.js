const config = {
  config: {
    user: 'postgres',
    database: 'quickcredit2',
    host: 'localhost',
    password: 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
    port: 5432,
  },
  testConfig: {
    user: 'postgres',
    database: 'quickcredittest',
    host: 'localhost',
    password: 'postgres',
    max: 10,
    idleTimeoutMillis: 30000,
    port: 5432,
  },
};

export default config;

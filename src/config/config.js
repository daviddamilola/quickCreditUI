import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    port: process.env.PORT || 5000,
  },
  secret: process.env.SECRET,
};

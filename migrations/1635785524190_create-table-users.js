/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE users (
            id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            fullname TEXT NOT NULL
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE users;
    `);
};

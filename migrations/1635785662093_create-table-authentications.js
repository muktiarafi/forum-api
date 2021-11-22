/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE authentications(
            token TEXT NOT NULL
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE authentications;
    `);
};

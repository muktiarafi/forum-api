/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE threads (
            id VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            body TEXT NOT NULL,
            user_id VARCHAR(255) NOT NULL REFERENCES users (id) ON DELETE SET NULL,
            date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE threads;
    `);
};

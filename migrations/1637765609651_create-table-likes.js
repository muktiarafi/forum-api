/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE likes (
            user_id VARCHAR(250) NOT NULL REFERENCES users (id) ON DELETE CASCADE,
            comment_id VARCHAR(250) NOT NULL REFERENCES comments (id) ON DELETE CASCADE,
            UNIQUE (user_id, comment_id)
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE likes;
    `);
};

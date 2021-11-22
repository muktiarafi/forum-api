/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql(`
        CREATE TABLE comments (
            id VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY,
            content TEXT NOT NULL,
            parent_id VARCHAR(255),
            is_delete BOOLEAN DEFAULT false,
            date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            user_id VARCHAR(255) NOT NULL REFERENCES users (id) ON DELETE SET NULL,
            thread_id VARCHAR(255) REFERENCES threads (id) ON DELETE CASCADE
        );
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
        DROP TABLE comments;
    `);
};

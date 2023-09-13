import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite3';

async function setupDatabase(): Promise<sqlite.Database> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./imagestore.db', (err) => {
            if (err) {
                return reject(err);
            }
            db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY NOT NULL,
        url TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT
      )`, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(db);
            });
        });
    });
}

export default setupDatabase;

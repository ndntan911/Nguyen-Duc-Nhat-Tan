import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';

// Connect to SQLite Database
const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db: Database = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create tables if they do not exist
const initDB = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table', err);
        } else {
            console.log('Items table initialized.');
        }
    });
};

initDB();

export default db;

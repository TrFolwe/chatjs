const sqlite = require("better-sqlite3")(require("path").join(__dirname, "chat.db"));

class SQLite {
    constructor() {
        sqlite.exec(`CREATE TABLE IF NOT EXISTS chat(
            _id INTEGER PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            message STRING NOT NULL,
            unix_time INTEGER NOT NULL
        )`);
        console.log("Database enabled!")
    }

    saveMessage(username, message) {
        sqlite.prepare(`INSERT INTO chat(username, message, unix_time) VALUES(?, ?, ?)`).run(username, message, Date.now());
    }

    getMessages() {
        return sqlite.prepare(`SELECT * FROM chat`).all();
    }
}

module.exports = SQLite;
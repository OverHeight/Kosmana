import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("database.db");

export default db;

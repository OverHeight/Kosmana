import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("database.js");

export default db;

import db from "./conn";

export const InitializeDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql("PRAGMA foreign_keys = ON;");

    // Create Kosan table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Kosan (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        NamaKosan TEXT NOT NULL,
        Kota TEXT NOT NULL,
        Alamat TEXT NOT NULL,
        Harga INTEGER NOT NULL,
        JumlahKamar INTEGER NOT NULL,
        TipeKosan TEXT NOT NULL,
        ImageUri TEXT NOT NULL
      );`,
      [],
      () => {
        console.log("Kosan table created or already exists");
        createKamarTable(tx);
      },
      (_, error) => console.error("Error creating Kosan table: ", error)
    );
  });
};

const createKamarTable = (tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Kamar (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      KosanId INTEGER NOT NULL,
      StatusKamar INTEGER,
      NoKam INTEGER NOT NULL,
      Harga INTEGER,
      ImageUri TEXT,
      FOREIGN KEY (KosanId) REFERENCES Kosan(Id)
    );
    CREATE INDEX IF NOT EXISTS idx_kamar_kosanid ON Kamar(KosanId);`,
    [],
    () => {
      console.log("Kamar table created or already exists");
      createPenghuniTable(tx);
    },
    (_, error) => console.error("Error creating Kamar table: ", error)
  );
};

const createPenghuniTable = (tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Penghuni (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      Nama TEXT NOT NULL,
      Umur INTEGER NOT NULL,
      JenisKelamin TEXT NOT NULL,
      NoTelp TEXT NOT NULL,
      FotoPenghuni TEXT,
      FotoKTP TEXT
    );`,
    [],
    () => {
      console.log("Penghuni table created or already exists");
      createPenghuniKamarTable(tx);
    },
    (_, error) => console.error("Error creating Penghuni table: ", error)
  );
};

const createPenghuniKamarTable = (tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS Penghuni_Kamar (
      Id INTEGER PRIMARY KEY AUTOINCREMENT,
      PenghuniId INTEGER,
      KamarId INTEGER,
      TanggalMasuk TEXT,
      TanggalKeluar TEXT,
      StatusPembayaran INTEGER,
      FOREIGN KEY (PenghuniId) REFERENCES Penghuni(Id),
      FOREIGN KEY (KamarId) REFERENCES Kamar(Id)
    );
    CREATE INDEX IF NOT EXISTS idx_penghunikamar_penghuniid ON Penghuni_Kamar(PenghuniId);
    CREATE INDEX IF NOT EXISTS idx_penghunikamar_kamarid ON Penghuni_Kamar(KamarId);`,
    [],
    () => console.log("Penghuni_Kamar table created or already exists"),
    (_, error) => console.error("Error creating Penghuni_Kamar table: ", error)
  );
};

export const DeleteTables = () => {
  const tables = ["Penghuni_Kamar", "Penghuni", "Kamar", "Kosan"];

  db.transaction((tx) => {
    tables.forEach((table) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS ${table}`,
        [],
        () => console.log(`Dropped table ${table}`),
        (_, error) => console.error(`Failed to drop table ${table}: `, error)
      );
    });
  });
};

export const addImageUri = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "ALTER TABLE Kamar ADD COLUMN ImageUri TEXT;",
      [],
      () => console.log("Added ImageUri column to Kamar table"),
      (_, error) => {
        console.error("Error adding ImageUri column:", error);
        return false;
      }
    );
  });
};

import db from "./conn";

export const InitializeDatabase = () => {
  db.transaction((tx) => {
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
        ImageUri TEXT NOT NUlL
      );`,
      [],
      () => {
        console.log("Kosan table created or already exists");
      },
      (tx, error) => {
        console.error("Error creating Kosan table: ", error);
      }
    );

    // Create Kamar table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Kamar (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        StatusKamar INTEGER,
        TanggalMasuk TEXT,
        TanggalKeluar TEXT,
        StatusPembayaran INTEGER,
        KosanId INTEGER NOT NULL,
        FOREIGN KEY (KosanId) REFERENCES Kosan(Id)
      );`,
      [],
      () => {
        console.log("Kamar table created or already exists");
      },
      (tx, error) => {
        console.error("Error creating Kamar table: ", error);
      }
    );

    // Create Penghuni table
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Penghuni (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Nama TEXT NOT NULL,
        Umur INTEGER NOT NULL,
        JenisKelamin TEXT NOT NULL,
        NoTelp TEXT NOT NULL,
        IdKamar INTEGER,
        FotoPenghuni TEXT,
        FotoKTP TEXT,
        FOREIGN KEY (IdKamar) REFERENCES Kamar(Id)
      );`,
      [],
      () => {
        console.log("Penghuni table created or already exists");
      },
      (tx, error) => {
        console.error("Error creating Penghuni table: ", error);
      }
    );
  });
};

export const DeleteTables = () => {
  db.transaction((tx) => {
    tx.executeSql("DROP TABLE Kosan"),
      [],
      () => {
        console.log("Dropped table");
      },
      (tx, error) => {
        console.error("failed to drop table: ", error);
      };
    tx.executeSql("DROP TABLE Kamar"),
      [],
      () => {
        console.log("Dropped table");
      },
      (tx, error) => {
        console.error("failed to drop table: ", error);
      };
    tx.executeSql("DROP TABLE Penghuni"),
      [],
      () => {
        console.log("Dropped table");
      },
      (tx, error) => {
        console.error("failed to drop table: ", error);
      };
  });
  console.log("Deleted Table");
};

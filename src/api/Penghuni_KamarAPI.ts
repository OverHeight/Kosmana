import { SQLError, SQLTransaction } from "expo-sqlite/legacy";
import db from "../database/conn";
import { DetailKamarData, PenghuniKamarData } from "@/types/DBtypes";

export const useGetAllPenghuniKamar = async (): Promise<DetailKamarData[]> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        const query = `
          SELECT 
            Kamar.Id AS KamarId, 
            kamar.KosanId,
            Kamar.NoKam,
            Kamar.ImageUri,
            Kamar.StatusKamar,
            Kamar.Harga,
            Penghuni_Kamar.Id AS TransId,
            Penghuni_Kamar.TanggalMasuk,
            Penghuni_Kamar.TanggalKeluar,
            Penghuni_Kamar.StatusPembayaran,
            Penghuni.Id AS PenghuniId,
            Penghuni.Nama
          FROM Kamar
          LEFT JOIN Penghuni_Kamar ON Kamar.Id = Penghuni_Kamar.KamarId
          LEFT JOIN Penghuni ON Penghuni_Kamar.PenghuniId = Penghuni.Id
        `;
        // console.log("Executing query:", query);
        tx.executeSql(
          query,
          [],
          (_, { rows }) => {
            // console.log("Query result:", rows._array);
            resolve(rows._array as DetailKamarData[]);
          },
          (_, error) => {
            console.error("SQL Error in useGetAllPenghuniKamar:", error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Error fetching data PenghuniKamar: ", error);
    throw error;
  }
};

export const useGetPenghuniKamarByPenghuniId = async (
  penghuniId: number
): Promise<PenghuniKamarData[]> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Penghuni_Kamar WHERE PenghuniId = ?",
          [penghuniId],
          (_, { rows }) => {
            resolve(rows._array as PenghuniKamarData[]);
          },
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Error fetching PenghuniKamar by PenghuniId: ", error);
    throw error;
  }
};

export const useGetPenghuniKamarById = async (
  id: number
): Promise<PenghuniKamarData | null> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Penghuni_Kamar WHERE Id = ?",
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows._array[0] as PenghuniKamarData);
            } else {
              resolve(null);
            }
          },
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Error fetching PenghuniKamar by ID: ", error);
    throw error;
  }
};

export const useCreatePenghuniKamar = async (
  penghuniKamarData: PenghuniKamarData,
  kamarId: number
): Promise<PenghuniKamarData> => {
  return new Promise<PenghuniKamarData>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Penghuni_Kamar (KamarId, PenghuniId, TanggalMasuk, TanggalKeluar, StatusPembayaran) VALUES (?, ?, ?, ?, ?)",
        [
          penghuniKamarData.KamarId,
          penghuniKamarData.PenghuniId,
          penghuniKamarData.TanggalMasuk ?? null,
          penghuniKamarData.TanggalKeluar ?? null,
          penghuniKamarData.StatusPembayaran ?? null,
        ],
        (_, result1) => {
          tx.executeSql(
            "UPDATE Kamar SET StatusKamar = 1 WHERE Id = ?",
            [kamarId],
            (_, result2) => {
              const insertedData: PenghuniKamarData = {
                ...penghuniKamarData,
                Id: result1.insertId,
              };
              resolve(insertedData);
            },
            (tx, error) => {
              console.error("SQL Error in Kamar update: ", error);
              reject(error);
              return false;
            }
          );
        },
        (tx, error) => {
          console.error("SQL Error in Penghuni_Kamar insert: ", error);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const useUpdatePenghuniKamar = async (
  data: PenghuniKamarData,
  Id: number
): Promise<void> => {
  if (data.Id === undefined) {
    throw new Error("Cannot update PenghuniKamar: Id is undefined");
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Penghuni_Kamar SET KamarId = ?, PenghuniId = ?, TanggalMasuk = ?, TanggalKeluar = ?, StatusPembayaran = ? WHERE Id = ?",
          [
            data.KamarId,
            data.PenghuniId,
            data.TanggalMasuk,
            data.TanggalKeluar,
            data.StatusPembayaran,
            Id,
          ],
          // This is the success callback
          () => resolve(),
          // This is the error callback
          (tx, error) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to update PenghuniKamar:", error);
    throw error;
  }
};

export const useDeletePenghuniKamar = async (
  id: number,
  kamarId: number
): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Penghuni_Kamar WHERE Id = ?",
          [id],
          (_, result1) => {
            tx.executeSql(
              "UPDATE Kamar SET StatusKamar = 0 WHERE Id = ?",
              [kamarId],
              (_, result2) => {
                resolve();
              },
              (tx, error) => {
                console.error("SQL Error in Kamar update: ", error);
                reject(error);
                return false;
              }
            );
          },
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Error deleting PenghuniKamar: ", error);
    throw error;
  }
};

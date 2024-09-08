import db from "../database/conn";
import { SQLError, SQLTransaction } from "expo-sqlite/legacy"; // Adjust import based on your library
import { KosanData } from "@/types/DBtypes";

// Get all Kosan
export const useGetAllKosan = async (): Promise<any[]> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Kosan",
          [],
          (_, { rows }) => {
            resolve(rows._array);
          },
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false; // Return false to indicate failure
          }
        );
      });
    });
  } catch (error) {
    console.error("Error fetching data Kosan: ", error);
    throw error;
  }
};

// Get Kosan by ID
export const useGetKosanById = async (id: number): Promise<any | null> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Kosan WHERE id = ?",
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows._array[0]);
            } else {
              resolve(null);
            }
          },
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false; // Return false to indicate failure
          }
        );
      });
    });
  } catch (error) {
    console.error("Error fetching data Kosan by ID: ", error);
    throw error;
  }
};

// Create Kosan
export const useCreateKosan = async (data: KosanData): Promise<number> => {
  try {
    console.log(data);
    return new Promise<number>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO Kosan (NamaKosan, Kota, Alamat, Harga, JumlahKamar, TipeKosan, ImageUri) VALUES (?,?,?,?,?,?,?)",
          [
            data.NamaKosan,
            data.Kota,
            data.Alamat,
            data.Harga,
            (data.JumlahKamar = 0),
            data.TipeKosan,
            data.ImageUri,
          ],
          (_, result) => {
            if (result.insertId !== undefined) {
              resolve(result.insertId);
            } else {
              reject(new Error("Failed to get inserted ID"));
            }
          },
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false; // Return false to indicate failure
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to add Kosan: ", error);
    throw error;
  }
};

// Update Kosan
export const useUpdateKosan = async (
  Id: number,
  data: KosanData
): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Kosan SET NamaKosan = ?, Kota = ?, Alamat = ?, Harga = ?, JumlahKamar = ?, TipeKosan = ?, ImageUri = ? WHERE Id = ?",
          [
            data.NamaKosan,
            data.Kota,
            data.Alamat,
            data.Harga,
            data.JumlahKamar,
            data.TipeKosan,
            data.ImageUri,
            Id,
          ],
          () => resolve(),
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false; // Return false to indicate failure
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to update Kosan: ", error);
    throw error;
  }
};

// Delete Kosan
export const useDeleteKosan = async (id: number): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Kosan WHERE id = ?",
          [id],
          () => resolve(),
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false; // Return false to indicate failure
          }
        );
      });
    });
  } catch (error) {
    console.error("Error deleting Kosan: ", error);
    throw error;
  }
};

export const countKosan = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) AS total_kosan FROM Kosan",
          [],
          (_, { rows }) => {
            resolve(rows._array[0].total_kosan);
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
    console.error("Error counting kosan:", error);
    throw error;
  }
};

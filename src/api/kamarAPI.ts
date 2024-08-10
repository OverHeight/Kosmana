import { SQLError, SQLTransaction } from "expo-sqlite/legacy";
import db from "../database/conn";

export interface KamarData {
  Id?: number;
  KosanId: number;
  StatusKamar?: number;
  TanggalMasuk?: string | null;
  TanggalKeluar?: string | null;
  StatusPembayaran?: number | null;
}

// In your api/kamarAPI.ts
export const useGetAllKamar = async (): Promise<KamarData[]> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Kamar",
          [],
          (_, { rows }) => {
            resolve(rows._array as KamarData[]);
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
    console.error("Error fetching data kamar: ", error);
    throw error;
  }
};

export const useGetKamarById = async (id: number) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Kamar WHERE id = ?",
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
    console.error("Error fetching data kamar by ID: ", error);
    throw error;
  }
};

export const useCreateKamar = async (data: KamarData): Promise<number> => {
  try {
    return new Promise<number>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO Kamar (KosanId, StatusKamar, TanggalMasuk, TanggalKeluar, StatusPembayaran) VALUES (?, ?, ?, ?, ?)",
          [
            data.KosanId,
            data.StatusKamar ?? 0,
            data.TanggalMasuk ?? null,
            data.TanggalKeluar ?? null,
            data.StatusPembayaran ?? null,
          ],
          (_, result) => {
            if (result.insertId !== undefined) {
              resolve(result.insertId);
            } else {
              reject(new Error("Failed to get inserted ID for Kamar"));
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
    console.error("Failed to add Kamar:", error);
    throw error;
  }
};

export const useUpdateKamar = async (data: KamarData): Promise<void> => {
  if (data.Id === undefined) {
    throw new Error("Cannot update Kamar: Id is undefined");
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Kamar SET KosanId = ?, StatusKamar = ?, TanggalMasuk = ?, TanggalKeluar = ?, StatusPembayaran = ? WHERE Id = ?",
          [
            data.KosanId,
            data.StatusKamar ?? 0,
            data.TanggalMasuk ?? null,
            data.TanggalKeluar ?? null,
            data.StatusPembayaran ?? null,
            data.Id!,
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
    console.error("Failed to update Kamar:", error);
    throw error;
  }
};

export const useDeleteKamar = async (id: number) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Kamar WHERE id = ?",
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
    console.error("Error Deleting Kamar: ", error);
    throw error;
  }
};

export const updateStatusKamar = async (
  id: number,
  statusPembayaran?: number
) => {
  if (id === undefined) {
    throw new Error("Cannot update Kamar: Id is undefined");
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Kamar SET StatusPembayaran = ? WHERE Id = ?",
          [statusPembayaran ?? null, id],
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
    console.error("Failed to update Kamar:", error);
    throw error;
  }
};

export const updatePaymentStatus = async (kamarId: number, status: number) => {
  // let newStatus = null;
  // if (status === true) {
  //   newStatus = 1;
  // }
  // if (status === false) {
  //   newStatus = 0;
  // }
  console.log("status: " + status);
  // console.log("NewStatus: " + newStatus);
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE kamar SET statusPembayaran = ? WHERE id = ?",
          [status, kamarId],
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
    console.error("Error updating payment status:", error);
    throw error;
  }
};

export const deleteKamarByKosanId = async (kosanId: number) => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Kamar WHERE KosanId = ?",
          [kosanId],
          () => resolve(),
          (tx: SQLTransaction, error: SQLError) => {
            console.error("Error deleting Kamar: ", error);
            reject(error);
            return false; // Return false to indicate failure
          }
        );
      });
    });
  } catch (error) {
    console.error("Error deleting Kamar by Kosan ID: ", error);
    throw error;
  }
};

export const countKamar = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) AS total_kamar FROM Kamar",
          [],
          (_, { rows }) => {
            resolve(rows._array[0].total_kamar);
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
    console.error("Error counting Kamar:", error);
    throw error;
  }
};

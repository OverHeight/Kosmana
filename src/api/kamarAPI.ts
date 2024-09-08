import { SQLError, SQLTransaction } from "expo-sqlite/legacy";
import db from "../database/conn";
import { KamarData } from "@/types/DBtypes";

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

export const useGetKamarById = async (
  id: number
): Promise<KamarData | null> => {
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
        // Insert the new Kamar
        tx.executeSql(
          "INSERT INTO Kamar (KosanId, StatusKamar, NoKam, Harga, ImageUri) VALUES (?, ?, ?, ?, ?)",
          [
            data.KosanId,
            data.StatusKamar ?? 0,
            data.NoKam,
            data.Harga ?? null,
            data.ImageUri ?? null,
          ],
          (_, result) => {
            if (result.insertId !== undefined) {
              // Increment the JumlahKamar in Kosan table
              tx.executeSql(
                "UPDATE Kosan SET JumlahKamar = JumlahKamar + 1 WHERE Id = ?",
                [data.KosanId],
                () => {
                  resolve(result.insertId as number);
                },
                (tx: SQLTransaction, error: SQLError) => {
                  console.error("Failed to update JumlahKamar: ", error);
                  reject(error);
                  return false;
                }
              );
            } else {
              reject(new Error("Failed to get inserted ID for Kamar"));
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
          "UPDATE Kamar SET NoKam = ?, Harga = ?, ImageUri = ? WHERE Id = ?",
          [
            data.NoKam ?? null,
            data.Harga ?? null,
            data.ImageUri ?? null,
            data.Id!,
          ],
          () => resolve(),
          (tx: SQLTransaction, error: SQLError) => {
            console.error("SQL Error: ", error);
            reject(error);
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Failed to update Kamar:", error);
    throw error;
  }
};

export const useDeleteKamar = async (
  id: number,
  kosanId: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx) => {
      // First, check if there are any transactions associated with this Kamar
      tx.executeSql(
        "SELECT COUNT(*) as count FROM Penghuni_Kamar WHERE KamarId = ?",
        [id],
        (_, result) => {
          const transactionCount = result.rows.item(0).count;
          if (transactionCount > 0) {
            // If there are transactions, reject the deletion
            reject(new Error("Cannot delete Kamar with existing transactions"));
            return;
          }

          // If no transactions, proceed with deletion
          tx.executeSql(
            "DELETE FROM Kamar WHERE id = ?",
            [id],
            (_, deleteResult) => {
              // Check if the delete operation was successful
              if (deleteResult.rowsAffected > 0) {
                // Decrement the JumlahKamar in the Kosan table
                tx.executeSql(
                  "UPDATE Kosan SET JumlahKamar = JumlahKamar - 1 WHERE Id = ?",
                  [kosanId],
                  () => resolve(),
                  (tx, error) => {
                    console.error("Failed to decrement JumlahKamar: ", error);
                    reject(error);
                    return false;
                  }
                );
              } else {
                resolve(); // Kamar was not found or deleted
              }
            },
            (tx, error) => {
              console.error("SQL Error during deletion: ", error);
              reject(error);
              return false;
            }
          );
        },
        (tx, error) => {
          console.error("SQL Error checking transactions: ", error);
          reject(error);
          return false;
        }
      );
    });
  }).catch((error) => {
    console.error("Error Deleting Kamar: ", error);
    throw error;
  });
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
  console.log("status: " + status);
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

export const countKamarByKosan = async (id: number) => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) AS total_kamar FROM Kamar WHERE KosanId = ?;",
          [id],
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

import { SQLError, SQLTransaction } from "expo-sqlite/legacy";
import db from "../database/conn";

export interface PenghuniData {
  Id?: number;
  Nama: string;
  Umur: number;
  JenisKelamin: string;
  NoTelp: string;
  IdKamar?: number;
  FotoPenghuni?: string;
  FotoKTP?: string;
}

export const useGetAllPenghuni = async (): Promise<PenghuniData[]> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Penghuni",
          [],
          (_, { rows }) => {
            resolve(rows._array as PenghuniData[]);
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
    console.error("Error fetching Penghuni data: ", error);
    throw error;
  }
};

export const useGetPenghuniById = async (
  id: number
): Promise<PenghuniData | null> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Penghuni WHERE Id = ?",
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
            return false;
          }
        );
      });
    });
  } catch (error) {
    console.error("Error fetching Penghuni by ID: ", error);
    throw error;
  }
};

export const useCreatePenghuni = async (
  data: PenghuniData
): Promise<number> => {
  try {
    return new Promise<number>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO Penghuni (Nama, Umur, JenisKelamin, NoTelp, IdKamar, FotoPenghuni, FotoKTP) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            data.Nama,
            data.Umur,
            data.JenisKelamin,
            data.NoTelp,
            data.IdKamar ?? null,
            data.FotoPenghuni ?? null,
            data.FotoKTP ?? null,
          ],
          (_, result) => {
            if (result.insertId !== undefined) {
              resolve(result.insertId);
            } else {
              reject(new Error("Failed to get inserted ID for Penghuni"));
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
    console.error("Failed to add Penghuni:", error);
    throw error;
  }
};

export const useUpdatePenghuni = async (data: PenghuniData): Promise<void> => {
  if (data.Id === undefined) {
    throw new Error("Cannot update Penghuni: Id is undefined");
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Penghuni SET Nama = ?, Umur = ?, JenisKelamin = ?, NoTelp = ?, IdKamar = ?, FotoPenghuni = ?, FotoKTP = ? WHERE Id = ?",
          [
            data.Nama,
            data.Umur,
            data.JenisKelamin,
            data.NoTelp,
            data.IdKamar ?? null,
            data.FotoPenghuni ?? null,
            data.FotoKTP ?? null,
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
    console.error("Failed to update Penghuni:", error);
    throw error;
  }
};

export const useDeletePenghuni = async (id: number): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM Penghuni WHERE Id = ?",
          [id],
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
    console.error("Error deleting Penghuni: ", error);
    throw error;
  }
};

export const useGetPenghuniByKamarId = async (
  kamarId: number
): Promise<PenghuniData | null> => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Penghuni WHERE IdKamar = ?",
          [kamarId],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(rows._array[0] as PenghuniData); // Type assertion to PenghuniData
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
    console.error("Error fetching Penghuni by Kamar ID: ", error);
    throw error;
  }
};

export const useAddKamar = async (
  penghuniId: number,
  kamarId: number
): Promise<void> => {
  if (penghuniId === undefined) {
    throw new Error("Cannot update Penghuni: penghuniId is undefined");
  }
  if (kamarId === undefined) {
    throw new Error("Cannot update Penghuni: kamarId is undefined");
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Penghuni SET IdKamar = ? WHERE Id = ?",
          [kamarId, penghuniId],
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
    console.error("Failed to update Penghuni:", error);
    throw error;
  }
};

export const useRemoveKamar = async (penghuniId: number): Promise<void> => {
  if (penghuniId === undefined) {
    throw new Error("Cannot update Penghuni: penghuniId is undefined");
  }

  try {
    await new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE Penghuni SET IdKamar = ? WHERE Id = ?",
          [null, penghuniId],
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
    console.error("Failed to update Penghuni:", error);
    throw error;
  }
};

export const countPenghuni = async () => {
  try {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT COUNT(*) AS total_penghuni FROM Penghuni",
          [],
          (_, { rows }) => {
            resolve(rows._array[0].total_penghuni);
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
    console.error("Error counting penghuni:", error);
    throw error;
  }
};

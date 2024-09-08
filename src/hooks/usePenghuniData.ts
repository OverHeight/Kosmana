import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import {
  useGetAllPenghuni,
  useCreatePenghuni,
  useDeletePenghuni,
  useGetPenghuniById,
  useUpdatePenghuni,
} from "@/api/PenghuniAPI";
import { PenghuniData } from "@/types/DBtypes";

type FilteredData = {
  [key: string]: PenghuniData[];
};

export const usePenghuniData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<FilteredData>({});
  const [search, setSearch] = useState<string>("");
  const [penghuni, setPenghuni] = useState<PenghuniData[]>([]);

  // Modal state
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Partial<PenghuniData> | null>(null);

  const filterAndSortData = useCallback(() => {
    const filtered = penghuni.filter((item) =>
      item.Nama.toLowerCase().includes(search.toLowerCase())
    );

    const sections = filtered.reduce((acc: FilteredData, item) => {
      const firstLetter = item.Nama[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(item);
      return acc;
    }, {});

    return Object.keys(sections)
      .sort()
      .reduce((acc: FilteredData, key) => {
        acc[key] = sections[key].sort((a, b) => a.Nama.localeCompare(b.Nama));
        return acc;
      }, {});
  }, [penghuni, search]);

  useEffect(() => {
    const fetchPenghuni = async () => {
      try {
        const data = await useGetAllPenghuni();
        setPenghuni(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPenghuni();
  }, [refreshing]);

  useEffect(() => {
    setFilteredData(filterAndSortData());
    setLoading(false);
  }, [filterAndSortData]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await useGetAllPenghuni();
      setPenghuni(data);
      setFilteredData(filterAndSortData());
    } catch (error) {
      console.error("Failed to refresh data:", error);
      Alert.alert("Error", "Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  }, [filterAndSortData]);

  const deletePenghuni = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await useDeletePenghuni(id);
        await refreshData();
      } catch (error) {
        Alert.alert("Error", "Gagal menghapus penghuni");
      } finally {
        setLoading(false);
      }
    },
    [refreshData]
  );

  const toggleModal = useCallback(
    (setEdit: boolean = false, data?: Partial<PenghuniData>) => {
      if (isModalVisible && !setEdit) {
        setIsEditing(false);
        setEditData(null);
      } else {
        setIsEditing(setEdit);
        setEditData(data || null);
      }
      setModalVisible((prev) => !prev);
    },
    [isModalVisible]
  );

  const handleSubmit = useCallback(
    async (penghuniData: PenghuniData) => {
      try {
        if (isEditing) {
          await useUpdatePenghuni(penghuniData);
          Alert.alert("Sukses", "Sukses Mengubah data Penghuni");
        } else {
          await useCreatePenghuni(penghuniData);
          Alert.alert("Sukses", "Sukses Menambah data Penghuni");
        }
        await refreshData();
      } catch (error) {
        Alert.alert("Error", "Error saat submit: " + error);
      } finally {
        toggleModal(false);
      }
    },
    [isEditing, refreshData, toggleModal]
  );

  const editPenghuni = useCallback(
    async (id: number) => {
      try {
        const response = await useGetPenghuniById(id);
        if (response) {
          toggleModal(true, response);
        } else {
          Alert.alert("Error", "Tidak dapat menemukan data penghuni");
        }
      } catch (error) {
        Alert.alert("Error", "Gagal mengambil data penghuni");
      }
    },
    [toggleModal]
  );

  return {
    loading,
    refreshing,
    filteredData,
    search,
    setSearch,
    refreshData,
    deletePenghuni,
    isModalVisible,
    isEditing,
    editData,
    toggleModal,
    handleSubmit,
    editPenghuni,
    penghuni,
  };
};

import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useGetAllPenghuniKamar } from "@/api/Penghuni_KamarAPI";
import { useGetAllKosan } from "@/api/kosanAPI";
import { useGetAllKamar } from "@/api/kamarAPI";
import { useGetAllPenghuni } from "@/api/PenghuniAPI";
import { KosanData, KamarData, DetailKamarData } from "@/types/DBtypes";

export const useKamarData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [listKamar, setListKamar] = useState<KamarData[]>([]);
  const [listPenghuniKamar, setListPenghuniKamar] = useState<DetailKamarData[]>(
    []
  );
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [listKosan, setListKosan] = useState<KosanData[]>([]);
  const [kosan, setKosan] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [kosanData, penghuniKamarData, kamarData] = await Promise.all([
        useGetAllKosan(),
        useGetAllPenghuniKamar(),
        useGetAllKamar(),
      ]);
      setListKosan(kosanData);
      setListPenghuniKamar(
        kosan !== null
          ? penghuniKamarData.filter((kamar) => kamar.KosanId === Number(kosan))
          : penghuniKamarData
      );
      setListKamar(
        kosan !== null
          ? kamarData.filter((kamar) => kamar.KosanId === Number(kosan))
          : kamarData
      );
      setDataLoaded(true); // Set dataLoaded to true after data has been loaded
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [kosan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, [fetchData]);

  return {
    listKamar,
    listPenghuniKamar,
    listKosan,
    loading,
    kosan,
    refreshing,
    dataLoaded,
    onRefresh,
    setKosan,
  };
};

import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useGetAllPenghuniKamar } from "@/api/Penghuni_KamarAPI";
import { useGetAllKosan } from "@/api/kosanAPI";
import { useGetAllKamar } from "@/api/kamarAPI";
import { useGetAllPenghuni } from "@/api/PenghuniAPI";
import { fetchId } from "@/hooks/kosanHook";
import {
  KosanData,
  KamarData,
  PenghuniData,
  DetailKamarData,
} from "@/types/DBtypes";

export const useKamarData = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [listKamar, setListKamar] = useState<KamarData[]>([]);
  const [listPenghuniKamar, setListPenghuniKamar] = useState<DetailKamarData[]>(
    []
  );
  const [listKosan, setListKosan] = useState<KosanData[]>([]);
  const [listPenghuni, setListPenghuni] = useState<PenghuniData[]>([]);
  const [kosan, setKosan] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [kosanData, penghuniKamarData, penghuniData, kamarData] =
        await Promise.all([
          useGetAllKosan(),
          useGetAllPenghuniKamar(),
          useGetAllPenghuni(),
          useGetAllKamar(),
        ]);

      setListKosan(kosanData);
      setListPenghuniKamar(
        kosan
          ? penghuniKamarData.filter((kamar) => kamar.KosanId === Number(kosan))
          : penghuniKamarData
      );
      setListPenghuni(penghuniData);
      setListKamar(
        kosan
          ? kamarData.filter((kamar) => kamar.KosanId === Number(kosan))
          : kamarData
      );
      console.log("kosan di hook:" + kosan);
      console.log("list kosan: ");
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [kosan]); // Ensure kosan is included here

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
    onRefresh,
    setKosan,
  };
};

// hooks/usePenghuniData.ts
import { useState, useEffect } from "react";
import { useGetAllPenghuni } from "@/api/PenghuniAPI";
import { PenghuniData } from "@/types/DBtypes";

export const usePenghuniData = () => {
  const [penghuni, setPenghuni] = useState<PenghuniData[]>([]);

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
  }, []);

  return penghuni;
};

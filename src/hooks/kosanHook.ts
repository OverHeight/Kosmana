import { router } from "expo-router";

let kosanId = 0;

export const navFromKosan = (idKosan: number) => {
  kosanId = idKosan;
  router.push(`/kamar/${idKosan}`);
  console.log(idKosan);
  return idKosan;
};

export const fetchId = () => {
  return kosanId;
};

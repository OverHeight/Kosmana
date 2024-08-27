export interface KamarData {
  Id?: number;
  KosanId: number;
  StatusKamar?: number | null;
  NoKam: number;
  Harga?: number | null;
  ImageUri?: string | null;
}

export interface PenghuniKamarData {
  Id?: number;
  KamarId: number;
  PenghuniId: number;
  StatusKamar: number | null;
  TanggalMasuk: string | null;
  TanggalKeluar: string | null;
  StatusPembayaran: number | null;
}

export interface DetailKamarData {
  KosanId: number;
  KamarId: number;
  PenghuniId: number | null;
  TransId: number;
  NoKam: number;
  Harga: number;
  TanggalMasuk: string | null;
  TanggalKeluar: string | null;
  StatusKamar: number | null;
  StatusPembayaran: number | null;
  Nama: string | null;
  ImageUri?: string | null;
}

export interface KosanData {
  Id?: number;
  NamaKosan: string;
  Kota: string;
  Alamat: string;
  Harga: number;
  JumlahKamar: number;
  TipeKosan: string;
  ImageUri: string;
}

export interface PenghuniData {
  Id?: number;
  Nama: string;
  Umur: number;
  JenisKelamin: string;
  NoTelp: string;
  FotoPenghuni?: string | null;
  FotoKTP?: string | null;
}

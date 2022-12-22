import { IIpfsNftMetadata } from "./IIPFS";

export interface IRentContract {
  duration: number;
  endBlock?: number;
  hasStarted: boolean;
  renter: string;
  rentee?: string;
}

export interface INFT {
  owner: string;
  nftId: number;
  offchainData: string;
  rentalContract: IRentContract | null;
}

export type INFTExtended = INFT & IIpfsNftMetadata;

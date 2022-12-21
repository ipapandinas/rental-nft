import { IIpfsNftMetadata } from "./IIPFS";

export interface IRentContract {
  hasStarted: boolean;
  renter: string;
  rentee: string | undefined;
}

export interface INFT {
  owner: string;
  nftId: number;
  offchainData: string;
  rentalContract: IRentContract | null;
}

export type INFTExtended = INFT & IIpfsNftMetadata;

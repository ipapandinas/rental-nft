import request from "graphql-request";
import {
  createNftTx,
  rentTx,
  submitTxBlocking,
  File,
  TernoaIPFS,
  WaitUntil,
  createContractTx,
  BlockchainEvents,
  checkTransactionSuccess,
  Errors,
  BlockchainEvent,
  ContractStartedEvent,
  NFTCreatedEvent,
  ContractCreatedEvent,
} from "ternoa-js";
import { NftMetadataType } from "ternoa-js/helpers/types";

import { IIpfsNftMetadata } from "interfaces/IIPFS";
import { INFT, INFTExtended } from "interfaces/INFT";

import { INDEXER_URL } from "./constants";
import { getNFT } from "./graphql";
import { signTx } from "./sign";

/**
 * Gets an NFT and its metadata.
 *
 * @param id - The ID of the NFT to get.
 * @param ipfsClient - The Ternoa IPFS client to use for retrieving offchain data.
 * @returns The NFT and its metadata.
 */
export const getNft = async (
  id: number,
  ipfsClient?: TernoaIPFS
): Promise<INFTExtended> => {
  const gql = getNFT(id);
  const res: INFT = (await request(INDEXER_URL, gql)).nftEntity;
  const { owner, nftId, offchainData, rentalContract } = res;
  const ipfsRes =
    ipfsClient &&
    ((await ipfsClient.getFile(offchainData)) as IIpfsNftMetadata);
  return {
    owner,
    nftId,
    offchainData,
    rentalContract,
    ...ipfsRes,
  };
};

/**
 * Signs a transaction and submits it with blocking behavior.
 *
 * @param tx - The transaction to sign, formatted as a hex string.
 * @param address - The address to use for signing the transaction.
 * @returns The submitted transaction response.
 */
const genericSign = async (tx: `0x${string}`, address: string) => {
  const signedTx = await signTx(tx, address);
  return await submitTxBlocking(signedTx, WaitUntil.BlockInclusion);
};

/**
 * Checks the success of a transaction and returns the desired event.
 *
 * @param events - The blockchain events to check.
 * @param ctor - The constructor function for the desired event.
 * @returns The desired event, if found.
 * @throws {Error} If the transaction failed or the desired event was not found.
 */
const genericTxnCheck = <T extends BlockchainEvent>(
  events: BlockchainEvents,
  ctor: new (...args: any[]) => T
) => {
  console.log({ events });
  const { isTxSuccess, failedEvent } = checkTransactionSuccess(events);
  if (!isTxSuccess && failedEvent)
    throw new Error(
      `${Errors.EXTRINSIC_FAILED}: ${failedEvent.errorType} - ${failedEvent.details}`
    );
  else {
    return events.findEventOrThrow(ctor);
  }
};

/**
 * Creates an NFT and returns the resulting `NFTCreatedEvent`.
 *
 * @param file - The file to store in IPFS.
 * @param metadata - The metadata for the NFT.
 * @param ipfsClient - The Ternoa IPFS client to use.
 * @param address - The address to use for signing the transaction.
 * @returns The `NFTCreatedEvent`.
 * @throws {Error} If the transaction fails or the `NFTCreatedEvent` is not found.
 */
export const createNft = async (
  file: File,
  metadata: NftMetadataType<{}>,
  ipfsClient: TernoaIPFS,
  address: string
) => {
  const { Hash } = await ipfsClient.storeNFT(file, metadata);
  const tx = await createNftTx(Hash);
  const { events } = await genericSign(tx, address);
  return genericTxnCheck(events, NFTCreatedEvent);
};

/**
 * Creates a contract and returns the resulting `ContractCreatedEvent`.
 *
 * @param id - The ID of the contract to create.
 * @param address - The address to use for signing the transaction.
 * @returns The `ContractCreatedEvent`.
 * @throws {Error} If the transaction fails or the `ContractCreatedEvent` is not found.
 */
export const createContract = async (id: number, address: string) => {
  const tx = await createContractTx(
    id,
    {
      fixed: 20,
    },
    {
      autoAcceptance: null,
    },
    false,
    { tokens: 1 },
    { fixedTokens: 100 },
    { fixedTokens: 100 }
  );
  const { events } = await genericSign(tx, address);
  return genericTxnCheck(events, ContractCreatedEvent);
};

/**
 * Rents an NFT and returns the resulting `ContractStartedEvent`.
 *
 * @param id - The ID of the NFT to rent.
 * @param address - The address to use for signing the transaction.
 * @returns The `ContractStartedEvent`.
 * @throws {Error} If the transaction fails or the `ContractStartedEvent` is not found.
 */
export const rentNft = async (id: number, address: string) => {
  const tx = await rentTx(id);
  const { events } = await genericSign(tx, address);
  return genericTxnCheck(events, ContractStartedEvent);
};

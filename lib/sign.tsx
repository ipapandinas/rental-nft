import { getWalletBySource } from "@talisman-connect/wallets";
import { getRawApi, query } from "ternoa-js";

const getSigner = async () => {
  const walletToUse = getWalletBySource("polkadot-js");
  return walletToUse?.signer;
};

const signGeneric = async (
  txHex: `0x${string}`,
  address: string,
  signer: any,
  nonce?: number
) => {
  const api = getRawApi();
  return (await api.tx(txHex).signAsync(address, { nonce, signer })).toHex();
};

export const signTx = async (txHex: `0x${string}`, address: string) => {
  const nonce = (
    (await query("system", "account", [address])) as any
  ).nonce.toNumber();
  const signer = await getSigner();
  return signGeneric(txHex, address, signer, nonce);
};

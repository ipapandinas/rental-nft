import { getRawApi } from "ternoa-js";

export const subscribeCurrentBlockNumber = async (
  setFunction: any
): Promise<any> => {
  try {
    const api = getRawApi();
    const unsub = await api.rpc.chain.subscribeNewHeads((header) => {
      setFunction(header.number.toNumber());
    });
    return unsub;
  } catch (err) {
    console.log(err);
  }
};

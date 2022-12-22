import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { DurationFixedType } from "ternoa-js";

import { INFTExtended } from "interfaces/INFT";
import { createContract } from "lib/ternoa";
import { useAppSelector } from "redux/hooks";

const ContractCreation = ({
  nftId,
  setError,
  setIsAvailableForRent,
  setNft,
}: {
  nftId: number;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsAvailableForRent: React.Dispatch<React.SetStateAction<boolean>>;
  setNft: React.Dispatch<React.SetStateAction<INFTExtended | undefined>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector(({ wallet }) => wallet.user);

  const handleContractCreation = async () => {
    try {
      setIsLoading(true);
      const contractData = await createContract(nftId, user.address);
      console.log({ contractData });
      const { duration, renter } = contractData;
      const { fixed } = duration as DurationFixedType;
      setNft(
        (prevState) =>
          prevState && {
            ...prevState,
            rentalContract: {
              duration: fixed,
              hasStarted: false,
              renter,
              rentee: undefined,
            },
          }
      );
      setIsAvailableForRent(true);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error?.message ?? JSON.stringify(error));
      setIsAvailableForRent(false);
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleContractCreation}
      variant="contained"
    >
      {isLoading ? (
        <CircularProgress aria-label="Loading..." />
      ) : (
        "Create contract"
      )}
    </Button>
  );
};

export default ContractCreation;

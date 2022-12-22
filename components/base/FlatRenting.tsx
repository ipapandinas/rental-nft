import { useState } from "react";
import Image from "next/image";
import { Box, Button, CircularProgress } from "@mui/material";

import { INFTExtended } from "interfaces/INFT";
import { IPFS_URL } from "lib/constants";
import { rentNft } from "lib/ternoa";
import { useAppSelector } from "redux/hooks";

const FlatRenting = ({
  currentBlock,
  isAvailableForRent,
  nft,
  setError,
  setIsAvailableForRent,
  setNft,
}: {
  currentBlock: number;
  isAvailableForRent: boolean;
  nft: INFTExtended;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsAvailableForRent: React.Dispatch<React.SetStateAction<boolean>>;
  setNft: React.Dispatch<React.SetStateAction<INFTExtended | undefined>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { image, nftId } = nft;

  const user = useAppSelector(({ wallet }) => wallet.user);

  const handleRent = async () => {
    setIsLoading(true);
    try {
      const rentData = await rentNft(Number(nftId), user.address);
      console.log({ rentData });
      const { rentee } = rentData;
      setNft((prevState) => {
        const duration = prevState?.rentalContract?.duration;
        return (
          prevState && {
            ...prevState,
            rentalContract: prevState.rentalContract && {
              ...prevState.rentalContract,
              endBlock: prevState.rentalContract.duration + currentBlock,
              hasStarted: true,
              rentee,
            },
          }
        );
      });
      setIsAvailableForRent(false);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error?.message ?? JSON.stringify(error));
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>
        {isAvailableForRent
          ? "👇 available flat to rent for 2min 👇"
          : "flat rented 🎉"}
      </h2>
      <Box
        sx={{
          position: "relative",
        }}
      >
        {image ? (
          <Box
            sx={{
              opacity: isAvailableForRent ? "20%" : "100%",
            }}
          >
            <Image
              alt="Flat Key"
              src={`${IPFS_URL}/ipfs/${image}`}
              width={282}
              height={310}
            />
          </Box>
        ) : (
          <CircularProgress aria-label="Loading..." />
        )}
        {isAvailableForRent && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {isLoading ? (
              <CircularProgress aria-label="Loading..." />
            ) : (
              <Button onClick={handleRent} variant="contained">
                Rent Key
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FlatRenting;

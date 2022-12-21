import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { INFTExtended } from "interfaces/INFT";
import { IPFS_API_KEY, IPFS_URL, RENTAL_NFT_ID } from "lib/constants";
import { getNft, rentNft } from "lib/ternoa";
import { useAppSelector } from "redux/hooks";
import { TernoaIPFS } from "ternoa-js";

const FlatRenting = ({
  isAvailableForRent,
  nft,
  setError,
  setIsAvailableForRent,
  setNft,
}: {
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
      setNft(
        (prevState) =>
          prevState && {
            ...prevState,
            rentalContract: prevState.rentalContract && {
              ...prevState.rentalContract,
              hasStarted: true,
              rentee,
            },
          }
      );
      setIsAvailableForRent(false);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setError(error?.message ?? JSON.stringify(error));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadNft = async (nftId: number) => {
      const ipfsClient = new TernoaIPFS(new URL(IPFS_URL), IPFS_API_KEY);
      try {
        const nftData = await getNft(nftId, ipfsClient);
        setNft(nftData);
      } catch (error) {
        console.log(error);
      }
    };

    const nftId = RENTAL_NFT_ID ?? nft?.nftId;
    if (nftId) {
      loadNft(nftId);
    }
  }, [nft?.nftId, setNft]);

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

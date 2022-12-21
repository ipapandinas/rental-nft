import { useState } from "react";
import Image from "next/image";
import { Box, Button, CircularProgress } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import { TernoaIPFS, File as TernoaFile } from "ternoa-js";

import { INFTExtended } from "interfaces/INFT";
import { IPFS_API_KEY, IPFS_URL } from "lib/constants";
import { createNft } from "lib/ternoa";
import { useAppSelector } from "redux/hooks";

const NftCreation = ({
  setError,
  setIsAvailableForRent,
  setNft,
}: {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setIsAvailableForRent: React.Dispatch<React.SetStateAction<boolean>>;
  setNft: React.Dispatch<React.SetStateAction<INFTExtended | undefined>>;
}) => {
  const [file, setFile] = useState<TernoaFile | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector(({ wallet }) => wallet.user);

  const handleFileChange = async (file: TernoaFile) => {
    const fileBuffer = await file.arrayBuffer();
    const fileUrl = URL.createObjectURL(new File([fileBuffer], file.name));
    setFile(file);
    setFilePreview(fileUrl);
  };

  const handleNftCreation = async () => {
    if (!file) return;

    const ipfsClient = new TernoaIPFS(new URL(IPFS_URL), IPFS_API_KEY);
    const metadata = {
      title: "Ternoa Flat Key",
      description: "Opens a secret gate during the tech AMA.",
    };

    try {
      setIsLoading(true);
      const nftData = await createNft(file, metadata, ipfsClient, user.address);
      console.log({ nftData });
      const { nftId, offchainData, owner } = nftData;
      setNft({
        owner,
        nftId,
        offchainData,
        rentalContract: null,
      });
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "40px",
      }}
    >
      <>
        <h2>👇 upload your flat&apos;s digital key 👇</h2>
        <FileUploader
          handleChange={handleFileChange}
          name="file"
          onTypeError={(err: Error) => console.log(err)}
          onSizeError={(err: Error) => console.log(err)}
        >
          {filePreview && (
            <Box>
              <Image
                alt="Flat Key"
                src={filePreview}
                width={141}
                height={155}
              />
            </Box>
          )}
        </FileUploader>
        <Button
          disabled={isLoading}
          onClick={handleNftCreation}
          variant="contained"
          sx={{
            marginTop: "24px",
          }}
        >
          {isLoading ? (
            <CircularProgress aria-label="Loading..." />
          ) : (
            "Create digital key"
          )}
        </Button>
      </>
    </Box>
  );
};

export default NftCreation;

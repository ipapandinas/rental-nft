import { useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";

import { INFTExtended } from "interfaces/INFT";
import { useAppSelector } from "redux/hooks";
import Image from "next/image";

const Enter = ({ nft }: { nft: INFTExtended }) => {
  const [canAccess, setAccess] = useState(false);
  const user = useAppSelector(({ wallet }) => wallet.user);
  const { owner, rentalContract } = nft;

  const handleKeyVerification = async () => {
    const check =
      (user.address === owner && rentalContract?.rentee === undefined) ||
      user.address === rentalContract?.rentee;
    setAccess(check);
  };

  const handleClose = () => setAccess(false);

  return (
    <Box>
      <Button
        disabled={!user.isConnected}
        onClick={handleKeyVerification}
        variant="contained"
      >
        Enter inside
      </Button>
      <Modal
        open={canAccess}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#000",
            border: "2px solid #fff",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Welcome
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This space is exclusive to the NFT owner or the rentee.
          </Typography>
          <Box sx={{ textAlign: "center", marginTop: "16px" }}>
            <Image
              alt="Simpsons gif"
              src="/simpsons.gif"
              width={220}
              height={167}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Enter;

import { useState } from "react";
import Image from "next/image";
import { Box, Button, Grid, Link, Paper, Typography } from "@mui/material";

import DialogLayout from "components/ui/DialogLayout";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { actions as walletActions } from "redux/wallet/actions";
import { getWallets, Wallet, WalletAccount } from "@talisman-connect/wallets";
import { middleEllipsis } from "lib/strings";

const WalletSelectModal = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.wallet.modalOpen);
  const AUTHORIZED_WALLETS = ["polkadot-js"];
  const supportedWallets: Wallet[] = getWallets()
    .filter((x) => AUTHORIZED_WALLETS.includes(x.extensionName))
    .sort((a, b) => a.extensionName.localeCompare(b.extensionName));
  const [error, setError] = useState<any>(undefined);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    undefined
  );
  const [accountList, setAccountList] = useState<WalletAccount[] | undefined>(
    undefined
  );
  const [isSelectAccountScreen, setIsSelectAccountScreen] = useState(false);

  const handleModalClose = () => {
    dispatch(walletActions.openCloseModal());
    setSelectedWallet(undefined);
    setAccountList(undefined);
    setIsSelectAccountScreen(false);
    setError(undefined);
  };

  const handleUserLogin = async (
    address: string,
    walletName: string,
    selectedWallet: string
  ) => {
    try {
      dispatch(walletActions.setUser(address, walletName, selectedWallet));
    } catch (err) {
      console.log(err);
    }
  };

  const cancelActions = () => {
    return !error && !isSelectAccountScreen ? (
      <Button
        onClick={() => handleModalClose()}
        variant="text"
        color="inherit"
        sx={{
          textTransform: "none",
        }}
      >
        Cancel
      </Button>
    ) : (
      <Button
        onClick={() => {
          setError(undefined);
          setAccountList(undefined);
          setIsSelectAccountScreen(false);
        }}
        variant="text"
        color="inherit"
        sx={{
          textTransform: "none",
        }}
      >
        Back
      </Button>
    );
  };

  const triggerOtherWallet = async (wallet: Wallet) => {
    try {
      setSelectedWallet(wallet);
      await wallet.enable("ternoa-workshop");
      await wallet.subscribeAccounts(
        (accounts: WalletAccount[] | undefined) => {
          setAccountList(accounts);
          setIsSelectAccountScreen(true);
        }
      );
    } catch (err) {
      setError(err);
    }
  };

  const connectOtherWallet = async (walletAccount: WalletAccount) => {
    try {
      handleUserLogin(
        walletAccount.address,
        walletAccount.name || "Account 1",
        selectedWallet?.extensionName || "polkadot-js"
      );
      handleModalClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DialogLayout
      open={open}
      dialogTitle="Chose how to connect"
      noFullScreen
      onClose={handleModalClose}
      dialogActions={cancelActions}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          paddingY: "16px",
        }}
      >
        {!error ? (
          !isSelectAccountScreen ? (
            <>
              {supportedWallets.map((x) => {
                return (
                  <Button
                    key={x.extensionName}
                    variant="contained"
                    onClick={() => triggerOtherWallet(x)}
                    fullWidth
                    sx={{
                      textTransform: "none",
                      margin: "6px",
                      padding: "12px",
                    }}
                  >
                    <Grid
                      container
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Grid
                        item
                        xs={5}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Image
                          width={22}
                          height={22}
                          src={x.logo.src}
                          alt={x.logo.alt}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={7}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        {x.title}
                      </Grid>
                    </Grid>
                  </Button>
                );
              })}
            </>
          ) : (
            <Box sx={{ width: "100%" }}>
              {accountList ? (
                accountList.map((x) => {
                  return (
                    <Paper
                      onClick={() => connectOtherWallet(x)}
                      sx={{
                        marginY: "10px",
                        paddingX: "10px",
                        paddingY: "5px",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                      key={x.address}
                    >
                      <Typography>{x.name}</Typography>
                      <Typography variant="caption">
                        {middleEllipsis(x.address)}
                      </Typography>
                    </Paper>
                  );
                })
              ) : (
                <Typography>No accounts were found</Typography>
              )}
            </Box>
          )
        ) : (
          <>
            <Typography color={"info"}>
              {error && error.message ? error.message : "An error has occured"}
            </Typography>
            {selectedWallet && (
              <>
                <Typography
                  color={"info"}
                >{`Check that the chosen extension is correctly installed`}</Typography>
                <Link
                  href={selectedWallet.installUrl}
                  target="_blank"
                  rel="noopener"
                >
                  Install Link
                </Link>
              </>
            )}
          </>
        )}
      </Box>
    </DialogLayout>
  );
};

export default WalletSelectModal;

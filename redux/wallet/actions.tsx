export const actions = {
  setUser: (address: string, walletName: string, selectedWallet: string) => ({
    type: "SET_USER",
    value: {
      address,
      walletName,
      selectedWallet,
    },
  }),
  logoutUser: () => ({
    type: "LOGOUT_USER",
  }),
  openCloseModal: () => ({
    type: "OPEN_CLOSE_MODAL",
  }),
  setBalance: (balance: string) => ({
    type: "SET_BALANCE",
    value: { balance },
  }),
  setAuth: (value: string | undefined) => ({
    type: "SET_AUTH",
    value: { value },
  }),
};

import { AnyAction, Reducer } from "redux";

const initialState = {
  modalOpen: false,
  user: {
    isConnected: false,
    address: "",
    walletName: "",
    balance: "",
  },
  auth: undefined as string | undefined,
};

export const walletReducer: Reducer<
  {
    modalOpen: boolean;
    user: {
      isConnected: boolean;
      address: string;
      walletName: string;
      balance: string;
    };
    auth: string | undefined;
  },
  AnyAction
> = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case "SET_USER": {
      const { address, walletName, selectedWallet } = action.value;
      return {
        ...state,
        user: {
          ...state.user,
          isConnected: true,
          address,
          walletName,
        },
      };
    }
    case "LOGOUT_USER": {
      return {
        ...state,
        user: initialState.user,
      };
    }
    case "OPEN_CLOSE_MODAL": {
      return {
        ...state,
        modalOpen: !state.modalOpen,
      };
    }
    case "SET_BALANCE": {
      const { balance } = action.value;
      return {
        ...state,
        user: {
          ...state.user,
          balance: balance,
        },
      };
    }
    case "SET_AUTH": {
      const { value } = action.value;
      return {
        ...state,
        auth: value,
      };
    }
    default:
      return state;
  }
};

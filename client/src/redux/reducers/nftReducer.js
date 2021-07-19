import { ActionTypes } from "../constants/action-types";

const intialState = {
  nft: [],
  account: '',
  artTokenContract: null,
  marketplaceContract: null
};

export const nftReducer = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_NFT:
      return { ...state, nft: payload };

    case ActionTypes.SET_ACCOUNT:
      return { ...state, nft: payload };
    
    case ActionTypes.SET_TOKEN_COTRACT:
      return { ...state, nft: payload }; 

    case ActionTypes.SET_MARKET_CONTRACT:
      return { ...state, nft: payload };
    default:
      return state;
  }
};

export const selectedNftReducer = (state = {}, { type, payload }) => {
  console.log(type);
  switch (type) {
    case ActionTypes.SELECTED_NFT:
      return { ...state, ...payload };
    case ActionTypes.REMOVE_SELECTED_NFT:
      return {};
    default:
      return state;
  }
};


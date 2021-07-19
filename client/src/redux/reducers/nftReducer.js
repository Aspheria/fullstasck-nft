import { ActionTypes } from "../constants/action-types";

const intialState = {
  nft: [],
};

export const nftReducer = (state = intialState, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_NFT:
      //add ArtTokenContract + Marketcontract + account
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


import { ActionTypes } from "../constants/action-types";

export const setNft = (nft) => {
  return {
    type: ActionTypes.SET_NFT,
    payload: nft,
  };
};

export const selectedNft = (nft) => {
  return {
    type: ActionTypes.SELECTED_NFT,
    payload: nft,
  };
};

export const removeSelectedNft = () => {
  return {
    type: ActionTypes.REMOVE_SELECTED_NFT,
  };
};


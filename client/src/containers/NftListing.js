import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import getWeb3 from './../utils/getWeb3'

import ArtMarketplace from './../contracts/ArtMarketplace.json'
import ArtToken from './../contracts/ArtToken.json'

import { setNft, setAccount, setTokenContract, setMarketContract } from "../redux/actions/nftActions";
import NftComponent from "./NftComponent";


const NftPage = () => {
  const nft = useSelector((state) => state.allNft.nft);
  const dispatch = useDispatch();
  const fetchNft = async () => {
    const response = await axios
      .get("https://fakestoreapi.com/products")
      .catch((err) => {
        console.log("Err: ", err);
      });
    dispatch(setNft(response.data));
  };
  // truffle migrate --reset
  // npm install -g truffle


  useEffect(() => {
    let itemsList = [];
    // let accounts, artTokenContract, marketplaceContract;

    const init = async () => {
      try{
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        console.log(accounts)

        if(typeof accounts === undefined){
          alert("Please login with Metamask!")
          console.log("login to metamask")
        }

        const networkId = await web3.eth.net.getId();
        // let itemsList = []

          try{
            const artTokenContract = new web3.eth.Contract(ArtToken.abi, ArtToken.networks[networkId].address);
            const marketplaceContract = new web3.eth.Contract(ArtMarketplace.abi, ArtMarketplace.networks[networkId].address);
            const totalSupply = await artTokenContract.methods.totalSupply().call();
            const totalItemsForSale = await marketplaceContract.methods.totalItemsForSale().call();
            console.log(totalSupply)
            console.log(totalItemsForSale)

            for (var tokenId=1; tokenId <= totalSupply; tokenId++){
              let item = await artTokenContract.methods.Items(tokenId).call();
              let owner = await artTokenContract.methods.ownerOf(tokenId).call();

              itemsList.push({
                tokenId: item.id,
                creator: item.creator,
                owner: owner,
                uri: item.uri,
                isForSale: false,
                saleId: null,
                price: 0,
                isSold: null
              });
            } 
            if(totalItemsForSale > 0){
              for(var saleId=0; saleId < totalItemsForSale; saleId++){
                let item = await marketplaceContract.methods.itemsForSale(saleId).call();
                let active = await marketplaceContract.methods.activeItems(item.tokenId).call();
  
                let itemListIndex = itemsList.findIndex(i => i.tokenId === item.tokenId);
  
                itemsList[itemListIndex] = {...itemsList[itemListIndex], 
                  isForSale: active, 
                  saleId: item.id, 
                  price: item.price, 
                  isSold: item.isSold
                };
              }
            }
            dispatch(setAccount(accounts[0]));
            dispatch(setTokenContract(artTokenContract));
            dispatch(setMarketContract(marketplaceContract));

          } catch(error) {
            console.error("Error", error);
            alert("Contracts not deployed to the current network " + networkId.toString());
          }
          console.log(itemsList)
          dispatch(setNft(itemsList));

        } catch(error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.` + error);
            console.error(error);
        }
    }
    init() 
    // fetchNft();
  }, []);
  
  console.log("Nft :", nft);
  return (
    <div className="ui grid container">
      <NftComponent />
    </div>
  );
};

export default NftPage;

import React, {useState, useEffect} from 'react';
import getWeb3 from './utils/getWeb3';
import './App.css';

import ArtToken from './contracts/ArtToken.json';
import ArtMarketplace from './contracts/ArtMarketplace.json';


function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [artTokenContract, setArtTokenContract] = useState(undefined);
  const [marketplaceContract, setMarketplaceContract] = useState(undefined);
  const [items, setItems] = useState([]);
  

  useEffect(() => {
    const init = async () => {
      try{
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        
        if(typeof accounts === undefined){
          alert("Please login with Metamask!")
          console.log("login to metamask")
        } 

        const networkId = await web3.eth.net.getId();
        try{
          const artTokenContract = new web3.eth.Contract(ArtToken.abi, ArtToken.networks[networkId].address);
          const marketplaceContract = new web3.eth.Contract(ArtMarketplace.abi, ArtMarketplace.networks[networkId].address);
      
          const totalSupply = await artTokenContract.methods.totalSupply().call();
          const totalItemsForSale = await marketplaceContract.methods.totalItemsForSale().call();
          
          let itemsList = []
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
                    
          console.log(itemsList);
          setWeb3(web3);
          setItems(itemsList);
          setAccounts(accounts);
          setArtTokenContract(artTokenContract);
          setMarketplaceContract(marketplaceContract);
          
        }catch(error) {
          console.error("Error", error);
          alert("Contracts not deployed to the current network " + networkId.toString());
        }
      }catch(error) {
        alert(`Failed to load web3, accounts, or contract. Check console for details.` + error);
        console.error(error);
      }
    }
    init();
  }, []);

  function getItemIndexBuyTokenId(tokenId) {
    const index = items.findIndex(item => item.tokenId === tokenId);
    return  index !== -1 ? index : undefined;
  }

  function getItemIndexBuySaleId(saleId) {
    const index = items.findIndex(item => item.saleId === saleId);
    return index !== -1 ? index : undefined;
  }

  async function mint(tokenMetadataURL){
    try{
      const receipt = await artTokenContract?.methods.mint(tokenMetadataURL).send({from: accounts[0]});
      console.log(receipt);
      console.log(receipt.events.Transfer.returnValues.tokenId);
      setItems(items => [...items, {
        tokenId: receipt.events.Transfer.returnValues.tokenId,
        creator: accounts[0],
        owner: accounts[0],
        uri: tokenMetadataURL,
        isForSale: false,
        saleId: null,
        price: 0,
        isSold: null
      }]);

    } catch (error) {
      console.error("Error, minting: ", error);
      alert("Error while minting!");
    }
  }

  async function putForSale(id, price) {
    try {
      const receipt = await marketplaceContract.methods.putItemForSale(id, price).send({gas: 210000, from: accounts[0]});
      console.log(receipt);

      const itemIdex = getItemIndexBuyTokenId(id);
      let newItems = [...items];
      newItems[itemIdex] = {...newItems[itemIdex], 
        isForSale: true,
        isSold: false,
        saleId: receipt.events.itemAddedForSale.returnValues.id,
        price: receipt.events.itemAddedForSale.returnValues.price
      };
      setItems(newItems);
      console.log(items)

    } catch (error) {
      console.error("Error, puting for sale: ", error);
      alert("Error while puting for sale!");
    }
  }

  async function buy(saleId, price) {
    try {
      const receipt = await marketplaceContract.methods.buyItem(saleId).send({gas: 210000, value: price, from: accounts[0]});
      console.log(receipt);
      const id = receipt.events.itemSold.id; ///saleId
      const itemIdex = getItemIndexBuySaleId(id);
      let newItems = [...items];
      newItems[itemIdex] = {...newItems[itemIdex], 
        isForSale: false,
        isSold: true
      };
      setItems(newItems);
      console.log(items)
    } catch (error) {
      console.error("Error, buying: ", error);
      alert("Error while buying!");
    }
  }


  if(typeof web3 === undefined){
    return <div> Loading Web3, accounts, and contracts ...</div>
  }

  return (
    <div className="App">
      <p><strong>Wallet Address: </strong>{accounts[0]}</p>
      <div>
        <button onClick={() => mint('uri/uri/meta.json')}>Mint</button>
      </div>
      <div>
        {items.map((item, key) => {
          return (
            <div key={key} style={{border: "1px solid black"}}>
              <p>ID: {item.tokenId}</p>
              <p>Creator: {item.creator}</p>
              <p>Owner: {item.owner}</p>
              <p>URI: {item.uri}</p>
              {item.isForSale &&
                <p>For Sale: 200</p>
              }
              {(item.owner === accounts[0] && !item.isForSale) &&
                <button onClick={() => putForSale(item.tokenId, 200)}>put for sale</button>
              }
              {(item.owner !== accounts[0] && item.isForSale) && 
                <button onClick={() => buy(item.saleId, 200)}>buy</button>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;

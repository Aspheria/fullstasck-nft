import React, { useEffect } from "react";
import axios from "axios";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { selectedNft,removeSelectedNft,} from "../redux/actions/nftActions";


const NftDetails = () => {

  const { nftId } = useParams();
  let nft = useSelector((state) => state.nft);
  const { image, title, price, owner, description } = nft;
  const dispatch = useDispatch();

  const fetchNftDetail = async (id) => {   //remover fetch e pegar item diretamente pelo redux
    const response = await axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .catch((err) => {
        console.log("Err: ", err);
      });
    dispatch(selectedNft(response.data));
  };

  useEffect(() => {
    if (nftId && nftId !== "") fetchNftDetail(nftId);
    return () => {
      dispatch(removeSelectedNft());
    };
  }, [nftId]);
  return (
    <div className="ui grid container">
      {Object.keys(nft).length === 0 ? (
        <div>...CARREGANDO</div>
      ) : (
        <div className="ui placeholder segment">
          <div className="ui two column stackable center aligned grid">
            <div className="ui vertical divider"></div>
            <div className="middle aligned row">
              <div className="column lp">
                <img className="ui fluid image" src={image} />
              </div>
              <div className="column rp">
                <h1>{title}</h1>
                <h2>
                  <a className="ui teal tag label">${price}</a>
                </h2>
                <h3 className="ui brown block header">{owner}</h3>
                <p>{description}</p>
                <div className="ui vertical animated button" tabIndex="0">
                  <div className="hidden content">
                    <i className="shop icon"></i>
                  </div>
                  <div className="visible content">COMPRAR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NftDetails;

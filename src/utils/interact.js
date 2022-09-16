import { pinJSONToIPFS } from './pinata.js'
const axios = require("axios");


require('dotenv').config();
const alchemyKey = process.env.REACT_APP_INFURA_KEY;
const thenticKey = process.env.REACT_APP_THENTIC_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

export const createCollection = async (collectionName, abbreviation) => {

  const options = {
    method: 'POST',
    url: 'https://thentic.p.rapidapi.com/nfts/contract',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'f76d73419emsh489fd9dde07867ep175b4ejsn9cba6f29d52a',
      'X-RapidAPI-Host': 'thentic.p.rapidapi.com'
    },
    data: '{"key":"' + thenticKey + '","chain_id": 97 ,"name":"' + collectionName + '","short_name":"' + abbreviation + '"}'
  };

  //sign the transaction via Metamask

  try {
    const response = await axios.request(options)
    window.open(response.data.transaction_url)
    return {
      success: true,
      status: "✅ Your request were made on \n" + response.data.transaction_url
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const mintNFT = async (contractAddress, nftId, url, name, description) => {
  const accounts = await web3.eth.getAccounts();

  // declare a new object **localAccount** and set account to it
  const localAccount = accounts[0];

  //error handling
  if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    }
  }

  //make metadata
  const metadata = {};
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;

  //make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: "😢 Something went wrong while uploading your tokenURI.",
    }
  }
  const tokenURI = pinataResponse.pinataUrl;

  const options = {
    method: 'POST',
    url: 'https://thentic.p.rapidapi.com/nfts/mint',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'f76d73419emsh489fd9dde07867ep175b4ejsn9cba6f29d52a',
      'X-RapidAPI-Host': 'thentic.p.rapidapi.com'
    },
    data: '{"key":"' + thenticKey + '","chain_id":97,"contract":"' + contractAddress + '","nft_id":"' + nftId + '","nft_data":"' + tokenURI + '","to":"' + localAccount + '"}'
  };

  //sign the transaction via Metamask

  try {
    const response = await axios.request(options)
    window.open(response.data.transaction_url)
    return {
      success: true,
      status: "✅ Your request were made on \n" + response.data.transaction_url
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};
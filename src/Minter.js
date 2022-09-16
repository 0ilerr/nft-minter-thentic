import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT, createCollection } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [collectionName, setCollectionName] = useState("");
  const [abbreviation, setAabbreviation] = useState("");

  const [contractAddress, setContractAddress] = useState("");
  const [nftId, setNftId] = useState("");
  const [url, setURL] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  useEffect(() => {
    async function fetchData() {
      const { address, status } = await getCurrentWalletConnected();
      setWallet(address)
      setStatus(status);

      addWalletListener();
    }
    fetchData();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onCreatePressed = async () => {
    const { status } = await createCollection(collectionName, abbreviation);
    setStatus(status);
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(contractAddress, nftId, url, name, description);
    setStatus(status);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <br></br>
      <h1 id="title">🧙‍♂️ Collection Creator</h1>
      <p>
        Simply add your collection name, and abbreviation, then press "Create."
      </p>
      <form>
        <h2>🦧 Name to collection: </h2>
        <input
          type="text"
          placeholder="Borred Ape"
          onChange={(event) => setCollectionName(event.target.value)}
        />
        <h2>🚀 Abbreviation to collection: </h2>
        <input
          type="text"
          placeholder="BA"
          onChange={(event) => setAabbreviation(event.target.value)}
        />
      </form>
      <button id="createButton" onClick={onCreatePressed}>
        Create
      </button>
      <h1 id="title">🧙‍♂️ NFT Minter</h1>
      <p>
        Simply add your contract address, id, asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🔍 Contract address: </h2>
        <input
          type="text"
          placeholder="0x51c0B49a081E8c795623995747B35E98bfB9C5e9"
          onChange={(event) => setContractAddress(event.target.value)}
        />
        <h2>🆔 Id: </h2>
        <input
          type="text"
          placeholder="1"
          onChange={(event) => setNftId(event.target.value)}
        />
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;

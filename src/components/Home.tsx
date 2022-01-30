import { ethers } from "ethers";
import WalletBalance from "./WalletBalance";
import Moliendos from "../artifacts/contracts/MyNFT.sol/Moliendos.json";
import { useEffect, useState } from "react";

const contractAddress = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";
const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();

const contract = new ethers.Contract(contractAddress, Moliendos.abi, signer);

const Home = () => {
    const [totalMinted, setTotalMinted] = useState(0);

    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    };

    return (
        <div>
            <WalletBalance />
            <h1>Moliendos NFT Collection</h1>
            {Array(totalMinted + 1)
                .fill(0)
                .map((_, index) => (
                    <div key={index} className="card">
                        <NFTImage tokenId={index} getCount={getCount} />
                    </div>
                ))}
        </div>
    );
};

const NFTImage = ({ tokenId, getCount }) => {
    const contentId = process.env.PINATA_CID;
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result);
        setIsMinted(result);
    };

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther("0.05"),
        });
        await result.wait();
        getMintedStatus();
        getCount();
    };

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
        alert(uri);
    }

    return (
        <div className="card" style={{ width: "18rem" }}>
            <img src={isMinted ? imageURI : "img/placeholder.png"} />
            <div>
                <h5>ID #{tokenId}</h5>
                {!isMinted ? (
                    <button onClick={mintToken}>Mint</button>
                ) : (
                    <button onClick={getURI}>Taken! Show URI</button>
                )}
            </div>
        </div>
    );
};

export default Home;

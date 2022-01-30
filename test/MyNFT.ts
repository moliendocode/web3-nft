import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyNFT", function () {
    it("Should mint and transfer an NFT to someone", async function () {
        const Moliendos = await ethers.getContractFactory("Moliendos");
        const moliendos = await Moliendos.deploy();
        await moliendos.deployed();

        const recipient = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";
        const metadataURI = "cid/test.png";

        let balance = await moliendos.balanceOf(recipient);

        expect(balance).to.equal(0);

        const newlyMintedToken = await moliendos.payToMint(
            recipient,
            metadataURI,
            { value: ethers.utils.parseEther("0.05") }
        );
        await newlyMintedToken.wait();

        balance = await moliendos.balanceOf(recipient);
        expect(balance).to.equal(1);

        expect(await moliendos.isContentOwned(metadataURI)).to.equal(true);
    });
});

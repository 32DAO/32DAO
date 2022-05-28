const Web3 = require("web3");
const hre = require("hardhat");

const ethProvider = require("eth-provider");
require("hardhat-ethernal");

async function main() {
  const provider = new ethers.providers.Web3Provider(
    new Web3(ethProvider())._provider
  );
  const signer = provider.getSigner();
  const MembershipToken = await hre.ethers.getContractFactory(
    "DAOMembership",
    signer
  );
  const nft = await hre.upgrades.deployProxy(MembershipToken, {
    initializer: "initialize",
  });
  // const nft = await MembershipToken.deploy();

  // await nft.deployed();

  await hre.ethernal.push({
    name: "DAOMembership",
    address: nft.address,
  });

  console.log("NFT deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

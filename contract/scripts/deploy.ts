import { ethers } from "hardhat";

async function main() {
  // const [owner, otherAccount] = await ethers.getSigners();

  // const MemberRegistry = await ethers.getContractFactory("MemberRegistry");
  // const memberRegistry = await MemberRegistry.deploy();

  // console.log("MemberRegistry contract deployed to:", memberRegistry.address);

  // const AdministerNFT = await ethers.getContractFactory("AdministerNFT");
  // const administerNFT = await AdministerNFT.deploy();

  // console.log("AdministerNFT contract deployed to:", administerNFT.address);

  // const MemberNFT = await ethers.getContractFactory("MemberNFT");
  // const memberNFT = await MemberNFT.deploy();

  // console.log("MemberNFT contract deployed to:", memberNFT.address);

  // const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
  // const badgeNFT = await BadgeNFT.deploy();

  // console.log("BadgeNFT contract deployed to:", badgeNFT.address);

  const PjDAOFactory = await ethers.getContractFactory("PjDAOFactory");
  const daoFactory = await PjDAOFactory.deploy('0xC844337B7B2C453c7e5EA4696CefF40939173Bb9', '0xB8130Dfef96d4C923656eE31571CC03C8359598b');

  console.log("PjDAOFactory contract deployed to:", daoFactory.address);

  // const AdminTimelockController = await ethers.getContractFactory("TimelockController");
  // const adminTimelockController = await AdminTimelockController.deploy(
  //     1, // sec
  //     [owner.getAddress(), otherAccount.getAddress()],
  //     [owner.getAddress(), otherAccount.getAddress()],
  //     owner.getAddress()
  // );

  // console.log("AdminTimelockController contract deployed to:", adminTimelockController.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

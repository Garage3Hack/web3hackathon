import { ethers } from "hardhat";

async function main() {

    const [owner] = await ethers.getSigners();

    // Deployed Shibuya Network
    const administerNFTAddress = "0x4aF1949172429D15AFf9Aa97D7321bd30e81cC2d";
    const memberNFTAddress = "0xC844337B7B2C453c7e5EA4696CefF40939173Bb9";
    const badgeNFTAddress = "0xB8130Dfef96d4C923656eE31571CC03C8359598b";
    const pjDaoFactoryAddress = "0x7303404Fb0577E30C9efB1df4EF984dCc5951D29";
    const adminTimelockControllerAddress = "0xe93cc4681C6AFa4d42b025Cd1284d183f7dE051b";

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



    // const PjDAOFactory = await ethers.getContractFactory("PjDAOFactoryShrink");
    // const daoFactory = await PjDAOFactory.deploy(memberNFTAddress, badgeNFTAddress);

    // console.log("PjDAOFactory contract deployed to:", daoFactory.address);

    // const AdminTimelockController = await ethers.getContractFactory("TimelockController");
    // const adminTimelockController = await AdminTimelockController.deploy(
    //     1, // sec
    //     [owner.getAddress()],
    //     [owner.getAddress()],
    //     owner.getAddress()
    // );

    // console.log("AdminTimelockController contract deployed to:", adminTimelockController.address);

    // const CoreGovernor = await ethers.getContractFactory("CoreGovernor");
    // const coreGovernor = await CoreGovernor.deploy(
    //     administerNFTAddress,
    //     adminTimelockController.address
    // );

    // console.log("CoreGovernor contract deployed to:", coreGovernor.address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
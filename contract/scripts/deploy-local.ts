import { ethers } from "hardhat";

async function main() {

    const [owner, otherAccount] = await ethers.getSigners();

    const MemberRegistry = await ethers.getContractFactory("MemberRegistry");
    const memberRegistry = await MemberRegistry.deploy();

    console.log("MemberRegistry contract deployed to:", memberRegistry.address);

    const AdministerNFT = await ethers.getContractFactory("AdministerNFT");
    const administerNFT = await AdministerNFT.deploy();

    console.log("AdministerNFT contract deployed to:", administerNFT.address);

    const MemberNFT = await ethers.getContractFactory("MemberNFT");
    const memberNFT = await MemberNFT.deploy();

    console.log("MemberNFT contract deployed to:", memberNFT.address);

    const BadgeNFT = await ethers.getContractFactory("BadgeNFT");
    const badgeNFT = await BadgeNFT.deploy();

    console.log("BadgeNFT contract deployed to:", badgeNFT.address);

    const PjDAOFactory = await ethers.getContractFactory("PjDAOFactory");
    const daoFactory = await PjDAOFactory.deploy(memberNFT.address, badgeNFT.address);

    console.log("PjDAOFactory contract deployed to:", daoFactory.address);

    const AdminTimelockController = await ethers.getContractFactory("TimelockController");
    const adminTimelockController = await AdminTimelockController.deploy(
        1, // sec
        [owner.getAddress(), otherAccount.getAddress()],
        [owner.getAddress(), otherAccount.getAddress()],
        owner.getAddress()
    );

    console.log("AdminTimelockController contract deployed to:", adminTimelockController.address);

    const CoreGovernor = await ethers.getContractFactory("CoreGovernor");
    const coreGovernor = await CoreGovernor.deploy(
        administerNFT.address,
        adminTimelockController.address
    );

    console.log("CoreGovernor contract deployed to:", coreGovernor.address);

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
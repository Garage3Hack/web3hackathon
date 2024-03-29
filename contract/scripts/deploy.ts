import { ethers } from "hardhat";

async function main() {

    const [owner] = await ethers.getSigners();

    // Deployed Shibuya Network 2023/3/24 hackathon
    // const memberRegistry = "0xf73b3dB71E5E804AE46AAf6CB00938E9607b5339";
    // const administerNFTAddress = "0x9bc966EFCEBCA3f2B8747e4873B582a058eAEdED";
    // const memberNFTAddress = "0x1996F5864714CD0f0a3aC7ca5DACB5Bf57352bB1";
    // const badgeNFTAddress = "0xCF8d9FdbD068B879dFB0A3DB6e4cf7d58621b1B2";
    // const pjDaoFactoryAddress = "0x194E020a580c1A327fCc131886051c7254EC774B";
    // const adminTimelockControllerAddress = "0x82d94F6AD894fE6A13D40425C1f70d241A584305";
    // const coreGovernorAddress = "0x0917A3B5A36d0508bC33C02fB40B504987ac76c8";

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
        [owner.getAddress()],
        [owner.getAddress()],
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
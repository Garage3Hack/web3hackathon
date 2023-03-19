import ethers from "ethers";

const generateHash = (str) => {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(str));
}

export default generateHash
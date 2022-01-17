import { Contract } from "@ethersproject/contracts";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

const main = async () => {
	const [owner, randomPerson, randomPerson2] = await ethers.getSigners();
	const randoms = [randomPerson, randomPerson2];

  const waveContractFactory = await ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("Contract deployed to:", waveContract.address);
	console.log("Contract deployed by:", owner.address);

	let waveCount = await waveContract.getTotalWaves();

	const numberOfWaves = Math.floor(Math.random() * 5) + 1;
	for (let i = 0; i < numberOfWaves; i++) {
		const random = i % 2 === 0 ? randoms[0] : randoms[1];
		await startWaving(random, waveContract);
	}

	waveCount = await waveContract.getTotalWaves();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const startWaving = async (waver: SignerWithAddress, contract: Contract) => {
	let waveTxn = await contract.connect(waver).wave();
	await waveTxn.wait();
}

runMain();
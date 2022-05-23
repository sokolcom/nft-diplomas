"use strict";

const hre = require("hardhat");


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const OrganizationFactory = await hre.ethers.getContractFactory("OrganizationFactory");
  const organizationFactory = await OrganizationFactory.deploy();
  await organizationFactory.deployed();

  console.log("OrganizationFactory deployed to:", organizationFactory.address);

  const tx = await organizationFactory.createOrganization("TESTING ORG");
  const { events } = await tx.wait();
  const { address } = events.find(Boolean);

  console.log("Created Organization at Address: " + address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

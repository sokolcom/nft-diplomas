"use strict";

import organizationFactoryABI from "../data/OrganizationFactoryABI.json";
const { ethers } = require("ethers");


let OrganizationFactory;

const App = {
  provider: null,
  signer: null,
  network: null,
  organizationFactoryAddress: null,
  organizationFactory: null,

  start: async function () {
    try {
      console.log("YAY-1");
      OrganizationFactory = new ethers.Contract(App.organizationFactoryAddress, organizationFactoryABI, this.provider);
      console.log("YAY-2");
      App.organizationFactory = await OrganizationFactory.deployed();
    } catch (error) {
      console.error("Oops!\nCould not connect to contract or chain!");
    }
  },

  createOrganization: async function () {
    const organizationName = document.getElementById("title").value;
    if (organizationName.length > 0xFF) {
      window.alert("Error!\nName too long! (max. 255 symbols)");
      return;
    }

    const сreatedOrganization = document.getElementById("createdOrganization");
    сreatedOrganization.innerHTML = "Создаем смарт-контракт учебного заведения... пожалуйста, дождитесь завершения.";

    const tx = await App.organizationFactory.connect(App.signer).createOrganization(organizationName);
    const { events } = await tx.wait();
    const { address } = events.find(Boolean);
    const addr = ethers.utils.getAddress(address);

    сreatedOrganization.innerHTML = "Адрес созданного смарт-контратка: <b>" + addr + "</b>";
    return;
  }
};


window.App = App;
window.addEventListener("load", async function () {
  await window.ethereum.enable();

  App.provider = new ethers.providers.Web3Provider(window.ethereum);  // MetaMask's provider

  App.network = await App.provider.getNetwork();
  if (App.network.chainId == 255) {  // Frontier
    App.organizationFactoryAddress = "0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a";
  } else if (App.network.chainId == 31337) {  // local Hardhat
    App.organizationFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  } else {
    window.alert("Error!\nOrganizationFactory contract was not deployed in this network!");
    return;
  }

  App.signer = App.provider.getSigner();  // Load MetaMask account
  App.start();
});

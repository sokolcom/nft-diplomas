"use strict";

import organizationABI from "../data/OrganizationABI.json";
const { ethers } = require("ethers");


let organization;
let org;

function _checkAddress(addr) {
  if (!ethers.utils.isAddress(addr)) {
    window.alert("Oops!\nInvalid address!");
    return false;
  }
  return true;
}

const App = {
  provider: null,
  signer: null,

  start: async function () {},
  createCert: async function () {
    const contractAddr = document.getElementById("contractAddr").value;
    const recipientAddr = document.getElementById("recipientAddr").value;
    if (!_checkAddress(contractAddr)) {
      return;
    }
    if (!_checkAddress(recipientAddr)) {
      return;
    }
    
    const certURI = document.getElementById("certBody").value;
    if (certURI.length == 0) {
      window.alert("Error! Cannot mint empty NFT!");
      return;
    }

    try {
      organization = new ethers.Contract(contractAddr, organizationABI, this.provider);
    } catch (err) {
      window.alert("Error!\nInvalid Organization Contract Address");
      return;
    }

    const status = document.getElementById("status");
    status.innerHTML = "Создаем NFT-сертификат... пожалуйста, дождитесь завершения.";

    org = await organization.deployed();
    const tx = await org.connect(App.signer).mintDiploma(recipientAddr, certURI);
    await tx.wait();
    
    const tokenId = await org.connect(App.signer).getDiplomaAmount();
    status.innerHTML = "ID сертификата: " + tokenId;
    return;
  }
};


window.App = App;
window.addEventListener("load", async function () {
  await window.ethereum.enable();

  App.provider = new ethers.providers.Web3Provider(window.ethereum);  // MetaMask's provider
  App.signer = App.provider.getSigner();  // Load MetaMask account
  App.start();
});

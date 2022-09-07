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
  },
  readPage: async function () {
    const contractAddr = document.getElementById("contractAddr ").value.toString();
    if (!_checkAddress(contractAddr)) {
      return;
    }

    try {
      organization = new ethers.Contract(contractAddr, organizationABI, this.provider);
    } catch (err) {
      window.alert("Error!\nInvalid Organization Contract Address");
      return;
    }

    let signerAddr = await App.signer.getAddress();
    if (!(await organization.connect(App.signer).isReader(signerAddr))) {
      window.alert("Error!\nYou must have the <READER> role in this Organization for this operation!");
      return;
    }

    const tokenId = document.getElementById("tokenId").value;
    if (tokenId > await organization.connect(App.signer).getDiplomaAmount()) {
      window.alert("Error!\nInvalid DiplomaID!");
      return;
    }

    const read = document.getElementById("read");
    read.innerHTML = "<br><br>Загружаем сертификат... пожалуйста, подождите."

    let organizationName;
    let diplomaURI;
    let graduate;
    try {
      organizationName = await organization.connect(App.signer)
        .getOrganizationName();
      diplomaURI = await organization.connect(App.signer).getDiploma(tokenId);
      graduate = await organization.connect(App.signer).ownerOf(tokenId);
    } catch (err) {
      window.alert("error: unable to View");
      return;
    }

    let pageHTML = "<br><br><table class=\"tg\" style=\"max-width:400px;font-size: 20px\"><tbody>";
    pageHTML += "<tr><td class=\"tg-left\">Название учебного заведения: </td><td class=\"tg-right\">" + organizationName + "</td></tr>";
    pageHTML += "<tr><td class=\"tg-left\">URI Диплома об окончании: </td><td class=\"tg-right\">" + diplomaURI + "</td></tr>";
    pageHTML += "<tr><td class=\"tg-left\">Выпускник: </td><td class=\"tg-right\">" + graduate + "</td></tr>"
    pageHTML += "</tbody></table>"
    read.innerHTML = pageHTML;
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

"use strict";

import organizationABI from "../data/OrganizationABI.json";
const { ethers } = require("ethers");


let organization;

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
  open: async function () {
    const contractAddr = document.getElementById("contractAddr").value;

    if (!_checkAddress(contractAddr)) {
      return;
    }

    try {
      organization = new ethers.Contract(contractAddr, organizationABI, this.provider);
    } catch (err) {
        window.alert("Error!\nInvalid Organization Contract Address");
        return;
    }

    if (await organization.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("Error!\nYou must be the Owner of the Organization Contract!");
      return;
    }

    const openStatus = document.getElementById("openStatus");
    if (await organization.connect(App.signer).isOpen()) {
      openStatus.innerHTML = "<b>Сертификаты уже открыты!</b>";
      return;
    }
    openStatus.innerHTML = "Открываем сертификаты... пожалуйста, дождитесь завершения.";

    const tx = await organization.connect(App.signer).open();
    await tx.wait();
    openStatus.innerHTML = "<b>Готово! Сертификаты открыты! 🥳</b>";
    return;
  },

  close: async function () {
    const contractAddr = document.getElementById("contractAddr").value;

    if (!_checkAddress(contractAddr)) {
      return;
    }

    try {
      organization = new ethers.Contract(contractAddr, organizationABI, this.provider);
    } catch (err) {
      window.alert("Error!\nInvalid Organization Contract Address");
      return;
    }

    if (await organization.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("Error!\nYou must be the Owner of Organization Contract!");
      return;
    }

    const openStatus = document.getElementById("openStatus");
    if (!(await organization.connect(App.signer).isOpen())) {
      openStatus.innerHTML = "<b>Сертификаты уже закрыты.</b>";
      return;
    }
    openStatus.innerHTML = "Закрываем сертификаты... пожалуйста, дождитесь завершения.";

    const tx = await organization.connect(App.signer).close();
    await tx.wait();
    openStatus.innerHTML = "<b>Сертификаты закрыты.</b>";
    return;
  },

  addReader: async function () {
    const contractAddr = document.getElementById("contractAddr").value;
    const readerAddr = document.getElementById("readerAddr").value;

    if (!_checkAddress(contractAddr)) {
      return;
    }
    if (!_checkAddress(readerAddr)) {
      return;
    }

    try {
      organization = new ethers.Contract(contractAddr, organizationABI, this.provider);
    } catch (err) {
      window.alert("Error!\nInvalid Organization Contract Address");
      return;
    }

    if (await organization.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("Error!\nYou must be the Owner of Organization Contract!");
      return;
    }

    const readerStatus = document.getElementById("readerStatus");
    
    if (await organization.connect(App.signer).isReader(readerAddr)){
      readerStatus.innerHTML = "<b>" + readerAddr + " может просматривать сертификаты.</b>";
      return;
    }
    readerStatus.innerHTML = "Добавляем пользователя... пожалуйста, дождитесь завершения.";

    const tx = await organization.connect(App.signer).addReader(readerAddr);
    await tx.wait();
    readerStatus.innerHTML = "<b>" + readerAddr + " теперь может просматривать сертификаты.</b>";
    return;
  },

  removeReader: async function () {
    const contractAddr = document.getElementById("contractAddr").value;
    const readerAddr = document.getElementById("readerAddr").value;

    if (!_checkAddress(contractAddr)) {
      return;
    }
    if (!_checkAddress(readerAddr)) {
      return;
    }

    try {
      organization = new ethers.Contract(contractAddr, organizationABI, this.provider);
    } catch (err) {
      window.alert("Error!\nInvalid Organization Contract Address");
      return;
    }

    if (await organization.connect(App.signer).owner() != await App.signer.getAddress()){
      window.alert("Error!\nYou must be the Owner of Organization Contract!");
      return;
    }

    const readerStatus = document.getElementById("readerStatus");
    if (!(await organization.connect(App.signer).isReader(readerAddr))){
      readerStatus.innerHTML = "<b>" + readerAddr + " не может просматривать сертификаты.</b>";
      return;
    }
    readerStatus.innerHTML = "Удаляем пользователя... пожалуйста, дождитесь завершения.";

    const tx = await organization.connect(App.signer).removeReader(readerAddr);
    await tx.wait();
    readerStatus.innerHTML = "<b>" + readerAddr + "теперь не может просматривать сертификаты.</b>";
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

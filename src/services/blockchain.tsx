import Web3 from "web3";
import { AbiItem } from "web3-utils";

import ImmigrationContract from "../../build/contracts/Immigration.json";

const web3 = new Web3(import.meta.env.VITE_BLOCKCHAIN_RPC_SERVER_URL);
const accounts = await web3.eth.getAccounts();
// web3.eth.defaultAccount = accounts[0];
let contract = new web3.eth.Contract(
  ImmigrationContract.abi as AbiItem[],
  import.meta.env.VITE_BLOCKCHAIN_CONTRACT_ADDRESS
);

const createPersonOnBlockchain = (
  id: string,
  passport: string,
  name: string,
  dateOfBirth: string,
  nationality: string
) => {
  return contract.methods
    .createNewCitizen(id, passport, name, dateOfBirth, nationality)
    .send({ from: accounts[0], gas: 1000000 });
};

const createFlightOnBlockchain = (
  id: string,
  code: string,
  flight_name: string,
  operator: string,
  departure: string,
  arrival: string
) => {
  return contract.methods
    .createNewFlight(id, code, flight_name, operator, departure, arrival)
    .send({ from: accounts[0], gas: 1000000 });
};

const getCitizen = (id: number) => {
  return contract.methods.getCitizen(id).call();
};

const getFlight = (id: number) => {
  return contract.methods.getFlight(id).call();
};

const addPersonToFlight = (citizen_id: number, flight_id: number) => {
  return contract.methods
    .addPersonToFlight(citizen_id, flight_id)
    .send({ from: accounts[0], gas: 1000000 });
};

export {
  createPersonOnBlockchain,
  createFlightOnBlockchain,
  getCitizen,
  getFlight,
  addPersonToFlight,
};

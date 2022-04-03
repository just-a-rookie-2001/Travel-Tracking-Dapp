import Web3 from "web3";
import { AbiItem } from "web3-utils";

import ImmigrationContract from "../../build/contracts/Immigration.json";

const web3 = new Web3(import.meta.env.VITE_BLOCKCHAIN_RPC_SERVER_URL);
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
  console.log(import.meta.env.VITE_BLOCKCHAIN_CONTRACT_ADDRESS, import.meta.env.VITE_BLOCKCHAIN_RPC_SERVER_URL)
  return contract.methods
    .createNewCitizen(id, passport, name, dateOfBirth, nationality)
    .send({ from: "0x4a495a2Db8af6FC7b66DfB6D35872401378115b1", gas: 1000000 });
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
    .send({ from: "0x4a495a2Db8af6FC7b66DfB6D35872401378115b1", gas: 1000000 });
};

export { createPersonOnBlockchain, createFlightOnBlockchain };

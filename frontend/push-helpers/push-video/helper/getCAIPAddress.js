
import { ethers } from "ethers";


export function isValidETHAddress(address) {
  return ethers.utils.isAddress(address);
}

const AddressValidators = {
  eip155: ({ address }) => {
    return isValidETHAddress(address);
  },
};

function validateCAIP(addressInCAIP) {
  const [blockchain, networkId, address] = addressInCAIP.split(":");

  if (!blockchain) return false;
  if (!networkId) return false;
  if (!address) return false;

  const validatorFn = AddressValidators[blockchain];

  return validatorFn({ address });
}

function getFallbackETHCAIPAddress(env="staging", address) {
  let chainId = 1; // by default PROD

  if (env === "dev" || env === "staging") {
    chainId = 5;
  }

  return `eip155:${chainId}:${address}`;
}

export function getCAIPAddress(env="staging", address, msg) {
  if (validateCAIP(address)) {
    return address;
  } else {
    if (isValidETHAddress(address)) {
      return getFallbackETHCAIPAddress(env, address);
    } else {
      throw Error(`Invalid Address! ${msg}`);
    }
  }
}
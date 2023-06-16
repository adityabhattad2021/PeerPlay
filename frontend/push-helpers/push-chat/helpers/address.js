export function walletToPCAIP10(account) {
  if (account.includes("eip155:")) {
    return account;
  }
  return "eip155:" + account;
}

export function pCAIP10ToWallet(wallet) {
  wallet = wallet.replace("eip155:", "");
  return wallet;
}


export function walletToCAIP(wallet,chainId){
  if(wallet.includes(`eip155:${chainId}`)){
    return wallet;
  }
  return `eip155:${chainId}:${wallet}`;
}
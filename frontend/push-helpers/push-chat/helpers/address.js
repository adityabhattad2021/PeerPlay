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

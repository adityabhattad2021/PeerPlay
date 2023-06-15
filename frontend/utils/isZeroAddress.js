export default function isZeroAddress(address) {
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    return address && address.toLowerCase() === zeroAddress;
  }
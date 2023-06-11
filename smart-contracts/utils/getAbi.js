const fs = require("fs")
const path = require("path")

const getAbi = (contractName) => {
  try {
    const dir = path.resolve(
      `./artifacts/contracts/${contractName}.sol/${contractName}.json`
    )
    const file = fs.readFileSync(dir, "utf8")
    const json = JSON.parse(file)
    const abi = json.abi
 
    return abi
  } catch (e) {
    console.log(`e`, e)
  }
}

module.exports={getAbi}
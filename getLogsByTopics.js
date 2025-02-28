const axios = require("axios");
const fs = require("fs");

async function getLogsByTopics(apiKey, fromBlock, toBlock, topic0) {
  let allLogs = [];
  let page = 1;
  let hasMoreLogs = true;

  while (hasMoreLogs) {
    const url = `https://api.routescan.io/v2/network/testnet/evm/80084/etherscan/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=0x98AFA03Ad45a5Ac59D338E4E2B6aC939b9bA37a2&topic0=${topic0}&page=${page}&offset=1000&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);
      const logs = response.data.result;

      if (logs && logs.length > 0) {
        allLogs = allLogs.concat(logs);
        page++;
      } else {
        hasMoreLogs = false;
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      throw error;
    }
  }

  return allLogs;
}

function extractHolderAddresses(logs) {
  return logs.map((log) => {
    if (log.data && log.data.length >= 66) {
      const holderAddress = `0x${log.data.slice(26, 66)}`;
      return { HolderAddress: holderAddress };
    } else {
      console.error("Invalid log data:", log);
      return { HolderAddress: null };
    }
  });
}

// Example usage
const apiKey = "YourApiKeyToken";
const fromBlock = 960612;
const toBlock = 4580082;
const topic0 =
  "0x3cde85058f06453cc8659ddf48d7e85206077357e9438a4abd2bdd431534e62b";

getLogsByTopics(apiKey, fromBlock, toBlock, topic0)
  .then((logs) => {
    const holderAddresses = extractHolderAddresses(logs);
    fs.writeFile(
      "Stake_LP_Phase_1.json",
      JSON.stringify(holderAddresses, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to file", err);
        } else {
          console.log("Logs saved to logs.json");
        }
      }
    );
  })
  .catch((error) => console.error(error));

const fs = require("fs");

// NFTs Holders Data
const BERAC_NFT = require("./data/BERAC_NFT.json");
const BERAC_POL = require("./data/BERAC_POL.json");
const BERAC_POL2 = require("./data/BERAC_POL2.json");
const GENESIS_HOLDERS = require("./data/genesis_holders.json");

// Vaults LP Data
const DIRAC_VAULT = require("./data/DIRAC_VAULT.json");
const DIRAC_HONEY_LP_Holders = require("./data/DIRAC_HONEY_LP_Holders.json");
const HONEY_VAULT_BERPS = require("./data/HONEY_VAULT_BERPS.json");
const I_BGT_VAULT = require("./data/I_BGT_VAULT.json");
const NECT_VAULT = require("./data/NECT_VAULT.json");
const BEND_VAULT = require("./data/BEND_VAULT.json");

// Stakes LP Data
const Stake_DIRAC_HONEY_LP_KODIAK = require("./data/Stake_DIRAC_HONEY_LP_KODIAK.json");
const Stake_LP_PHASE_1_DATA = require("./data/Stake_LP_Phase_1.json");
const Stake_DIRAC_PHASE_1_DATA = require("./data/Stake_DIRAC_PHASE_1.json");
const Stake_DIRAC_Phase_2 = require("./data/Stake_DIRAC_Phase_2.json");

// Unique Holder Addresses
const UNIQUE_HOLDER_ADDRESSES = require("./data/unique_holder_addresses.json");
const { Parser } = require("json2csv");

// Convert vault addresses to lowercase for consistent comparison
const DIRAC_VAULT_ADDRESSES = DIRAC_VAULT.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const DIRAC_HONEY_LP_ADDRESSES = DIRAC_HONEY_LP_Holders.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const HONEY_VAULT_BERPS_ADDRESSES = HONEY_VAULT_BERPS.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const BEND_VAULT_ADDRESSES = BEND_VAULT.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

// Convert stake addresses to lowercase for consistent comparison
const STAKE_LP_PHASE_1_ADDRESSES = Stake_LP_PHASE_1_DATA.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const STAKE_DIRAC_PHASE_1_ADDRESSES = Stake_DIRAC_PHASE_1_DATA.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const HOLDER_ADDRESSES_PHASE_1 = [];

for (let i = 0; i < UNIQUE_HOLDER_ADDRESSES.length; i++) {
  let GET_BERA = 10;
  let GET_HONEY = 0;
  let GET_DIRAC = 0;
  let GET_DIRAC_HONEY_LP_TOKEN = 0;
  let DEPOSIT_DIRAC_VAULT = 0;
  let DEPOSIT_HONEY_VAULT_BERPS = 0;
  let DEPOSIT_BEND_VAULT = 0;
  let STAKE_LP_PHASE_1 = 0;
  let STAKE_DIRAC_Phase_1 = 0;
  let HOLD_BERAC_NFT = 0;

  let holderAddress = UNIQUE_HOLDER_ADDRESSES[i];

  if (DIRAC_VAULT_ADDRESSES.includes(holderAddress)) {
    DEPOSIT_DIRAC_VAULT = 10;
    GET_HONEY = 10;
  } 
  if (DIRAC_HONEY_LP_ADDRESSES.includes(holderAddress))
    GET_DIRAC_HONEY_LP_TOKEN = 10;
  if (HONEY_VAULT_BERPS_ADDRESSES.includes(holderAddress)) DEPOSIT_HONEY_VAULT_BERPS = 10;
  if (BEND_VAULT_ADDRESSES.includes(holderAddress)) DEPOSIT_BEND_VAULT = 10;

  if (STAKE_LP_PHASE_1_ADDRESSES.includes(holderAddress)) {
    GET_DIRAC_HONEY_LP_TOKEN = 10;
    STAKE_LP_PHASE_1 = 10;
  } 
  if (STAKE_DIRAC_PHASE_1_ADDRESSES.includes(holderAddress)) {
    STAKE_DIRAC_Phase_1 = 10;
    GET_DIRAC = 10;
  }
    

  const beracNftHolder = BERAC_NFT.find(
    (item) => item.HolderAddress.toLowerCase() === holderAddress
  );
  if (beracNftHolder) {
    // Convert Quantity to number if it's a string
    const quantity = typeof beracNftHolder.Quantity === 'string' 
      ? parseInt(beracNftHolder.Quantity, 10) 
      : beracNftHolder.Quantity;
      
    HOLD_BERAC_NFT = quantity > 3 ? 30 : quantity * 10;
  }

  const totalPoints = GET_HONEY + GET_DIRAC + GET_DIRAC_HONEY_LP_TOKEN + 
                     DEPOSIT_DIRAC_VAULT + DEPOSIT_HONEY_VAULT_BERPS + 
                     DEPOSIT_BEND_VAULT + STAKE_LP_PHASE_1 + 
                     STAKE_DIRAC_Phase_1 + GET_BERA;

  const points1 = HOLD_BERAC_NFT
    ? (HOLD_BERAC_NFT/10) * totalPoints + HOLD_BERAC_NFT
    : totalPoints;

  if(totalPoints > 0) {
    const holderPhase1 = {
      holderAddress: holderAddress,
      GET_BERA: GET_BERA,
      GET_HONEY: GET_HONEY,
      GET_DIRAC: GET_DIRAC,
      GET_DIRAC_HONEY_LP_TOKEN: GET_DIRAC_HONEY_LP_TOKEN,
      DEPOSIT_DIRAC_VAULT: DEPOSIT_DIRAC_VAULT,
      DEPOSIT_HONEY_VAULT_BERPS: DEPOSIT_HONEY_VAULT_BERPS,
      DEPOSIT_BEND_VAULT: DEPOSIT_BEND_VAULT,
      STAKE_LP_PHASE_1: STAKE_LP_PHASE_1,
      STAKE_DIRAC_PHASE_1: STAKE_DIRAC_Phase_1,
      HOLD_BERAC_NFT: HOLD_BERAC_NFT,
      TOTAL_POINTS: totalPoints,
      MULTIPLIER_POINTS: points1
    };
  
    HOLDER_ADDRESSES_PHASE_1.push(holderPhase1);
  }
}

const fields = [
  "holderAddress",
  "GET_BERA",
  "GET_HONEY",
  "GET_DIRAC",
  "GET_DIRAC_HONEY_LP_TOKEN",
  "DEPOSIT_DIRAC_VAULT",
  "DEPOSIT_HONEY_VAULT_BERPS",
  "DEPOSIT_BEND_VAULT",
  "STAKE_LP_PHASE_1",
  "STAKE_DIRAC_PHASE_1",
  "HOLD_BERAC_NFT",
  "TOTAL_POINTS",
  "MULTIPLIER_POINTS"
];

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(HOLDER_ADDRESSES_PHASE_1);

fs.writeFileSync("holder_addresses_phase_1.csv", csv);

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
const Stake_DIRAC_PHASE_1 = require("./data/Stake_DIRAC_PHASE_1.json");
const Stake_DIRAC_Phase_2 = require("./data/Stake_DIRAC_Phase_2.json");

const CUBQUEST_DATA = require("./data/CUBEQUESTPOINTS.json");
const INFRARED_DATA = require("./data/Infrared.json");
const BGT_STATION_DATA = require("./data/bgtStationData.json");
const GALXE_DATA = require("./data/galaxe.json");

// Unique Holder Addresses
const UNIQUE_HOLDER_ADDRESSES = require("./data/unique_holder_addresses.json");
const { Parser } = require("json2csv");

// Extract addresses from CUBQUEST_DATA (which has a different structure)
const CUBQUEST_ADDRESSES = CUBQUEST_DATA.map(item => item.ADDRESS.toLowerCase());

// Convert GALXE_DATA addresses to lowercase for consistent comparison
const GALXE_ADDRESSES = GALXE_DATA.map(address => address.toLowerCase());

// Convert vault addresses to lowercase for consistent comparison
const NECT_VAULT_ADDRESSES = NECT_VAULT.map(item => item.HolderAddress.toLowerCase());
const I_BGT_VAULT_ADDRESSES = I_BGT_VAULT.map(item => item.HolderAddress.toLowerCase());

// Convert stake addresses to lowercase for consistent comparison
const STAKE_DIRAC_PHASE_2_ADDRESSES = Stake_DIRAC_Phase_2.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const STAKE_DIRAC_HONEY_LP_KODIAK_ADDRESSES = Stake_DIRAC_HONEY_LP_KODIAK.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

// Convert INFRARED and BGT_STATION addresses to lowercase
const INFRARED_ADDRESSES = INFRARED_DATA.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const BGT_STATION_ADDRESSES = BGT_STATION_DATA.map(item => 
  typeof item === 'string' ? item.toLowerCase() : 
  (item.HolderAddress ? item.HolderAddress.toLowerCase() : '')
).filter(address => address !== '');

const HOLDER_ADDRESSES_PHASE_2 = [];

for (let i = 0; i < UNIQUE_HOLDER_ADDRESSES.length; i++) {
  let DEPOSIT_NECT_VAULT = 0;
  let DEPOSIT_iBGT_VAULT = 0;

  let GALXE = 0;
  let CUBQUEST = 0;

  let HOLD_GENESIS_NFT = 0;
  let HOLD_BERAC_POL_NFT = 0;
  let HOLD_BERAC_POL_2_NFT = 0;

  let STAKE_DIRAC_Phase_2 = 0;
  let Stake_LP_KODIAK = 0;

  let STAKE_INFRARED = 0;
  let STAKE_BGT_STATION = 0;

  let holderAddress = UNIQUE_HOLDER_ADDRESSES[i];

  if (NECT_VAULT_ADDRESSES.includes(holderAddress)) DEPOSIT_NECT_VAULT = 20;
  if (I_BGT_VAULT_ADDRESSES.includes(holderAddress)) DEPOSIT_iBGT_VAULT = 20;

  if (CUBQUEST_ADDRESSES.includes(holderAddress)) CUBQUEST = 50;
  if (GALXE_ADDRESSES.includes(holderAddress)) GALXE = 50;

  if (INFRARED_ADDRESSES.includes(holderAddress)) STAKE_INFRARED = 30;
  if (BGT_STATION_ADDRESSES.includes(holderAddress)) STAKE_BGT_STATION = 30;

  if (STAKE_DIRAC_PHASE_2_ADDRESSES.includes(holderAddress)) STAKE_DIRAC_Phase_2 = 10;
  if (STAKE_DIRAC_HONEY_LP_KODIAK_ADDRESSES.includes(holderAddress)) Stake_LP_KODIAK = 10;

  const genesisHolder = GENESIS_HOLDERS.find(
    (item) => item.HolderAddress.toLowerCase() === holderAddress
  );
  if (genesisHolder) {
    HOLD_GENESIS_NFT = genesisHolder.balance * 15;
  }

  const beracPolHolder = BERAC_POL.find(
    (item) => item.HolderAddress.toLowerCase() === holderAddress
  );
  if (beracPolHolder) {
    // Convert Quantity to number if it's a string
    const quantity = typeof beracPolHolder.Quantity === 'string' 
      ? parseInt(beracPolHolder.Quantity, 10) 
      : beracPolHolder.Quantity;
      
    HOLD_BERAC_POL_NFT = Math.min(quantity, 5) * 15;
  }

  const beracPol2Holder = BERAC_POL2.find(
    (item) => item.HolderAddress.toLowerCase() === holderAddress
  );
  if (beracPol2Holder) {
    // Convert Quantity to number if it's a string
    const quantity = typeof beracPol2Holder.Quantity === 'string' 
      ? parseInt(beracPol2Holder.Quantity, 10) 
      : beracPol2Holder.Quantity;
      
    HOLD_BERAC_POL_2_NFT = Math.min(quantity, 5) * 40;
  }

  const totalPoints = HOLD_GENESIS_NFT + HOLD_BERAC_POL_NFT + HOLD_BERAC_POL_2_NFT + STAKE_DIRAC_Phase_2 + Stake_LP_KODIAK + STAKE_INFRARED + STAKE_BGT_STATION + DEPOSIT_NECT_VAULT + DEPOSIT_iBGT_VAULT + GALXE + CUBQUEST;

  if(totalPoints > 0) {
    const holderPhase1 = {
      holderAddress: holderAddress,
      DEPOSIT_NECT_VAULT: DEPOSIT_NECT_VAULT,
      DEPOSIT_iBGT_VAULT: DEPOSIT_iBGT_VAULT,
      GALXE: GALXE,
      CUBQUEST: CUBQUEST,
      HOLD_GENESIS_NFT: HOLD_GENESIS_NFT,
      HOLD_BERAC_POL_NFT: HOLD_BERAC_POL_NFT,
      HOLD_BERAC_POL_2_NFT: HOLD_BERAC_POL_2_NFT,
      STAKE_DIRAC_Phase_2: STAKE_DIRAC_Phase_2,
      Stake_LP_KODIAK: Stake_LP_KODIAK,
      STAKE_INFRARED: STAKE_INFRARED,
      STAKE_BGT_STATION: STAKE_BGT_STATION,
      TOTAL_POINTS: totalPoints
    };
  
    HOLDER_ADDRESSES_PHASE_2.push(holderPhase1);
  }
}

const fields = [
  "holderAddress",
  "DEPOSIT_NECT_VAULT",
  "DEPOSIT_iBGT_VAULT",
  "GALXE",
  "CUBQUEST",
  "HOLD_GENESIS_NFT",
  "HOLD_BERAC_POL_NFT",
  "HOLD_BERAC_POL_2_NFT",
  "STAKE_DIRAC_Phase_2",
  "Stake_LP_KODIAK",
  "STAKE_INFRARED",
  "STAKE_BGT_STATION",
  "TOTAL_POINTS",
];

const json2csvParser = new Parser({ fields });
const csv = json2csvParser.parse(HOLDER_ADDRESSES_PHASE_2);

fs.writeFileSync("holder_addresses_phase_2.csv", csv);

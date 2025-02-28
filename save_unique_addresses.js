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

const LEADERBOARD = require("./data/leaderboard.json");

// TODO: get all HolderAddresses from all files and stock them in an array
const HOLDER_ADDRESSES = [
  ...BERAC_NFT.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...BERAC_POL.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...BERAC_POL2.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...GENESIS_HOLDERS.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...DIRAC_VAULT.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...DIRAC_HONEY_LP_Holders.map((item) =>
    item.HolderAddress?.toLocaleLowerCase()
  ),
  ...HONEY_VAULT_BERPS.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...I_BGT_VAULT.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...NECT_VAULT.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...BEND_VAULT.map((item) => item.HolderAddress?.toLocaleLowerCase()),
  ...Stake_DIRAC_HONEY_LP_KODIAK.map((item) =>
    item.HolderAddress?.toLocaleLowerCase()
  ),
  ...LEADERBOARD.map((item) => item.HolderAddress?.toLocaleLowerCase()),
];

// TODO: Remove duplicates from HOLDER_ADDRESSES
const UNIQUE_HOLDER_ADDRESSES = [...new Set(HOLDER_ADDRESSES)];

// TODO: save the unique holder addresses in a file called unique_holder_addresses.json

fs.writeFileSync(
  "./data/unique_holder_addresses.json",
  JSON.stringify(UNIQUE_HOLDER_ADDRESSES, null, 2)
);

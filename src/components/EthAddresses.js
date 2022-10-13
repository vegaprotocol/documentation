import React from "react";
import mainnetContracts from "../../specs/mainnet_contracts.json";
import testnetContracts from "../../specs/testnet_contracts.json";

const etherscanBase = {
  ropsten: "https://ropsten.etherscan.io/address/",
  sepolia: "https://sepolia.etherscan.io/address/",
  mainnet: "https://etherscan.io/address/",
};

// Budget version of frontend-monorepo's EtherscanLink
function etherscanLink(contractAddress, network) {
  const base = etherscanBase[network.toLowerCase()];
  if (!base) {
    throw new Error("Unknown base address");
  }

  return (
    <a href={`${base}${contractAddress}`} target="_blank" rel="noreferrer">
      🔍
    </a>
  );
}

const contractNames = {
  MultisigControl: "Multisig Control",
  ERC20AssetPool: "ERC20 Asset pool", 
  VegaToken: "Vega token",
  VestingBridge: "Token vesting",
  StakingBridge: "Staking bridge",
  ERC20Bridge: "ERC20 Bridge",
};

const showOnlyDefault = [
  "VegaToken",
  "VestingBridge",
  "StakingBridge",
  "ERC20Bridge",
];

/**
 * Display ETH addresses without having to hardcode them
 *
 * @param show String[] Show a subset of showOnly
 * @param frontMatter Object The frontmatter of the page. Should contain vega_network and ethereum_network
 * @returns
 */
export default function EthAddresses({ frontMatter, show }) {
  const { vega_network } = frontMatter;
  let showOnly = show ? show : showOnlyDefault;

  if (!vega_network) {
    throw new Error("Missing vega_network");
  }

  const addresses = vega_network.toLowerCase() === 'mainnet' ? mainnetContracts : testnetContracts
  const ethereum_network = addresses.network

  if (!addresses) {
    throw new Error("Could not load addresses");
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Ethereum network</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(addresses)
          .filter(
            (key) => {
              return showOnly.indexOf(key) !== -1
            }
          )
          .map((key) => {
            return (
              <tr>
                <td>
                  <strong>{contractNames[key]}</strong>
                </td>
                <td>
                  <code>{addresses[key].address}</code>{" "}
                  {etherscanLink(addresses[key].address, ethereum_network)}
                </td>
                <td align="center">{ethereum_network}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

import React from "react";
import mainnetContracts from "../../specs/mainnet_contracts.json";
import testnetContracts from "../../specs/testnet_contracts.json";

const etherscanBase = {
  "11155111": "https://sepolia.etherscan.io/address/",
  "1": "https://etherscan.io/address/",
  "42161": "https://arbiscan.io/address/",
  "421614": "https://sepolia.arbiscan.io/address/",
};

const networkName = {
  "11155111": "Ethereum (Sepolia)",
  "1": "Ethereum",
  "42161": "Arbitrum",
  "421614": "Arbitrum (Sepolia)"
}

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
  ERC20Bridge: "Ethereum ERC20 Bridge",
  ArbitrumMultisigControl: "Arbitrum Multisig Control",
  ArbitrumBridge: "Arbitrum Bridge",
};

const showOnlyDefault = [
  "VegaToken",
  "VestingBridge",
  "StakingBridge",
  "ERC20Bridge",
  "ArbitrumBridge"
];

/**
 * Display ETH addresses without having to hardcode them
 *
 * @param show String[] Show a subset of showOnly
 * @param frontMatter Object The frontmatter of the page. Should contain vega_network
 * @returns
 */
export default function EthAddresses({ frontMatter, show }) {
  const { vega_network } = frontMatter;
  let showOnly = show ? show : showOnlyDefault;

  if (!vega_network) {
    throw new Error("Missing vega_network");
  }

  const addresses = vega_network.toLowerCase() === 'mainnet' ? mainnetContracts : testnetContracts

  if (!addresses) {
    throw new Error("Could not load addresses");
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Network</th>
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
            const contract = addresses[key]
            return (
              <tr>
                <td>
                  <strong>{contractNames[key]}</strong>
                </td>
                <td>
                  <code>{contract.address}</code>{" "}
                  {etherscanLink(contract.address, contract.chainId)}
                </td>
                <td align="center">{networkName[contract.chainId]}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

import React from "react";
import { EnvironmentConfig } from "@vegaprotocol/smart-contracts-sdk";

const etherscanBase = {
  Ropsten: "https://ropsten.etherscan.io/address/",
  Mainnet: "https://etherscan.io/address/",
};

// Budget version of frontend-monorepo's EtherscanLink
function etherscanLink(contractAddress, network) {
  const base = etherscanBase[network];
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
  vegaTokenAddress: "Vega token",
  claimAddress: "Token claim addres",
  lockedAddress: "Locked token proxy",
  vestingAddress: "Token vesting",
  stakingBridge: "Staking bridge",
  erc20Bridge: "ERC20 Bridge",
};

const showOnlyDefault = [
  "vegaTokenAddress",
  "vestingAddress",
  "stakingBridge",
  "erc20Bridge",
];

/**
 * Display ETH addresses without having to hardcode them
 *
 * @param show String[] Show a subset of showOnly
 * @param frontMatter Object The frontmatter of the page. Should contain vega_network and ethereum_network
 * @returns
 */
export default function EthAddresses({ frontMatter, show }) {
  const { vega_network, ethereum_network } = frontMatter;
  let showOnly = show ? show : showOnlyDefault;

  if (!vega_network || !ethereum_network) {
    throw new Error("Missing vega_network or ethereum_network");
  }

  const addresses = EnvironmentConfig[vega_network];
  if (!addresses) {
    throw new Error("Missing vega_network or ethereum_network");
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
            (key) => addresses[key].length > 8 && showOnly.indexOf(key) !== -1
          )
          .map((key) => {
            return (
              <tr>
                <td>
                  <strong>{contractNames[key]}</strong>
                </td>
                <td>
                  <code>{addresses[key]}</code>{" "}
                  {etherscanLink(addresses[key], ethereum_network)}
                </td>
                <td align="center">{ethereum_network}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

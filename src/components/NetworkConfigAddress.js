import React from "react";
import { specs } from "../../package.json";

/**
 * Display ETH addresses without having to hardcode them
 *
 * @param show String[] Show a subset of showOnly
 * @param frontMatter Object The frontmatter of the page. Should contain vega_network and ethereum_network
 * @returns
 */
export default function NetworkConfigAddress({ label, network, frontMatter }) {
  const { vega_network } = frontMatter;
  let useNetwork

  if (!vega_network && !network) {
    throw new Error("Missing vega_network");
  } else {
    if (vega_network) {
        useNetwork = vega_network
    } else if (network) {
        useNetwork = network
    }
  } 


  const isMainnet = useNetwork.toLowerCase() === 'mainnet'  

  const address = isMainnet ? specs.networks.mainnet1 : specs.networks.fairground

  if (!address) {
    throw new Error("Could not load addresses");
  }

  let displayLabel = label ? label : address

  return (
    <a href={address} className="external">{displayLabel}</a>
  );
}

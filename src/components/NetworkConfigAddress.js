import React from "react";
import { specs } from "../../package.json";

/**
 * Display ETH addresses without having to hardcode them
 *
 * @param show String[] Show a subset of showOnly
 * @param frontMatter Object The frontmatter of the page. Should contain vega_network and ethereum_network
 * @returns
 */
export function NetworkConfigAddress({ label, network, frontMatter }) {
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



  const address = NetworkConfigAddressText(useNetwork)

  if (!address) {
    throw new Error("Could not load addresses");
  }

  let displayLabel = label ? label : address

  return (
    <a href={address} className="external">{displayLabel}</a>
  );
}

/**
 * Produces the plain text version of the URL
 * 
 * @param {String} vega_network 
 * @returns string Address of the config
 */
export function NetworkConfigAddressText(vega_network) {
  const ismainnet = vega_network.toLowerCase() === 'mainnet'  
  return ismainnet ? specs.networks.mainnet1 : specs.networks.fairground
}

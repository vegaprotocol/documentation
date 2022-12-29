import React from "react";
import mainnetNetworkParameters from "../../../specs/mainnet_network_parameters.json";
import testnetNetworkParameters from "../../../specs/testnet_network_parameters.json";

// Prevent two components on the same page triggering a load
let loadingMutex = false;

// Where to link to if the user clicks on the component
const networkApiUrl = {
	TESTNET: "https://api.testnet.vega.xyz/api/v2/network/parameters",
	MAINNET: "https://api.token.vega.xyz/network/parameters",
};

// Context contains all network parameters
export const networkParameters = {
	TESTNET: {
		buildTime: restructureData(testnetNetworkParameters),
		latest: undefined,
	},
	MAINNET: {
		buildTime: restructureData(mainnetNetworkParameters),
		latest: undefined,
	},
};

/**
 * Reformat the array of [{ key: 'networkParamterName', value: 'value'}]
 * into { networkParameterName: value }
 * @param {Object} apiResponse
 * @returns {Object}
 */
export function restructureData(apiResponse) {
	if (!apiResponse || !apiResponse.networkParameters) {
		throw new Error(`No network parameters in ${apiResponse}`);
	}

	const dict = {};
	if (apiResponse.networkParameters.edges) {
		apiResponse.networkParameters.edges.forEach(a => {
			dict[a.node["key"]] = a.node["value"];
		});
	} else {
		apiResponse.networkParameters.forEach((a) => {
			dict[a["key"]] = a["value"];
		});
	}
	return dict;
}

/**
 * Fetches latest values from the network
 *
 * @param {String} network
 * @returns
 */
export async function fetchData(network) {
	if (!networkParameters[network]) {
		throw new Error(`Unknown network: ${network}`);
	}

	const latest = networkParameters[network].latest;

	// If we've already loaded in live results, just use them
	if (latest) {
		return latest;
	} else {
		// We need to load live results. But only once, and not multiple times
		// before the first load finished
		if (loadingMutex === false) {
			loadingMutex = true;

			try {
				// Fetch all data
				const response = await fetch(networkApiUrl[network]);
				const allParams = await response.json();
				// Reformat the data in to { parameter: value }
				const structuredParams = restructureData(allParams);

				// Update the context
				networkParameters[network].latest = structuredParams;
				loadingMutex = false;
			} catch (e) {
				// Silently fail, but don't prevent a retry
				// Will cause the component to render with build time values
				loadingMutex = false;
			}
		}
	}
}

export const NetworkParameterContext = React.createContext(networkParameters);

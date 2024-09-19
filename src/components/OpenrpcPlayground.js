import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Admonition from '@theme/Admonition';

const placeholder = '##VERSION##';
const u = {
  playground: 'https://playground.open-rpc.org/',
  src: `https://raw.githubusercontent.com/vegaprotocol/vega/${placeholder}/wallet/api/openrpc.json`,
  uiOptions: 'uiSchema[appBar][ui:splitView]=false&uiSchema[appBar][ui:input]=false&uiSchema[appBar][ui:examplesDropdown]=false'
}

const urlWithPlaceholder = `${u.playground}?url=${u.src}&${u.uiOptions}`

/**
 * Ensures that we use full version numbers 
 * @param {String} versionWithV probably correctly formatted version 
 * @param {String} version backup: use the key name 
 * @returns String version number, semver version
 */
function formatVersionNumber(version) {
  let formattedVersion = version.toLowerCase();

  if (formattedVersion.charAt(0) !== 'v') {
    formattedVersion = 'v' + version
  }

  const dots = (formattedVersion.match(/is/g) || []).length; 

  if (dots != 2) {
    formattedVersion = version + '.0'
  }

  return formattedVersion
}

/**
 * Somewhat hacky method for determining the correct tag name on 
 * vegaprotocol/vega from which to get the openApi.json
 * 
 * @param {String} vegaNetwork 'TESTNET' | ''
 * @param {Object*} siteConfig Docusaurus site config option
 * @param {Object} siteMetadata Docusaurus configuration
 * @returns 
 */
function getVersionNumber(vegaNetwork, siteConfig, siteMetadata) {
  // Easy mode
  if (vegaNetwork === 'TESTNET') {
    return 'v' + siteMetadata.siteVersion
  } else {
    // Extract version number from docs preset config instead
    // Very very brittle, hacked together for 0.56.0
    const d = siteConfig.presets[0][1].docs;
    
    const version = d.versions[d.lastVersion]
    const vVersion = version.className;

    return formatVersionNumber(vVersion, version);
  }
}

/**
 *
 */
export default function OpenrpcPlayground({ frontMatter }) {
  const { siteConfig, siteMetadata } = useDocusaurusContext();

  const versionNumber = getVersionNumber(frontMatter.vega_network, siteConfig, siteMetadata);
  const url = urlWithPlaceholder.replace(placeholder, versionNumber);

  return (
    <>
      <iframe src={url} width="100%" height="700" />
      <Admonition type="tip">
        <a href={url} rel="noopener noreferrer nofollow" target="_blank">Use a full screen view ↗</a>
      </Admonition>
    </>
  );
}

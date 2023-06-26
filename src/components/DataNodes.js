import React from "react";
import mainnetNodes from "../../specs/mainnet_network.json";
import mainnetNodesVaguer from "../../specs/mainnet_vaguer.json";
import mainnetNodesVaguerTimestamp from "../../specs/mainnet_vaguer_timestamp.json";
import testnetNodes from "../../specs/testnet_network.json";
import testnetNodesVaguer from "../../specs/testnet_vaguer.json";
import testnetNodesVaguerTimestamp from "../../specs/testnet_vaguer_timestamp.json";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function getVaguerResultForName(name, vaguerResult) {
   return vaguerResult.find(v => v.host === name || v.host.indexOf(name) !== -1) 
}

function getHostname(url) {
    var match = url.replace('http://','').replace('https://','').match(/^(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    if (match && match.length > 2) {
        const host = match[2]

        // Some special cases
        return host.replace('.vega.community', '').replace('grpc.', '')
    }
    return url
}

function vaguerList(listOfNodes, vaguerResult) {
    const list = listOfNodes.map(host => {
        const name = getHostname(host)
        const res = getVaguerResultForName(name, vaguerResult)
        const good = (res && res['🥇'] === '🥇' ? true : false) 
        const https = (res && res['https'] === '✓' ? true : false) 
        return Object.assign({}, {
            name: name.replace('.vega.xyz', ''),
            host,
            https,
            good 
        })
    })

    const alphabetical = (a, b) => (a.name > b.name) ? 1 : -1

    const goodList = list.filter(n => n.good === true)
    const badList = list.filter(n => n.good === false)

    return [...goodList.sort(alphabetical), ...badList.sort(alphabetical)]
}

function TableForNodes(listOfNodes, vaguerResult, type) {
    const listOfNodesPlusVaguer = vaguerList(listOfNodes, vaguerResult)

    return (<table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Connectivity</th>
          { type !== 'grpc' ? <th>SSL</th> : null }
        </tr>
      </thead>
      <tbody>
        {listOfNodesPlusVaguer
            .map(n => {
              let https = n.https === true ? '🔐' : ''
              if (https === '') {
                if (n.host.indexOf('https://') !== -1) {
                  https = '🔒'
                }
              }

              return (
                <tr>
                    <td>
                        <code>{n.host}</code>
                    </td>
                    <td align="center">{n.good === true ? '⭐' : ''}</td>
                    {type !== 'grpc' ? <td align="center">{https}</td> : null}
                </tr>
                );
            })}
      </tbody>
    </table>)
}

/**
 * Display ETH addresses without having to hardcode them
 *
 * @param show String[] Show a subset of showOnly
 * @param frontMatter Object The frontmatter of the page. Should contain vega_network and ethereum_network
 * @returns
 */
export default function DataNodes({ frontMatter }) {
  const { vega_network } = frontMatter;

  if (!vega_network) {
    throw new Error("Missing vega_network");
  }

  const isMainnet = vega_network.toLowerCase() === 'mainnet'  

  const addresses = isMainnet ? mainnetNodes.API : testnetNodes.API
  const vaguer = isMainnet ? mainnetNodesVaguer : testnetNodesVaguer
  const source = isMainnet ? 'https://github.com/vegaprotocol/networks' : 'https://github.com/vegaprotocol/networks-internal'
  const d = isMainnet ? mainnetNodesVaguerTimestamp : testnetNodesVaguerTimestamp 
  if (!addresses) {
    throw new Error("Could not load addresses");
  }

  return (
    <div className="DataNodeList">
        <Tabs>
            <TabItem value="rest" label="REST">{TableForNodes(addresses.REST.Hosts, vaguer, 'rest')}</TabItem>
            <TabItem value="grpc" label="gRPC">{TableForNodes(addresses.GRPC.Hosts, vaguer, 'grpc')}</TabItem>
            <TabItem value="graphql" label="GraphQL">{TableForNodes(addresses.GraphQL.Hosts, vaguer, 'graphql')}</TabItem>
        </Tabs>
        <p style={{fontSize: "0.7em", marginTop: '0'}}><strong>Source:</strong> <a href={source} className="external" target="_blank" rel="noopener nofollow">{source.replace('https://', '')}</a><br />
        <strong>Last refreshed:</strong> <em>{d.date}</em></p>
    </div>
    );
}

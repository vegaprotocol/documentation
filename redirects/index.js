// https: //github.com/vegaprotocol/documentation/blob/main/netlify.toml
function handler(event) {
    var request = event.request;
    var host = request.headers.host.value;
    var uri = request.uri;
    var newHost = null;
    var newUrl = null;
    switch (host) {
        case "docs.testnet.vega.xyz":
        case "docs.fairground.vega.xyz":
            newHost = "docs.vega.xyz";
            break;
        case "docs-test2.vega.xyz":
            newHost = "docs-test.vega.xyz";
            break;
        case "docs-redirects2.vega.xyz":
            newHost = "docs-redirects.vega.xyz";
            break;

    }
    var newUri = uri
        .replace('/docs/testnet/grpc', '/testnet/api/grpc')
        .replace('/docs/mainnet/grpc', '/mainnet/api/grpc')
        .replace('/docs/testnet/graphql', '/testnet/api/graphql')
        .replace('/docs/mainnet/graphql', '/mainnet/api/graphql')
        .replace('/docs', '')
        .replace('/testnet/api/vega-wallet/v2-api/get-started', '/testnet/api/vega-wallet/accessing-api')
        .replace('/testnet/api/vega-wallet/v2-api', '/testnet/category/api/wallet-api')
        .replace('/testnet/api/vega-wallet/v2-api/integrate-wallet-service', '/testnet/api/vega-wallet/how-to/bootstrap-local-service')
        .replace('/testnet/api/vega-wallet/v2-api/openrpc', '/testnet/api/vega-wallet/reference/core/json-rpc')
        .replace('/testnet/api/vega-wallet/reference/core/openrpc', '/testnet/api/vega-wallet/reference/core/json-rpc')
        .replace('/testnet/concepts/vega-protocol', '/testnet/concepts/governance')
        .replace('/mainnet/concepts/vega-protocol', '/mainnet/concepts/governance');
    if (newHost) {
        newUrl = `https://${newHost}${newUri}`
        var response = {
            statusCode: 302,
            statusDescription: 'Found',
            headers: { "location": { "value": newUrl } }
        }
        return response;
    } else if (newUri != uri) {
        newUrl = `https://${host}${newUri}`
        var response = {
            statusCode: 301,
            statusDescription: 'Found',
            headers: { "location": { "value": newUrl } }
        }
        return response;
    } else {
        return request;
    }
}
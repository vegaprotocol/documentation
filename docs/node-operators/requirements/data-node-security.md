---
sidebar_position: 3
title: Running a secure data-node
sidebar_label: Data node security
hide_title: false
---

As the node operator, you must provide the TLS to the APIs exposed to the internet to provide secure communication between people and your server. You have a few options to do it:

- The data node has an internal mechanism to provide the TLS and auto-request for the certificate.
- A proxy service like `nginx` or `caddy` if you wish to pass requests with some DMZ.

Before We start, let's discuss the APIs exposed with the data node. The data node exposes 3 APIs with two separate ports:

- GRPC port - default value is `3007` - the GRPC API
- Gateway port - default value is `3008` - the GraphQL and the REST APIs.

You should expose both GRPC and Gateway with a TLS. However, the data node's internal mechanism allows you to expose with TLS only the gateway port.

## Use internal data node's mechanism to expose Gateway (GraphQL and REST APIs) with TLS

Assumptions:

- You have got configured and running or ready to start data node service.
- You have the spare domain pointing to your server.
- You have free 443 port on your server where the data node is running.


## Use nginx as proxy service

Assumptions

- You have got `nginx` >= `1.13` to use the `grpc_proxy` feature.
- You have got `certbot` with the nginx extension


### Example config

```nginx
server {
    server_name grpc.vega.mainnet.community;

    location / {
        grpc_pass grpc://10.8.0.202:3007;

    }
    
    listen 80 http2;
}

server {
    server_name vega.mainnet.community;

    location / {
        proxy_pass http://10.8.0.202:3008;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    listen 80; # managed by Certbot
}
```


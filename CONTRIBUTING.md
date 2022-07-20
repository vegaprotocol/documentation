# Making changes
You can make changes through the GitHub web UI, or if you have a more complex set of changes you can clone the repository, make your changes locally and create a pull request. Whenever a pull request is submitted, a deploy preview will be built to demonstrate your changes.

Anyone is welcome to create a Pull Request. If you're looking to help out, check out the [Issues list](https://github.com/vegaprotocol/documentation/issues) and ensure there isn't an existing [Pull Request](https://github.com/vegaprotocol/documentation/pulls) for the issue.

## Current process
1. All changes must be be made in a branch, and proposed via a pull request.
2. The reviewer will check the changes, check the deploy preview and approve or request changes
3. Finally changes are merged

## Editing on GitHub
You can fork the repository and edit your own copy, or propose changes via the GitHub UI. When you are finished and create a Pull Request, a Netlify Deploy Preview will be built and linked. This can be used to review your changes.

## Local development
The [Docusaurus installation guide](https://docusaurus.io/docs/installation) covers the  software requirements for Docusaurus itself. The following guide walks you through getting the Vega documentation served locally.

### Requirements

The best way to get the correct version of node is using the `nvm` utility which can be installed from these instructions:

`https://github.com/nvm-sh/nvm#installing-and-updating`

Once nvm is installed (check with `nvm --version`) you can run the following command from inside the root of the documentation folder to download and install the correct version of node required by the script:

```
> nvm install
> npm --version
```

`Yarn` can be install by running:

```
> npm install -g yarn
> yarn --version
```

The libraries needed by yarn can be installed by:

```
> yarn install
```

If you are regenerating the API documentation, you need to have Python3 installed. You can check if you have by running:

```
> python3 --version
```


### Clone, setup and run the server
```bash
git clone git@github.com:vegaprotocol/documentation.git
cd documentation
nvm install
yarn install
yarn run serve
```

### Regenerating the API documentation
Edit `scripts/build.sh` and update `grpc_doc_branch` and `graphql_doc_branch` to a new branch/tag as necessary.

```bash
cd documentation
./scripts/build.sh
```

### Running locally

```console
yarn serve
```

### Production build locally

```console
yarn build
```

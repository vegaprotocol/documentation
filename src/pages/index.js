import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";
import Link from "@docusaurus/Link";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { usePluginData } from "@docusaurus/useGlobalData";
import { FeatureList, Column, Feature } from "../components/FeatureList";
function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const versions = usePluginData("docusaurus-plugin-content-docs");
  const isBrowser = useIsBrowser();
  const base = isBrowser ? getBaseUrl(versions) : "mainnet";

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <Link className="cta" href={`${base}/concepts/new-to-vega`}>
          New to Vega?
        </Link>
      </div>
    </header>
  );
}

// This feels hacky - but Link doesn't appear to prefix version on the hompage
// presumably because it's not served by Docs
const DEFAULT = "mainnet";

// Given an array of versions, and a selected version (see below), return the
// appropriate base path for the version
function getSelectedBase(versions, selectedVersion) {
  if (!selectedVersion) {
    return DEFAULT;
  }

  const chosenVersion = versions.find((ver) => ver.name === selectedVersion);
  if (!chosenVersion) {
    return DEFAULT;
  }

  return chosenVersion.path;
}

// Detect if the user has selected a version, gather plugin information together
// and select a base url for homepage links
function getBaseUrl(versions) {
  if (!window || !window.localStorage || !versions || !versions.versions) {
    return DEFAULT;
  }

  const v =
    window.localStorage.getItem("docs-preferred-version-default") || DEFAULT;

  return getSelectedBase(versions.versions, v);
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const versions = usePluginData("docusaurus-plugin-content-docs");
  const isBrowser = useIsBrowser();
  const base = isBrowser ? getBaseUrl(versions) : "mainnet";

  return (
    <Layout description={`${siteConfig.tagline}`}>
    <HomepageHeader />
      <main>
        <section style={{ marginTop: "20px"}}>
        <FeatureList>
          <Column title="Get to know the protocol">
            <Feature
              url="/testnet/concepts/vega-chain"
              title="Vega Blockchain"
              subtitle="How the Vega PoS chain works"
              image="chain.png"
            />
            <Feature
              url="/testnet/concepts/governance"
              title="Governance"
              subtitle="Make your voice heard, take part in governance."
              image="governance.png"
            />
          </Column>
          <Column title="Use Vega">
            <Feature
              url="https://console.vega.xyz"
              title="Trade on Console"
              subtitle="Console is a trading interface for Vega"
              image="console.png"
            />
            <Feature
              url="/testnet/tools"
              title="Apps"
              subtitle="Browse wallet apps and other tools for Vega"
              image="apps.png"
            />
          </Column>
          <Column title="Set up a node">
            <Feature
              url="/testnet/node-operators/"
              title="Run a validator node"
              subtitle="Support running the network by becoming a validator"
              image="run-node.png"
            />
            <Feature
              url="/testnet/node-operators#get-started-with-a-data-node"
              title="Start up a data node"
              subtitle="Get direct access to network and trading data with your own data node."
              image="data-node.png"
            />
          </Column>
        </FeatureList>
        </section>
        <hr />
        <section id="spotlight">
          <h2>Spotlight</h2>
          <Link to={`${base}/node-operators`} className="card cardContainer">
            <h3 className="cardTitle">Node operators: Overview</h3>
            <p className="cardDescription">
              Get guidance on how to maintain and upgrade a node.
            </p>
          </Link>
          <Link to={`${base}/releases/overview`} className="card cardContainer">
            <h3 className="cardTitle">Release summaries</h3>
            <p className="cardDescription">
              See the latest features and get ahead of breaking changes.
            </p>
          </Link>
          <Link
            to={`${base}/tools/vega-wallet/desktop-app`}
            className="card cardContainer"
          >
            <h3 className="cardTitle">Vega Wallet</h3>
            <p className="cardDescription">
              Step-by-step instructions to set up your Vega Wallet using the
              desktop app.
            </p>
          </Link>
        </section>
      </main>
    </Layout>
  );
}

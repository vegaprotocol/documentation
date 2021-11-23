import React from "react";
import clsx from "clsx";
import styles from "./HomepageFeatures.module.css";

const FeatureList = [
  {
    title: "Vega concepts",
    description: (
      <>
        Vega's restricted mainnet is a decentralised network run by a set of validators. Find out about the underlying framework under <a href="/docs/concepts/new-to-vega">concepts</a>. 
      </>
    ), 
  },
  {
    title: "APIs",
    description: (
      <>
        Vega provides GraphQL, gRPC and REST APIs to programmatically interact with the protocol. Find the documentation under <a href="/docs/api/overview">API</a>. 
      </>
    ),
  },
  {
    title: "Tools for using Vega",
    description: (
      <>
        Vega has a number of tools available for interacting with the functionality the protocol provides. See the tools available for restricted mainnet under <a href="/docs/tools/overview">tools</a>.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

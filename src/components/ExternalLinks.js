import React from 'react';

export default function Highlight({children, href}) {
  return (
    <a
      href={href}
      target="_blank">
      {children} &#8599;
    </a>
  );
}
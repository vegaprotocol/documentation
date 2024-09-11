import React from 'react'

/**
 * Renders a network parameter and its value, fetching the value live
 * from the relevant network if possible, but using build time values
 * by default

 * @param {Object} props
 */
export default function NetworkParameter (props) {
  const name = props.name ? props.name : props.param

  return <span className='networkparameter networkparametername'>{name}</span>
}

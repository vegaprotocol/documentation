import Head from "@docusaurus/Head";
import React from "react";

const wrapper = {
  background: 'repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZUAAAGVAgMAAABLNYSoAAAADFBMVEUAAAAAAAAAAAAAAAA16TeWAAAAA3RSTlMAvr/b7un1AAADjUlEQVR42u3dQW7bMBCFYQM+gI+kq+cIPYoXXXRRgLEztp40b6QgIyOL5B+gBSGK/FgUDCVSZE73uIz/J8UYb0pcxke8PTOncU1ZI65EnMc4LWIuDgMD02Buf4KZC4hRVnlPVDqN8Wil3zxnwcDAtJkRBYyJrLnSYCLhXlzJCRgYmDaj+9SNlaWwK7q5YFQhDAzMYeaWcEYJr/QeGqQTk56hYWBgWsxQp43wbqzxOyJutnueEcXnVsLAwLSYXIVeVpVQUxyWVwzSai4MDEyTGdbVr8ryiSc1zlpwC8HP4jAwME1GMS1qVwF5DyZVWrQyrsDAwBxmpkVGPRIrVLsSvvKansVhYGB6TFwVoCE5EjbfdF1NV6Wymq5awzAwMH3GCkRdSqhjp/WbHOViDwwMzHFGV9KbbYLrrDzxFFd+KhMFYWC+l9EjtWDVrioUu99M/FTmXgsMzHcxNkgPTTz5m62WduzjCSsOAwPTYGwGSgWqLS7y0mgtWLUpYGBgGky5J21vz4zXXnvKgoGBaTAp/BP8lPDwrwlXO07/PK7AwMA0GO/8wUT4llE1RYlq7nidgIGBaTDpHXX4QqkSBeOfNJWnPMDAwDQYX4Dxj/807jpzC2Wpv6seGBiYLqOwjq0r9tZaZomx4jAwMF3Gv1qoj1NxxpdglYjiMDAwRxjVpY4doSt27FHa7L21V/wMAwPTZeaSvkvNK/Usb4FvRoWBgTnO2GLq5gmeOxPE/lMABgamz3zEZz8OfD02rqhNy5tVMwwMTJvx7aD1kUa++8XebL3zX2BgYNqMqtC4aw/B5fOxn6ISUe5tg4GBeQnjnd9LesJKRYUwMDBtZm9JxmCF7WSL9OZveYGBgfkyo6sKlfQV0/rgTtnxd1oQgoGBaTER5TO0wn89oTPlGA8DA9NlfO9ofZqYGDs8RczuKSowFTPFfxgMzAbzhXOLzqpITXHGZ4phSiYCBmaH8e93/dlXcFr5MaZc44GBgekziuKl99/2+o3PQAXjU1owML+M+fsKJqqwx+JIGCxGTfFWDv/9TDAwMA3GN8bUCzkamzdbsKoUBgamzdgM1O5IrBZ4m1JxP5UeBgbmRYx67+4MlLx0wEq5ogMDA9NkVNKO//us9rQoq6zFPwAGBqbHKNt+D4S/9G7PHSvK03hhYGBaTL1so7rqAVgjusMRMDAwr2L8XF1/dPb32J29bTAwMMeYd2dt2Xbv1REFAAAAAElFTkSuQmCC)',
  display: 'flex',
  flexGrow: '1'
}  

const messageContainer = {
  width: '100%',
  maxWidth: '41.25rem',
  margin: 'auto',
  border: '3px solid black',
  background: 'white',
  alignItems: 'self-end',
}

const windowWrapper = {
  background: 'white',
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  padding: ' 0.2rem 0.5rem',
  borderBottom: '3px solid black',
  margin: 'auto'
}

const textWrapper = {
  background: 'white',
  padding: '1.2rem 1.875rem',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  lineHeight: '1.3rem',
  margin: 'auto',
  maxWidth: '90%',
  fontFamily: 'AlphaLyrae'
}

const title = {
  fontFamily: 'AlphaLyrae',
  fontSize: '2rem'
}

export default function Home() {
  return (
    <div style={wrapper}>
      <Head>
        <title>Restricted | Vega Protocol Documentation</title>
        <link rel="stylesheet" href="https://static.vega.xyz/fonts.css" />
      </Head>
      <div style={messageContainer}>
        <div style={windowWrapper}>
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 18H0V21H3V18Z" fill="currentColor"></path>
            <path d="M6 15H3V18H6V15Z" fill="currentColor"></path>
            <path d="M9 12H6V15H9V12Z" fill="currentColor"></path>
            <path d="M12 9H9V12H12V9Z" fill="currentColor"></path>
            <path d="M15 6H12V9H15V6Z" fill="currentColor"></path>
            <path d="M18 3H15V6H18V3Z" fill="currentColor"></path>
            <path d="M21 0H18V3H21V0Z" fill="currentColor"></path>
            <path d="M18 18V21H21V18H18Z" fill="currentColor"></path>
            <path d="M15 15V18H18V15H15Z" fill="currentColor"></path>
            <path d="M12 12V15H15V12H12Z" fill="currentColor"></path>
            <path d="M6 6V9H9V6H6Z" fill="currentColor"></path>
            <path d="M3 3V6H6V3H3Z" fill="currentColor"></path>
            <path d="M0 0L0 3H3V0H0Z" fill="currentColor"></path>
          </svg>
        </div>
        <div style={textWrapper}>
          <h1 style={title}>451 Unavailable</h1>
          <p>
            Due to uncertainty about the legal and regulatory status of the content hosted on this site, it is not available to visitors in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}

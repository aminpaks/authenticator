import Head from 'next/head';
import {AppProps} from 'next/app';
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';
import {Favicon} from '../components/Favicon';

export default function App(props: AppProps) {
  const {Component, pageProps} = props;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <Favicon />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
        }}
      >
        <Notifications position="bottom-center" />
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}

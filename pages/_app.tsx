import {AppProps} from 'next/app';
import {MantineProvider} from '@mantine/core';
import {Notifications} from '@mantine/notifications';

export default function App(props: AppProps) {
  const {Component, pageProps} = props;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light',
      }}
    >
      <Notifications position="bottom-center" />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

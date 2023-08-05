import {ReactNode} from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {
  IoInformationSharp,
  IoLockOpen,
  IoQrCodeSharp,
  IoSettingsSharp,
} from 'react-icons/io5';
import {
  AppShell,
  Container,
  Divider,
  Flex,
  Header,
  NavLink,
  Navbar,
  Text,
  Title,
} from '@mantine/core';

type Props = {
  title?: string;
  children?: ReactNode;
};

export function Layout({children, title = ''}: Props) {
  return (
    <>
      <Head>
        <title>{`${title ? `${title} | ` : ''}Authenticator`}</title>
      </Head>
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{base: 220}} p="xs">
            <NavLink
              href="/"
              label="QRCode Decoder"
              icon={<IoQrCodeSharp />}
              component={Link}
            />
            <NavLink
              href="/otp-code"
              label="OTP Code Generator"
              icon={<IoSettingsSharp />}
              component={Link}
            />
            <NavLink
              href="/about"
              label="About"
              icon={<IoInformationSharp />}
              component={Link}
            />
          </Navbar>
        }
        header={
          <Header height={54} p="xs">
            <Flex gap="xs" align="center">
              <IoLockOpen />
              <Text fz="xl">Authenticator</Text>
            </Flex>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Container>
          <Title>{title}</Title>
          <Divider my="lg" />
          <div>{children}</div>
        </Container>
      </AppShell>
    </>
  );
}

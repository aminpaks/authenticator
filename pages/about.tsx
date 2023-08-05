import {Button, Flex, Text} from '@mantine/core';
import {Layout} from '../components/Layout';
import {VscGithub} from 'react-icons/vsc';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <Layout title="About">
      <Flex align="center" gap="md">
        <Text variant="gradient" fw={700}>
          Powered by Next.js & Vercel
        </Text>
        <div>
          <Button
            variant="subtle"
            component={Link}
            target="_blank"
            href="https://github.com/aminpaks/authenticator"
          >
            <Flex align="center" gap="xs">
              <VscGithub />
              <Text size="xs" inline>
                Source code
              </Text>
            </Flex>
          </Button>
        </div>
      </Flex>
    </Layout>
  );
}

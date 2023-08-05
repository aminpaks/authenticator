import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {
  Button,
  Center,
  CopyButton,
  Grid,
  Input,
  MantineSize,
  Progress,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {generateTOTP} from '../utils/token-generator';
import {IoClipboardOutline, IoCopyOutline} from 'react-icons/io5';

export function OtpCode() {
  const {push, query} = useRouter();
  const secret = (query.secret as string) || 'VRLKCO6EW7EC7DYV';
  const setSecret = (secret: string) => {
    push({query: {secret}});
  };

  const [state, setState] = useState<{
    token: string;
    nextToken: string;
    progress: number;
    nextIn: string;
  }>({
    token: '',
    nextToken: '',
    progress: 0.2,
    nextIn: '30',
  });

  useEffect(() => {
    let timeoutId: number;
    function tick() {
      setState(() => {
        const interval = (Date.now() / 1000) % 30;
        const progress = Number(((interval / 30) * 100).toFixed(1));
        const nextIn = String(Math.ceil(30 - interval));
        const token = generateTOTP({key: secret});
        const nextToken = generateTOTP({key: secret, now: Date.now() + 30_000});

        return {
          token,
          nextToken,
          progress,
          nextIn,
        };
      });
      timeoutId = window.setTimeout(tick, 50);
    }
    tick();
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [secret]);

  return (
    <Center>
      <Stack maw={340}>
        <TextInput
          label="Secret"
          type="text"
          value={secret}
          rightSection={
            <Tooltip withArrow label="Paste secret">
              <Button
                compact
                variant="subtle"
                onClick={() => {
                  navigator.clipboard.readText().then(setSecret);
                }}
              >
                <IoClipboardOutline />
              </Button>
            </Tooltip>
          }
          onChange={(event) => {
            setSecret(event.currentTarget.value);
          }}
        />
        <Grid columns={2} align="center">
          <Grid.Col span={1}>
            <Text>Current OTP code</Text>
          </Grid.Col>
          <Grid.Col span={1}>
            <Input
              readOnly
              value={state.token}
              rightSection={
                <CopyToken
                  label="Copy current OTP"
                  copiedMessage="Current OTP code copied!"
                  token={state.token}
                />
              }
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Text size="sm">Next OTP code</Text>
          </Grid.Col>
          <Grid.Col span={1}>
            <Input
              readOnly
              size="xs"
              value={state.nextToken}
              rightSection={
                <CopyToken
                  label="Copy next OTP"
                  copiedMessage="Next OTP code copied!"
                  token={state.nextToken}
                  buttonSize="xs"
                />
              }
            />
          </Grid.Col>
        </Grid>
        <Grid columns={4} align="center" gutter={0}>
          <Grid.Col span={1}>
            <Text size="xs" fw={700} variant="gradient">
              Next in {state.nextIn}s
            </Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <Progress striped size="md" value={state.progress} />
          </Grid.Col>
        </Grid>
      </Stack>
    </Center>
  );
}

function CopyToken({
  label,
  token,
  buttonSize,
  copiedMessage = 'Code copied!',
}: {
  label: string;
  token: string;
  buttonSize?: MantineSize;
  copiedMessage?: string;
}) {
  return (
    <CopyButton value={token}>
      {({copied, copy}) => (
        <Tooltip withArrow label={label}>
          <Button
            compact
            variant="subtle"
            size={buttonSize}
            color={copied ? 'teal' : 'blue'}
            onClick={() => {
              copy();
              notifications.show({
                message: copiedMessage,
              });
            }}
          >
            <IoCopyOutline />
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
}

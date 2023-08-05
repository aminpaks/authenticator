import Link from 'next/link';
import {useCallback, useState} from 'react';
import {
  Button,
  CopyButton,
  Divider,
  Flex,
  Group,
  Skeleton,
  Text,
  Tooltip,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {Dropzone, MIME_TYPES} from '@mantine/dropzone';
import {IoImagesSharp} from 'react-icons/io5';
import {notifications} from '@mantine/notifications';
import {OperationResult} from '../interfaces';

type StateItem =
  | {status: 'loading'; name: string; url: string}
  | {status: 'rejected'; name: string; url: string; reason: string}
  | {status: 'fulfilled'; name: string; url: string; value: string};

export function UploadImage() {
  const theme = useMantineTheme();
  const [state, setState] = useState<StateItem[]>([]);

  const handleFilesDrop = useCallback((acceptedFiles: File[]) => {
    const body = new FormData();
    setState(
      acceptedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        status: 'loading',
      }))
    );

    acceptedFiles.forEach((file) => {
      body.append('file', file, file.name);
    });

    async function upload() {
      const response = await fetch('/api/image', {
        method: 'POST',
        body,
      });
      const data = (await response.json()) as OperationResult<
        (OperationResult<string> & {name: string})[]
      >;
      if (data.status === 'fulfilled') {
        setState((state) => {
          const newState = state.map((item) => {
            const result = data.value.find(({name}) => item.name === name);
            return result
              ? ({
                  name: item.name,
                  url: item.url,
                  status: result.status,
                  ...(result.status === 'fulfilled'
                    ? {value: result.value}
                    : {
                        reason: result.reason || 'Error: Unknown!',
                      }),
                } as StateItem)
              : item;
          });
          return newState;
        });
      } else {
        notifications.show({
          title: 'Failed to process QRCodes!',
          message: data.reason || 'Unknown error',
        });
      }
    }
    upload();
  }, []);

  return (
    <div>
      <Dropzone
        onDrop={handleFilesDrop}
        onReject={(files) => {
          notifications.show({
            title: 'Files rejected!',
            message: `${files.length} files were rejected, only images are accepted`,
          });
        }}
        maxSize={500 * 1024}
        accept={[MIME_TYPES.png, MIME_TYPES.jpeg, MIME_TYPES.gif]}
      >
        <Group
          position="center"
          spacing="xl"
          style={{minHeight: rem(220), pointerEvents: 'none'}}
        >
          <Dropzone.Accept>
            <IoImagesSharp
              size="3.2rem"
              color={
                theme.colors[theme.primaryColor][
                  theme.colorScheme === 'dark' ? 4 : 6
                ]
              }
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IoImagesSharp
              size="3.2rem"
              color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IoImagesSharp size="3.2rem" />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag QRCode images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              Attach as many files as you like, total size should not exceed
              500kb
            </Text>
          </div>
        </Group>
      </Dropzone>
      {state.length > 0 && (
        <>
          <Divider my="md" variant="dashed" />
          <Flex gap="lg" direction="column">
            {state.map((item) => {
              return (
                <Flex key={item.name} gap="md" align="center">
                  <img width={100} alt="decoded QRCode secret" src={item.url} />
                  {item.status === 'loading' ? (
                    <div style={{width: 260}}>
                      <Flex gap="md" direction="column">
                        <Skeleton height={8} radius="xl" />
                        <Skeleton height={8} mt={2} radius="xl" />
                      </Flex>
                    </div>
                  ) : (
                    <Flex gap="xs" direction="column">
                      <div>
                        {item.status === 'fulfilled' ? (
                          <CopyButton value={item.value}>
                            {({copied, copy}) => (
                              <Tooltip withArrow label="Copy secret">
                                <Button
                                  size="xs"
                                  color={copied ? 'teal' : 'blue'}
                                  onClick={() => {
                                    notifications.show({
                                      message: 'Secret copied!',
                                    });
                                    copy();
                                  }}
                                >
                                  {item.value}
                                </Button>
                              </Tooltip>
                            )}
                          </CopyButton>
                        ) : (
                          <Text>{item.reason}</Text>
                        )}
                      </div>
                      {item.status === 'fulfilled' && (
                        <span>
                          <Button
                            size="xs"
                            href={`/otp-code?secret=${item.value}`}
                            component={Link}
                          >
                            Generate one-time-password code
                          </Button>
                        </span>
                      )}
                    </Flex>
                  )}
                </Flex>
              );
            })}
          </Flex>
        </>
      )}
    </div>
  );
}

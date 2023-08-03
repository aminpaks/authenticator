import Jimp from 'jimp';
import formidable, {File} from 'formidable';
import {Decoder} from '@nuintun/qrcode';
import {NextApiRequest, NextApiResponse} from 'next';
import {tryCatch} from '../../utils/try-catch';

const qrCode = new Decoder();

export const config = {
  api: {
    sizeLimit: '500kb',
    bodyParser: false,
  },
};

async function decodeQrCode(file: string) {
  const image = await Jimp.read(file);
  const opaque = new Jimp(
    image.getWidth(),
    image.getHeight(),
    0xffffffff
  ).composite(image, 0, 0);

  const {bitmap} = opaque;
  const {width, height} = bitmap;
  const result = tryCatch(() =>
    qrCode.decode(new Uint8ClampedArray(bitmap.data), width, height)
  );

  if (result.status === 'rejected' || !result.value?.data) {
    throw new Error('Failed to decode QRCode!');
  }

  const url = new URL(result.value.data);
  const params = new URLSearchParams(url.search);
  const secret = params.get('secret');

  if (!secret) {
    throw new Error('No secret found!');
  }

  return secret;
}

function createFileWithName(file: File, name: string) {
  return {file, name};
}

const parseRequest = async (req: NextApiRequest) => {
  const form = formidable({});
  const [_, {file: files}] = await form.parse(req);
  return Array.isArray(files)
    ? files.map((file) => createFileWithName(file, file.originalFilename))
    : [createFileWithName(files, files.originalFilename)];
};

async function decodeQrCodes(
  filepaths: string[]
): Promise<PromiseSettledResult<string>[]> {
  return Promise.allSettled(
    filepaths.map((filepath) => decodeQrCode(filepath))
  ).then((results) =>
    results.map((result) => {
      return result.status === 'fulfilled'
        ? result
        : {status: 'rejected', reason: String(result.reason)};
    })
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const images = await parseRequest(req);
    const secrets = await decodeQrCodes(
      images.map((image) => image.file.filepath)
    );
    const results = secrets.map((secret, index) => {
      const image = images[index];
      return {
        ...secret,
        name: image.name,
      };
    });
    return res.status(201).json({status: 'fulfilled', value: results});
  } catch (err) {
    console.error(err);
    return res.status(400).json({status: 'rejected', reason: null});
  }
}

import {Layout} from '../components/Layout';
import {UploadImage} from '../components/Upload';

export default function IndexPage() {
  return (
    <Layout title="QRCode Decoder">
      <UploadImage />
    </Layout>
  );
}

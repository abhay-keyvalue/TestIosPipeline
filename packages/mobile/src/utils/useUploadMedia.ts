import {showToast} from '@components/customToast';
import {S3_URL_DOMAIN_SUBSTRING, isIOS} from '@constants/general';
import axios from 'axios';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import RNFetchBlob from 'rn-fetch-blob';
import {Buffer} from 'buffer';
import {getMediaPreSignedUrl} from './common';

const useUploadMedia = () => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);

  const uploadMedia = async ({mediaName, mediaUrl, mediaType}) => {
    setLoading(true);
    const imageUploadOptions = {
      key: mediaName,
      mediaType
    };
    const mediaUploadData = await getMediaPreSignedUrl(imageUploadOptions);

    const isSuccess = await uploadToS3({
      signedUrl: mediaUploadData?.url,
      file: mediaUrl
    });

    setLoading(false);

    return isSuccess ? mediaUploadData : null;
  };

  const uploadToS3 = async ({signedUrl, file}) => {
    try {
      const imageBody = await convertToBase64(file);

      const data = Buffer.from(imageBody, 'base64');

      if (data) {
        const response = await axios.put(signedUrl, data);

        return response.config.url;
      }
    } catch (error) {
      showToast(t('failed_to_upload_file'), {type: 'error'});
    }
  };

  const convertToBase64 = async (filePath) => {
    let base64Data = '';
    let imagePath = isIOS ? filePath.replace('file:///', '') : filePath;

    if (filePath.includes(S3_URL_DOMAIN_SUBSTRING))
      await RNFetchBlob.config({
        fileCache: true
      })
        .fetch('GET', filePath)
        .then((resp) => {
          imagePath = isIOS ? resp.path() : `file://${resp.path()}`;
        })
        .catch(() => {
          showToast(t('failed_to_upload_file'), {type: 'error'});
        });

    await RNFetchBlob.fs
      .readFile(imagePath, 'base64')
      .then((data) => {
        base64Data = data;
      })
      .catch(() => {
        showToast(t('failed_to_upload_file'), {type: 'error'});
      });

    return base64Data;
  };

  return {loading, uploadMedia};
};

export default useUploadMedia;

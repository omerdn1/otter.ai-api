import axios from 'axios';
import rp from 'request-promise';
import { getCookieValueAndHeader, parseXml } from './utils';

const API_BASE_URL = 'https://otter.ai/forward/api/v1';
const AWS_S3_URL = 'https://s3.us-west-2.amazonaws.com';
const CSRF_COOKIE_NAME = 'csrftoken';

class OtterApi {
  constructor(options = {}) {
    this.options = options;
    this.user = {};
    this.csrfToken = '';
  }

  init = async () => {
    await this.#login();
  };

  #login = async () => {
    const { email, password } = this.options;

    if (!email || !password) {
      throw new Error(
        "Email and/or password were not given. Can't perform authentication to otter.ai",
      );
    }
    const csrfResponse = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/login_csrf`,
    });
    const {
      cookieValue: csrfToken,
      cookieHeader: csrfCookie,
    } = getCookieValueAndHeader(
      csrfResponse.headers['set-cookie'][0],
      CSRF_COOKIE_NAME,
    );

    const response = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/login`,
      params: {
        username: email,
      },
      headers: {
        authorization: `Basic ${Buffer.from(`${email}:${password}`).toString(
          'base64',
        )}`,
        'x-csrftoken': csrfToken,
        cookie: csrfCookie,
      },
      withCredentials: true,
    });

    const cookieHeader = `${response.headers['set-cookie'][0]}; ${response.headers['set-cookie'][1]}`;
    ({ cookieValue: this.csrfToken } = getCookieValueAndHeader(
      response.headers['set-cookie'][0],
      CSRF_COOKIE_NAME,
    ));

    this.user = response.data.user;

    axios.defaults.headers.common.cookie = cookieHeader;

    console.log('Successfuly logged in to Otter.ai');

    return response;
  };

  getSpeeches = async () => {
    const { data } = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/speeches`,
      params: {
        userid: this.user.id,
      },
    });

    return data.speeches;
  };

  getSpeech = async speech_id => {
    const { data } = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/speech`,
      params: {
        speech_id,
        userid: this.user.id,
      },
    });

    return data.speech;
  };

  speechSearch = async query => {
    const { data } = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/speech_search`,
      params: {
        query,
        userid: this.user.id,
      },
    });

    return data.hits;
  };

  validateUploadService = () =>
    axios({
      method: 'OPTIONS',
      url: `${AWS_S3_URL}/speech-upload-prod`,
      headers: {
        Accept: '*/*',
        'Access-Control-Request-Method': 'POST',
        Origin: 'https://otter.ai',
        Referer: 'https://otter.ai/',
      },
    });

  uploadSpeech = async file => {
    const uploadOptionsResponse = await axios({
      method: 'GET',
      url: `${API_BASE_URL}/speech_upload_params`,
      params: {
        userid: this.user.id,
      },
      headers: {
        Accept: '*/*',
        Connection: 'keep-alive',
        Origin: 'https://otter.ai',
        Referer: 'https://otter.ai/',
      },
    });

    delete uploadOptionsResponse.data.data.form_action;

    const xmlResponse = await rp({
      method: 'POST',
      uri: `${AWS_S3_URL}/speech-upload-prod`,
      formData: { ...uploadOptionsResponse.data.data, file },
    });

    const { Bucket, Key } = await parseXml(xmlResponse);

    const finishResponse = await axios({
      method: 'POST',
      url: `${API_BASE_URL}/finish_speech_upload`,
      params: {
        bucket: Bucket,
        key: Key,
        language: 'en',
        country: 'us',
        userid: this.user.id,
      },
      headers: {
        'x-csrftoken': this.csrfToken,
      },
    });

    return finishResponse.data;
  };
}

export default OtterApi;

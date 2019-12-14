import axios from 'axios';

const API_BASE_URL = 'https://otter.ai/forward/api/v1';

class OtterApi {
  constructor(options = {}) {
    this.options = options;
    this.user = {};
    this.#login();
  }

  #login = async () => {
    const { email, password } = this.options;

    if (!email || !password) {
      throw new Error(
        "Email and/or password were not given. Can't perform authentication",
      );
    }

    try {
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
          'x-csrftoken':
            'uGb1NitOx0k9BEhqMk2PKwui0fGytDCsvYz7kDs80LeIqBNW4d4oow8WSHJYkqlJ',
          cookie:
            'csrftoken=uGb1NitOx0k9BEhqMk2PKwui0fGytDCsvYz7kDs80LeIqBNW4d4oow8WSHJYkqlJ;',
        },
        withCredentials: true,
      });

      const cookieHeader = `${response.headers['set-cookie'][0]}; ${response.headers['set-cookie'][1]}`;

      this.user = response.data.user;

      axios.defaults.headers.common.cookie = cookieHeader;

      return response;
    } catch (err) {
      throw new Error(err);
    }
  };

  getSpeeches = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/speeches`,
        params: {
          userid: this.user.id,
        },
        withCredentials: true,
      });

      return data.speeches;
    } catch (err) {
      throw new Error(err);
    }
  };

  getSpeech = async (speech_id = '22NYPUVRU3LI2QHB') => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${API_BASE_URL}/speech`,
        params: {
          speech_id,
          userid: this.user.id,
        },
        withCredentials: true,
      });

      return data.speech;
    } catch (err) {
      throw new Error(err);
    }
  };
}

export default OtterApi;

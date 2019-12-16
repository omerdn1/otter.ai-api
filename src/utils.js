import { parseString } from 'xml2js';

const getCookieValueAndHeader = (cookieHeader, cookieName) => {
  const match = cookieHeader.match(new RegExp(`${cookieName}=(?<value>.*?);`));
  return { cookieValue: match[1], cookieHeader: match[0] };
};

const parseXml = xml => {
  return new Promise((resolve, reject) => {
    parseString(
      xml,
      { explicitArray: false, explicitRoot: false },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      },
    );
  });
};

export { getCookieValueAndHeader, parseXml };

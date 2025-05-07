import https from 'https';

export const fetchCountries = () => {
  return new Promise((resolve, reject) => {
    https.get('https://restcountries.com/v3.1/all', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', err => reject(err));
  });
};
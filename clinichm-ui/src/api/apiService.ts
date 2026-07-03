import config from './config';

export const apiService = (input: RequestInfo, init: RequestInit = {}) => {
  const apiKey = config.apikey.toString();

  const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey,
    ...(init.headers || {}),
  };

  return fetch(input, {
    ...init,
    headers,
  });
};

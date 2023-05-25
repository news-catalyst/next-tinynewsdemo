import http from 'http';
import https from 'https';
import fetch from 'node-fetch';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

export const getAgent = (url) =>
  new URL(url).protocol === 'http:' ? httpAgent : httpsAgent;

export const wait = async (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

// Add a timeout?
export const fetchWithRetry = async ({
  url,
  method,
  maxRetries = 2,
  headers,
  requestData,
}) => {
  let requestBody;
  let attempts = 0;
  let resultingJson;
  let errors = [];
  if (typeof requestData === 'string') {
    requestBody = requestData;
  } else {
    try {
      requestBody = JSON.stringify(requestData);
    } catch (error) {
      return { errors: [error] };
    }
  }
  while (attempts < maxRetries && resultingJson === undefined) {
    if (attempts > 0) {
      await wait(attempts * 1000);
    }
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: requestBody,
        agent: getAgent(url),
      });
      resultingJson = await response.json();
    } catch (error) {
      errors.push(error);
    }
    attempts++;
  }
  return resultingJson || { errors };
};

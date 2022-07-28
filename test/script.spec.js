import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '3s', target: 1 },
    { duration: '5s', target: 2 },
    { duration: '2s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://httpbin.test.k6.io/');
  check(res, {
    'is status 200': (r) => r.status === 200,
    'body size is 9,591 bytes': (r) => r.body.length == 9591,
    'verify homepage text': (r) =>
      r.body.includes('Send email to the developer'),
  });
  sleep(1);
}

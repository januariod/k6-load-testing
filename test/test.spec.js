import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
  };
}

export const options = {
  stages: [
    { duration: '5s', target: 10 },
    { duration: '10s', target: 20 },
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    // http errors should be less than 5%
    http_req_failed: ['rate < 0.05'],

    // 90% of requests must finish within 500ms, 95% within 1000, and 99.9% within 2s.
    http_req_duration: ['p(90) < 3000', 'p(95) < 6000', 'p(99.9) < 9000'],
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/1/');
  check(res, {
    'is status 200': (r) => r.status === 200,

    'body size is 9,591 bytes': (r) => r.body.length <= 10000,

    'verify homepage text': (r) =>
      r.body.includes('date_of_birth'),

    'max duration': (r) => r.timings.duration < 4000,
  });
}

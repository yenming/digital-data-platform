const request = require('supertest');
const app = require('../app');

describe('基本路由測試', () => {
  test('GET / 應該返回 200', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  test('GET /health 應該返回 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  test('GET /auth/login 應該返回 200', async () => {
    const response = await request(app).get('/auth/login');
    expect(response.status).toBe(200);
  });

  test('GET /auth/register 應該返回 200', async () => {
    const response = await request(app).get('/auth/register');
    expect(response.status).toBe(200);
  });

  test('GET /about 應該返回 200', async () => {
    const response = await request(app).get('/about');
    expect(response.status).toBe(200);
  });

  test('GET /contact 應該返回 200', async () => {
    const response = await request(app).get('/contact');
    expect(response.status).toBe(200);
  });
});

describe('404 錯誤測試', () => {
  test('GET /nonexistent 應該返回 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});

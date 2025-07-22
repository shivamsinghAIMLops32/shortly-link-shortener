import { registerUser, loginUser } from '../auth';

describe('Auth Actions', () => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'testpassword123';

  it('registers a new user', async () => {
    const res = await registerUser({ email: testEmail, password: testPassword });
    expect(res.success).toBe(true);
  });

  it('prevents duplicate registration', async () => {
    const res = await registerUser({ email: testEmail, password: testPassword });
    expect(res.error).toBe('User already exists');
  });

  it('validates input', async () => {
    const res = await registerUser({ email: 'bad', password: '123' });
    expect(res.error).toBe('Invalid input');
  });

  it('logs in with correct credentials', async () => {
    const res = await loginUser({ email: testEmail, password: testPassword });
    expect(res.success).toBe(true);
    expect(res.user.email).toBe(testEmail);
  });

  it('fails login with wrong password', async () => {
    const res = await loginUser({ email: testEmail, password: 'wrong' });
    expect(res.error).toBe('Invalid credentials');
  });
}); 
import { createLink, getUserLinks, deleteLink } from '../link';
import { registerUser, loginUser } from '../auth';

let userId: string;
let linkId: string;

beforeAll(async () => {
  const email = `linktest${Date.now()}@example.com`;
  const password = 'testpassword123';
  await registerUser({ email, password });
  const login = await loginUser({ email, password });
  userId = login.user.id;
});

describe('Link Actions', () => {
  it('creates a new link', async () => {
    const res = await createLink({ originalUrl: 'https://example.com', userId });
    expect(res.success).toBe(true);
    expect(res.link.originalUrl).toBe('https://example.com');
    linkId = res.link.id;
  });

  it('fetches user links', async () => {
    const links = await getUserLinks(userId);
    expect(Array.isArray(links)).toBe(true);
    expect(links.some(l => l.id === linkId)).toBe(true);
  });

  it('deletes a link', async () => {
    const res = await deleteLink(linkId, userId);
    expect(res.success).toBe(true);
  });
}); 
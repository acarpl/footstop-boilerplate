import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function decrypt(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { payload };
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return { payload: null };
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;
  
  if (!token) return null;
  
  try {
    const { payload } = await decrypt(token);
    return payload;
  } catch (error) {
    return null;
  }
}
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET); // Ambil dari env variable

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return { payload, expired: false };
  } catch (error) {
    // Jika token kadaluwarsa atau tidak valid, 'jose' akan melempar error
    console.log('Token verification failed', error);
    throw error; // Lempar kembali errornya untuk ditangkap di middleware
  }
}
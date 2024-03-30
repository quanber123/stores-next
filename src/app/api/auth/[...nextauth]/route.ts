import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
const endpoints = process.env.NEXT_PUBLIC_BACKEND_URL;
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        const res = await fetch(`${endpoints}api/auth/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await res.json();
        if (res.ok && user) {
          console.log(user);
          return user;
        }
        return null;
      },
    }),
  ],
};

export default NextAuth(authOptions);

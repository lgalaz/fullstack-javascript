import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import users from '../../../../data/users.json';

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        if (!credentials) return null;
        const match = users.find(
          (user) => user.name === credentials.name && user.password === credentials.password
        );
        if (!match) return null;
        return { id: String(match.id), name: match.name };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

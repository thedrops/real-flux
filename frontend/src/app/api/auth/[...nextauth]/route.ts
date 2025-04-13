import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

interface SignInResponse {
  id: number;
  email: string;
  accessToken: string;
}

interface ProfileResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais ausentes');
          throw new Error('Email e senha são obrigatórios');
        }

        try {
          console.log('Tentando login com:', credentials.email);
          console.log('API URL:', process.env.API_URL);
          console.log(`${process.env.API_URL || 'http://localhost:3333'}/auth/signin`)
          const signInResponse = await fetch(`${process.env.API_URL || 'http://localhost:3333'}/auth/signin`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log('Status do signin:', signInResponse.status);
          
          if (!signInResponse.ok) {
            const errorData = await signInResponse.text();
            console.error('Erro no signin:', errorData);
            throw new Error(errorData || 'Falha na autenticação');
          }

          const signInData: SignInResponse = await signInResponse.json();
          console.log('Login bem-sucedido, token obtido');

          const profileResponse = await fetch(`${process.env.API_URL || 'http://localhost:3333'}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${signInData.accessToken}`,
              'Accept': 'application/json'
            },
          });

          console.log('Status do profile:', profileResponse.status);

          if (!profileResponse.ok) {
            const errorData = await profileResponse.text();
            console.error('Erro ao buscar perfil:', errorData);
            throw new Error(errorData || 'Falha ao buscar perfil');
          }

          const profileData: ProfileResponse = await profileResponse.json();
          console.log('Perfil obtido com sucesso');

          return {
            id: String(profileData.id),
            email: profileData.email,
            name: profileData.name,
            accessToken: signInData.accessToken,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at
          };
        } catch (error) {
          console.error('Erro detalhado na autenticação:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      console.log('Token JWT:', token);
      console.log('User:', user);
      if (user) {
        token.id = String(user.id);
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.created_at = user.created_at;
        token.updated_at = user.updated_at;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      console.log('Session:', session);
      console.log('Token:', token);
      if (session.user) {
        session.user.id = String(token.id);
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.accessToken = token.accessToken;
        session.user.created_at = token.created_at;
        session.user.updated_at = token.updated_at;
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 1 dia
  },
  secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(options);
export { handler as GET, handler as POST };

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface AuthUser extends User {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  createdAt: string;
  updatedAt: string;
}

export const options = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, unknown> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }

        try {
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

          if (!signInResponse.ok) {
            const errorData = await signInResponse.text();
            throw new Error(errorData || 'Falha na autenticação');
          }

          const signInData = await signInResponse.json();

          const profileResponse = await fetch(`${process.env.API_URL || 'http://localhost:3333'}/users/profile`, {
            headers: {
              'Authorization': `Bearer ${signInData.accessToken}`,
              'Accept': 'application/json'
            },
          });

          if (!profileResponse.ok) {
            const errorData = await profileResponse.text();
            throw new Error(errorData || 'Falha ao buscar perfil');
          }

          const profileData = await profileResponse.json();

          return {
            id: String(profileData.id),
            email: profileData.email,
            name: profileData.name,
            accessToken: signInData.accessToken,
            createdAt: profileData.created_at,
            updatedAt: profileData.updated_at,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at
          } as AuthUser;
        } catch (error) {
          console.error('Erro detalhado na autenticação:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.accessToken = token.accessToken;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
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

// Create a simple handler for NextAuth
const handler = NextAuth(options);

// Export the handlers with uppercase method names
export {
  handler as GET,
  handler as POST,
  handler as OPTIONS,
  handler as HEAD,
  handler as PATCH,
  handler as DELETE,
  handler as PUT
};

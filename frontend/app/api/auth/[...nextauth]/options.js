import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const data = await res.json();

          console.log("API RESPONSE:", data);

          if (!res.ok || data.status !== "success") {
            throw new Error(data.message || "Login failed");
          }

          const user = data?.data?.user;
          const accessToken = data?.data?.accessToken;

          if (!user || !accessToken) {
            throw new Error("Invalid response from server");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            accessToken,
          };
        } catch (error) {
          console.error("Auth error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;

      session.user = {
        name: token.name,
        email: token.email,
        role: token.role,
      };

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};


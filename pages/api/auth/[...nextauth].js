import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      state: true,
    }),
  ],
  debug: true,
  session: {
    strategy: 'jwt',
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.SECRET,
    // // Set to true to use encryption (default: false)
    // encryption: true,
    // // You can define your own encode/decode functions for signing and encryption
    // // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[CB] signIn returning true');
      return true;
      // let isAllowedToSignIn = false;

      // console.log(
      //   '[CB] signIn (user, account,profile, email, credentials):',
      //   user,
      //   account,
      //   profile,
      //   email,
      //   credentials
      // );

      // let authorizedDomains = process.env.AUTHORIZED_EMAIL_DOMAINS.split(',');
      // authorizedDomains.forEach((authorizedDomain) => {
      //   if (user.email.split('@')[1] === authorizedDomain) {
      //     isAllowedToSignIn = true;
      //   }
      // });
      // console.log('[CB] signIn ********* is allowed?', isAllowedToSignIn);
      // return isAllowedToSignIn;
    },
    session({ session, token, user }) {
      console.log('[CB] session() session, token, user:', session, token, user);
      if (user) session.user = user;
      // Send properties to the client, like an access_token from a provider.
      if (token) session.accessToken = token.accessToken;
      return session;
    },
    jwt({ token, user, account, profile, isNewUser }) {
      console.log(
        '[CB]jwt() token/user/account/profile/isNewUser:',
        token,
        user,
        account,
        profile,
        isNewUser
      );
      if (profile) token.account = profile;
      if (account) token.accessToken = account.access_token;

      return token;
    },
    redirect({ url, baseUrl }) {
      console.log();
      console.log('[CB] redirect url/baseUrl:', url, baseUrl);
      console.log();
      // return url;

      if (url.startsWith(baseUrl)) return url;

      // localhost
      if (
        url.startsWith('http://localhost:3000') ||
        url.startsWith('https://localhost:3000')
      ) {
        let parsedUrl = new URL(url);
        let params = parsedUrl.searchParams;
        let site = params.get('site');

        if (site) {
          let siteUrl = `${parsedUrl.protocol}//${site}.${parsedUrl.host}${parsedUrl.pathname}`;
          console.log('>> [SITE]', site, siteUrl);

          return siteUrl;
        }
      }
      return url;

      // // Allows relative callback URLs
      // else if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      // return baseUrl;
    },
  },
});

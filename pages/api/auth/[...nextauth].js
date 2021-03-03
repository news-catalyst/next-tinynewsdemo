import NextAuth from 'next-auth';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: 'presspass',
      name: 'PressPass',
      type: 'oauth',
      version: '2.0',
      scope: 'openid profile email organizations',
      accessTokenUrl: 'https://server.presspass.dev/openid/token',
      authorizationUrl:
        'https://server.presspass.dev/openid/authorize/?response_type=code',
      clientId: '901292',
      idToken: true,
      params: { grant_type: 'authorization_code' },
      profileUrl: 'https://server.presspass.dev/openid/userinfo',
      async profile(profile, tokens) {
        const res = await fetch(
          'https://server.presspass.dev/openid/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }
        );
        const responseData = await res.json();
        responseData.id = 'presspass';
        return responseData;
      },
    },
  ],
  debug: true,
  secret: process.env.SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    jwt: true,

    // Seconds - How long until an idle session expires and is no longer valid.
    // maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    // updateAge: 24 * 60 * 60, // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  callbacks: {
    async signIn(user, account, profile) {
      let isAllowedToSignIn = false;

      user.organizations.forEach((org) => {
        if (org.slug === process.env.ORG_SLUG) {
          isAllowedToSignIn = true;
        }
      });

      return isAllowedToSignIn;
    },
    session(session, payload) {
      if (payload.account) session.user = payload.account;
      return session;
    },
    jwt(token, account, user, userInfo) {
      if (userInfo) token.account = userInfo;
      return token;
    },
  },
});

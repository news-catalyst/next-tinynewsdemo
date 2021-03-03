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
      profileUrl: 'https://server.presspass.dev/openid/userinfo',
      clientId: '901292',
      idToken: true,
      params: { grant_type: 'authorization_code' },
      async profile(profile, tokens) {
        console.log(profile, tokens);
        return {
          id: 'presspass',
        };
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth provider does not return e-mail by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        // return {
        //   access_token: tokens.access_token,
        //   refresh_token: tokens.refresh_token,
        //   id_token: tokens.id_token,
        //   token_type: tokens.token_type
        // }
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
    async session(session, token) {
      console.log('session', session);
      console.log('sessiontoken', token);
      return session;
    },
    async jwt(token, user, account, profile, isNewUser) {
      console.log('jwt callback: ', token, user, account, profile, isNewUser);
      return token;
    },
  },
  async jwt(token, user, account, profile, isNewUser) {
    console.log('token', token);
    console.log('user', user);
    console.log('account', account);
    console.log('profile', profile);
    console.log('isNewUser', isNewUser);
    return token;
  },
});

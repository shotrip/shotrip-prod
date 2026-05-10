"use client";

import { ENV } from "@/config/env";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {  
      userPoolId: `${ENV.COGNITO.USER_POOL_ID}`,
      userPoolClientId: `${ENV.COGNITO.CLIENT_ID}`,
      loginWith: {
        oauth: {
          domain: `${ENV.COGNITO.DOMAIN}`,
          scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
          redirectSignIn:[`${ENV.SITE_URL}/auth-callback`],
          redirectSignOut: [`${ENV.SITE_URL}`],
          responseType: "code",
        }
      }
    }
  }
});

export default function AmplifyConfigure() {
  return null;
}
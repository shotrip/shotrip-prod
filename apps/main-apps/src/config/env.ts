export const ENV = {
  // Site URLs
  PROD_URL: process.env.NEXT_PUBLIC_PROD_URL || '',

  // API Gateway
  API_BASE_URL: process.env.NEXT_PUBLIC_API_GW_BASE_URL || '',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY || '',

  // Lens Context
  LENS_CONTEXT: {
    tenantId: process.env.NEXT_PUBLIC_LENS_TENANT_ID || '',
    namespace: process.env.NEXT_PUBLIC_LENS_NAMESPACE || '',
    token: process.env.NEXT_PUBLIC_LENS_TOKEN || '',
  },

  // Cognito
  COGNITO: {
    USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '',
    CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '',
    DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '',
  },

  // Others
  // GAS_URL: process.env.NEXT_PUBLIC_GAS_URL || '',
  BUY_ME_A_COFFEE_URL: process.env.NEXT_PUBLIC_BUY_ME_A_COFFEE_URL || '',
} as const;
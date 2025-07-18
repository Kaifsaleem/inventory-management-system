export interface ConfigInterface {
  server: {
    port: number;
  };
  database: {
    connectionString: string;
    masterDBName: string;
    companyDBPrefix: string;
  };
  redis: {
    host: string;
    port: number;
    password: string;
    db: number;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
    successUrl: string;
    cancelUrl: string;
  };
  stripe: {
    secretKey: string;
    publicKey: string;
    successUrl: string;
    cancelUrl: string;
  };
}

const config = (): ConfigInterface => {
  return {
    server: {
      port: parseInt(process.env.PORT ?? '3001', 10),
    },
    database: {
      connectionString: process.env.DATABASE_URI ?? '',
      masterDBName: process.env.MASTER_DB_NAME ?? 'test',
      companyDBPrefix: process.env.COMPANY_DB_PREFIX ?? 'test_c_',
    },
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD ?? '',
      db: parseInt(process.env.REDIS_DB ?? '0', 10),
    },
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID ?? '',
      keySecret: process.env.RAZORPAY_KEY_SECRET ?? '',
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID ?? '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? '',
      successUrl: process.env.PAYPAL_SUCCESS_URL ?? '',
      cancelUrl: process.env.PAYPAL_CANCEL_URL ?? '',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY ?? '',
      publicKey: process.env.STRIPE_PUBLIC_KEY ?? '',
      successUrl: process.env.STRIPE_SUCCESS_URL ?? '',
      cancelUrl: process.env.STRIPE_CANCEL_URL ?? '',
    },
  };
};

export default config;

import * as midtransClient from 'midtrans-client';

export const midtrans = new midtransClient.Snap({
  isProduction: false, // change to `true` for production environment
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

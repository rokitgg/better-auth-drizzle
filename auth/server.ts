import { betterAuth } from "better-auth";
import { passkey, phoneNumber, twoFactor } from "better-auth/plugins";
import { reactResetPasswordEmail } from "@/lib/email/rest-password";
import { resend } from "@/lib/email/resend";

import db from "@/lib/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "@/env";

const from = process.env.BETTER_AUTH_EMAIL ?? "delivered@resend.dev";
const to = process.env.TEST_EMAIL ?? "";

export const auth = betterAuth({
  appName: "better-auth-drizzle",
  database: drizzleAdapter(db, { provider: "pg" }),
  baseUrl: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(url, user) {
      const res = await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        react: reactResetPasswordEmail({
          username: user.email,
          resetLink: url,
        }),
      });
      console.log(res, user.email);
    },
    sendEmailVerificationOnSignUp: true,
    async sendVerificationEmail(email, url) {
      console.log("Sending verification email to", email);
      const res = await resend.emails.send({
        from,
        to: to ?? email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, email);
    },
  },
  plugins: [
    phoneNumber({
      otp: {
        sendOTP(phoneNumber, code) {
          console.log(`Sending OTP to ${phoneNumber}: ${code}`);
        },
        sendOTPonSignUp: true,
      },
    }),
    twoFactor({
      otpOptions: {
        async sendOTP(user, otp) {
          await resend.emails.send({
            from,
            to: user.email,
            subject: "Your OTP",
            html: `Your OTP is ${otp}`,
          });
        },
      },
    }),
    passkey(),
  ],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    // google: {
    //   clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    // },
  },
  rateLimit: {
    enabled: true,
  },
  logger: {
    disabled: env.VERCEL_ENV === "production",
  },
});

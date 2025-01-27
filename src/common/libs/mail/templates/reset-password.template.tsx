import { Html } from '@react-email/html';
import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
  const confirmLink = `${domain}/auth/reset-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="bg-[#f4f4f4] text-[#333] font-sans p-6">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <Heading className="text-2xl font-bold text-[#1DB954] mb-4 text-center">
                Spotify Clone
              </Heading>
            </div>
            <Heading className="text-xl font-bold text-[#1DB954] mb-4 text-center">
              Reset Password
            </Heading>
            <Text className="mb-4 text-base text-center">Hi there,</Text>
            <Text className="mb-6 text-base text-center">
              We heard that you lost your password. Sorry about that! But don’t worry! You can use
              the following button to reset your password:
            </Text>
            <div className="text-center">
              <Link
                href={confirmLink}
                className="text-base text-white py-3 px-8 bg-[#1DB954] rounded-lg inline-block font-bold hover:bg-[#1ED760]"
              >
                Reset password
              </Link>
            </div>
            <Text className="mt-6 text-base text-center">
              This link will remain active for the next 30 minutes. Once it expires, you will need
              to request a new one.
            </Text>
            <Text className="mt-6 text-xs text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Spotify Clone. All rights reserved.
            </Text>
          </div>
        </Body>
      </Html>
    </Tailwind>
  );
}

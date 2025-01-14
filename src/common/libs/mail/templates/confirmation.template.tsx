import { Html } from '@react-email/html';
import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ConfirmationTemplateProps {
  name: string;
  domain: string;
  token: string;
}

export function ConfirmationTemplate({ name, domain, token }: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/verification?token=${token}`;

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
              Account Confirmation
            </Heading>
            <Text className="mb-4 text-base text-center">Hi {name},</Text>
            <Text className="mb-6 text-base text-center">
              Thank you for signing up for Spotify! To complete the account creation process, please
              confirm your email address by clicking the button below.
            </Text>
            <div className="text-center">
              <Link
                className="text-base text-white py-3 px-8 bg-[#1DB954] rounded-full inline-block font-bold hover:bg-[#1ED760]"
                href={confirmLink}
              >
                Confirm Email Address
              </Link>
            </div>
            <Text className="mt-6 text-base text-center">
              The confirmation link will expire in 30 minutes. If it expires, you’ll need to request
              a new one.
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

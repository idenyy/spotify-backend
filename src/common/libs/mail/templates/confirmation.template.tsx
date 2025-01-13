import { Html } from '@react-email/html';
import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({ domain, token }: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/auth/verification?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className="bg-[#191414] text-white font-sans p-6">
          <Heading className="text-3xl font-extrabold text-[#1DB954] mb-6">
            Confirm Your Email
          </Heading>
          <Text className="mb-4 text-base text-gray-300">Hi there,</Text>
          <Text className="mb-6 text-base text-gray-300">
            You’re almost there! Please confirm your email address to activate your Spotify account.
            Click the button below:
          </Text>
          <div className="text-center">
            <Link
              className="text-base text-white py-3 px-8 bg-[#1DB954] rounded-full inline-block font-bold hover:bg-[#1ED760]"
              href={confirmLink}
            >
              Confirm Email
            </Link>
          </div>
          <Text className="mt-6 mb-4 text-sm text-gray-500">
            The confirmation link will expire in 30 minutes. If it expires, you’ll need to request a
            new one.
          </Text>
          <Text className="text-gray-500 text-xs self-center">
            &copy; {new Date().getFullYear()} Spotify Clone. All rights reserved.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
}

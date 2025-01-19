import { Html } from '@react-email/html';
import { Body, Heading, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

interface ConfirmationTemplateProps {
  name: string;
  token: string;
}

export function ConfirmationTemplate({ name, token }: ConfirmationTemplateProps) {
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
              Confirm Your Email Address
            </Heading>
            <Text className="mb-4 text-base text-center">Hello {name},</Text>
            <Text className="mb-6 text-base text-center">
              We're excited to have you join our platform! To finalize your account setup, please
              confirm your email address using the code below.
            </Text>
            <div className="text-center">
              <p className="text-base text-white py-3 px-8 bg-[#1DB954] rounded-lg inline-block font-bold hover:bg-[#1ED760]">
                {token}
              </p>
            </div>
            <Text className="mt-6 text-base text-center">
              This confirmation code will expire in 30 minutes. If it becomes invalid, you can
              request a new one from the app.
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

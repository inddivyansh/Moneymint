'use client';

import HomePage from '@/components/dashboard/HomePage';
import OnboardingModal from '@/components/dashboard/OnboardingModal';

export default function Home() {
  return (
    <>
      <OnboardingModal />
      <HomePage />
    </>
  );
}

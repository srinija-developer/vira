import React from 'react';
import LandingHero from './components/LandingHero';
import LandingHowItWorks from './components/LandingHowItWorks';
import LandingFeatures from './components/LandingFeatures';
import LandingBeforeAfter from './components/LandingBeforeAfter';
import LandingCTA from './components/LandingCTA';
import LandingNav from './components/LandingNav';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingBeforeAfter />
      <LandingCTA />
    </div>
  );
}
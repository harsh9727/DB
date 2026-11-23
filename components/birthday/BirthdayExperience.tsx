'use client';

import React, { useState } from 'react';
import { STEP_DEFINITIONS } from './config';
import { StepTransition } from './StepTransition';
import { ProgressIndicator } from './ProgressIndicator';
import { FloatingHearts } from './FloatingHearts';
import { PasswordScreen } from './PasswordScreen';
import { WelcomeScreen } from './WelcomeScreen';

export function BirthdayExperience() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1);
  const [unlockedSteps, setUnlockedSteps] = useState<number[]>([0]);

  const currentStep = STEP_DEFINITIONS[currentStepIndex];

  const goToStep = (index: number) => {
    if (index >= 0 && index < STEP_DEFINITIONS.length) {
      setDirection(index > currentStepIndex ? 1 : -1);
      setCurrentStepIndex(index);
      if (!unlockedSteps.includes(index)) {
        setUnlockedSteps((prev) => [...prev, index]);
      }
    }
  };

  const handlePasswordSuccess = () => {
    // Unlock step 2 and transition forward
    setUnlockedSteps((prev) => (prev.includes(1) ? prev : [...prev, 1]));
    setDirection(1);
    setCurrentStepIndex(1);
  };

  const handleNext = () => {
    if (currentStepIndex < STEP_DEFINITIONS.length - 1) {
      goToStep(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-burgundy-velvet select-none">
      {/* Ambient background particles (hearts & sparkles) */}
      <FloatingHearts />

      {/* Storytelling Progress Indicator */}
      <ProgressIndicator
        steps={STEP_DEFINITIONS}
        currentIndex={currentStepIndex}
        onBack={handleBack}
        canGoBack={currentStepIndex > 0}
      />

      {/* Horizontal Step Transition Container */}
      <StepTransition stepKey={currentStep.id} direction={direction}>
        {currentStep.id === 'password' && (
          <PasswordScreen onSuccess={handlePasswordSuccess} />
        )}

        {currentStep.id === 'welcome' && (
          <WelcomeScreen
            onNext={handleNext}
            hasNextStep={currentStepIndex < STEP_DEFINITIONS.length - 1}
          />
        )}
      </StepTransition>
    </main>
  );
}

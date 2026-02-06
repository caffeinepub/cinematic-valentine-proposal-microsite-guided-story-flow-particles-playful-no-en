import { useState, useEffect } from 'react';
import { HeartIntroStage } from './components/valentine/HeartIntroStage';
import { TypingIntroStage } from './components/valentine/TypingIntroStage';
import { ProposalQuestionStage } from './components/valentine/ProposalQuestionStage';
import { HeartYesTransitionStage } from './components/valentine/HeartYesTransitionStage';
import { YesCountdownStage } from './components/valentine/YesCountdownStage';
import { StorySlidesStage } from './components/valentine/StorySlidesStage';
import { ShootingStarStage } from './components/valentine/ShootingStarStage';
import { CelebrationStage } from './components/valentine/CelebrationStage';
import { FinalEndingStage } from './components/valentine/FinalEndingStage';
import { BackgroundLayers } from './components/valentine/BackgroundLayers';
import { ParticlesLayer } from './components/valentine/ParticlesLayer';
import { CursorSparkleTrail } from './components/valentine/CursorSparkleTrail';
import { AudioToggle } from './components/valentine/AudioToggle';
import { StageTransition } from './components/valentine/StageTransition';
import { BackButton } from './components/valentine/BackButton';

type Stage = 'heartIntro' | 'intro' | 'proposal' | 'heartYesTransition' | 'countdown' | 'slides' | 'star' | 'celebration' | 'ending';

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('heartIntro');
  const [stageHistory, setStageHistory] = useState<Stage[]>(['heartIntro']);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[App] Service worker registered successfully');
          
          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('[App] Service worker activated');
                  // If there's a controller, a new SW has taken over
                  if (navigator.serviceWorker.controller) {
                    console.log('[App] New service worker activated, content updated');
                  }
                }
              });
            }
          });

          // Check for updates periodically (every minute)
          setInterval(() => {
            registration.update();
          }, 60000);
        })
        .catch((error) => {
          // Silent fail - offline support is optional enhancement
          console.log('[App] Service worker registration failed:', error);
        });
    }
  }, []);

  const handleStageComplete = (nextStage: Stage) => {
    setStageHistory((prev) => [...prev, nextStage]);
    setCurrentStage(nextStage);
  };

  const handleBack = () => {
    if (stageHistory.length > 1) {
      const newHistory = stageHistory.slice(0, -1);
      setStageHistory(newHistory);
      setCurrentStage(newHistory[newHistory.length - 1]);
    }
  };

  const canGoBack = stageHistory.length > 1;

  // Render heart intro stages without background layers
  if (currentStage === 'heartIntro') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <AudioToggle />
        <HeartIntroStage
          onComplete={() => handleStageComplete('intro')}
          isReducedMotion={isReducedMotion}
        />
      </div>
    );
  }

  if (currentStage === 'heartYesTransition') {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <AudioToggle />
        {canGoBack && <BackButton onClick={handleBack} />}
        <HeartYesTransitionStage
          onComplete={() => handleStageComplete('countdown')}
          isReducedMotion={isReducedMotion}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <BackgroundLayers currentStage={currentStage} />
      <ParticlesLayer isReducedMotion={isReducedMotion} currentStage={currentStage} />
      <CursorSparkleTrail isReducedMotion={isReducedMotion} />
      <AudioToggle />
      {canGoBack && <BackButton onClick={handleBack} />}

      <main className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <StageTransition currentStage={currentStage}>
          {currentStage === 'intro' && (
            <TypingIntroStage onComplete={() => handleStageComplete('proposal')} />
          )}
          {currentStage === 'proposal' && (
            <ProposalQuestionStage onYesClick={() => handleStageComplete('heartYesTransition')} />
          )}
          {currentStage === 'countdown' && (
            <YesCountdownStage onComplete={() => handleStageComplete('slides')} />
          )}
          {currentStage === 'slides' && (
            <StorySlidesStage onComplete={() => handleStageComplete('star')} />
          )}
          {currentStage === 'star' && (
            <ShootingStarStage onComplete={() => handleStageComplete('celebration')} />
          )}
          {currentStage === 'celebration' && (
            <CelebrationStage onComplete={() => handleStageComplete('ending')} />
          )}
          {currentStage === 'ending' && <FinalEndingStage />}
        </StageTransition>
      </main>
    </div>
  );
}

export default App;

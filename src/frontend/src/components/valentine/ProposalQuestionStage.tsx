import { useState, useRef } from 'react';
import { RippleButton } from './RippleButton';
import { WhyILoveYouModal } from './WhyILoveYouModal';
import { NoButtonEngine } from './NoButtonEngine';
import { LightSweepText } from './LightSweepText';

interface ProposalQuestionStageProps {
  onYesClick: () => void;
}

export function ProposalQuestionStage({ onYesClick }: ProposalQuestionStageProps) {
  const [showModal, setShowModal] = useState(false);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const whyButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="max-w-4xl mx-auto text-center px-6 relative">
        <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 card-glow animate-float-breath relative overflow-hidden">
          {/* Ornamental corners */}
          <div
            className="absolute top-0 left-0 w-32 h-32 opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'url(/assets/generated/ornament-corners.dim_1024x1024.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div
            className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none transform rotate-90"
            style={{
              backgroundImage: 'url(/assets/generated/ornament-corners.dim_1024x1024.png)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
          />

          <div className="space-y-8 relative z-10">
            <LightSweepText>
              <h2 className="font-romantic text-4xl md:text-6xl text-glow">
                Fatima urf Meethadil
              </h2>
            </LightSweepText>

            <p className="font-elegant text-xl md:text-2xl text-foreground/90 leading-relaxed">
              Kya tum meri Valentine banogi?
            </p>

            <div ref={containerRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 relative min-h-[200px]">
              <RippleButton
                ref={yesButtonRef}
                onClick={onYesClick}
                className="glassmorphism px-8 py-4 rounded-2xl font-elegant text-xl md:text-2xl font-semibold button-glow hover:button-glow-hover hover:scale-105 transition-all duration-300 cinematic-ease animate-slide-up"
                style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
              >
                YES 💖
              </RippleButton>

              <NoButtonEngine
                yesButtonRef={yesButtonRef}
                whyButtonRef={whyButtonRef}
                containerRef={containerRef}
              />

              <RippleButton
                ref={whyButtonRef}
                onClick={() => setShowModal(true)}
                className="glassmorphism px-6 py-3 rounded-2xl font-elegant text-lg md:text-xl border-2 border-primary/30 hover:border-primary/60 hover:scale-105 transition-all duration-300 cinematic-ease animate-slide-up"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
              >
                Why I Love You ❤️
              </RippleButton>
            </div>
          </div>
        </div>
      </div>

      <WhyILoveYouModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

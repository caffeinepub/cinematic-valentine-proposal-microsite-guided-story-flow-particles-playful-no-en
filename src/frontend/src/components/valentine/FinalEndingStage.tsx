import { LightSweepText } from './LightSweepText';
import { PromiseScroll } from './PromiseScroll';

export function FinalEndingStage() {
  return (
    <div className="max-w-4xl mx-auto text-center px-6 space-y-12 animate-stagger-container">
      <div className="glassmorphism-strong rounded-3xl p-8 md:p-12 lg:p-16 card-glow animate-float-breath animate-entrance-scale">
        <div className="space-y-8">
          <LightSweepText>
            <h2 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-glow animate-scale-in animate-shimmer-ambient">
              Happy Rose Day My Love 🌹
            </h2>
          </LightSweepText>

          <p className="font-elegant text-2xl md:text-3xl lg:text-4xl text-glow-soft leading-relaxed animate-fade-in animate-entrance-slide">
            Abhi toh meri ho… hamesha meri hi rehna, Meethadil.
          </p>

          <div className="pt-8 animate-slide-up animate-entrance-fade" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
            <p className="font-romantic text-2xl md:text-3xl text-foreground/80">
              Forever Yours,
            </p>
            <p className="font-romantic text-3xl md:text-4xl text-glow-soft mt-2">
              Utkarsh ❤️
            </p>
          </div>
        </div>
      </div>

      <div className="animate-entrance-promise" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
        <PromiseScroll />
      </div>
    </div>
  );
}

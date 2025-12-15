import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{
    id: number;
    title: string;
    description: string;
  }>;
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#003366] to-[#00AEEF] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute top-0 left-0 right-0 flex justify-between -mt-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{ width: `${100 / totalSteps}%` }}
            >
              <div
                className={`
                  w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm
                  transition-all duration-300 border-2 sm:border-4 border-white
                  ${
                    step.id < currentStep
                      ? 'bg-[#22C55E] text-white shadow-lg'
                      : step.id === currentStep
                      ? 'bg-[#003366] text-white shadow-lg scale-110'
                      : 'bg-gray-300 text-gray-600'
                  }
                `}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  step.id + 1
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-between px-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center text-center"
            style={{ width: `${100 / totalSteps}%` }}
          >
            <h3
              className={`
                text-[10px] sm:text-xs md:text-sm font-semibold mb-1 transition-colors
                ${
                  step.id === currentStep
                    ? 'text-[#003366]'
                    : step.id < currentStep
                    ? 'text-[#22C55E]'
                    : 'text-gray-400'
                }
              `}
            >
              {step.title}
            </h3>
            <p className="text-[9px] sm:text-xs text-gray-500 hidden sm:block">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Check } from "lucide-react";

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

interface ClienteWizardStepperProps {
  currentStep: number;
  steps: WizardStep[];
}

export function ClienteWizardStepper({ currentStep, steps }: ClienteWizardStepperProps) {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#244F82] to-[#1a3a5f] transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between items-start">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Connector Line - Before */}
                {index > 0 && (
                  <div
                    className={`h-0.5 flex-1 -ml-2 transition-colors duration-300 ${
                      isCompleted ? "bg-[#22C55E]" : "bg-gray-300"
                    }`}
                  />
                )}

                {/* Step Circle */}
                <div className="relative z-10 flex items-center justify-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#22C55E] text-white scale-100"
                        : isCurrent
                        ? "bg-[#244F82] text-white scale-110 shadow-lg ring-4 ring-blue-100"
                        : "bg-gray-300 text-gray-600 scale-100"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.id + 1
                    )}
                  </div>
                </div>

                {/* Connector Line - After */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mr-2 transition-colors duration-300 ${
                      isCompleted ? "bg-[#22C55E]" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center max-w-[100px] sm:max-w-none">
                <p
                  className={`text-xs sm:text-sm font-semibold transition-colors duration-300 ${
                    isCurrent
                      ? "text-[#244F82]"
                      : isCompleted
                      ? "text-[#22C55E]"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextButtonText?: string;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onCancel,
  isNextDisabled = false,
  isSubmitting = false,
  nextButtonText,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const getNextButtonText = () => {
    if (nextButtonText) return nextButtonText;
    if (isLastStep) return 'Finalizar y Descargar PDF';
    return 'Guardar y Continuar';
  };

  const getNextButtonIcon = () => {
    if (isLastStep) return <Check className="w-4 h-4 ml-2" />;
    return <ArrowRight className="w-4 h-4 ml-2" />;
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <div>
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Cancelar
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled || isSubmitting}
          className="bg-[#003366] hover:bg-[#00AEEF] transition-colors gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Procesando...
            </>
          ) : (
            <>
              {getNextButtonText()}
              {getNextButtonIcon()}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

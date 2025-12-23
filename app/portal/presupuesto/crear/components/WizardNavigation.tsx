import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Trash2, Eye } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onClearForm: () => void;
  onPreview?: () => void;
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
  onClearForm,
  onPreview,
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
    <div className="pt-6 border-t border-gray-200 space-y-3">
      {/* Clear Form Button - Mobile Only (Top) */}
      <div className="flex md:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={onClearForm}
          disabled={isSubmitting}
          className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 w-full text-sm"
        >
          <Trash2 className="w-4 h-4 flex-shrink-0" />
          Limpiar Formulario
        </Button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isSubmitting}
              className="gap-2 w-full md:w-auto border-[#244F82] text-[#244F82] hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Preview Button */}
          {onPreview && (
            <Button
              type="button"
              variant="outline"
              onClick={onPreview}
              disabled={isSubmitting}
              className="gap-2 border-[#244F82] text-[#244F82] hover:bg-blue-50 w-full md:w-auto"
            >
              <Eye className="w-4 h-4" />
              Previsualizar
            </Button>
          )}

          {/* Clear Form Button - Desktop Only (Inline) */}
          <Button
            type="button"
            variant="outline"
            onClick={onClearForm}
            disabled={isSubmitting}
            className="hidden md:flex gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 text-sm"
          >
            <Trash2 className="w-4 h-4 flex-shrink-0" />
            Limpiar Formulario
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 w-full md:w-auto"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={onNext}
            disabled={isNextDisabled || isSubmitting}
            className="bg-[#244F82] hover:bg-[#1a3a5f] transition-colors gap-2 w-full md:w-auto"
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
    </div>
  );
}

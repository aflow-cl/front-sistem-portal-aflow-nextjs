import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidationAlertProps {
  errors: string[];
  onClose?: () => void;
  title?: string;
}

export function ValidationAlert({ errors, onClose, title = 'Campos requeridos' }: ValidationAlertProps) {
  if (errors.length === 0) return null;

  return (
    <div className="mb-4 bg-red-50 border-2 border-red-300 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-red-800 font-semibold text-sm">{title}</h3>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-red-700 mt-2">
            <p className="mb-2 text-sm">Por favor, complete los siguientes campos:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {errors.slice(0, 5).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
              {errors.length > 5 && (
                <li className="text-red-600 font-medium">
                  ...y {errors.length - 5} error(es) adicionales
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

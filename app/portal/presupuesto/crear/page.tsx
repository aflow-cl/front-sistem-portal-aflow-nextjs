"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// import { VisualizationType } from '@/types/presupuesto';

// Components
import { BudgetWizardStepper } from '../components/shared/BudgetWizardStepper';
import { BudgetPreviewPanel } from '../components/BudgetPreviewPanel';
import { WizardNavigation } from './components/WizardNavigation';
import { ClienteForm } from './components/ClienteForm';
import { ProyectoForm } from './components/ProyectoForm';
import { PresupuestoTable } from '../components/PresupuestoTable';
import { ResumenFinal } from './components/ResumenFinal';
import { createBudget } from '../api/budgetService';
import { useAuth } from '@/hooks/useAuth';
import { validateRut } from '@/lib/utils';
import { useBudgetFormState } from '../hooks/useBudgetFormState';

// ============================================
// VALIDATION SCHEMA
// ============================================

const itemSchema = z.object({
  tipo: z.string().default('item'),
  proveedor: z.string().optional(),
  producto: z.string().optional(),
  descripcion: z.string().optional(),
  unidad: z.string().default('UN'),
  cantidad: z.coerce.number().int('La cantidad debe ser un número entero').min(0).default(1),
  valor: z.coerce.number().int('El valor debe ser un número entero').min(0).default(0),
  utilidad: z.coerce.number().min(0).max(100).default(0),
  iva: z.coerce.number().min(0).max(100).default(19),
  bruto: z.number().default(0),
  total: z.number().default(0),
  esComentario: z.boolean().default(false),
  seccion: z.string().optional(),
});

// Type for budget item derived from schema
type BudgetItem = z.infer<typeof itemSchema>;

const budgetWizardSchema = z.object({
  // Step 1: Cliente
  cliente: z.object({
    tipoPersona: z.enum(['persona-natural', 'empresa'], {
      errorMap: () => ({ message: 'Seleccione el tipo de persona' }),
    }),
    rut: z.string()
      .min(1, 'Ingrese el RUT del cliente')
      .refine(validateRut, 'Formato de RUT inválido. Use formato XX.XXX.XXX-X'),
    // Campos para Persona Natural
    primerNombre: z.string().optional(),
    segundoNombre: z.string().optional(),
    apellidoPaterno: z.string().optional(),
    apellidoMaterno: z.string().optional(),
    // Campos para Empresa
    razonSocial: z.string().optional(),
    giro: z.string().optional(),
    // Estado
    estado: z.enum(['Activo', 'Inactivo'], {
      errorMap: () => ({ message: 'Seleccione el estado del cliente' }),
    }).default('Activo'),
    // Dirección/Sucursal
    sucursalId: z.string().min(1, 'Seleccione una sucursal de la lista o agregue una nueva'),
    sucursalNombre: z.string().optional(),
    regionId: z.string().min(1, 'Seleccione la Región donde se ubica'),
    ciudadId: z.string().min(1, 'Seleccione la Ciudad correspondiente'),
    comuna: z.string().min(1, 'Seleccione la Comuna del cliente'),
    descripcionDireccion: z.string()
      .min(1, 'Ingrese una descripción para esta dirección')
      .min(3, 'La descripción debe tener al menos 3 caracteres'),
    tipoDireccion: z.string().min(1, 'Seleccione el tipo de dirección (Comercial, Facturación, etc.)'),
    calle: z.string()
      .min(1, 'Ingrese el nombre de la calle')
      .min(3, 'El nombre de la calle debe tener al menos 3 caracteres'),
    numero: z.string()
      .min(1, 'Ingrese el número de la dirección'),
    complemento: z.string().optional(),
    // Contacto
    email: z.string()
      .min(1, 'Ingrese el correo electrónico del cliente')
      .email('Formato de correo inválido. Ejemplo: contacto@empresa.cl'),
    telefono: z.string()
      .min(1, 'Ingrese el número de teléfono')
      .min(8, 'El número de teléfono debe tener al menos 8 dígitos'),
    // Notas
    notas: z.string().optional(),
  }).superRefine((data, ctx) => {
    // Validación condicional según tipo de persona
    if (data.tipoPersona === 'persona-natural') {
      if (!data.primerNombre || data.primerNombre.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['primerNombre'],
          message: 'Ingrese el primer nombre (mínimo 2 caracteres)',
        });
      }
      if (!data.apellidoPaterno || data.apellidoPaterno.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['apellidoPaterno'],
          message: 'Ingrese el apellido paterno (mínimo 2 caracteres)',
        });
      }
    } else if (data.tipoPersona === 'empresa') {
      if (!data.razonSocial || data.razonSocial.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['razonSocial'],
          message: 'Ingrese la Razón Social (mínimo 3 caracteres)',
        });
      }
      if (!data.giro || data.giro.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['giro'],
          message: 'Ingrese el Giro Comercial (mínimo 3 caracteres)',
        });
      }
    }
  }),

  // Step 2: Proyecto
  proyecto: z.object({
    nombre: z.string()
      .min(1, 'Ingrese el nombre del proyecto')
      .min(5, 'El nombre debe tener al menos 5 caracteres'),
    descripcion: z.string()
      .min(1, 'Ingrese una descripción del proyecto')
      .min(10, 'La descripción debe tener al menos 10 caracteres'),
    fechaInicio: z.string().min(1, 'Seleccione la fecha de inicio del proyecto').default(() => new Date().toISOString().split('T')[0]),
    fechaTermino: z.string().min(1, 'Seleccione la fecha de término del proyecto'),
    responsable: z.string()
      .min(1, 'Ingrese el nombre del responsable del proyecto')
      .min(3, 'El nombre del responsable debe tener al menos 3 caracteres'),
    observaciones: z.string().optional(),
  }).refine(
    (data) => {
      if (data.fechaInicio && data.fechaTermino) {
        return new Date(data.fechaTermino) >= new Date(data.fechaInicio);
      }
      return true;
    },
    {
      message: 'La fecha de término debe ser igual o posterior a la fecha de inicio',
      path: ['fechaTermino'],
    }
  ),

  // Step 3: Items
  items: z.array(itemSchema).default([]),
});

type BudgetWizardFormData = z.infer<typeof budgetWizardSchema>;

// ============================================
// WIZARD STEPS CONFIGURATION
// ============================================

const WIZARD_STEPS = [
  {
    id: 0,
    title: 'Cliente',
    description: 'Datos del contratante',
  },
  {
    id: 1,
    title: 'Proyecto',
    description: 'Información del trabajo',
  },
  {
    id: 2,
    title: 'Presupuesto',
    description: 'Ítems y valores',
  },
  {
    id: 3,
    title: 'Confirmación',
    description: 'Resumen y descarga',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function CrearPresupuestoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [folio, setFolio] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFinalizeDialog, setShowFinalizeDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  // const [visualizationType, setVisualizationType] = useState<VisualizationType>('Completa');
  const [showRestoreDraftDialog, setShowRestoreDraftDialog] = useState(false);
  const [savedDraftData, setSavedDraftData] = useState<Record<string, unknown> | null>(null);

  // Initialize form with react-hook-form
  const form = useForm<BudgetWizardFormData>({
    resolver: zodResolver(budgetWizardSchema),
    defaultValues: {
      cliente: {
        tipoPersona: 'empresa',
        rut: '',
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        razonSocial: '',
        giro: '',
        estado: 'Activo',
        sucursalId: '',
        sucursalNombre: '',
        regionId: '',
        ciudadId: '',
        comuna: '',
        descripcionDireccion: '',
        tipoDireccion: '',
        calle: '',
        numero: '',
        complemento: '',
        email: '',
        telefono: '',
        notas: '',
      },
      proyecto: {
        nombre: '',
        descripcion: '',
        fechaInicio: new Date().toISOString().split('T')[0], // Default to today
        fechaTermino: '',
        responsable: '',
        observaciones: '',
      },
      items: [],
    },
  });

  // Hook to get reactive form state for preview
  const { formValues } = useBudgetFormState(form);

  // Generate folio on mount
  useEffect(() => {
    const generatedFolio = `PRE-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setFolio(generatedFolio);
  }, []);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (user?.email) {
      const storageKey = `aflow-presupuesto-draft-${user.email}`;
      const savedDraft = localStorage.getItem(storageKey);

      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          // Store draft data and show dialog
          setSavedDraftData(parsedDraft);
          setShowRestoreDraftDialog(true);
        } catch (error) {
          console.error('Error loading draft:', error);
          toast.error('Error al cargar el borrador');
          // Ensure we start at step 0 on error
          setCurrentStep(0);
        }
      } else {
        // No draft exists, ensure we start at step 0
        setCurrentStep(0);
      }
    }
  }, [user]);

  // Handle restore draft confirmation
  const handleRestoreDraft = () => {
    if (savedDraftData && user?.email) {
      form.reset(savedDraftData.formData as BudgetWizardFormData);
      setCurrentStep((savedDraftData.currentStep as number) || 0);
      if (savedDraftData.folio) {
        setFolio(savedDraftData.folio as string);
      }
      toast.success('Borrador restaurado correctamente');
      setShowRestoreDraftDialog(false);
      setSavedDraftData(null);
    }
  };

  // Handle discard draft
  const handleDiscardDraft = () => {
    if (user?.email) {
      const storageKey = `aflow-presupuesto-draft-${user.email}`;
      localStorage.removeItem(storageKey);
      setCurrentStep(0);
      toast.info('Borrador descartado. Iniciando nuevo presupuesto');
      setShowRestoreDraftDialog(false);
      setSavedDraftData(null);
    }
  };

  // Save draft to localStorage on form changes
  useEffect(() => {
    if (user?.email) {
      const storageKey = `aflow-presupuesto-draft-${user.email}`;
      const subscription = form.watch((formData) => {
        const draftData = {
          formData,
          currentStep,
          folio,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(draftData));
      });

      return () => subscription.unsubscribe();
    }
  }, [form, currentStep, folio, user]);

  // Mutation for creating budget
  const createBudgetMutation = useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });

      // Clear localStorage draft
      if (user?.email) {
        const storageKey = `aflow-presupuesto-draft-${user.email}`;
        localStorage.removeItem(storageKey);
      }

      // Simulate PDF download
      toast.success('¡Presupuesto generado correctamente!', {
        description: `Folio: ${folio}`,
      });

      // Redirect after a delay
      setTimeout(() => {
        router.push('/portal/presupuesto/consultar');
      }, 2000);
    },
    onError: (error) => {
      console.error('Error creating budget:', error);
      toast.error('Error al crear el presupuesto', {
        description: 'Por favor, intente nuevamente',
      });
    },
  });

  // Validate current step before advancing
  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: string[] = [];
    let fieldLabels: Record<string, string> = {};

    switch (step) {
      case 0:
        fieldsToValidate = [
          'cliente.tipoPersona',
          'cliente.rut',
          'cliente.estado',
          'cliente.sucursalId',
          'cliente.regionId',
          'cliente.ciudadId',
          'cliente.comuna',
          'cliente.descripcionDireccion',
          'cliente.tipoDireccion',
          'cliente.calle',
          'cliente.numero',
          'cliente.email',
          'cliente.telefono',
        ];

        // Add conditional fields based on tipoPersona
        const tipoPersona = form.getValues('cliente.tipoPersona');
        if (tipoPersona === 'persona-natural') {
          fieldsToValidate.push(
            'cliente.primerNombre',
            'cliente.apellidoPaterno'
          );
        } else {
          fieldsToValidate.push(
            'cliente.razonSocial',
            'cliente.giro'
          );
        }

        fieldLabels = {
          'cliente.tipoPersona': 'Tipo de Persona',
          'cliente.rut': 'RUT',
          'cliente.primerNombre': 'Primer Nombre',
          'cliente.segundoNombre': 'Segundo Nombre',
          'cliente.apellidoPaterno': 'Apellido Paterno',
          'cliente.apellidoMaterno': 'Apellido Materno',
          'cliente.razonSocial': 'Razón Social',
          'cliente.giro': 'Giro Comercial',
          'cliente.estado': 'Estado',
          'cliente.sucursalId': 'Sucursal',
          'cliente.regionId': 'Región',
          'cliente.ciudadId': 'Ciudad',
          'cliente.comuna': 'Comuna',
          'cliente.descripcionDireccion': 'Descripción de Dirección',
          'cliente.tipoDireccion': 'Tipo de Dirección',
          'cliente.calle': 'Calle',
          'cliente.numero': 'Número',
          'cliente.email': 'Correo Electrónico',
          'cliente.telefono': 'Teléfono',
        };
        break;
      case 1:
        fieldsToValidate = [
          'proyecto.nombre',
          'proyecto.descripcion',
          'proyecto.fechaInicio',
          'proyecto.fechaTermino',
          'proyecto.responsable',
        ];
        fieldLabels = {
          'proyecto.nombre': 'Nombre del Proyecto',
          'proyecto.descripcion': 'Descripción del Proyecto',
          'proyecto.fechaInicio': 'Fecha de Inicio',
          'proyecto.fechaTermino': 'Fecha de Término',
          'proyecto.responsable': 'Responsable',
        };
        break;
      case 2:
        // Validate that at least one item exists
        const items = form.getValues('items');
        const hasValidItems = items.some((item: BudgetItem) => !item.esComentario);
        if (!hasValidItems) {
          toast.error('Validación de Presupuesto', {
            description: 'Debe agregar al menos un ítem válido al presupuesto. Use el formulario superior para agregar productos o servicios.',
            duration: 5000,
          });
          return false;
        }
        // Validate each item has required fields
        const invalidItems: string[] = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (!item.esComentario) {
            const errors: string[] = [];
            if (!item.proveedor) errors.push('proveedor');
            if (!item.producto) errors.push('producto');
            if (errors.length > 0) {
              invalidItems.push(`Ítem #${i + 1}: falta ${errors.join(' y ')}`);
            }
          }
        }
        if (invalidItems.length > 0) {
          toast.error('Errores en Ítems del Presupuesto', {
            description: (
              <div className="space-y-1">
                <p className="font-semibold">Los siguientes ítems tienen errores:</p>
                <ul className="list-disc list-inside text-sm">
                  {invalidItems.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            ),
            duration: 6000,
          });
          return false;
        }
        toast.success('✓ Presupuesto validado correctamente');
        return true;
      case 3:
        return true;
    }

    // Trigger validation for specific fields
    const result = await form.trigger(fieldsToValidate as unknown as readonly (keyof z.infer<typeof budgetWizardSchema>)[]);

    if (!result) {
      // Get specific errors from form state
      const errors = form.formState.errors;
      const missingFields: string[] = [];

      fieldsToValidate.forEach((field) => {
        const fieldParts = field.split('.');
        let error: unknown = errors;

        // Navigate through nested errors
        for (const part of fieldParts) {
          if (error && typeof error === 'object' && error !== null && part in error) {
            error = (error as Record<string, unknown>)[part];
          } else {
            error = null;
            break;
          }
        }

        // If there's an error for this field, add to missing fields
        if (error && typeof error === 'object' && error !== null && 'message' in error) {
          const label = fieldLabels[field] || field;
          const message = (error as { message?: string }).message || '';
          missingFields.push(`• ${label}: ${message}`);
        }
      });

      if (missingFields.length > 0) {
        const stepName = step === 0 ? 'Datos del Cliente' : 'Datos del Proyecto';
        toast.error(`Errores en ${stepName}`, {
          description: (
            <div className="space-y-2">
              <p className="font-semibold">Por favor, corrija los siguientes campos:</p>
              <div className="text-sm space-y-1">
                {missingFields.slice(0, 5).map((field, idx) => (
                  <div key={idx}>{field}</div>
                ))}
                {missingFields.length > 5 && (
                  <div className="text-xs text-gray-400 mt-1">
                    ...y {missingFields.length - 5} error(es) más
                  </div>
                )}
              </div>
            </div>
          ),
          duration: 8000,
        });
      } else {
        toast.error('Validación Incompleta', {
          description: 'Por favor, complete todos los campos requeridos marcados con asterisco (*)',
          duration: 5000,
        });
      }

      // Scroll to first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      toast.success('✓ Datos guardados correctamente', {
        description: 'Puede continuar al siguiente paso',
      });
    }

    return result;
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateStep(currentStep);

    if (isValid) {
      if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Final step - show confirmation dialog
        setShowFinalizeDialog(true);
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  // Confirm cancel
  const confirmCancel = () => {
    if (user?.email) {
      const storageKey = `aflow-presupuesto-draft-${user.email}`;
      localStorage.removeItem(storageKey);
    }
    form.reset();
    toast.info('Presupuesto cancelado');
    router.push('/portal/presupuesto/consultar');
  };

  // Handle clear form
  const handleClearForm = () => {
    setShowClearDialog(true);
  };

  // Confirm clear form
  const confirmClearForm = () => {
    if (user?.email) {
      const storageKey = `aflow-presupuesto-draft-${user.email}`;
      localStorage.removeItem(storageKey);
    }

    // Reset form to initial values
    form.reset({
      cliente: {
        tipoPersona: 'empresa',
        rut: '',
        primerNombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        razonSocial: '',
        giro: '',
        estado: 'Activo',
        sucursalId: '',
        sucursalNombre: '',
        regionId: '',
        ciudadId: '',
        comuna: '',
        descripcionDireccion: '',
        tipoDireccion: '',
        calle: '',
        numero: '',
        complemento: '',
        email: '',
        telefono: '',
        notas: '',
      },
      proyecto: {
        nombre: '',
        descripcion: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaTermino: '',
        responsable: '',
        observaciones: '',
      },
      items: [],
    });

    // Go back to first step
    setCurrentStep(0);

    // Generate new folio
    const generatedFolio = `PRE-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    setFolio(generatedFolio);

    setShowClearDialog(false);
    toast.success('Formulario limpiado correctamente');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle finalize and submit
  const handleFinalize = async () => {
    const formData = form.getValues();

    // Calculate totals
    const items = formData.items
      .filter((item: BudgetItem) => !item.esComentario)
      .map((item: BudgetItem, index: number) => ({
        id: `item-${index + 1}`,
        producto: item.producto || 'Producto',
        descripcion: item.descripcion || 'Descripción',
        unidadMedida: item.unidad as unknown as 'UN' | 'M2' | 'M3' | 'KG' | 'LT' | 'HR' | 'DIA' | 'MES',
        cantidad: parseFloat(item.cantidad.toString()) || 0,
        precioUnitario: parseFloat(item.valor.toString()) || 0,
        iva: parseFloat(item.iva.toString()) || 19,
        utilidad: parseFloat(item.utilidad.toString()) || 0,
        total: item.total || 0,
      }));

    const subtotal = items.reduce((sum, item) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      return sum + conUtilidad;
    }, 0);

    const iva = items.reduce((sum, item) => {
      const base = item.cantidad * item.precioUnitario;
      const conUtilidad = base * (1 + item.utilidad / 100);
      return sum + conUtilidad * (item.iva / 100);
    }, 0);

    const total = subtotal + iva;

    // Generate client name based on tipo persona
    const clienteName = formData.cliente.tipoPersona === 'persona-natural'
      ? `${formData.cliente.primerNombre || ''} ${formData.cliente.segundoNombre || ''} ${formData.cliente.apellidoPaterno || ''} ${formData.cliente.apellidoMaterno || ''}`.trim()
      : formData.cliente.razonSocial || 'Cliente';

    // Transform data for API
    const budgetData = {
      cliente: clienteName,
      proyecto: formData.proyecto.nombre,
      estado: 'Borrador' as const,
      items,
      subtotal,
      iva,
      total,
      moneda: 'CLP' as const,
      observaciones: formData.proyecto.descripcion,
    };

    createBudgetMutation.mutate(budgetData);
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ClienteForm form={form} />;
      case 1:
        return <ProyectoForm form={form} />;
      case 2:
        return <PresupuestoTable form={form} />;
      case 3:
        return <ResumenFinal form={form} folio={folio} />;
      default:
        return null;
    }
  };

  // Check if next button should be disabled
  const isNextDisabled = () => {
    if (currentStep === 2) {
      const items = form.watch('items');
      return !items || items.filter((item: BudgetItem) => !item.esComentario).length === 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-4">
      <div className="w-full md:max-w-[90vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 pt-0">
          <div className="mb-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/portal/presupuesto/consultar')}
              className="gap-2 text-gray-600 hover:text-gray-900 w-full sm:w-auto justify-start text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline">Volver a Presupuestos</span>
              <span className="inline xs:hidden">Volver</span>
            </Button>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Crear Nuevo Presupuesto
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Complete el proceso paso a paso para generar un presupuesto profesional
          </p>
        </div>

        {/* Wizard Stepper (AFLOW Design) */}
        <BudgetWizardStepper
          currentStep={currentStep}
          steps={WIZARD_STEPS}
        />

        {/* Form */}
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            {/* Step Content */}
            <div className="mb-3">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={WIZARD_STEPS.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onCancel={handleCancel}
              onClearForm={handleClearForm}
              onPreview={() => setShowPreview(true)}
              isNextDisabled={isNextDisabled()}
              isSubmitting={createBudgetMutation.isPending}
            />
          </form>
        </Form>

        {/* Preview Panel */}
        <BudgetPreviewPanel
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          formData={{ ...formValues, folio }}
        />

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cancelar presupuesto?</AlertDialogTitle>
              <AlertDialogDescription>
                Se perderá todo el progreso y los datos ingresados. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continuar editando</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancel}
                className="bg-red-600 hover:bg-red-700"
              >
                Sí, cancelar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Finalize Confirmation Dialog */}
        <AlertDialog open={showFinalizeDialog} onOpenChange={setShowFinalizeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Finalizar y generar PDF?</AlertDialogTitle>
              <AlertDialogDescription>
                Se generará el presupuesto con el folio <strong>{folio}</strong> y se descargará en formato PDF.
                Podrá consultarlo posteriormente en la lista de presupuestos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Revisar nuevamente</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleFinalize}
                className="bg-[#003366] hover:bg-[#00AEEF]"
                disabled={createBudgetMutation.isPending}
              >
                {createBudgetMutation.isPending ? 'Generando...' : 'Sí, finalizar'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Clear Form Confirmation Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Limpiar formulario?</AlertDialogTitle>
              <AlertDialogDescription>
                Se borrarán todos los datos ingresados y se reiniciará el formulario desde el principio.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmClearForm}
                className="bg-red-600 hover:bg-red-700"
              >
                Sí, limpiar todo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Restore Draft Confirmation Dialog */}
        <AlertDialog open={showRestoreDraftDialog} onOpenChange={setShowRestoreDraftDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Restaurar borrador guardado?</AlertDialogTitle>
              <AlertDialogDescription>
                Se encontró un borrador guardado anteriormente. ¿Desea continuar desde donde lo dejó o empezar un nuevo presupuesto?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDiscardDraft}>
                Descartar y empezar nuevo
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRestoreDraft}
                className="bg-[#244F82] hover:bg-[#1a3a5f]"
              >
                Continuar con borrador
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

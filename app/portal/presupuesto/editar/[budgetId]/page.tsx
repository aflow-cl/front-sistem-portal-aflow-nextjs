"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  fetchBudgetById, 
  fetchHistoria, 
  fetchBudgetNotes,
  addBudgetNote,
  duplicateBudget,
  updateBudget
} from "@/app/portal/presupuesto/api/budgetService";
import { BudgetHistoryTimeline } from "../components/BudgetHistoryTimeline";
import { BudgetNotes } from "../components/BudgetNotes";
import { DuplicateBudgetModal } from "../components/DuplicateBudgetModal";
import { EditBudgetHeader } from "../components/EditBudgetHeader";
import { PresupuestoTable } from "../../components/PresupuestoTable";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileText, Building2 } from "lucide-react";
import type { BudgetDetailedData, AccionHistoria, BudgetNote } from "@/types/presupuesto";
import { use } from "react";

interface PageProps {
  params: Promise<{
    budgetId: string;
  }>;
}

export default function EditBudgetPage({ params }: PageProps) {
  const { budgetId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [budget, setBudget] = useState<BudgetDetailedData | null>(null);
  const [history, setHistory] = useState<AccionHistoria[]>([]);
  const [notes, setNotes] = useState<BudgetNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Form setup
  const form = useForm<{
    items: Array<{
      id?: string;
      tipo: string;
      proveedor: string;
      producto: string;
      descripcion: string;
      unidad: string;
      cantidad: number;
      valor: number;
      utilidad: number;
      iva: number;
      bruto: number;
      total: number;
      esComentario: boolean;
    }>;
  }>({
    defaultValues: {
      items: [],
    },
  });

  // Load budget data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [budgetData, historyData, notesData] = await Promise.all([
          fetchBudgetById(budgetId),
          fetchHistoria(),
          fetchBudgetNotes(budgetId),
        ]);

        if (!budgetData) {
          toast.error("Presupuesto no encontrado");
          router.push("/portal/presupuesto/consultar");
          return;
        }

        setBudget(budgetData);
        // Filter history by this budget's folio
        setHistory(historyData.filter(h => h.folio === budgetData.folio));
        setNotes(notesData);

        // Convert budget items to form format
        if (budgetData.items && budgetData.items.length > 0) {
          const formItems = budgetData.items.map(item => ({
            tipo: 'item',
            proveedor: item.proveedor || '',
            producto: item.producto || '',
            descripcion: item.descripcion || '',
            unidad: item.unidadMedida || 'UN',
            cantidad: item.cantidad || 0,
            valor: item.precioUnitario || 0,
            utilidad: item.utilidad || 0,
            iva: item.iva || 19,
            bruto: 0,
            total: item.total || 0,
            esComentario: false,
          }));
          form.reset({ items: formItems });
        }
      } catch (error) {
        console.error("Error loading budget:", error);
        toast.error("Error al cargar el presupuesto");
        router.push("/portal/presupuesto/consultar");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [budgetId, router, form]);

  const handleSave = async () => {
    if (!budget) return;

    setIsSaving(true);
    try {
      // Get items from form
      const formData = form.getValues();
      const updatedBudget = {
        ...budget,
        items: formData.items.map((item) => ({
          id: item.id || `item-${Date.now()}-${Math.random()}`,
          producto: item.producto || '',
          descripcion: item.descripcion || '',
          cantidad: parseFloat(String(item.cantidad)) || 0,
          unidadMedida: (item.unidad || 'UN') as "UN" | "M2" | "M3" | "KG" | "LT" | "HR" | "DIA" | "MES",
          precioUnitario: parseFloat(String(item.valor)) || 0,
          iva: parseFloat(String(item.iva)) || 19,
          utilidad: parseFloat(String(item.utilidad)) || 0,
          total: parseFloat(String(item.total)) || 0,
          proveedor: item.proveedor || '',
        })),
      };
      
      await updateBudget(updatedBudget.id, updatedBudget);
      toast.success("Cambios guardados correctamente", {
        description: `Presupuesto ${budget.folio} actualizado`,
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Error al guardar los cambios");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!budget) return;

    setIsDuplicating(true);
    try {
      const result = await duplicateBudget(budget.id);
      toast.success("Presupuesto duplicado correctamente", {
        description: `Nuevo folio: ${result.folio}`,
      });
      setShowDuplicateModal(false);
      
      // Redirect to the new budget
      setTimeout(() => {
        router.push(`/portal/presupuesto/editar/${result.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error duplicating budget:", error);
      toast.error("Error al duplicar el presupuesto");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleAddNote = async (content: string) => {
    if (!budget || !user) return;

    const newNote = await addBudgetNote(budget.id, content, user.email || "Usuario");
    setNotes([newNote, ...notes]);
  };

  const handleEstadoChange = async (newEstado: BudgetDetailedData["estado"], comentario?: string) => {
    if (!budget) return;

    try {
      // Update budget estado
      const updatedBudget = {
        ...budget,
        estado: newEstado,
      };
      
      await updateBudget(budget.id, updatedBudget);
      setBudget(updatedBudget);

      // Add note with the comment if provided
      if (comentario && user) {
        const noteContent = `Estado cambiado a "${newEstado}": ${comentario}`;
        const newNote = await addBudgetNote(budget.id, noteContent, user.email || "Usuario");
        setNotes([newNote, ...notes]);
      }
    } catch (error) {
      console.error("Error updating estado:", error);
      throw error; // Re-throw to let EditBudgetHeader handle the error
    }
  };

  const handleNotifyEmail = async (data: { to: string; subject: string; message: string }) => {
    // For now, use mailto: link. In production, implement backend email service
    const mailtoLink = `mailto:${encodeURIComponent(data.to)}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.message)}`;
    window.location.href = mailtoLink;
  };

  // Watch form changes to detect modifications
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasChanges(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Header Skeleton */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Presupuesto no encontrado
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              El presupuesto que buscas no existe o ha sido eliminado.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <EditBudgetHeader
        budget={budget}
        onSave={handleSave}
        onDuplicate={() => setShowDuplicateModal(true)}
        onEstadoChange={handleEstadoChange}
        onNotifyEmail={handleNotifyEmail}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />

      {/* Main Content */}
      <div className="w-full md:max-w-[90vw] 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Budget Information - Full Width */}
          <Card className="rounded-xl shadow-sm border-gray-200">
            <CardContent className="p-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="cliente">Cliente</TabsTrigger>
                  <TabsTrigger value="items">Ítems</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-4 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#003366] to-[#00AEEF] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Información General</h2>
                      <p className="text-xs text-gray-600">Datos principales del presupuesto</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Folio</label>
                      <p className="text-base text-gray-900 font-semibold">{budget.folio}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Estado</label>
                      <p className="text-base text-gray-900">{budget.estado}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha de Creación</label>
                      <p className="text-base text-gray-900">
                        {new Date(budget.fecha).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Fecha de Cierre</label>
                      <p className="text-base text-gray-900">
                        {budget.fechaCierre 
                          ? new Date(budget.fechaCierre).toLocaleDateString("es-CL")
                          : "Sin definir"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Autor</label>
                      <p className="text-base text-gray-900">{budget.autor || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Proyecto</label>
                      <p className="text-base text-gray-900">{budget.proyecto || "-"}</p>
                    </div>
                  </div>

                  {budget.descripcion && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">Descripción</label>
                      <p className="text-sm text-gray-600 mt-1">{budget.descripcion}</p>
                    </div>
                  )}
                </TabsContent>

                {/* Cliente Tab */}
                <TabsContent value="cliente" className="space-y-4 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Datos del Cliente</h2>
                      <p className="text-xs text-gray-600">Información de contacto</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Razón Social</label>
                      <p className="text-base text-gray-900 font-semibold">
                        {budget.cliente_info?.razonSocial || budget.cliente}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">RUT</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.rut || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Giro</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.giro || "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">Dirección</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.direccion || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Ciudad</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.ciudad || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Región</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.region || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.email || "-"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                      <p className="text-base text-gray-900">{budget.cliente_info?.telefono || "-"}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4 mt-6">
                  <Form {...form}>
                    <PresupuestoTable form={form} />
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* History & Notes - Split 60/40 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* History Timeline - 60% */}
            <div className="lg:col-span-3">
              <BudgetHistoryTimeline history={history} />
            </div>

            {/* Notes - 40% */}
            <div className="lg:col-span-2">
              <BudgetNotes
                notes={notes}
                onAddNote={handleAddNote}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Modal */}
      <DuplicateBudgetModal
        open={showDuplicateModal}
        onOpenChange={setShowDuplicateModal}
        budget={budget}
        onConfirm={handleDuplicate}
        isLoading={isDuplicating}
      />
    </div>
  );
}

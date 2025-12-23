"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProveedorContactData } from "./ProveedorWizardModal";

const contactSchema = z.object({
  email: z.string().email("Email inválido"),
  telefono: z.string().min(8, "Teléfono debe tener al menos 8 caracteres"),
  notas: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ProveedorContactFormProps {
  initialData: ProveedorContactData | null;
  onSubmit: (data: ProveedorContactData) => void;
  onBack: () => void;
}

export function ProveedorContactForm({
  initialData,
  onSubmit,
  onBack,
}: ProveedorContactFormProps) {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      email: "",
      telefono: "",
      notas: "",
    },
  });

  const handleSubmit = (data: ContactFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
          <p className="text-sm text-gray-600">
            Ingrese los datos de contacto del proveedor.
          </p>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="contacto@proveedor.cl"
                  />
                </FormControl>
                <FormDescription>
                  Email principal de contacto del proveedor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+56 9 1234 5678"
                    maxLength={15}
                  />
                </FormControl>
                <FormDescription>
                  Número de teléfono de contacto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Notas */}
          <FormField
            control={form.control}
            name="notas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas (Opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Información adicional sobre el proveedor..."
                    rows={4}
                    className="resize-none"
                  />
                </FormControl>
                <FormDescription>
                  Cualquier información adicional relevante sobre el proveedor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Atrás
          </Button>
          <Button type="submit" className="bg-[#244F82] hover:bg-[#1a3a5f]">
            Siguiente
          </Button>
        </div>
      </form>
    </Form>
  );
}

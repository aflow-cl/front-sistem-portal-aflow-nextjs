"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle, ArrowLeft, Mail, Phone, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function SoportePage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    telefono: "",
    tipoConsulta: "",
    asunto: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    // Simulación de envío
    toast.success("Mensaje enviado correctamente", {
      description: "Nos pondremos en contacto contigo en las próximas 24 horas",
    });

    // Limpiar formulario
    setFormData({
      nombre: "",
      email: "",
      empresa: "",
      telefono: "",
      tipoConsulta: "",
      asunto: "",
      mensaje: "",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#244F82] hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>

            {/* Header */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-4">
                Centro de Soporte
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Contáctanos y resolveremos tus dudas o problemas lo antes posible.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="w-5 h-5 text-[#244F82]" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-2">Escríbenos directamente</p>
                    <a href="mailto:soporte@aflow.cl" className="text-[#244F82] hover:underline font-medium">
                      soporte@aflow.cl
                    </a>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="w-5 h-5 text-[#244F82]" />
                      Teléfono
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-2">Llámanos</p>
                    <a href="tel:+56212345678" className="text-[#244F82] hover:underline font-medium">
                      +56 2 1234 5678
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                      Lunes a Viernes<br />
                      9:00 - 18:00 hrs
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-[#244F82]" />
                      Horario de Atención
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lunes - Viernes</span>
                        <span className="font-medium text-gray-900">9:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sábado</span>
                        <span className="font-medium text-gray-900">10:00 - 14:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Domingo</span>
                        <span className="font-medium text-gray-900">Cerrado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5" />
                      Soporte Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-100 text-sm mb-4">
                      Planes Pro y Enterprise incluyen soporte prioritario 24/7
                    </p>
                    <Link
                      href="/presupuesto#planes"
                      className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      Ver Planes
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Envíanos un Mensaje</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">
                      Completa el formulario y te responderemos en menos de 24 horas
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="nombre">
                            Nombre Completo <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="nombre"
                            type="text"
                            placeholder="Juan Pérez"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="juan@empresa.cl"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="empresa">Empresa</Label>
                          <Input
                            id="empresa"
                            type="text"
                            placeholder="Nombre de tu empresa"
                            value={formData.empresa}
                            onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            type="tel"
                            placeholder="+56 9 1234 5678"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tipoConsulta">Tipo de Consulta</Label>
                        <Select
                          value={formData.tipoConsulta}
                          onValueChange={(value) => setFormData({ ...formData, tipoConsulta: value })}
                        >
                          <SelectTrigger id="tipoConsulta" className="mt-1">
                            <SelectValue placeholder="Selecciona un tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soporte-tecnico">Soporte Técnico</SelectItem>
                            <SelectItem value="consulta-comercial">Consulta Comercial</SelectItem>
                            <SelectItem value="facturacion">Facturación</SelectItem>
                            <SelectItem value="sugerencia">Sugerencia/Feedback</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="asunto">Asunto</Label>
                        <Input
                          id="asunto"
                          type="text"
                          placeholder="Breve descripción del tema"
                          value={formData.asunto}
                          onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mensaje">
                          Mensaje <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="mensaje"
                          placeholder="Describe tu consulta o problema en detalle..."
                          rows={6}
                          value={formData.mensaje}
                          onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                          required
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Mínimo 20 caracteres
                        </p>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          className="bg-[#244F82] hover:bg-[#1a3a5f] flex-1"
                        >
                          Enviar Mensaje
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData({
                            nombre: "",
                            email: "",
                            empresa: "",
                            telefono: "",
                            tipoConsulta: "",
                            asunto: "",
                            mensaje: "",
                          })}
                        >
                          Limpiar
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500 text-center">
                        Al enviar este formulario, aceptas nuestra{" "}
                        <Link href="/privacidad" className="text-[#244F82] hover:underline">
                          Política de Privacidad
                        </Link>
                      </p>
                    </form>
                  </CardContent>
                </Card>

                {/* FAQ Section */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="text-xl">Preguntas Frecuentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          ¿Cuál es el tiempo de respuesta del soporte?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Plan Básico: 24-48 horas. Plan Pro: 8-12 horas. Plan Enterprise: 2-4 horas con soporte 24/7.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          ¿Puedo agendar una llamada con soporte?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sí, clientes de Plan Pro y Enterprise pueden agendar llamadas con nuestro equipo técnico.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          ¿Ofrecen capacitación para nuevos usuarios?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sí, todos los planes incluyen documentación y tutoriales. Plan Enterprise incluye capacitación personalizada.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

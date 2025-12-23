"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Check, 
  FileText, 
  Calculator, 
  Send, 
  Download,
  Clock,
  BarChart3
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function PresupuestoServicePage() {
  const [showContactModal, setShowContactModal] = useState(false);

  const features = [
    { icon: FileText, title: "Templates Personalizables", description: "Crea presupuestos profesionales en minutos con plantillas adaptadas a tu industria" },
    { icon: Calculator, title: "Cálculos Automáticos", description: "IVA, descuentos, márgenes y totales calculados instantáneamente sin errores" },
    { icon: Send, title: "Envío Automático", description: "Distribución por email, WhatsApp o descarga directa en PDF" },
    { icon: Download, title: "Generación PDF", description: "Documentos profesionales con branding corporativo personalizado" },
    { icon: Clock, title: "Historial Completo", description: "Seguimiento de versiones, estados y modificaciones en tiempo real" },
    { icon: BarChart3, title: "Analytics Integrado", description: "Dashboards con métricas de conversión, tiempos y montos promedio" },
  ];

  const benefits = [
    "Reduce el tiempo de elaboración en un 70%",
    "Elimina errores de cálculo y transcripción",
    "Aumenta la cantidad de cotizaciones mensuales",
    "Mejora la tasa de conversión con seguimiento",
    "Integración con tu catálogo de productos",
    "Acceso multi-usuario con permisos granulares",
  ];

  const plans = [
    {
      name: "Básico",
      price: "10.990",
      period: "mes",
      description: "Ideal para pequeñas empresas y emprendedores",
      features: [
        "Hasta 50 presupuestos/mes",
        "3 usuarios incluidos",
        "Templates básicos",
        "Generación PDF",
        "Soporte por email",
      ],
      cta: "Comenzar",
      popular: false,
    },
    {
      name: "Pro",
      price: "19.990",
      period: "mes",
      description: "Perfecto para empresas en crecimiento",
      features: [
        "Presupuestos ilimitados",
        "10 usuarios incluidos",
        "Templates personalizados",
        "Branding corporativo",
        "Analytics avanzados",
        "Integración con ERP",
        "Soporte prioritario",
      ],
      cta: "Contratar",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "29.990",
      period: "mes",
      description: "Solución completa para grandes organizaciones",
      features: [
        "Todo de Plan Pro",
        "Usuarios ilimitados",
        "API personalizada",
        "Workflows automatizados",
        "Capacitación incluida",
        "SLA garantizado",
        "Gerente de cuenta dedicado",
      ],
      cta: "Contactar",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "¿Cuánto tiempo toma la implementación?",
      answer: "La implementación estándar toma entre 2 a 4 semanas, incluyendo configuración, migración de datos, capacitación del equipo y puesta en marcha. Ofrecemos soporte completo durante todo el proceso.",
    },
    {
      question: "¿Se puede integrar con mi sistema actual?",
      answer: "Sí, AFLOW Presupuesto se integra con los principales ERP (SAP, Oracle, Softland), CRM (Salesforce, HubSpot) y sistemas de inventario mediante APIs robustas. También ofrecemos desarrollo de integraciones personalizadas.",
    },
    {
      question: "¿Qué nivel de personalización ofrecen?",
      answer: "Total personalización de templates, branding corporativo, campos personalizados, workflows y cálculos específicos. El Plan Pro y Enterprise incluyen diseño personalizado de documentos.",
    },
    {
      question: "¿Cómo funciona el soporte técnico?",
      answer: "Plan Básico: soporte por email en horario laboral. Plan Pro: soporte prioritario multicanal. Plan Enterprise: gerente de cuenta dedicado, SLA garantizado y soporte 24/7.",
    },
    {
      question: "¿Puedo migrar mis presupuestos existentes?",
      answer: "Absolutamente. Nuestro equipo te ayuda a migrar todos tus presupuestos históricos, catálogos de productos y configuraciones desde Excel, Word o cualquier otro sistema.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#244F82] via-[#0c3b64] to-[#1a3a5f] text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="bg-[#FF7A00] hover:bg-[#ff8c1a] mb-6">
                Presupuesto Inteligente AFLOW
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-6">
                Crea Presupuestos Profesionales en{" "}
                <span className="text-[#FF7A00]">Minutos, no Horas</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Automatiza tu proceso de cotización, elimina errores y aumenta tu productividad comercial con la solución líder en gestión de presupuestos empresariales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowContactModal(true)}
                  size="lg"
                  className="bg-[#FF7A00] hover:bg-[#ff8c1a] text-white text-base px-8"
                >
                  Solicitar Demo Gratuita
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-base px-8"
                >
                  <a href="#planes">Ver Planes y Precios</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Client Logos Carousel */}
        <section className="py-12 bg-gray-50 border-y">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-600 mb-8 font-medium">
              Empresas que confían en AFLOW
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {["Empresa 1", "Empresa 2", "Empresa 3", "Empresa 4", "Empresa 5"].map((company, i) => (
                <div key={i} className="text-2xl font-bold text-gray-400">{company}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
                Transforma tu Proceso Comercial
              </h2>
              <p className="text-lg text-gray-600">
                Di adiós a los presupuestos manuales y da la bienvenida a la eficiencia y profesionalismo
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-[#244F82] hover:shadow-lg transition-all">
                  <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
                Funcionalidades Clave
              </h2>
              <p className="text-lg text-gray-600">
                Todo lo que necesitas para gestionar presupuestos de manera profesional
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow border-2">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-[#244F82]/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-[#244F82]" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planes" className="py-20 bg-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
                Planes y Precios
              </h2>
              <p className="text-lg text-gray-600">
                Elige el plan perfecto para tu empresa. Todos incluyen soporte y actualizaciones.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-[#FF7A00] border-2 shadow-2xl scale-105' : 'border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[#FF7A00] text-white px-4 py-1">Más Popular</Badge>
                    </div>
                  )}
                  <CardContent className="pt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600"> CLP/{plan.period}</span>
                    </div>

                    <Button
                      onClick={() => setShowContactModal(true)}
                      className={`w-full mb-6 ${plan.popular ? 'bg-[#FF7A00] hover:bg-[#ff8c1a]' : 'bg-[#244F82] hover:bg-[#1a3a5f]'}`}
                    >
                      {plan.cta}
                    </Button>

                    <div className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4 text-center">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                Respuestas a las dudas más comunes sobre Presupuesto AFLOW
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border px-6">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-semibold text-gray-900">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-[#244F82] via-[#0c3b64] to-[#1a3a5f] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
              Comienza a Optimizar tus Presupuestos Hoy
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a cientos de empresas que ya transformaron su proceso comercial con AFLOW
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowContactModal(true)}
                size="lg"
                className="bg-[#FF7A00] hover:bg-[#ff8c1a] text-white text-base px-8"
              >
                Solicitar Demo Gratuita
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-base px-8"
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar Demo</DialogTitle>
            <DialogDescription>
              Completa el formulario y nos contactaremos contigo en menos de 24 horas.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-center text-gray-600">
              Formulario de contacto en desarrollo.
            </p>
            <p className="text-center text-sm text-gray-500">
              Por ahora, contáctanos directamente a: <br />
              <a href="mailto:contacto@aflow.cl" className="text-[#244F82] hover:underline">contacto@aflow.cl</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

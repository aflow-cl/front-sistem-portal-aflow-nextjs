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
  Globe, 
  RefreshCw, 
  Database, 
  FileSearch,
  Mail,
  Zap
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AutomatizacionServicePage() {
  const [showContactModal, setShowContactModal] = useState(false);

  const features = [
    { icon: Globe, title: "Web Scraping Inteligente", description: "Extrae datos de sitios web de forma automatizada y precisa" },
    { icon: Database, title: "Integración de Datos", description: "Consolida información de múltiples fuentes en un solo repositorio" },
    { icon: RefreshCw, title: "Actualización Automática", description: "Datos siempre actualizados con sincronización programable" },
    { icon: FileSearch, title: "Validación y Limpieza", description: "Procesamiento inteligente para garantizar calidad de datos" },
    { icon: Mail, title: "Notificaciones Proactivas", description: "Alertas automáticas ante cambios o anomalías detectadas" },
    { icon: Zap, title: "Procesamiento en Tiempo Real", description: "Captura y procesa información al instante" },
  ];

  const benefits = [
    "Ahorra hasta 80% del tiempo en recopilación manual",
    "Elimina errores humanos en transcripción de datos",
    "Monitoreo 24/7 sin intervención manual",
    "Escalabilidad para procesar miles de fuentes",
    "Cumplimiento normativo y ético garantizado",
    "ROI visible desde el primer mes",
  ];

  const plans = [
    {
      name: "Básico",
      price: "10.990",
      period: "mes",
      description: "Ideal para automatización de procesos simples",
      features: [
        "Hasta 10 fuentes web",
        "Actualizaciones diarias",
        "Almacenamiento 10 GB",
        "Reportes semanales",
        "Soporte por email",
      ],
      cta: "Comenzar",
      popular: false,
    },
    {
      name: "Pro",
      price: "19.990",
      period: "mes",
      description: "Para empresas con necesidades avanzadas",
      features: [
        "Fuentes web ilimitadas",
        "Actualizaciones en tiempo real",
        "Almacenamiento 100 GB",
        "APIs personalizadas",
        "Validación avanzada",
        "Dashboards interactivos",
        "Soporte prioritario 24/7",
      ],
      cta: "Contratar",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "29.990",
      period: "mes",
      description: "Solución completa para grandes operaciones",
      features: [
        "Todo de Plan Pro",
        "Almacenamiento ilimitado",
        "Procesamiento distribuido",
        "Machine Learning incluido",
        "SLA 99.9% uptime",
        "Infraestructura dedicada",
        "Consultoría estratégica",
      ],
      cta: "Contactar",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "¿Qué tipo de sitios web pueden automatizar?",
      answer: "Podemos automatizar la extracción de datos desde casi cualquier sitio público: portales de noticias, marketplaces, sitios gubernamentales, redes sociales, directorios empresariales, y más. Respetamos robots.txt y términos de servicio de cada sitio.",
    },
    {
      question: "¿Es legal la automatización de información web?",
      answer: "Sí, siempre y cuando se respeten las normativas de cada sitio (robots.txt, términos de uso) y las leyes de protección de datos. AFLOW garantiza cumplimiento normativo completo, solo extrayendo información pública y respetando límites de acceso.",
    },
    {
      question: "¿Con qué frecuencia se actualizan los datos?",
      answer: "Depende del plan: Plan Básico permite actualizaciones diarias programadas. Plan Pro y Enterprise ofrecen sincronización en tiempo real o intervalos personalizados (cada hora, cada 15 minutos, etc.).",
    },
    {
      question: "¿Qué pasa si un sitio web cambia su estructura?",
      answer: "Nuestro sistema incluye detección automática de cambios estructurales y alertas proactivas. El equipo técnico ajusta los extractores rápidamente (generalmente en 24-48 horas) sin costo adicional en planes Pro y Enterprise.",
    },
    {
      question: "¿Puedo integrar los datos con mis sistemas existentes?",
      answer: "Absolutamente. Ofrecemos múltiples opciones: APIs REST, webhooks, exportación a CSV/Excel/JSON, integración directa con bases de datos (PostgreSQL, MySQL, MongoDB) y conexión con herramientas de BI (Power BI, Tableau, Looker).",
    },
  ];

  const useCases = [
    {
      title: "Monitoreo de Competencia",
      description: "Rastrea precios, productos y promociones de competidores en tiempo real",
      icon: "🔍"
    },
    {
      title: "Lead Generation",
      description: "Captura información de contacto de potenciales clientes desde directorios y LinkedIn",
      icon: "👥"
    },
    {
      title: "Análisis de Mercado",
      description: "Recopila datos de mercado, tendencias y sentimientos desde múltiples fuentes",
      icon: "📊"
    },
    {
      title: "Compliance y Regulación",
      description: "Monitorea cambios normativos en sitios gubernamentales automáticamente",
      icon: "⚖️"
    },
    {
      title: "Medios y Noticias",
      description: "Agrega contenido desde portales de noticias para análisis y resúmenes",
      icon: "📰"
    },
    {
      title: "E-commerce",
      description: "Sincroniza catálogos de productos desde proveedores y marketplaces",
      icon: "🛒"
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
                Automatización Web AFLOW
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold mb-6">
                Automatiza la Recopilación de{" "}
                <span className="text-[#FF7A00]">Información Web</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Extrae, procesa y consolida datos desde cualquier sitio web de forma automática. Ahorra tiempo, elimina errores y toma decisiones basadas en información actualizada.
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

        {/* Client Logos */}
        <section className="py-12 bg-gray-50 border-y">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-600 mb-8 font-medium">
              Empresas que automatizan con AFLOW
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {["Retail Corp", "Tech Solutions", "Finance Group", "Media Digital", "InnovaLabs"].map((company, i) => (
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
                Libera tu Equipo de Tareas Repetitivas
              </h2>
              <p className="text-lg text-gray-600">
                Deja que la tecnología haga el trabajo pesado mientras tu equipo se enfoca en análisis y estrategia
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
                Tecnología de Vanguardia
              </h2>
              <p className="text-lg text-gray-600">
                Potencia tu negocio con automatización inteligente y escalable
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

        {/* Use Cases Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
                Casos de Uso Reales
              </h2>
              <p className="text-lg text-gray-600">
                Aplicaciones prácticas de automatización web en diferentes industrias
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {useCases.map((useCase, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{useCase.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{useCase.title}</h3>
                    <p className="text-sm text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planes" className="py-20 bg-gradient-to-b from-blue-50 to-white scroll-mt-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4">
                Planes y Precios
              </h2>
              <p className="text-lg text-gray-600">
                Soluciones adaptadas a cada necesidad empresarial
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
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900 mb-4 text-center">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-600 mb-12 text-center">
                Respuestas sobre automatización web con AFLOW
              </p>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-gray-50 rounded-lg border px-6">
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
              Automatiza tu Recopilación de Datos Hoy
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Libera a tu equipo del trabajo manual y enfócate en lo que realmente importa
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

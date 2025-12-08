"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Users, BarChart3, Globe, Sparkles } from "lucide-react";

/**
 * Landing Page - AFLOW Portal
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-aflow-orange" />
            <h1 className="text-2xl font-poppins font-bold text-white">AFLOW</h1>
          </div>
          <Link href="/login">
            <Button 
              variant="aflow" 
              className="gap-2 shadow-lg hover:shadow-aflow-orange/50 transition-all"
            >
              Ingresar al Portal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 animate-in fade-in duration-1000">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aflow-orange/10 border border-aflow-orange/20 text-aflow-orange text-sm font-medium mb-4">
                <Zap className="h-4 w-4" />
                Sistema Empresarial Modular
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white leading-tight">
              Gestiona tu empresa
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-aflow-orange to-orange-600">
                de forma inteligente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
              AFLOW Portal centraliza todos tus procesos empresariales en una plataforma moderna, 
              segura y fácil de usar. Cotizaciones, finanzas, clientes y más en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/login">
                <Button 
                  variant="aflow" 
                  size="lg" 
                  className="h-14 px-8 text-lg gap-2 shadow-2xl hover:shadow-aflow-orange/50 transition-all"
                >
                  Comenzar Ahora
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg border-gray-600 text-white hover:bg-white/10"
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-400 font-inter">
              Módulos diseñados para optimizar cada área de tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-gray-900/50 border-gray-800 hover:border-aflow-orange/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-aflow-orange/10 flex items-center justify-center group-hover:bg-aflow-orange/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-white">
                  Dashboard Inteligente
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Visualiza métricas clave, actividad reciente y accede rápidamente a las acciones más importantes.
                </p>
                <div className="flex items-center gap-2 text-sm text-aflow-orange">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Métricas en tiempo real</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gray-900/50 border-gray-800 hover:border-aflow-orange/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-aflow-orange/10 flex items-center justify-center group-hover:bg-aflow-orange/20 transition-colors">
                  <Shield className="h-6 w-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-white">
                  Seguridad Avanzada
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Control de acceso basado en roles (RBAC) con permisos granulares para cada usuario.
                </p>
                <div className="flex items-center gap-2 text-sm text-aflow-orange">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>3 niveles de permisos</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gray-900/50 border-gray-800 hover:border-aflow-orange/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-aflow-orange/10 flex items-center justify-center group-hover:bg-aflow-orange/20 transition-colors">
                  <Users className="h-6 w-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-white">
                  Gestión de Clientes
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  CRM completo con historial de interacciones, segmentación y campañas automatizadas.
                </p>
                <div className="flex items-center gap-2 text-sm text-aflow-orange">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Base de datos centralizada</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-gray-900/50 border-gray-800 hover:border-aflow-orange/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-aflow-orange/10 flex items-center justify-center group-hover:bg-aflow-orange/20 transition-colors">
                  <Globe className="h-6 w-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-white">
                  Comercio Exterior
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Gestiona importaciones y exportaciones con tracking de documentos y cálculo de aranceles.
                </p>
                <div className="flex items-center gap-2 text-sm text-aflow-orange">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Integración aduanera</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-gray-900/50 border-gray-800 hover:border-aflow-orange/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-aflow-orange/10 flex items-center justify-center group-hover:bg-aflow-orange/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-white">
                  Cotizaciones Digitales
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Crea, envía y gestiona cotizaciones profesionales con generación automática de PDF.
                </p>
                <div className="flex items-center gap-2 text-sm text-aflow-orange">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Plantillas personalizables</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-gray-900/50 border-gray-800 hover:border-aflow-orange/50 transition-all group">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-aflow-orange/10 flex items-center justify-center group-hover:bg-aflow-orange/20 transition-colors">
                  <Zap className="h-6 w-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-white">
                  Módulos Integrados
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Finanzas, guardias, contratantes y más. Todo sincronizado en tiempo real.
                </p>
                <div className="flex items-center gap-2 text-sm text-aflow-orange">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>8 módulos disponibles</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-aflow-orange to-orange-600 border-none shadow-2xl">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-poppins font-bold text-white">
                ¿Listo para transformar tu negocio?
              </h2>
              <p className="text-xl text-white/90 font-inter">
                Únete a las empresas que ya confían en AFLOW Portal para gestionar sus operaciones.
              </p>
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg bg-white text-aflow-orange hover:bg-gray-100 gap-2 shadow-xl"
                >
                  Comenzar Gratis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-aflow-orange" />
              <span className="text-lg font-poppins font-bold text-white">AFLOW Portal</span>
            </div>
            <p className="text-gray-400 text-sm font-inter">
              © {new Date().getFullYear()} AFLOW. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

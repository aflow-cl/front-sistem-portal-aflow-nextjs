import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-black py-20 md:py-32 overflow-hidden">
          <ParticleBackground />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white mb-6">
                Bienvenido a{" "}
                <span className="text-aflow-orange">AFLOW Portal</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Sistema Corporativo Modular Empresarial. Gestiona tu negocio de
                manera eficiente, segura y escalable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-aflow-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-aflow-orange/30"
                >
                  Iniciar Sesión
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium border border-white/30 hover:bg-white/20 hover:border-aflow-orange transition-colors"
                >
                  Conocer más
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-dark mb-4">
                ¿Por qué elegir AFLOW?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Potencia tu negocio con nuestra plataforma integral diseñada
                para la excelencia operacional.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-aflow-orange transition-colors">
                <div className="w-12 h-12 bg-aflow-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                  Seguridad Avanzada
                </h3>
                <p className="text-gray-600">
                  Protección de datos empresariales con autenticación robusta y
                  control de acceso basado en roles.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-aflow-orange transition-colors">
                <div className="w-12 h-12 bg-aflow-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                  Alta Performance
                </h3>
                <p className="text-gray-600">
                  Construido con Next.js 15 para máxima velocidad, eficiencia y
                  experiencia de usuario superior.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-aflow-orange transition-colors">
                <div className="w-12 h-12 bg-aflow-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-aflow-orange" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                  Gestión Colaborativa
                </h3>
                <p className="text-gray-600">
                  Múltiples módulos integrados para trabajo en equipo,
                  productividad y control total.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-aflow-orange to-orange-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Accede al portal y descubre todas las funcionalidades disponibles
              para tu organización.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-aflow-orange px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Iniciar Sesión Ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

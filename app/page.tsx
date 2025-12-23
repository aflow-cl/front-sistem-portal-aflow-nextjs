import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Users, 
  Settings, 
  Link2, 
  BarChart3, 
  Cloud, 
  FileSignature, 
  Globe,
  CheckCircle2,
  FileText,
  Workflow
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: 'rgb(10, 26, 55)' }}>
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: 'rgb(10, 26, 55)' }}>
          <ParticleBackground />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex rounded-full bg-orange-500/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-orange-400 border border-orange-500/30">
                  Innovación + Eficiencia + Escalabilidad
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-white leading-tight">
                  Bienvenido a{" "}
                  <span className="text-orange-500">AFLOW</span>{" "}
                  <span className="text-blue-500">Portal</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                  Sistema Corporativo Modular Empresarial. Gestiona tu negocio de
                  manera eficiente, segura y escalable con tecnología de vanguardia.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 bg-aflow-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-aflow-blue-light transition-colors shadow-lg shadow-aflow-blue/30"
                  >
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#soluciones"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium border border-white/30 hover:bg-white/20 hover:border-aflow-blue transition-colors"
                  >
                    Explorar Soluciones
                  </a>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-orange-500/20 to-blue-500/20 opacity-50 blur-3xl" />
                <div className="relative rounded-3xl border-2 border-white/10 bg-gradient-to-br from-aflow-blue/40 to-blue-900/40 backdrop-blur-sm p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/20 rounded w-3/4" />
                    <div className="h-4 bg-white/20 rounded w-full" />
                    <div className="h-4 bg-white/20 rounded w-5/6" />
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-24 bg-white/10 rounded-lg" />
                      <div className="h-24 bg-white/10 rounded-lg" />
                      <div className="h-24 bg-white/10 rounded-lg" />
                      <div className="h-24 bg-white/10 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Soluciones Section */}
        <section id="soluciones" className="py-20 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-dark mb-4">
                Un ecosistema digital <span className="text-aflow-blue">para tu crecimiento</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Integramos desarrollo, automatización, analítica y nube en una sola plataforma adaptable a tu empresa.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Settings,
                  title: "Automatización de Procesos",
                  desc: "Optimiza tareas operativas, elimina retrabajos y reduce tiempos en más del 50% con flujos inteligentes.",
                },
                {
                  icon: Link2,
                  title: "Integración de Sistemas",
                  desc: "Conecta ERP, CRM, bancos y plataformas externas mediante APIs seguras y escalables en la nube.",
                },
                {
                  icon: BarChart3,
                  title: "Data & Analytics",
                  desc: "Convierte datos en decisiones con tableros en tiempo real, KPIs y reportes de rendimiento estratégico.",
                },
                {
                  icon: Cloud,
                  title: "Cloud & DevOps",
                  desc: "Despliegues automáticos, monitoreo continuo y máxima disponibilidad sobre infraestructura cloud.",
                },
                {
                  icon: FileSignature,
                  title: "Firma Digital y Documentos",
                  desc: "Digitaliza contratos, órdenes y documentos con trazabilidad y cumplimiento normativo.",
                },
                {
                  icon: Globe,
                  title: "Sitios y Portales Corporativos",
                  desc: "Crea portales empresariales de autoservicio y presencia digital con diseño profesional.",
                },
              ].map((item) => (
                <div 
                  key={item.title} 
                  className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200 hover:border-aflow-blue hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-aflow-blue/10 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-aflow-blue" />
                  </div>
                  <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Productos Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-dark mb-4">
                Nuestros <span className="text-aflow-blue">Productos</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Soluciones especializadas diseñadas para optimizar la gestión y automatización de tus procesos empresariales.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Tarjeta Presupuesto */}
              <Link 
                href="/presupuesto"
                className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-aflow-blue overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-aflow-blue/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-8 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-aflow-blue to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-poppins font-bold text-gray-dark mb-4 group-hover:text-aflow-blue transition-colors">
                    Gestión de Presupuestos
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Sistema completo para crear, gestionar y hacer seguimiento de presupuestos empresariales. 
                    Control total sobre tus cotizaciones, aprobaciones y generación de documentos.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Creación y edición de presupuestos</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Gestión de clientes y proveedores</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Historial completo y trazabilidad</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Reportes y análisis en tiempo real</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-aflow-blue font-semibold group-hover:gap-4 transition-all">
                    Ver más detalles
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-aflow-blue to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>

              {/* Tarjeta Automatización */}
              <Link 
                href="/automatizacion"
                className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-orange-500 overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-8 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Workflow className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-poppins font-bold text-gray-dark mb-4 group-hover:text-orange-500 transition-colors">
                    Automatización de Procesos
                  </h3>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Optimiza y automatiza tus flujos de trabajo empresariales. Reduce tiempos, 
                    elimina errores manuales y aumenta la eficiencia operativa de tu organización.
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Flujos de trabajo personalizables</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Integración con sistemas existentes</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Notificaciones y alertas automáticas</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">Reducción de costos operativos</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-orange-500 font-semibold group-hover:gap-4 transition-all">
                    Ver más detalles
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">
                ¿Necesitas más información sobre nuestros productos?
              </p>
              <Link
                href="/soporte"
                className="inline-flex items-center gap-2 text-aflow-blue hover:text-blue-700 font-semibold transition-colors"
              >
                Contáctanos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Beneficios Section */}
        <section id="beneficios" className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-dark mb-4">
                ¿Por qué elegir <span className="text-aflow-blue">AFLOW</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                AFLOW Portal impulsa la transformación digital con soluciones reales que mejoran la productividad y el control operativo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                "Implementación en 4 semanas",
                "Integraciones con ERP, CRM y bancos",
                "Reducción de tiempos operativos 30–50%",
                "Soporte local y SLA garantizado",
                "Cumplimiento normativo y seguridad avanzada",
                "Escalabilidad sin límites en la nube",
              ].map((benefit) => (
                <div 
                  key={benefit} 
                  className="flex items-start gap-3 rounded-xl border-2 border-gray-200 bg-white p-6 hover:shadow-lg hover:border-aflow-blue transition-all"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-dark font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seguridad y Performance Section */}
        <section className="py-20 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-dark mb-4">
                Tecnología de <span className="text-aflow-blue">vanguardia</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Construido con las mejores prácticas para garantizar seguridad, performance y experiencia de usuario superior.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-aflow-blue transition-colors">
                <div className="w-12 h-12 bg-aflow-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-aflow-blue" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                  Seguridad Avanzada
                </h3>
                <p className="text-gray-600">
                  Protección de datos empresariales con autenticación robusta y
                  control de acceso basado en roles.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-aflow-blue transition-colors">
                <div className="w-12 h-12 bg-aflow-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-aflow-blue" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-gray-dark mb-3">
                  Alta Performance
                </h3>
                <p className="text-gray-600">
                  Construido con Next.js 15 para máxima velocidad, eficiencia y
                  experiencia de usuario superior.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:border-aflow-blue transition-colors">
                <div className="w-12 h-12 bg-aflow-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-aflow-blue" />
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

        {/* Sectores Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-gray-dark mb-4">
                Tecnología adaptada a <span className="text-aflow-blue">cada industria</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Desde manufactura hasta servicios financieros, nuestras soluciones se ajustan a las necesidades de cada sector.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                "Retail & eCommerce",
                "Construcción & Obras",
                "Educación & ONG",
                "Servicios Financieros",
                "Logística & Transporte",
                "Salud & Farmacéutica",
              ].map((sector) => (
                <div
                  key={sector}
                  className="rounded-xl border-2 border-gray-200 bg-white py-8 px-6 text-center hover:bg-blue-50 hover:border-aflow-blue hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-poppins font-semibold text-gray-dark">{sector}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-aflow-blue via-blue-600 to-blue-700 text-center text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
              Lleva tu empresa al siguiente nivel
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Accede al portal y descubre todas las funcionalidades disponibles para tu organización. Digitaliza tus procesos y maximiza la eficiencia operativa.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-aflow-blue px-8 py-4 rounded-lg font-semibold text-base hover:bg-gray-100 transition-colors shadow-xl"
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

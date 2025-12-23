import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#244F82] hover:underline mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>

            <div className="bg-white rounded-xl shadow-sm border p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-[#244F82]" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900">
                    Política de Privacidad
                  </h1>
                  <p className="text-gray-600 mt-1">Última actualización: Diciembre 2025</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introducción</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    AFLOW (&quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Compañía&quot;) se compromete a proteger la privacidad de sus usuarios (&quot;usted&quot; o &quot;el Usuario&quot;). Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos su información personal cuando utiliza nuestros servicios de portal empresarial AFLOW.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Al acceder o utilizar nuestros servicios, usted acepta las prácticas descritas en esta Política de Privacidad. Si no está de acuerdo con estos términos, por favor no utilice nuestros servicios.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Información que Recopilamos</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Información Proporcionada Directamente</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Datos de registro: nombre, correo electrónico, teléfono, cargo, empresa</li>
                    <li>Información de perfil: foto, preferencias, configuraciones</li>
                    <li>Datos empresariales: RUT, razón social, dirección, giro comercial</li>
                    <li>Información de pago: datos de facturación (procesados de forma segura)</li>
                    <li>Contenido generado: presupuestos, documentos, notas, archivos</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Información Recopilada Automáticamente</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Datos de uso: páginas visitadas, tiempo de sesión, acciones realizadas</li>
                    <li>Información técnica: dirección IP, navegador, sistema operativo, dispositivo</li>
                    <li>Cookies y tecnologías similares: para mejorar la experiencia del usuario</li>
                    <li>Logs de actividad: historial de cambios, auditoría de seguridad</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cómo Usamos su Información</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Utilizamos la información recopilada para los siguientes propósitos:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Provisión de servicios:</strong> Operar, mantener y mejorar la plataforma AFLOW</li>
                    <li><strong>Personalización:</strong> Adaptar la experiencia según sus preferencias y necesidades</li>
                    <li><strong>Comunicación:</strong> Enviar notificaciones, actualizaciones y soporte técnico</li>
                    <li><strong>Seguridad:</strong> Detectar, prevenir y responder a fraudes o actividades no autorizadas</li>
                    <li><strong>Análisis:</strong> Comprender cómo se usa la plataforma para mejoras continuas</li>
                    <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y normativas</li>
                    <li><strong>Marketing:</strong> Enviar información sobre nuevos productos y servicios (con su consentimiento)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartir Información</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    No vendemos su información personal. Podemos compartir sus datos en las siguientes circunstancias:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar (hosting, pagos, analytics)</li>
                    <li><strong>Socios empresariales:</strong> Con su consentimiento explícito para integraciones</li>
                    <li><strong>Cumplimiento legal:</strong> Cuando lo requiera la ley o autoridades competentes</li>
                    <li><strong>Transferencias empresariales:</strong> En caso de fusión, adquisición o venta de activos</li>
                    <li><strong>Consentimiento:</strong> Cuando usted autorice expresamente el intercambio</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seguridad de los Datos</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Encriptación TLS/SSL para datos en tránsito</li>
                    <li>Encriptación AES-256 para datos en reposo</li>
                    <li>Autenticación multifactor (MFA) disponible</li>
                    <li>Controles de acceso basados en roles (RBAC)</li>
                    <li>Auditorías de seguridad regulares</li>
                    <li>Backups automáticos cifrados</li>
                    <li>Monitoreo 24/7 de amenazas</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    A pesar de nuestros esfuerzos, ningún sistema es 100% seguro. Le recomendamos usar contraseñas fuertes y mantener sus credenciales confidenciales.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sus Derechos</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    De acuerdo con la Ley N° 19.628 sobre Protección de Datos Personales de Chile, usted tiene derecho a:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Acceso:</strong> Solicitar información sobre qué datos personales tenemos sobre usted</li>
                    <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                    <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos (derecho al olvido)</li>
                    <li><strong>Portabilidad:</strong> Obtener una copia de sus datos en formato estructurado</li>
                    <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos para ciertos fines</li>
                    <li><strong>Limitación:</strong> Restringir cómo procesamos su información</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Para ejercer estos derechos, contáctenos en:{" "}
                    <a href="mailto:privacidad@aflow.cl" className="text-[#244F82] hover:underline font-medium">
                      privacidad@aflow.cl
                    </a>
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retención de Datos</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Conservamos su información personal mientras su cuenta esté activa o sea necesario para proporcionar servicios. Después de la terminación de su cuenta, retenemos ciertos datos durante el período legalmente requerido (generalmente 5-7 años para fines contables y legales) y luego procedemos a su eliminación segura.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies y Tecnologías Similares</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Utilizamos cookies y tecnologías similares para:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Mantener su sesión activa</li>
                    <li>Recordar sus preferencias</li>
                    <li>Analizar el uso de la plataforma</li>
                    <li>Mejorar la seguridad</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Puede gestionar las cookies desde la configuración de su navegador, aunque esto puede afectar la funcionalidad del sitio.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Transferencias Internacionales</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Sus datos pueden ser transferidos y procesados en servidores ubicados fuera de Chile, específicamente en centros de datos certificados en Estados Unidos y Europa. Garantizamos que estas transferencias cumplen con los estándares de protección adecuados mediante cláusulas contractuales estándar y certificaciones como SOC 2 e ISO 27001.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Menores de Edad</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado datos de un menor, procederemos a eliminarlos inmediatamente.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Cambios a esta Política</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos sobre cambios significativos mediante correo electrónico o un aviso destacado en la plataforma. La fecha de &quot;Última actualización&quot; al inicio del documento indica cuándo se realizaron los últimos cambios.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contacto</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el tratamiento de sus datos personales, contáctenos:
                  </p>
                  <div className="bg-blue-50 border-l-4 border-[#244F82] p-4 rounded">
                    <p className="font-medium text-gray-900 mb-2">AFLOW - Protección de Datos</p>
                    <p className="text-gray-700">Email: <a href="mailto:privacidad@aflow.cl" className="text-[#244F82] hover:underline">privacidad@aflow.cl</a></p>
                    <p className="text-gray-700">Teléfono: +56 2 1234 5678</p>
                    <p className="text-gray-700">Dirección: Av. Providencia 1234, Santiago, Chile</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

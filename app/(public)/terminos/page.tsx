import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FileText, ArrowLeft } from "lucide-react";

export default function TerminosPage() {
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
                <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[#FF7A00]" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-poppins font-bold text-gray-900">
                    Términos y Condiciones
                  </h1>
                  <p className="text-gray-600 mt-1">Última actualización: Diciembre 2025</p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Bienvenido a AFLOW Portal. Al acceder y utilizar este servicio, usted acepta estar sujeto a estos Términos y Condiciones (&quot;Términos&quot;), todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio y sus servicios. Los materiales contenidos en este sitio web están protegidos por las leyes de propiedad intelectual aplicables.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Definiciones</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>&quot;Servicio&quot;:</strong> La plataforma AFLOW Portal y todas sus funcionalidades</li>
                    <li><strong>&quot;Usuario&quot;:</strong> Cualquier persona o entidad que acceda y utilice el Servicio</li>
                    <li><strong>&quot;Cuenta&quot;:</strong> Perfil de usuario creado para acceder al Servicio</li>
                    <li><strong>&quot;Contenido&quot;:</strong> Información, datos, textos, software, música, sonido, fotografías, gráficos, videos, mensajes u otros materiales</li>
                    <li><strong>&quot;Cliente&quot;:</strong> Empresa u organización que contrata el Servicio</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Registro y Cuenta</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Creación de Cuenta</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Para utilizar ciertas funciones del Servicio, debe crear una cuenta proporcionando información precisa, completa y actualizada. Es responsable de:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Mantener la confidencialidad de su contraseña</li>
                    <li>Todas las actividades que ocurran bajo su cuenta</li>
                    <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                    <li>Asegurar que su información de contacto esté actualizada</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Elegibilidad</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Debe ser mayor de 18 años y tener capacidad legal para celebrar contratos vinculantes. Al crear una cuenta en nombre de una empresa u organización, declara tener autoridad para vincular a dicha entidad a estos Términos.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso del Servicio</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Licencia de Uso</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    AFLOW le otorga una licencia limitada, no exclusiva, intransferible y revocable para acceder y usar el Servicio de acuerdo con estos Términos.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Restricciones de Uso</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Usted acepta NO:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Copiar, modificar, distribuir o vender cualquier parte del Servicio sin autorización</li>
                    <li>Realizar ingeniería inversa o intentar extraer el código fuente</li>
                    <li>Usar el Servicio para fines ilegales o no autorizados</li>
                    <li>Transmitir virus, malware o código malicioso</li>
                    <li>Intentar obtener acceso no autorizado a sistemas o redes</li>
                    <li>Interferir o interrumpir el Servicio o servidores</li>
                    <li>Crear cuentas mediante métodos automatizados</li>
                    <li>Utilizar el Servicio para enviar spam o contenido no solicitado</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Contenido del Usuario</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Propiedad</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Usted conserva todos los derechos sobre el contenido que carga, publica o almacena en el Servicio. Al utilizar el Servicio, nos otorga una licencia mundial, no exclusiva, libre de regalías para usar, almacenar, mostrar y procesar su contenido únicamente con el fin de operar y mejorar el Servicio.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Responsabilidad</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Usted es el único responsable del contenido que publica y de las consecuencias de compartirlo. Declaramos que no revisamos previamente el contenido del usuario, pero nos reservamos el derecho de eliminar o deshabilitar acceso a contenido que viole estos Términos.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Planes y Pagos</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Suscripciones</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El Servicio se ofrece bajo diferentes planes de suscripción. Al suscribirse, acepta pagar todas las tarifas aplicables según el plan seleccionado.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Facturación</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                    <li>Las tarifas se facturan por adelantado de forma mensual o anual</li>
                    <li>La facturación se realiza automáticamente hasta que cancele</li>
                    <li>Todos los precios están en pesos chilenos (CLP) más IVA</li>
                    <li>Los pagos no son reembolsables excepto cuando lo requiera la ley</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Cambios de Precio</h3>
                  <p className="text-gray-700 leading-relaxed">
                    AFLOW se reserva el derecho de modificar las tarifas con un aviso previo de 30 días. Los cambios de precio no afectan el período de facturación actual.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cancelación y Terminación</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Por el Usuario</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Puede cancelar su suscripción en cualquier momento desde la configuración de su cuenta. La cancelación será efectiva al final del período de facturación actual.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Por AFLOW</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Podemos suspender o terminar su acceso inmediatamente si:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Viola estos Términos o nuestras políticas</li>
                    <li>Su conducta daña a AFLOW o a otros usuarios</li>
                    <li>No paga las tarifas adeudadas</li>
                    <li>Lo requiere la ley o una orden judicial</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Propiedad Intelectual</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    El Servicio y todo su contenido, características y funcionalidad (incluyendo pero no limitado a información, software, texto, gráficos, logotipos, íconos, imágenes, clips de audio, descargas, interfaces, código) son propiedad de AFLOW, sus licenciantes o proveedores de contenido y están protegidos por:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Leyes de derechos de autor chilenas e internacionales</li>
                    <li>Leyes de marcas registradas</li>
                    <li>Leyes de patentes</li>
                    <li>Otras leyes de propiedad intelectual</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Garantías y Limitaciones</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Disponibilidad del Servicio</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Nos esforzamos por mantener el Servicio disponible 24/7, pero no garantizamos que siempre esté disponible, sea ininterrumpido, oportuno o libre de errores. Podemos realizar mantenimiento programado con aviso previo.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Renuncia de Garantías</h3>
                  <p className="text-gray-700 leading-relaxed">
                    EL SERVICIO SE PROPORCIONA &quot;TAL CUAL&quot; Y &quot;SEGÚN DISPONIBILIDAD&quot; SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitación de Responsabilidad</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, AFLOW NO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, INCLUYENDO PERO NO LIMITADO A:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles</li>
                    <li>Acceso no autorizado a sus datos o sistemas</li>
                    <li>Errores u omisiones en el contenido</li>
                    <li>Interrupción o terminación del Servicio</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    NUESTRA RESPONSABILIDAD TOTAL NO EXCEDERÁ EL MONTO QUE HAYA PAGADO EN LOS ÚLTIMOS 12 MESES.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnización</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Usted acepta indemnizar, defender y eximir de responsabilidad a AFLOW, sus directores, empleados, agentes y socios de cualquier reclamo, demanda, pérdida, responsabilidad y gasto (incluyendo honorarios de abogados) que surjan de: (a) su uso del Servicio; (b) violación de estos Términos; (c) violación de derechos de terceros; o (d) su contenido.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Ley Aplicable y Jurisdicción</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Estos Términos se regirán e interpretarán de acuerdo con las leyes de Chile, sin dar efecto a ningún principio de conflictos de leyes. Cualquier disputa será resuelta en los tribunales competentes de Santiago, Chile.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modificaciones</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios sustanciales se notificarán con 30 días de anticipación. El uso continuado del Servicio después de los cambios constituye su aceptación de los nuevos Términos.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Disposiciones Generales</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Totalidad del Acuerdo:</strong> Estos Términos constituyen el acuerdo completo entre usted y AFLOW</li>
                    <li><strong>Renuncia:</strong> El no ejercicio de un derecho no constituye renuncia al mismo</li>
                    <li><strong>Divisibilidad:</strong> Si alguna disposición es inválida, las demás permanecen vigentes</li>
                    <li><strong>Cesión:</strong> No puede transferir estos Términos sin nuestro consentimiento</li>
                    <li><strong>Idioma:</strong> En caso de conflicto entre versiones, prevalece la versión en español</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contacto</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Si tiene preguntas sobre estos Términos y Condiciones, contáctenos:
                  </p>
                  <div className="bg-orange-50 border-l-4 border-[#FF7A00] p-4 rounded">
                    <p className="font-medium text-gray-900 mb-2">AFLOW - Soporte Legal</p>
                    <p className="text-gray-700">Email: <a href="mailto:legal@aflow.cl" className="text-[#244F82] hover:underline">legal@aflow.cl</a></p>
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

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import Image from "next/image";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Email inválido")
    .toLowerCase(),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Carousel images/slides
const carouselSlides = [
 {
    image: "/images/company/LogoSinFondoTexto.png",
    title: "Transforma tu Empresa con AFLOW",
    description: "Automatiza, integra y acelera tus procesos clave."
  },
  {
    image: "/images/company/LogoSinFondoTexto.png",
    title: "Procesos que Fluyen, Negocios que Escalan",
    description: "Optimiza tu operación con flujos inteligentes."
  },
  {
    image: "/images/company/LogoSinFondoTexto.png",
    title: "Presupuestos Inteligentes en Minutos",
    description: "Crea y gestiona presupuestos con total agilidad."
  }
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);

      const result = await login(data);

      if (result.success) {
        toast.success("Inicio de sesión exitoso", {
          description: "Redirigiendo al portal...",
        });

        // Redirect to private area
        setTimeout(() => {
          router.push("/portal");
          router.refresh();
        }, 500);
      } else {
        toast.error("Error al iniciar sesión", {
          description: result.error || "Credenciales inválidas",
        });
      }
    } catch {
      toast.error("Error inesperado", {
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0b0c] via-[#141518] to-[#0d0e10] text-foreground">
      <LoadingOverlay 
        isLoading={isLoading} 
        message="Iniciando sesión..." 
        variant="orange" 
      />
      
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Mobile layout - centered */}
      <div className="md:hidden relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#F97316] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <Card className="bg-card/95 backdrop-blur-sm border border-border/60 shadow-2xl shadow-black/40">
            <CardHeader className="space-y-3">
              <div className="flex justify-center mb-2">
                <Image
                  src="/images/company/LogoSinFondoTexto.png"
                  alt="AFLOW Logo"
                  width={80}
                  height={30}
                  className="object-contain animate-float"
                  priority
                />
              </div>
              <CardTitle className="text-3xl font-poppins font-bold text-center bg-gradient-to-r from-aflow-blue to-blue-500 bg-clip-text text-transparent">
                Iniciar Sesión
              </CardTitle>
              <CardDescription className="text-black text-center text-base font-medium">
                Ingresa tus credenciales para acceder al portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aflow-blue font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="usuario@aflow.cl"
                            type="email"
                            autoComplete="email"
                            disabled={isLoading}
                                 className="h-10 bg-white/95 border-gray-300 text-black placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-aflow-blue focus-visible:ring-offset-0 focus-visible:border-aflow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1 font-medium" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-aflow-blue font-semibold">Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              disabled={isLoading}
                              className="h-10 bg-white/95 border-gray-300 text-black placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-aflow-blue focus-visible:ring-offset-0 focus-visible:border-aflow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-aflow-blue transition-colors"
                              disabled={isLoading}
                              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs mt-1 font-medium" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-aflow-blue hover:bg-aflow-blue-light shadow-lg shadow-black/30"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-gray-300 text-center">
                <p className="mb-2 font-medium">Credenciales de prueba:</p>
                <code className="bg-[#1a1c20] border border-[#3a3d43] px-3 py-2 rounded text-xs text-aflow-blue font-mono block">
                  test@aflow.cl / 123456
                </code>
              </div>
            </CardFooter>
          </Card>

          <p className="text-center text-sm text-gray-400 mt-6">
            © {new Date().getFullYear()} AFLOW. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Tablet and Desktop layout - two columns */}
      <div className="hidden md:flex relative min-h-screen">
        {/* Left side - Form (40%) */}
        <div className="w-full md:w-[40%] relative flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#F97316] mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>

            <Card className="bg-card/95 backdrop-blur-sm border border-border/60 shadow-2xl shadow-black/40">
              <CardHeader className="space-y-3">
                <div className="flex justify-center mb-2">
                  <Image
                    src="/images/company/LogoSinFondoTexto.png"
                    alt="AFLOW Logo"
                    width={80}
                    height={30}
                    className="object-contain animate-float"
                    priority
                  />
                </div>
                <CardTitle className="text-3xl font-poppins font-bold text-center bg-gradient-to-r from-aflow-blue to-blue-500 bg-clip-text text-transparent">
                  Iniciar Sesión
                </CardTitle>
                <CardDescription className="text-black text-center text-base font-medium">
                  Ingresa tus credenciales para acceder al portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-aflow-blue font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="usuario@aflow.cl"
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              className="bg-white/95 border-gray-300 text-black placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-aflow-blue focus-visible:ring-offset-0 focus-visible:border-aflow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs mt-1 font-medium" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-aflow-blue font-semibold">Contraseña</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                disabled={isLoading}
                                className="h-10 bg-white/95 border-gray-300 text-black placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-aflow-blue focus-visible:ring-offset-0 focus-visible:border-aflow-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-aflow-blue transition-colors"
                                disabled={isLoading}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-600 text-xs mt-1 font-medium" />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-aflow-blue hover:bg-aflow-blue-light shadow-lg shadow-black/30"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-gray-300 text-center">
                  <p className="mb-2 font-medium">Credenciales de prueba:</p>
                  <code className="bg-[#1a1c20] border border-[#3a3d43] px-3 py-2 rounded text-xs text-aflow-blue font-mono block">
                    test@aflow.cl / 123456
                  </code>
                </div>
              </CardFooter>
            </Card>

            <p className="text-center text-sm text-gray-400 mt-6">
              © {new Date().getFullYear()} AFLOW. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Right side - Carousel (60%) */}
        <div className="w-full md:w-[60%] relative overflow-hidden bg-gradient-to-br from-aflow-blue/20 to-blue-900/20">
          {/* Carousel container */}
          <div className="relative w-full h-full">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                  <div className="mb-8">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      width={200}
                      height={80}
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-gray-300 max-w-md">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? "bg-aflow-blue w-8"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBlogPostBySlug, fetchRecentBlogPosts } from "@/data/blog/blogService";
import { Calendar, Clock, User, ArrowLeft, ArrowRight } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchBlogPostBySlug(slug),
    enabled: !!slug,
  });

  const { data: recentPosts = [] } = useQuery({
    queryKey: ["recent-blog-posts"],
    queryFn: () => fetchRecentBlogPosts(3),
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-full mb-3" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
            <p className="text-gray-600 mb-6">
              El artículo que buscas no existe o ha sido eliminado.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#244F82] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Article Header */}
        <section className="bg-white border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-[#244F82] hover:underline mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al blog
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-[#244F82]">{post.category}</Badge>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <p className="text-sm text-gray-500">{post.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="w-4 h-4" />
                  {post.readTime} minutos de lectura
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <article className="lg:col-span-3">
                <Card>
                  <CardContent className="pt-8">
                    {/* Featured Image Placeholder */}
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl mb-8 flex items-center justify-center">
                      <div className="text-8xl">📰</div>
                    </div>

                    {/* Article Body - Using prose classes for markdown-style content */}
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {post.content}
                      </div>
                    </div>

                    {/* Tags Footer */}
                    <div className="mt-12 pt-8 border-t">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Etiquetas:</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 p-8 bg-gradient-to-br from-[#244F82] to-[#0c3b64] rounded-xl text-white">
                      <h3 className="text-2xl font-bold mb-3">¿Por qué elegir AFLOW?</h3>
                      <p className="text-blue-100 mb-6">
                        Transforma tu empresa con nuestras soluciones integrales de automatización,
                        integración y analytics. Comienza tu transformación digital hoy.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link
                          href="/presupuesto"
                          className="inline-flex items-center gap-2 bg-[#FF7A00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#ff8c1a] transition-colors"
                        >
                          Ver Presupuesto Inteligente
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          href="/login"
                          className="inline-flex items-center gap-2 bg-white text-[#244F82] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                          Iniciar Sesión
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1 space-y-6">
                {/* Recent Posts */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Artículos Recientes</h3>
                    <div className="space-y-4">
                      {recentPosts
                        .filter((p) => p.id !== post.id)
                        .slice(0, 3)
                        .map((recentPost) => (
                          <Link
                            key={recentPost.id}
                            href={`/blog/${recentPost.slug}`}
                            className="block group"
                          >
                            <h4 className="font-medium text-sm text-gray-900 group-hover:text-[#244F82] transition-colors line-clamp-2 mb-1">
                              {recentPost.title}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(recentPost.publishedAt)}
                            </p>
                          </Link>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Card */}
                <Card className="bg-gradient-to-br from-[#FF7A00] to-[#ff8c1a] text-white border-0">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">Solicita una Demo</h3>
                    <p className="text-sm text-orange-100 mb-4">
                      Descubre cómo AFLOW puede optimizar tus procesos empresariales
                    </p>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center w-full gap-2 bg-white text-[#FF7A00] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Comenzar Ahora
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

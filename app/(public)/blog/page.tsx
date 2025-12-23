"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchBlogPosts, fetchBlogCategories, fetchBlogTags } from "@/data/blog/blogService";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: fetchBlogCategories,
  });

  const { data: tags = [] } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: fetchBlogTags,
  });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#244F82] to-[#0c3b64] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
                Blog AFLOW
              </h1>
              <p className="text-lg md:text-xl text-blue-100">
                Insights, noticias y mejores prácticas sobre transformación digital empresarial
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Search */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Buscar</h3>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar artículos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Categorías</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory 
                          ? 'bg-[#244F82] text-white' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Todas las categorías
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category 
                            ? 'bg-[#244F82] text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Etiquetas</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedTag === tag 
                            ? 'bg-[#244F82] hover:bg-[#1a3a5f]' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-[#FF7A00] to-[#ff8c1a] text-white border-0">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">¿Listo para transformar tu empresa?</h3>
                  <p className="text-sm text-orange-100 mb-4">
                    Descubre cómo AFLOW puede optimizar tus procesos
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

            {/* Main Content */}
            <div className="lg:col-span-3">
              {postsLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                      <Skeleton className="h-48 w-full rounded-t-xl" />
                      <CardContent className="pt-6">
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">No se encontraron artículos con los filtros seleccionados.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                      {filteredPosts.length} {filteredPosts.length === 1 ? 'artículo' : 'artículos'}
                    </p>
                    {(selectedCategory || selectedTag || searchTerm) && (
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedTag(null);
                          setSearchTerm("");
                        }}
                        className="text-sm text-[#244F82] hover:underline"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
                      <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 rounded-t-xl flex items-center justify-center">
                          <div className="text-6xl">📰</div>
                        </div>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-[#244F82] border-[#244F82]">
                              {post.category}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {post.readTime} min
                            </span>
                          </div>

                          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#244F82] transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {post.author.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.publishedAt)}
                              </span>
                            </div>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-[#244F82] hover:gap-2 transition-all"
                            >
                              Leer más
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

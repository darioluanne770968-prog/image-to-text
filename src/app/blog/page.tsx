"use client";

import { getAllPosts, getAllCategories } from "@/lib/blog/posts";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.category === selectedCategory)
    : posts;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Blog & Tutorials
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn how to extract text from images, convert documents, and master OCR technology with our comprehensive guides.
        </p>
      </section>

      {/* Category Filter */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Posts
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="h-full bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Gradient Header */}
                <div className="h-32 bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Tag className="h-8 w-8 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>

                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime} min
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found in this category.</p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Try Our OCR Tool?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Extract text from images, convert documents, and more - completely free!
          </p>
          <Link href="/">
            <Button size="lg">
              Start Converting
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts,
} from "@/lib/blog/posts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {post.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime} min read
              </span>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Keywords/Tags */}
          <div className="mb-12">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Try It Yourself!</h2>
            <p className="text-muted-foreground mb-6">
              Ready to extract text from images? Our free tool makes it easy.
            </p>
            <Link href="/">
              <Button size="lg">
                Start Converting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <article className="h-full bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <Badge variant="secondary" className="mb-3">
                        {relatedPost.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {relatedPost.description}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}

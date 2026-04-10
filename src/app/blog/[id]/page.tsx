import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Clock, ArrowLeft } from "lucide-react";
import { blogPosts } from "../../data/products";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  content: string;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    id: post.id,
  }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id) as BlogPost | undefined;

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/blog" className="hover:text-primary">
          Blog
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span
            className="text-xs text-accent"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            {post.category}
          </span>
        </div>
        <h1
          className="text-3xl md:text-4xl lg:text-5xl mb-4"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
          }}
        >
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{post.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {post.readTime}
          </span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Related Posts or Call to Action */}
      <div className="mt-12 pt-8 border-t">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Enjoyed this article?</h3>
          <p className="text-muted-foreground mb-6">
            Discover more stories about wellness, culture, and tradition.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Read More Articles
          </Link>
        </div>
      </div>
    </div>
  );
}

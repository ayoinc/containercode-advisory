import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/notion';
import { formatDate } from '@/lib/utils';
import { NotionBlockRenderer } from '@/components/notion/notion-block-renderer';
import { ShareButtons } from '@/components/ui/share-buttons';
import { BlogCard } from '@/components/blog/blog-card';

interface BlogPostPageProps {
  // Next 15+: route params are async
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const { results: posts } = await getBlogPosts({ pageSize: 100 });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params for blog posts:', error);
    // Return empty array to avoid build failure
    return [];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ContainerCode Advisory',
    };
  }
  
  return {
    title: `${post.title} | ContainerCode Advisory Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    notFound();
  }
  
  // Get related posts (for this example, we'll just get the latest 3 posts)
  const { results: relatedPosts } = await getBlogPosts({
    pageSize: 3,
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'Published',
          },
        },
        {
          property: 'Slug',
          rich_text: {
            does_not_equal: slug,
          },
        },
      ],
    },
  });
  
  return (
    <>
      <article className="pt-12 pb-24">
        <div className="container-custom max-w-4xl">
          {/* Post header */}
          <div className="mb-10">
            <div className="flex items-center gap-x-4 text-sm mb-4">
              <span className="text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <time dateTime={post.publishedDate} className="text-navy-300">
                {formatDate(post.publishedDate)}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-navy-200 mb-8">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-aqua-500/10 rounded-full flex items-center justify-center">
                    <span className="text-aqua-400 font-medium">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="font-medium">{post.author.name}</span>
              </div>
              
              <div className="ml-auto">
                <ShareButtons title={post.title} />
              </div>
            </div>
          </div>
          
          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-12 rounded-xl overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-auto"
              />
            </div>
          )}
          
          {/* Post content */}
          <div className="prose prose-invert prose-lg max-w-none prose-a:text-aqua-400 prose-headings:text-navy-100 prose-strong:text-navy-100">
            <NotionBlockRenderer blocks={post.content} />
          </div>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-navy-700">
              <h3 className="text-sm font-medium text-navy-300 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-navy-800 text-navy-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-20">
          <div className="container-custom max-w-7xl">
            <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

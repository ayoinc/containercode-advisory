import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { BlogPost } from '@/lib/notion';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
}

export function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  if (variant === 'featured') {
    return (
      <div className="group relative rounded-xl overflow-hidden bg-navy-850 border border-navy-700 shadow-card hover:shadow-card-hover hover:border-aqua-500/40 transition-shadow">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative h-64 md:h-full">
              {post.coverImage ? (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-navy-800 flex items-center justify-center">
                  <span className="text-navy-300 text-lg">No image</span>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-x-4 text-sm mb-4">
                <span className="text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider">
                  {post.category}
                </span>
                <time dateTime={post.publishedDate} className="text-navy-400">
                  {formatDate(post.publishedDate)}
                </time>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-navy-100 group-hover:text-aqua-400 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-navy-300 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center gap-3">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-navy-800 border border-navy-700 rounded-full flex items-center justify-center">
                    <span className="text-aqua-400 font-medium">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{post.author.name}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="group rounded-xl overflow-hidden bg-navy-850 border border-navy-700 shadow-card hover:shadow-card-hover hover:border-aqua-500/40 transition-shadow">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-48">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-navy-800 flex items-center justify-center">
              <span className="text-navy-300 text-lg">No image</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-x-4 text-sm mb-3">
            <span className="text-aqua-300 bg-aqua-500/10 border border-aqua-500/25 px-2.5 py-0.5 rounded-full font-mono text-xs uppercase tracking-wider">
              {post.category}
            </span>
            <time dateTime={post.publishedDate} className="text-navy-400 text-xs">
              {formatDate(post.publishedDate)}
            </time>
          </div>
          
          <h3 className="text-xl font-bold mb-2 text-navy-100 group-hover:text-aqua-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-navy-300 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-navy-800 border border-navy-700 rounded-full flex items-center justify-center">
                <span className="text-aqua-400 text-xs font-medium">
                  {post.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs font-medium">{post.author.name}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

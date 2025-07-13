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
      <div className="group relative rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
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
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">No image</span>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 flex flex-col">
              <div className="flex items-center gap-x-4 text-sm mb-4">
                <span className="text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <time dateTime={post.publishedDate} className="text-gray-500">
                  {formatDate(post.publishedDate)}
                </time>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-600 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
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
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 font-medium">
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
    <div className="group rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition-shadow">
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
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-lg">No image</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-x-4 text-sm mb-3">
            <span className="text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">
              {post.category}
            </span>
            <time dateTime={post.publishedDate} className="text-gray-500 text-xs">
              {formatDate(post.publishedDate)}
            </time>
          </div>
          
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-700 text-xs font-medium">
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

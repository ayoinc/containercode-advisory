import { Metadata } from 'next';
import { getBlogPosts } from '@/lib/notion';
import { BlogCard } from '@/components/blog/blog-card';
import { Search, Filter, TrendingUp, Calendar, User, Building2 } from 'lucide-react';
import Link from 'next/link';
import { SmartImage } from '@/components/ui/images/smart-image';

export const metadata: Metadata = {
  title: 'Insights & Thought Leadership | ContainerCode Advisory',
  description: 'Expert insights, industry analysis, and thought leadership on multi-cloud strategy, cybersecurity, DevOps, and digital transformation from our professional team.',
  keywords: ['cloud insights', 'cybersecurity blog', 'devops articles', 'digital transformation trends', 'technology thought leadership'],
};

// Fallback featured articles for professional presentation
const fallbackFeaturedArticles = [
  {
    id: 'multi-cloud-strategy-2024',
    title: 'Multi-Cloud Strategy: Best Practices for 2024 and Beyond',
    excerpt: 'Comprehensive guide to developing and implementing a successful multi-cloud strategy that drives business value whilst minimising complexity and risk.',
    author: { name: 'Sarah Johnson', avatar: '' },
    category: 'Cloud Strategy',
    featured: true,
    slug: 'multi-cloud-strategy-2024',
    publishedDate: '2024-01-15',
    lastEditedTime: '2024-01-15',
    coverImage: '',
    tags: ['multi-cloud', 'strategy', 'best-practices'],
    content: [] as any[]
  },
  {
    id: 'zero-trust-security-implementation',
    title: 'Implementing Zero Trust Security in Enterprise Environments',
    excerpt: 'Practical approach to deploying zero trust architecture with real-world case studies and lessons learned from successful implementations.',
    author: { name: 'Michael Chen', avatar: '' },
    category: 'Cybersecurity',
    featured: false,
    slug: 'zero-trust-security-implementation',
    publishedDate: '2024-01-12',
    lastEditedTime: '2024-01-12',
    coverImage: '',
    tags: ['zero-trust', 'cybersecurity', 'enterprise'],
    content: [] as any[]
  },
  {
    id: 'devops-automation-trends',
    title: 'DevOps Automation Trends Shaping 2024',
    excerpt: 'Analysis of emerging automation technologies and practices that are transforming software delivery and operational excellence.',
    author: { name: 'David Kumar', avatar: '' },
    category: 'DevOps',
    featured: false,
    slug: 'devops-automation-trends',
    publishedDate: '2024-01-10',
    lastEditedTime: '2024-01-10',
    coverImage: '',
    tags: ['devops', 'automation', 'trends'],
    content: [] as any[]
  }
];

const categories = [
  'All Topics',
  'Cloud Strategy',
  'Cybersecurity', 
  'DevOps',
  'Digital Transformation',
  'Industry Analysis',
  'Case Studies'
];

// Function to map blog categories to image categories
function getImageCategory(postCategory: string): string {
  const categoryMap: Record<string, string> = {
    'Cloud Strategy': 'cloud computing',
    'Cybersecurity': 'cybersecurity',
    'DevOps': 'technology',
    'Digital Transformation': 'digital transformation',
    'Industry Analysis': 'business',
    'Case Studies': 'technology'
  };
  
  return categoryMap[postCategory] || 'technology'; // fallback to technology
}

export default async function ProfessionalBlogPage() {
  let posts = fallbackFeaturedArticles;
  
  try {
    const { results: notionPosts } = await getBlogPosts();
    posts = notionPosts.length > 0 ? notionPosts.map(post => ({
      ...post,
      featured: post.featured ?? false
    })) : fallbackFeaturedArticles;
  } catch (error) {
    console.log('Using fallback blog posts:', error);
    posts = fallbackFeaturedArticles;
  }

  // Add display helpers to posts
  const enhancedPosts = posts.map(post => ({
    ...post,
    featured: post.featured ?? false, // Ensure featured is always boolean
    position: 'Senior Consultant', // Default position
    date: new Date(post.publishedDate || Date.now()).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    readTime: `${Math.ceil(post.excerpt.length / 50)} min read` // Estimate read time
  }));

  const featuredPosts = enhancedPosts.filter(post => post.featured);
  const regularPosts = enhancedPosts.filter(post => !post.featured);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              Insights & Thought Leadership
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Expert Technology 
              <span className="block text-primary-400">Insights</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Stay ahead of the curve with expert analysis, industry insights, and practical guidance 
              from our team of certified technology professionals and thought leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Categories & Search */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    index === 0 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-w-64"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-12">
              <TrendingUp className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {/* Blog Image */}
                  <div className="relative h-64">
                    <SmartImage 
                      category={getImageCategory(post.category)}
                      usage="general"
                      alt={`${post.title} cover image`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium backdrop-blur-sm">
                        {post.category}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {/* Author & Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{typeof post.author === 'string' ? post.author : post.author.name}</div>
                          <div className="text-gray-600 text-sm">{post.position}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <div className="text-sm text-gray-500">{post.readTime}</div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">Latest Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(regularPosts.length > 0 ? regularPosts : enhancedPosts).map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                {/* Blog Image */}
                <div className="relative h-48">
                  <SmartImage 
                    category={getImageCategory(post.category)}
                    usage="general"
                    alt={`${post.title} cover image`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  
                  {/* Category */}
                  <div className="absolute top-4 left-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium backdrop-blur-sm">
                      {post.category}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{typeof post.author === 'string' ? post.author : post.author.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Empty state */}
          {posts.length === 0 && (
            <div className="text-center py-20">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Articles Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We&apos;re currently working on bringing you valuable insights and thought leadership. 
                Please check back soon for expert articles and industry analysis.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Our Latest Insights</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for weekly insights, industry analysis, and expert commentary 
              on the latest technology trends and best practices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              No spam, unsubscribe at any time. Read our privacy policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
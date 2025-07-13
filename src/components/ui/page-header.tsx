interface PageHeaderProps {
  title: string;
  description?: string;
  alignment?: 'left' | 'center';
}

export function PageHeader({ 
  title, 
  description, 
  alignment = 'center' 
}: PageHeaderProps) {
  return (
    <div className="bg-navy-900 text-white py-20">
      <div className="container-custom">
        <div className={`max-w-3xl ${alignment === 'center' ? 'mx-auto text-center' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-white/80">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <div className="relative bg-navy-950 text-navy-100 py-20 border-b border-navy-800 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-tech-grid opacity-40" />
      <div className="container-custom relative z-10">
        <div className={`max-w-3xl ${alignment === 'center' ? 'mx-auto text-center' : ''}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-navy-100">{title}</h1>
          {description && (
            <p className="text-xl text-navy-200">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

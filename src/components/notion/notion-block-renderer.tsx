import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NotionBlockRendererProps {
  blocks: any[];
}

export function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }
  
  return (
    <>
      {blocks.map((block) => {
        // Skip unsupported blocks or blocks without a type
        if (!block || !block.type) return null;
        
        const { id, type } = block;
        
        // Process different block types
        switch (type) {
          case 'paragraph':
            return (
              <p key={id} className="mb-4">
                {block.paragraph.rich_text.length > 0 ? (
                  block.paragraph.rich_text.map((text: any, i: number) => (
                    <RichTextRenderer key={i} richText={text} />
                  ))
                ) : (
                  <br />
                )}
              </p>
            );
            
          case 'heading_1':
            return (
              <h1 key={id} className="text-3xl font-bold mt-8 mb-4">
                {block.heading_1.rich_text.map((text: any, i: number) => (
                  <RichTextRenderer key={i} richText={text} />
                ))}
              </h1>
            );
            
          case 'heading_2':
            return (
              <h2 key={id} className="text-2xl font-bold mt-8 mb-4">
                {block.heading_2.rich_text.map((text: any, i: number) => (
                  <RichTextRenderer key={i} richText={text} />
                ))}
              </h2>
            );
            
          case 'heading_3':
            return (
              <h3 key={id} className="text-xl font-bold mt-6 mb-3">
                {block.heading_3.rich_text.map((text: any, i: number) => (
                  <RichTextRenderer key={i} richText={text} />
                ))}
              </h3>
            );
            
          case 'bulleted_list_item':
            return (
              <li key={id} className="mb-1">
                {block.bulleted_list_item.rich_text.map((text: any, i: number) => (
                  <RichTextRenderer key={i} richText={text} />
                ))}
                {block.bulleted_list_item.children && (
                  <ul className="ml-6 mt-1 list-disc">
                    <NotionBlockRenderer blocks={block.bulleted_list_item.children} />
                  </ul>
                )}
              </li>
            );
            
          case 'numbered_list_item':
            return (
              <li key={id} className="mb-1">
                {block.numbered_list_item.rich_text.map((text: any, i: number) => (
                  <RichTextRenderer key={i} richText={text} />
                ))}
                {block.numbered_list_item.children && (
                  <ol className="ml-6 mt-1 list-decimal">
                    <NotionBlockRenderer blocks={block.numbered_list_item.children} />
                  </ol>
                )}
              </li>
            );
            
          case 'code':
            return (
              <pre key={id} className="bg-navy-950 border border-navy-700 p-4 rounded overflow-x-auto mb-6 text-navy-100">
                <code className="text-sm">
                  {block.code.rich_text.map((text: any, i: number) => (
                    <Fragment key={i}>{text.plain_text}</Fragment>
                  ))}
                </code>
              </pre>
            );
            
          case 'quote':
            return (
              <blockquote key={id} className="pl-4 border-l-2 border-aqua-500 italic text-navy-200 mb-6">
                {block.quote.rich_text.map((text: any, i: number) => (
                  <RichTextRenderer key={i} richText={text} />
                ))}
              </blockquote>
            );
            
          case 'image':
            const imageSource = block.image.file?.url || block.image.external?.url;
            const imageAlt = block.image.caption?.length > 0 
              ? block.image.caption[0].plain_text 
              : 'Image';
              
            return (
              <figure key={id} className="mb-6">
                <div className="relative h-96 w-full rounded-md overflow-hidden">
                  <Image
                    src={imageSource}
                    alt={imageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
                {block.image.caption?.length > 0 && (
                  <figcaption className="text-center text-sm text-navy-300 mt-2">
                    {block.image.caption[0].plain_text}
                  </figcaption>
                )}
              </figure>
            );
            
          case 'divider':
            return <hr key={id} className="my-8 border-t border-navy-700" />;
            
          case 'callout':
            return (
              <div 
                key={id} 
                className="bg-navy-800 border border-navy-700 p-4 rounded flex items-start gap-4 mb-6"
              >
                {block.callout.icon?.emoji && (
                  <div className="text-xl">{block.callout.icon.emoji}</div>
                )}
                <div>
                  {block.callout.rich_text.map((text: any, i: number) => (
                    <RichTextRenderer key={i} richText={text} />
                  ))}
                </div>
              </div>
            );
            
          case 'to_do':
            return (
              <div key={id} className="flex items-start gap-2 mb-2">
                <input 
                  type="checkbox" 
                  checked={block.to_do.checked} 
                  readOnly 
                  className="mt-1.5"
                />
                <span className={block.to_do.checked ? 'line-through text-navy-400' : ''}>
                  {block.to_do.rich_text.map((text: any, i: number) => (
                    <RichTextRenderer key={i} richText={text} />
                  ))}
                </span>
              </div>
            );
            
          case 'table':
            // Table processing would go here
            return <div key={id} className="my-6">Table (not fully supported yet)</div>;
            
          default:
            return (
              <div key={id} className="text-navy-400 italic my-2">
                Unsupported block type: {type}
              </div>
            );
        }
      })}
    </>
  );
}

interface RichTextRendererProps {
  richText: any;
}

function RichTextRenderer({ richText }: RichTextRendererProps) {
  if (!richText) return null;
  
  const { plain_text, href, annotations } = richText;
  
  if (!plain_text) return null;
  
  // Define styles based on annotations
  let className = '';
  if (annotations.bold) className += 'font-bold ';
  if (annotations.italic) className += 'italic ';
  if (annotations.strikethrough) className += 'line-through ';
  if (annotations.underline) className += 'underline ';
  if (annotations.code) className += 'font-mono bg-navy-800 text-aqua-300 px-1 rounded ';
  if (annotations.color && annotations.color !== 'default') {
    className += `text-${annotations.color} `;
  }
  
  // If there's a link
  if (href) {
    return (
      <Link 
        href={href} 
        className={`${className} text-aqua-400 hover:text-aqua-300 hover:underline`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {plain_text}
      </Link>
    );
  }
  
  // Regular text with annotations
  if (className) {
    return <span className={className.trim()}>{plain_text}</span>;
  }
  
  // Plain text
  return <>{plain_text}</>;
}

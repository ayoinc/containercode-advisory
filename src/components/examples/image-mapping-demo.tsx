'use client';

import React from 'react';
import { SmartImage, HeroImage, ServiceImage, TeamImage, GeneralImage } from '@/components/ui/images/smart-image';
import { imageMapper } from '@/lib/image-mapper';
import Image from 'next/image';

export function ImageMappingDemo() {
  const logo = imageMapper.getLogo();
  const placeholder = imageMapper.getFallbackImage();

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-6">Image Mapping System Demo</h2>
      
      {/* Static Images */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Static Images</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Logo</h4>
            <Image src={logo.path} alt={logo.alt} width={120} height={48} className="h-12" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Placeholder</h4>
            <Image src={placeholder.path} alt={placeholder.alt} width={128} height={96} className="w-32 h-24 object-cover rounded" />
          </div>
        </div>
      </section>

      {/* Smart Images (Local + Fallback) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Smart Images (Local + Fallback)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Hero</h4>
            <HeroImage alt="Hero image" className="w-full h-32 object-cover rounded" width={200} height={128} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Cloud Service</h4>
            <ServiceImage alt="Cloud service" category="cloud-technologies" className="w-full h-32 object-cover rounded" width={200} height={128} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Team</h4>
            <TeamImage alt="Team member" className="w-full h-32 object-cover rounded" width={200} height={128} />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">General</h4>
            <GeneralImage alt="General image" className="w-full h-32 object-cover rounded" width={200} height={128} />
          </div>
        </div>
      </section>

      {/* Category-based Smart Images */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Category-based Smart Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { category: 'cloud computing', displayName: 'Cloud Computing' },
            { category: 'cybersecurity', displayName: 'Cybersecurity' },
            { category: 'devops', displayName: 'DevOps' },
            { category: 'professional teams', displayName: 'Business Team' },
            { category: 'digital transformation', displayName: 'Digital Innovation' }
          ].map(({ category, displayName }) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2">{displayName}</h4>
              <SmartImage 
                category={category}
                className="w-full h-32 object-cover rounded"
                alt={`${displayName} related image`}
                width={200}
                height={128}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
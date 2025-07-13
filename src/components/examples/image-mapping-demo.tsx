'use client';

import React from 'react';
import { SmartImage, HeroImage, ServiceImage, TeamImage, BlogImage } from '@/components/ui/smart-image';
import { PexelsImage } from '@/components/ui/pexels-image';
import { getLogo, getPlaceholderImage } from '@/lib/image-mapper';

export function ImageMappingDemo() {
  const logo = getLogo();
  const placeholder = getPlaceholderImage();

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold mb-6">Image Mapping System Demo</h2>
      
      {/* Static Images */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Static Images</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Logo</h4>
            <img src={logo.path} alt={logo.alt} className="h-12" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Placeholder</h4>
            <img src={placeholder.path} alt={placeholder.alt} className="w-32 h-24 object-cover rounded" />
          </div>
        </div>
      </section>

      {/* Smart Images (Local + Fallback) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Smart Images (Local + Fallback)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Hero</h4>
            <HeroImage className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Cloud Service</h4>
            <ServiceImage service="cloud" className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Team</h4>
            <TeamImage className="w-full h-32 object-cover rounded" />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Blog</h4>
            <BlogImage className="w-full h-32 object-cover rounded" />
          </div>
        </div>
      </section>

      {/* Pexels Images (API) */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Pexels Images (Live API)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Cloud Computing</h4>
            <PexelsImage 
              category="cloudComputing" 
              className="w-full h-32 object-cover rounded"
              alt="Cloud computing illustration"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Cybersecurity</h4>
            <PexelsImage 
              category="cybersecurity" 
              className="w-full h-32 object-cover rounded"
              alt="Cybersecurity illustration"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">DevOps</h4>
            <PexelsImage 
              category="devops" 
              className="w-full h-32 object-cover rounded"
              alt="DevOps illustration"
            />
          </div>
        </div>
      </section>

      {/* Category-based Smart Images */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Category-based Smart Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['cloud computing', 'cybersecurity', 'software development', 'business team', 'digital innovation'].map((category) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2 capitalize">{category.replace(' ', ' ')}</h4>
              <SmartImage 
                category={category}
                className="w-full h-32 object-cover rounded"
                alt={`${category} related image`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy UI components
export const LazyAccordion = dynamic(
  () => import('@nextui-org/react').then(mod => ({ default: mod.Accordion })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse h-12 bg-gray-200 rounded" />
  }
);

export const LazyModal = dynamic(
  () => import('@nextui-org/react').then(mod => ({ default: mod.Modal })),
  { 
    ssr: false,
    loading: () => <div />
  }
);

export const LazyDropdown = dynamic(
  () => import('@nextui-org/react').then(mod => ({ default: mod.Dropdown })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse h-8 bg-gray-200 rounded" />
  }
);

// Chart components (if needed - install recharts first)
// export const LazyChart = dynamic(
//   () => import('recharts').then(mod => ({ default: mod.LineChart })),
//   { 
//     ssr: false,
//     loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />
//   }
// );

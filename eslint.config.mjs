import next from 'eslint-config-next/core-web-vitals';

// Flat config (ESLint 9). eslint-config-next ships native flat configs, so we
// spread them directly rather than going through FlatCompat.
const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'out/**',
      'build/**',
      'public/**',
      'coverage/**',
      'scripts/**',
      'workers/**',
      'tests/**',
      'src/cloudflare/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      'next.config.js',
      'analyze/**',
    ],
  },
  ...next,
  {
    // The Next 16 preset promotes several advisory rules to errors. Keep them
    // visible as warnings rather than blocking CI on pre-existing patterns.
    rules: {
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-img-element': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/incompatible-library': 'warn',
    },
  },
];

export default eslintConfig;

# ContainerCode Advisory Website

A cutting-edge website for ContainerCode Advisory, a premier technology consulting business specializing in multi-cloud solutions, cybersecurity, and digital transformation.

## Technologies Used

- **Next.js 14+**: React framework with App Router and server components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **API Integrations**:
  - Notion API: Content management for blog posts, case studies, and team profiles
  - Resend API: Email delivery for contact forms and newsletters
  - Pexels API: Professional imagery for the website

## Project Structure

```
containercode-app/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── blog/        # Blog pages
│   │   ├── case-studies/ # Case studies pages
│   │   ├── services/    # Service pages
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Homepage
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   ├── sections/    # Page sections
│   │   ├── ui/          # UI components
│   │   └── forms/       # Form components
│   ├── lib/             # Utility functions & API clients
│   └── types/           # TypeScript types
└── tailwind.config.js   # Tailwind configuration
```

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-username/containercode-advisory.git
cd containercode-advisory
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy the `.env.example` file to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Visit [http://localhost:3000](http://localhost:3000) to see the website.

## Features

- **Modern Design**: Implementing 2025 design trends with a professional technology focus
- **Multi-Cloud Expertise Showcase**: Highlighting expertise across Azure, AWS, Google Cloud, Oracle, and IBM
- **Service Pages**: Detailed pages for each service offered
- **Case Studies**: Showcasing client success stories with measurable results
- **Blog Platform**: Content management via Notion API
- **Interactive Features**: Tools, calculators, and assessments
- **Contact Forms**: Integrated with Resend API for reliable email delivery
- **Responsive Design**: Optimized for all device sizes
- **Dark Mode**: Professional dark theme with toggle option

## Deployment

This website is configured for deployment on Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy .next
```

## API Integrations

### Notion API

Used for content management, including blog posts, case studies, and team profiles. Configuration is in `src/lib/notion.ts`.

### Resend API

Used for transactional emails, including contact form submissions and newsletter signups. Configuration is in `src/lib/resend.ts`.

### Pexels API

Used for professional imagery throughout the website. Configuration is in `src/lib/pexels.ts`.

## License

This project is proprietary and confidential.

## Contact

For questions or support, contact info@containercode.club.

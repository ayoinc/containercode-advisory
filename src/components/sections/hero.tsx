import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 to-navy-800/40" />
        <div className="absolute inset-0 opacity-20 bg-[url('/images/grid-pattern.svg')]" />
      </div>
      
      {/* Content overlay */}
      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-aqua-900/20 text-aqua-500 mb-6">
                <span className="w-2 h-2 rounded-full bg-aqua-500 mr-2"></span>
                <span className="text-sm font-medium">Multi-Cloud Specialists</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Cloud Excellence with Security-First Approach
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-xl">
              Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary btn-lg">
                Schedule Consultation
              </Link>
              <Link 
                href="/services" 
                className="btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white/30 btn-lg"
              >
                Explore Services
              </Link>
            </div>
            
            {/* Trusted by logos */}
            <div>
              <p className="text-white/60 text-sm mb-4">Trusted by innovative companies</p>
              <div className="flex flex-wrap items-center gap-8">
                {/* Placeholder for company logos - replace with actual images */}
                <div className="h-8 w-24 bg-white/10 rounded"></div>
                <div className="h-8 w-28 bg-white/10 rounded"></div>
                <div className="h-8 w-20 bg-white/10 rounded"></div>
                <div className="h-8 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            {/* Replace with actual hero image */}
            <div className="relative h-[500px] w-full">
              <div className="absolute inset-0 bg-navy-600/20 backdrop-blur-sm rounded-lg transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-500/30 to-aqua-500/30 rounded-lg transform -rotate-3"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[400px] w-[400px]">
                  {/* 3D cloud illustration would go here */}
                  <div className="h-full w-full bg-navy-800/50 rounded-lg border border-white/10 flex items-center justify-center">
                    <span className="text-white text-xl">3D Cloud Illustration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center">
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

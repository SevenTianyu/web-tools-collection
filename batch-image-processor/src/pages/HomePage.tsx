import { Link } from 'react-router-dom';
import { 
  Minimize2, 
  Maximize2, 
  Type, 
  FileType, 
  Shield, 
  Lock, 
  Zap,
  FolderOpen,
  Check
} from 'lucide-react';

const features = [
  {
    title: 'Batch Compress',
    description: 'Reduce file size while maintaining quality. Supports quality control and EXIF preservation.',
    icon: Minimize2,
    path: '/compress',
    color: 'blue',
  },
  {
    title: 'Batch Resize',
    description: 'Resize images to exact dimensions or fit within bounds. Includes presets for social media and e-commerce.',
    icon: Maximize2,
    path: '/resize',
    color: 'purple',
  },
  {
    title: 'Add Watermark',
    description: 'Add text or image watermarks with customizable position, opacity, and rotation.',
    icon: Type,
    path: '/watermark',
    color: 'amber',
  },
  {
    title: 'Format Convert',
    description: 'Convert between JPEG, PNG, WebP, and AVIF formats with quality control.',
    icon: FileType,
    path: '/convert',
    color: 'green',
  },
];

const benefits = [
  { icon: Shield, title: '100% Private', desc: 'All processing happens in your browser. Images never leave your device.' },
  { icon: Lock, title: 'No Upload Required', desc: 'Compress image without uploading to any server.' },
  { icon: Zap, title: 'Lightning Fast', desc: 'Batch process hundreds of images with optimized performance.' },
  { icon: FolderOpen, title: 'Folder Support', desc: 'Upload entire folders and maintain folder structure.' },
];

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacy-First Image Processing
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Batch Image Processor
            <span className="block text-primary-600">Without Uploading</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The ultimate privacy-first image editor. Compress, resize, watermark, and convert 
            images in bulk - all processed locally in your browser. No server uploads, no data collection.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/compress" className="btn-primary text-lg px-8 py-3">
              Start Processing
            </Link>
            <a 
              href="#features" 
              className="btn-secondary text-lg px-8 py-3"
            >
              Learn More
            </a>
          </div>

          {/* SEO Keywords */}
          <div className="mt-12 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">batch image compressor</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">bulk image resize</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">compress image without uploading</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">privacy first image editor</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Tool</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All tools support batch processing, folder uploads, and maintain your folder structure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              const colorClasses: Record<string, string> = {
                blue: 'bg-blue-100 text-blue-600 hover:bg-blue-50',
                purple: 'bg-purple-100 text-purple-600 hover:bg-purple-50',
                amber: 'bg-amber-100 text-amber-600 hover:bg-amber-50',
                green: 'bg-green-100 text-green-600 hover:bg-green-50',
              };

              return (
                <Link
                  key={feature.path}
                  to={feature.path}
                  className={`
                    group p-6 rounded-2xl border-2 border-transparent transition-all duration-300
                    ${colorClasses[feature.color].replace('text-', 'hover:border-').split(' ')[0].replace('bg-', 'bg-opacity-50 ')}
                    hover:shadow-lg hover:-translate-y-1
                  `}
                >
                  <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center mb-4
                    ${colorClasses[feature.color]}
                  `}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Get Started →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600">
              Your privacy is our priority. Process images securely without compromising on features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Three simple steps to process your images</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload Images', desc: 'Drag & drop images or select folders. Supports JPEG, PNG, WebP, AVIF.' },
              { step: '2', title: 'Configure Settings', desc: 'Choose your processing options. Preview changes in real-time.' },
              { step: '3', title: 'Download Results', desc: 'Process all images and download as a ZIP file with folder structure preserved.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Process Your Images?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Start using our batch image processor today. No registration required, completely free, 
            and your images stay private.
          </p>
          <Link 
            to="/compress" 
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
          >
            <Check className="w-5 h-5" />
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center text-sm">
        <p>Batch Image Processor - Privacy-First Image Editor</p>
        <p className="mt-2">
          Keywords: batch image compressor, bulk image resize, compress image without uploading, privacy first image editor
        </p>
      </footer>
    </div>
  );
};

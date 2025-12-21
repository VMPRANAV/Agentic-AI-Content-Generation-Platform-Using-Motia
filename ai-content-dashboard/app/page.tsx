import { HeroParallax } from "@/components/ui/hero-parallax"

export default function LandingPage() {
  const products = [
    {
      title: "AI-Powered SEO Articles",
      link: "/dashboard",
      thumbnail: "/futuristic-ai-article-generation-hologram.jpg",
    },
    {
      title: "Twitter Thread Generator",
      link: "/dashboard",
      thumbnail: "/social-media-thread-ai-interface.jpg",
    },
    {
      title: "LinkedIn Content Strategy",
      link: "/dashboard",
      thumbnail: "/professional-content-ai-dashboard.jpg",
    },
    {
      title: "Real-time Research Agents",
      link: "/dashboard",
      thumbnail: "/ai-research-agent-cyberpunk.jpg",
    },
    {
      title: "Content Performance Analytics",
      link: "/dashboard",
      thumbnail: "/analytics-dashboard-neon-graphs.jpg",
    },
    {
      title: "Multi-format Content",
      link: "/dashboard",
      thumbnail: "/multiple-content-formats-ai.jpg",
    },
    {
      title: "Audience Targeting AI",
      link: "/dashboard",
      thumbnail: "/audience-analysis-ai-interface.jpg",
    },
    {
      title: "Automated Publishing",
      link: "/dashboard",
      thumbnail: "/automated-publishing-system-futuristic.jpg",
    },
    {
      title: "Content Optimization",
      link: "/dashboard",
      thumbnail: "/content-optimization-ai-hologram.jpg",
    },
    {
      title: "Brand Voice Training",
      link: "/dashboard",
      thumbnail: "/ai-brand-voice-training.jpg",
    },
    {
      title: "Competitor Analysis",
      link: "/dashboard",
      thumbnail: "/competitor-analysis-dashboard-tech.jpg",
    },
    {
      title: "Content Calendar AI",
      link: "/dashboard",
      thumbnail: "/ai-content-calendar-interface.jpg",
    },
    {
      title: "Viral Content Predictor",
      link: "/dashboard",
      thumbnail: "/viral-content-prediction-ai.jpg",
    },
    {
      title: "Multi-language Generation",
      link: "/dashboard",
      thumbnail: "/multilingual-ai-content-system.jpg",
    },
    {
      title: "Content Ideation Engine",
      link: "/dashboard",
      thumbnail: "/ai-content-ideation-futuristic.jpg",
    },
  ]

  return (
    <main className="min-h-screen">
      <HeroParallax products={products} />
    </main>
  )
}

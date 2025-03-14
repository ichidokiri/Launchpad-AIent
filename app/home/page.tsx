import Hero from "@/components/hero"
import Features from "@/components/features"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="relative home-background">
      <div className="relative z-10 bg-black/20">
        <Hero />
        <Features />
        <Footer />
      </div>
    </div>
  )
}


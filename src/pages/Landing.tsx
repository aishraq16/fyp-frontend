import { ArrowRight, FileText, Image, Link2, Shield, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
const features = [{
  icon: FileText,
  title: "Text Analysis",
  description: "Paste any article, social media post, or text snippet. Our AI analyzes language patterns, claims, and sources to assess credibility."
}, {
  icon: Link2,
  title: "URL Scanning",
  description: "Simply drop a link and we'll fetch the content, cross-reference sources, and evaluate the article's authenticity in seconds."
}, {
  icon: Image,
  title: "Image Verification",
  description: "Upload screenshots or images. Our AI detects manipulated media, reverse-searches origins, and flags potential misinformation."
}];
const stats = [{
  value: "98.7%",
  label: "Accuracy Rate"
}, {
  value: "2M+",
  label: "Articles Analyzed"
}, {
  value: "<3s",
  label: "Average Response"
}];
export default function Landing() {
  return <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          
          
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 
               bg-gradient-to-r from-primary via-purple-500 to-pink-500 
               bg-clip-text text-transparent 
               drop-shadow-2xl 
               animate-pulse">
  fyp25098
</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{
          animationDelay: "0.1s"
        }}>Don't let misinformation spread. Our application uses AI/ML techniques to detect </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{
          animationDelay: "0.2s"
        }}>
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90 group">
                Start Detecting Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/detect">
              <Button size="lg" variant="outline">
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Three Ways to <span className="text-gradient">Verify</span>
            </h2>
            
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => <Card key={feature.title} className="glass border-border/50 hover:border-primary/50 transition-all group animate-fade-in-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[{
            step: "1",
            icon: FileText,
            title: "Input Content",
            desc: "Paste text, URL, or upload an image"
          }, {
            step: "2",
            icon: Zap,
            title: "AI Analysis",
            desc: "Our models process and cross-reference"
          }, {
            step: "3",
            icon: Shield,
            title: "Get Results",
            desc: "Receive a detailed credibility report"
          }].map((item, index) => <div key={item.step} className="text-center animate-fade-in-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                    <item.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-card border-2 border-primary flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Fight <span className="text-gradient">​Misinformation </span>?
          </h2>
          
          <Link to="/signup">
            <Button size="lg" className="gradient-primary text-primary-foreground hover:opacity-90">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          
        </div>
      </footer>
    </div>;
}

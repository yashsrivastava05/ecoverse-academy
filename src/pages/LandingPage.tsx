import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Target, TreePine, Trophy, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return <span ref={ref} className="font-mono-stat font-bold text-primary glow-text">{count.toLocaleString()}{suffix}</span>;
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 hover:border-primary/40 transition-all animate-breathe"
      style={{ animationDelay: `${delay * 2}s` }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-4 group-hover:glow-sm transition-shadow">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-foreground text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-mesh overflow-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-16 border-b border-border/30 bg-card/60 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span className="font-display font-bold text-primary text-xl">EcoQuest</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#stats" className="hover:text-foreground transition-colors">Impact</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log In</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="glow-sm">Sign Up Free</Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 md:py-36">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent border border-primary/30 px-4 py-1.5 text-sm font-medium text-primary mb-8">
            <Sparkles className="w-4 h-4" />
            <span>The future of environmental education</span>
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.95] tracking-tighter mb-6">
            Learn. Act.<br />
            <span className="text-primary glow-text">Save the Planet.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The world's first gamified eco-learning platform for students.
            Complete real-world missions, grow your virtual ecosystem, and compete with peers.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="glow-md text-lg px-8 py-6 font-heading font-bold">
                Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 font-heading border-border hover:border-primary/40">
                Explore Features
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: 50000, suffix: '+', label: 'Students' },
            { value: 2000000, suffix: '+', label: 'EcoPoints Earned' },
            { value: 10000, suffix: '+', label: 'Trees Planted' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="p-6"
            >
              <p className="text-4xl md:text-5xl mb-2">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-display">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Everything you need to go <span className="text-primary">green</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Gamified learning, real-world missions, and a growing virtual ecosystem that evolves with your impact.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={<Target className="w-6 h-6" />} title="Eco Missions" desc="Complete real-world sustainability challenges. Plant trees, reduce waste, save water, and earn points." delay={0} />
            <FeatureCard icon={<TreePine className="w-6 h-6" />} title="Virtual Ecosystem" desc="Watch your personal ecosystem evolve from barren land to a thriving planet as you earn EcoPoints." delay={0.1} />
            <FeatureCard icon={<Trophy className="w-6 h-6" />} title="Leaderboards" desc="Compete with students and schools worldwide. Climb the ranks and earn legendary badges." delay={0.2} />
            <FeatureCard icon={<BookOpen className="w-6 h-6" />} title="Learn & Quiz" desc="Interactive lessons, quizzes, and mini-games covering climate, energy, water, and biodiversity." delay={0.3} />
            <FeatureCard icon={<Sparkles className="w-6 h-6" />} title="AI Eco Tutor" desc="Ask EcoBot anything about the environment. Get personalized mission recommendations and carbon footprint analysis." delay={0.4} />
            <FeatureCard icon={<Leaf className="w-6 h-6" />} title="Real Rewards" desc="Redeem EcoPoints for certificates, eco-products, scholarships, and more from partner organizations." delay={0.5} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-3xl border border-primary/30 bg-accent/50 backdrop-blur-sm p-12 glow-sm"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Ready to save the planet?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of students making a real difference. Your journey starts with a single seed.
          </p>
          <Link to="/signup">
            <Button size="lg" className="glow-md text-lg px-10 py-6 font-heading font-bold">
              Start as a 🌱 Seed <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌍</span>
            <span className="font-display font-bold text-foreground">EcoQuest</span>
          </div>
          <p>© 2026 EcoQuest. Growing a greener future, one mission at a time.</p>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Leaf className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      </footer>
    </div>
  );
}

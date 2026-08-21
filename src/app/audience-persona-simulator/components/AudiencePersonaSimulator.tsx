'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/ui/AppIcon';
import MetricBar from '@/components/ui/MetricBar';

const defaultContent = `Excited to share that our team just hit a major milestone — 10,000 customers in 18 months! 🎉

This journey has taught me more about resilience, teamwork, and the power of listening to your customers than any business school ever could.

Three things that made the difference:
→ Obsessive customer focus
→ Shipping fast and iterating faster
→ Building a culture of radical transparency

What's your biggest lesson from building something from scratch? Drop it below 👇

#StartupLife #SaaS #Entrepreneurship #B2B #Growth`;

interface Persona {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  reaction: string;
  likelyAction: string;
  painPoint: string;
  resonance: number;
  trust: number;
  relevance: number;
  actionLikelihood: number;
  quote: string;
}

const generatePersonas = (content: string): Persona[] => {
  const hasNumbers = /\d/.test(content);
  const hasBullets = /[→•\-\*]/.test(content);
  const hasQuestion = content.includes('?');
  const wordCount = content.split(/\s+/).length;
  const hasHashtags = /#\w+/.test(content);

  return [
    {
      id: 'founder',
      name: 'The Founder',
      emoji: '🚀',
      description: 'Early-stage startup founder, 28–38, building in public',
      color: '#7C3AED',
      reaction: 'Highly relatable — they see themselves in this story',
      likelyAction: 'Saves post, leaves a comment sharing their own milestone',
      painPoint: 'Wants validation and community, not just inspiration',
      resonance: hasNumbers ? 91 : 75,
      trust: 85,
      relevance: 94,
      actionLikelihood: hasQuestion ? 82 : 60,
      quote: '"Finally, someone who gets it. Sharing this with my co-founder."',
    },
    {
      id: 'recruiter',
      name: 'The Recruiter',
      emoji: '🎯',
      description: 'Tech recruiter or talent scout, scanning for culture signals',
      color: '#06B6D4',
      reaction: 'Interested in the company culture signals and growth trajectory',
      likelyAction: 'Follows the author, researches the company for talent pipeline',
      painPoint: 'Needs proof of culture, not just numbers',
      resonance: hasBullets ? 78 : 62,
      trust: 72,
      relevance: 68,
      actionLikelihood: 45,
      quote: '"Radical transparency — that\'s a culture flag I want to explore."',
    },
    {
      id: 'investor',
      name: 'The Investor',
      emoji: '💼',
      description: 'Angel investor or VC associate, evaluating founders',
      color: '#F59E0B',
      reaction: 'Scans for traction signals and founder mindset quality',
      likelyAction: 'DMs the author or adds to watchlist',
      painPoint: 'Needs specifics — revenue, growth rate, market size',
      resonance: hasNumbers ? 70 : 45,
      trust: 65,
      relevance: 72,
      actionLikelihood: hasNumbers ? 58 : 30,
      quote: '"10k customers is interesting. But what\'s the MRR?"',
    },
    {
      id: 'jobseeker',
      name: 'The Job Seeker',
      emoji: '👩‍💻',
      description: 'Mid-level professional looking for their next opportunity',
      color: '#10B981',
      reaction: 'Inspired by the culture described, evaluates as potential employer',
      likelyAction: 'Checks company LinkedIn page, looks for open roles',
      painPoint: 'Wants to know if this culture is real or performative',
      resonance: hasBullets ? 83 : 70,
      trust: 76,
      relevance: 79,
      actionLikelihood: 52,
      quote: '"Radical transparency sounds amazing. Are they hiring?"',
    },
    {
      id: 'competitor',
      name: 'The Competitor',
      emoji: '🔍',
      description: 'Founder or PM at a competing company, doing market research',
      color: '#EF4444',
      reaction: 'Analyzes the milestone for competitive intelligence',
      likelyAction: 'Likes the post (to stay visible), internally benchmarks',
      painPoint: 'Wants to understand their growth strategy',
      resonance: 55,
      trust: 50,
      relevance: 88,
      actionLikelihood: 35,
      quote: '"10k customers in 18 months. We need to understand their GTM."',
    },
  ];
};

export default function AudiencePersonaSimulator() {
  const [content, setContent] = useState(defaultContent);
  const [analyzed, setAnalyzed] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

  const handleAnalyze = () => {
    setPersonas(generatePersonas(content));
    setAnalyzed(true);
    setSelectedPersona(null);
  };

  const active = personas.find(p => p.id === selectedPersona);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
            <Icon name="UsersIcon" size={20} className="text-warning" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Audience Persona Simulator</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          See how 5 different audience types perceive, react to, and act on your content.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-border bg-card card-glow p-6 space-y-4">
        <label className="text-sm font-semibold text-foreground">Your Content</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setAnalyzed(false); }}
          rows={5}
          className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          placeholder="Paste your content here..."
        />
        <div className="flex justify-end">
          <button onClick={handleAnalyze} disabled={!content.trim()} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 disabled:opacity-50">
            <Icon name="UsersIcon" size={16} />
            Simulate Personas
          </button>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {analyzed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Persona Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {personas.map((persona, i) => (
                <motion.button
                  key={persona.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedPersona(selectedPersona === persona.id ? null : persona.id)}
                  className={`rounded-2xl border p-4 text-left transition-all duration-200 space-y-2 ${
                    selectedPersona === persona.id
                      ? 'border-primary/50 bg-primary/5 card-glow-active' :'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                  }`}
                >
                  <div className="text-2xl">{persona.emoji}</div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{persona.name}</p>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${persona.resonance}%`, backgroundColor: persona.color }} />
                    </div>
                    <span className="text-xs font-bold font-tabular" style={{ color: persona.color }}>{persona.resonance}</span>
                  </div>
                  <p className="text-xs text-foreground/70">Resonance</p>
                </motion.button>
              ))}
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="rounded-2xl border border-border bg-card card-glow overflow-hidden"
                >
                  <div className="p-6 border-b border-border flex items-center gap-4">
                    <div className="text-4xl">{active.emoji}</div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{active.name}</h3>
                      <p className="text-sm text-muted-foreground">{active.description}</p>
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Scores */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-foreground">Perception Scores</h4>
                      <div className="space-y-3">
                        <MetricBar label="Resonance" value={active.resonance} color={active.color} showValue />
                        <MetricBar label="Trust" value={active.trust} color={active.color} showValue />
                        <MetricBar label="Relevance" value={active.relevance} color={active.color} showValue />
                        <MetricBar label="Action Likelihood" value={active.actionLikelihood} color={active.color} showValue />
                      </div>
                    </div>
                    {/* Right: Qualitative */}
                    <div className="space-y-4">
                      <div className="rounded-xl bg-muted/40 border border-border p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Their Reaction</p>
                        <p className="text-sm text-foreground">{active.reaction}</p>
                      </div>
                      <div className="rounded-xl bg-muted/40 border border-border p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Likely Action</p>
                        <p className="text-sm text-foreground">{active.likelyAction}</p>
                      </div>
                      <div className="rounded-xl bg-muted/40 border border-border p-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Pain Point</p>
                        <p className="text-sm text-foreground">{active.painPoint}</p>
                      </div>
                      <div className="rounded-xl border border-border p-4" style={{ backgroundColor: active.color + '15', borderColor: active.color + '40' }}>
                        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: active.color }}>What They're Thinking</p>
                        <p className="text-sm text-foreground italic">{active.quote}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!selectedPersona && (
              <p className="text-center text-sm text-muted-foreground">Click a persona card to see their detailed reaction</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

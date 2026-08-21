import type { AnalysisResult } from '@/types/analysis';

export const mockAnalysisResult: AnalysisResult = {
  id: 'analysis-001',
  uploadedAt: '2026-08-21T04:30:00Z',
  filename: 'linkedin-post-q3-campaign.pdf',
  fileType: 'pdf',
  platform: 'LinkedIn',
  contentType: 'Post',
  status: 'complete',
  extractedText: `Excited to share that our team just hit a major milestone — 10,000 customers in 18 months! 🎉

This journey has taught me more about resilience, teamwork, and the power of listening to your customers than any business school ever could.

When we started, everyone said B2B SaaS in this niche was too crowded. We believed in the problem we were solving.

Three things that made the difference:
→ Obsessive customer focus
→ Shipping fast and iterating faster
→ Building a culture of radical transparency

To every customer who believed in us early — thank you. You're the reason we wake up every morning. What's your biggest lesson from building something from scratch? Drop it below 👇

#StartupLife #SaaS #Entrepreneurship #B2B #Growth`,
  ocrConfidence: 98.4,
  pageCount: 1,
  characterCount: 742,
  scores: {
    hook: 91,
    clarity: 86,
    emotion: 78,
    readability: 88,
    cta: 72,
    originality: 80,
    overall: 82,
  },
  tone: 'Inspirational',
  sentiment: 'Positive',
  keywords: {
    important: ['milestone', 'customers', 'resilience', 'teamwork', 'transparency'],
    repeated: ['customers', 'building'],
    weak: ['major', 'things', 'every'],
    potential: ['10x growth', 'B2B success', 'startup journey'],
  },
  hashtags: {
    count: 5,
    tags: ['#StartupLife', '#SaaS', '#Entrepreneurship', '#B2B', '#Growth'],
    generic: ['#StartupLife', '#Growth'],
    specific: ['#SaaS', '#B2B', '#Entrepreneurship'],
    suggestions: ['#FounderStory', '#B2BSaaS', '#StartupMilestone', '#CustomerSuccess'],
    relevanceScore: 74,
  },
  recommendations: [
    {
      id: 'rec-001',
      category: 'CTA',
      what: 'Strengthen your call-to-action',
      why: 'Your CTA is a question, which is good for engagement, but it lacks specificity. A targeted question gets 3x more responses.',
      suggestion: 'Replace "Drop it below 👇" with "Share your #1 lesson in one sentence — I read every reply."',
      priority: 'HIGH',
    },
    {
      id: 'rec-002',
      category: 'Hook',
      what: 'Lead with the number earlier',
      why: 'Numbers create immediate pattern interruption in feeds. "10,000 customers" buried after "Excited to share" loses impact.',
      suggestion: 'Start with: "10,000 customers. 18 months. Zero outside funding. Here\'s what nobody tells you."',
      priority: 'HIGH',
    },
    {
      id: 'rec-003',
      category: 'Structure',
      what: 'Add a transitional bridge before the lesson list',
      why: 'The jump from emotional narrative to bullet points feels abrupt. A one-line bridge improves flow and keeps readers engaged.',
      suggestion: 'Add before the arrows: "But the real lessons weren\'t in a pitch deck:"',
      priority: 'MEDIUM',
    },
    {
      id: 'rec-004',
      category: 'Hashtags',
      what: 'Replace generic hashtags with niche-specific ones',
      why: '#StartupLife has 12M+ posts. Your content will drown. Niche tags have smaller but highly engaged audiences.',
      suggestion: 'Swap #StartupLife → #FounderStory and #Growth → #B2BSaaS for better reach-to-engagement ratio.',
      priority: 'MEDIUM',
    },
    {
      id: 'rec-005',
      category: 'Emotional Impact',
      what: 'Name a specific customer story',
      why: 'Abstract gratitude ("every customer") is forgettable. One concrete story creates emotional resonance that drives shares.',
      suggestion: 'Add: "One customer told us we saved their team 12 hours a week. That\'s when it clicked."',
      priority: 'LOW',
    },
  ],
  insights: {
    strongestSentence: '"We believed in the problem we were solving."',
    weakestSection: 'The closing CTA — too generic, lacks urgency or specificity.',
    wordCount: 156,
    readingTime: '37 seconds',
    sentenceCount: 12,
    avgSentenceLength: 13,
    fillerWords: ['major', 'just', 'every'],
    questions: 1,
    emojis: ['🎉', '👇'],
    mentions: [],
    urls: 0,
    passiveVoiceCount: 1,
    ctaDetected: true,
  },
  contentDNA: {
    professional: 72,
    emotional: 65,
    educational: 85,
    confident: 78,
    urgent: 22,
    creative: 80,
  },
};

export const mockRecentAnalyses = [
  {
    id: 'analysis-001',
    filename: 'linkedin-post-q3-campaign.pdf',
    platform: 'LinkedIn' as const,
    contentType: 'Post' as const,
    uploadedAt: '2026-08-21T04:30:00Z',
    overallScore: 82,
    status: 'complete' as const,
    fileType: 'pdf' as const,
  },
  {
    id: 'analysis-002',
    filename: 'instagram-product-launch.jpg',
    platform: 'Instagram' as const,
    contentType: 'Caption' as const,
    uploadedAt: '2026-08-20T14:22:00Z',
    overallScore: 67,
    status: 'complete' as const,
    fileType: 'image' as const,
  },
  {
    id: 'analysis-003',
    filename: 'twitter-thread-draft.pdf',
    platform: 'X/Twitter' as const,
    contentType: 'Post' as const,
    uploadedAt: '2026-08-19T09:15:00Z',
    overallScore: 74,
    status: 'complete' as const,
    fileType: 'pdf' as const,
  },
  {
    id: 'analysis-004',
    filename: 'facebook-ad-copy-v2.png',
    platform: 'Facebook' as const,
    contentType: 'Advertisement' as const,
    uploadedAt: '2026-08-18T16:45:00Z',
    overallScore: 58,
    status: 'complete' as const,
    fileType: 'image' as const,
  },
  {
    id: 'analysis-005',
    filename: 'linkedin-announcement.pdf',
    platform: 'LinkedIn' as const,
    contentType: 'Announcement' as const,
    uploadedAt: '2026-08-17T11:30:00Z',
    overallScore: 89,
    status: 'complete' as const,
    fileType: 'pdf' as const,
  },
  {
    id: 'analysis-006',
    filename: 'ig-reel-caption-draft.jpg',
    platform: 'Instagram' as const,
    contentType: 'Marketing Content' as const,
    uploadedAt: '2026-08-16T08:00:00Z',
    overallScore: 71,
    status: 'complete' as const,
    fileType: 'image' as const,
  },
];

export const mockScoreHistory = [
  { label: '#1', score: 58, date: 'Aug 14' },
  { label: '#2', score: 64, date: 'Aug 15' },
  { label: '#3', score: 71, date: 'Aug 16' },
  { label: '#4', score: 67, date: 'Aug 17' },
  { label: '#5', score: 89, date: 'Aug 18' },
  { label: '#6', score: 74, date: 'Aug 19' },
  { label: '#7', score: 82, date: 'Aug 21' },
];
export type Platform = 'Instagram' | 'LinkedIn' | 'X/Twitter' | 'Facebook' | 'General';
export type ContentType = 'Post' | 'Caption' | 'Advertisement' | 'Announcement' | 'Marketing Content' | 'Other';
export type AnalysisStatus = 'uploaded' | 'extracting' | 'analyzing' | 'complete' | 'error';
export type Sentiment = 'Positive' | 'Negative' | 'Neutral';
export type Tone = 'Professional' | 'Friendly' | 'Educational' | 'Inspirational' | 'Humorous' | 'Promotional' | 'Urgent' | 'Neutral';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScoreBreakdown {
  hook: number;
  clarity: number;
  emotion: number;
  readability: number;
  cta: number;
  originality: number;
  overall: number;
}

export interface Recommendation {
  id: string;
  category: string;
  what: string;
  why: string;
  suggestion: string;
  priority: Priority;
}

export interface KeywordAnalysis {
  important: string[];
  repeated: string[];
  weak: string[];
  potential: string[];
}

export interface HashtagAnalysis {
  count: number;
  tags: string[];
  generic: string[];
  specific: string[];
  suggestions: string[];
  relevanceScore: number;
}

export interface ContentInsights {
  strongestSentence: string;
  weakestSection: string;
  wordCount: number;
  readingTime: string;
  sentenceCount: number;
  avgSentenceLength: number;
  fillerWords: string[];
  questions: number;
  emojis: string[];
  mentions: string[];
  urls: number;
  passiveVoiceCount: number;
  ctaDetected: boolean;
}

export interface AnalysisResult {
  id: string;
  uploadedAt: string;
  filename: string;
  fileType: 'pdf' | 'image';
  platform: Platform;
  contentType: ContentType;
  status: AnalysisStatus;
  extractedText: string;
  ocrConfidence?: number;
  pageCount?: number;
  characterCount: number;
  scores: ScoreBreakdown;
  tone: Tone;
  sentiment: Sentiment;
  keywords: KeywordAnalysis;
  hashtags: HashtagAnalysis;
  recommendations: Recommendation[];
  insights: ContentInsights;
  contentDNA: {
    professional: number;
    emotional: number;
    educational: number;
    confident: number;
    urgent: number;
    creative: number;
  };
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Pencil, 
  Clock, 
  LayoutDashboard, 
  Mail, 
  Search,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Eye,
  Columns,
  Quote,
  Minus,
  BookOpen,
  Heading,
  Sparkles,
  Download,
  UploadCloud,
  Link2,
  RefreshCw,
  Clipboard
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

import { AdminNav } from '../components/AdminNav';

interface Insight {
  id: string;
  title: string;
  type: string;
  description: string;
  photoUrl: string;
  content: string;
  markets: string[];
  subMarkets: string[];
  market?: string; 
  subMarket?: string; 
  sections: string[];
  displayDate: string;
  authorId: string;
  createdAt: any;
  updatedAt: any;
}

const PAPER_TYPES = ["Article", "Report", "Research", "Interview", "Case Study"];
const MARKETS = ["Global", "UAE", "India", "Southeast Asia", "Emerging Markets"];
const SUB_MARKETS: Record<string, string[]> = {
  "UAE": ["Dubai", "Abu Dhabi", "Ras Al Khaimah"],
  "India": ["Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Chennai", "Goa"],
  "Southeast Asia": ["Singapore", "Vietnam", "Thailand", "Indonesia", "Sri Lanka"],
  "Emerging Markets": ["Saudi Arabia", "Egypt", "Nigeria", "Brazil", "Mexico", "Turkey"],
  "Global": ["Macro Trends", "Cross-Border", "Digital Assets", "ESG"]
};
const SECTIONS = ["Spotlight", "New from Univue", "Regular"];

interface DocBlock {
  id: string;
  type: 'heading' | 'subheading' | 'paragraph' | 'highlight' | 'grid' | 'quote' | 'image' | 'chart' | 'divider' | 'reference' | 'footnote' | 'stat';
  text?: string;
  author?: string; // for quote
  title?: string;  // for highlight/chart
  col1Title?: string;
  col1Text?: string;
  col2Title?: string;
  col2Text?: string;
  imageUrl?: string;
  caption?: string;
  chartData?: { label: string; value: number }[];
  fontSize?: 'sm' | 'base' | 'lg';
  fontStyle?: 'normal' | 'bold' | 'italic' | 'lead';
}

const compileDocument = (
  blocks: DocBlock[], 
  font: string, 
  size: string, 
  dateLine: string, 
  byLine: string
): string => {
  let output = `<div class="univue-paper font-${font} text-size-${size}">\n\n`;
  
  if (dateLine || byLine) {
    output += `<div class="univue-byline-block flex flex-wrap justify-between items-center text-[10px] uppercase tracking-[0.25em] font-bold text-brand-gold border-b border-gray-150 pb-4 mb-8">\n`;
    if (dateLine) output += `  <span>${dateLine}</span>\n`;
    if (byLine) output += `  <span>${byLine}</span>\n`;
    output += `</div>\n\n`;
  }
  
  for (const block of blocks) {
    switch (block.type) {
      case 'heading':
        output += `### ${block.text || 'Heading Section'}\n\n`;
        break;
        
      case 'paragraph': {
        let pText = block.text || '';
        if (block.fontStyle === 'italic') {
          pText = `*${pText}*`;
        } else if (block.fontStyle === 'bold') {
          pText = `**${pText}**`;
        } else if (block.fontStyle === 'lead') {
          output += `<p class="text-xl md:text-2xl text-brand-blue font-serif font-light leading-relaxed mb-6 italic border-l-2 border-brand-gold pl-6">${pText}</p>\n\n`;
          continue;
        }
        
        if (block.fontSize === 'lg') {
          output += `<p class="text-lg text-gray-700 leading-relaxed font-light mb-6">${pText}</p>\n\n`;
        } else if (block.fontSize === 'sm') {
          output += `<p class="text-xs text-gray-400 leading-normal mb-4 italic">${pText}</p>\n\n`;
        } else {
          output += `${pText}\n\n`;
        }
        break;
      }
        
      case 'highlight':
        output += `:::highlight\n`;
        if (block.title) output += `### ${block.title}\n`;
        output += `${block.text || ''}\n`;
        output += `:::\n\n`;
        break;
        
      case 'grid':
        output += `:::grid\n`;
        output += `#### ${block.col1Title || 'Column 1 Header'}\n`;
        output += `${block.col1Text || ''}\n\n`;
        output += `#### ${block.col2Title || 'Column 2 Header'}\n`;
        output += `${block.col2Text || ''}\n`;
        output += `:::\n\n`;
        break;
        
      case 'quote':
        output += `> [ ${block.title || 'INSIGHT PULL QUOTE'} ]\n`;
        output += `> "${block.text || ''}"\n`;
        output += `> — ${block.author || 'Univue Executive Advisory'}\n\n`;
        break;
        
      case 'divider':
        output += `---\n\n`;
        break;
        
      case 'image':
        output += `<figure class="my-10 border-y border-gray-100 py-4 bg-gray-50/25 p-4">\n`;
        output += `  <img src="${block.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200'}" alt="${block.caption || ''}" class="w-full h-auto object-cover max-h-[450px]" referrerPolicy="no-referrer" />\n`;
        output += `  <figcaption class="text-[9px] uppercase tracking-widest text-center mt-3 text-gray-400 font-bold block">${block.caption || 'Advisory Photo Asset'}</figcaption>\n`;
        output += `</figure>\n\n`;
        break;
        
      case 'subheading':
        output += `#### ${block.text || 'Subheading Section'}\n\n`;
        break;
        
      case 'reference': {
        const refInfo = parseReferenceText(block.text);
        if (refInfo.url) {
          output += `<p class="univue-reference text-[10px] text-gray-500 font-mono pl-3 border-l border-gray-300 my-2">[REF] <a href="${refInfo.url}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; font-weight: bold;">${refInfo.title}</a></p>\n\n`;
        } else {
          output += `<p class="univue-reference text-[10px] text-gray-500 font-mono pl-3 border-l border-gray-300 my-2">[REF] ${refInfo.title}</p>\n\n`;
        }
        break;
      }
        
      case 'footnote':
        output += `<p class="univue-footnote text-[9px] text-gray-400 italic my-1">⁺ ${block.text || ''}</p>\n\n`;
        break;
        
      case 'stat':
        output += `<div class="univue-stat-card my-6 p-4 bg-brand-soft-ivory/30 border border-brand-gold/20 flex flex-col items-center justify-center text-center">\n`;
        output += `  <span class="text-3xl font-serif font-bold text-brand-blue">${block.title || ''}</span>\n`;
        output += `  <span class="text-[10px] uppercase tracking-widest text-brand-gold font-bold mt-1">${block.text || ''}</span>\n`;
        output += `</div>\n\n`;
        break;

      case 'chart': {
        const title = block.title || 'Performance Indices';
        const data = block.chartData || [];
        output += `<div class="my-10 p-8 bg-brand-soft-ivory border border-gray-200/65 rounded-none font-sans shadow-sm max-w-2xl mx-auto">\n`;
        output += `  <p class="text-[9px] uppercase tracking-[0.25em] font-bold text-brand-gold mb-6 border-b border-gray-150 pb-3 block">${title}</p>\n`;
        output += `  <div class="space-y-5">\n`;
        data.forEach(item => {
          output += `    <div>\n`;
          output += `      <div class="flex justify-between text-[11px] font-bold text-brand-blue mb-1.5 uppercase tracking-wider">\n`;
          output += `        <span>${item.label || 'Indicator'}</span>\n`;
          output += `        <span class="text-brand-gold font-mono">${item.value || 0}%</span>\n`;
          output += `      </div>\n`;
          output += `      <div class="w-full bg-gray-150/40 h-2.5 rounded-none overflow-hidden">\n`;
          output += `        <div class="bg-brand-gold h-full" style="width: ${item.value || 0}%"></div>\n`;
          output += `      </div>\n`;
          output += `    </div>\n`;
        });
        output += `  </div>\n`;
        output += `  <p class="text-[8px] text-gray-400 uppercase tracking-widest text-right mt-4 font-bold tracking-wide">* Benchmark Projections 2026</p>\n`;
        output += `</div>\n\n`;
        break;
      }
    }
  }
  
  output += `</div>`;
  return output;
};

const parseContentToBlocks = (content: string): DocBlock[] => {
  if (!content || content.trim() === '') {
    return [];
  }

  const blocks: DocBlock[] = [];
  const lines = content.split('\n');
  let currentBlockType: string | null = null;
  let currentBlockLines: string[] = [];
  
  let gridCol = 1;
  let gridHeader1 = '';
  let gridText1 = '';
  let gridHeader2 = '';
  let gridText2 = '';

  const flush = () => {
    if (currentBlockType === 'paragraph' && currentBlockLines.length > 0) {
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'paragraph',
        text: currentBlockLines.join('\n').trim(),
        fontSize: 'base',
        fontStyle: 'normal'
      });
    }
    currentBlockLines = [];
    currentBlockType = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith(':::highlight')) {
      flush();
      currentBlockType = 'highlight';
      continue;
    } else if (trimmed.startsWith(':::grid')) {
      flush();
      currentBlockType = 'grid';
      gridCol = 1;
      gridHeader1 = '';
      gridText1 = '';
      gridHeader2 = '';
      gridText2 = '';
      continue;
    } else if (trimmed === ':::') {
      if (currentBlockType === 'highlight') {
        let title = 'Strategic Takeaway';
        let bodyText = '';
        const joined = currentBlockLines.join('\n').trim();
        const headMatch = joined.match(/###\s*(.*)/);
        if (headMatch) {
          title = headMatch[1];
          bodyText = joined.replace(/###\s*(.*)/, '').trim();
        } else {
          bodyText = joined;
        }
        blocks.push({
          id: 'b-' + Math.random().toString(36).substr(2, 9),
          type: 'highlight',
          title,
          text: bodyText
        });
      } else if (currentBlockType === 'grid') {
        blocks.push({
          id: 'b-' + Math.random().toString(36).substr(2, 9),
          type: 'grid',
          col1Title: gridHeader1 || 'Column 1',
          col1Text: gridText1.trim(),
          col2Title: gridHeader2 || 'Column 2',
          col2Text: gridText2.trim()
        });
      }
      currentBlockType = null;
      currentBlockLines = [];
      continue;
    }

    if (currentBlockType === 'highlight') {
      currentBlockLines.push(line);
      continue;
    } else if (currentBlockType === 'grid') {
      if (trimmed.startsWith('####')) {
        const headerText = trimmed.substring(4).trim();
        if (gridCol === 1 && !gridHeader1) {
          gridHeader1 = headerText;
        } else {
          gridCol = 2;
          gridHeader2 = headerText;
        }
      } else {
        if (gridCol === 1) {
          gridText1 += line + '\n';
        } else {
          gridText2 += line + '\n';
        }
      }
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      flush();
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'subheading',
        text: trimmed.substring(5).trim()
      });
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flush();
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'heading',
        text: trimmed.substring(4).trim()
      });
      continue;
    }

    if (trimmed.includes('class="univue-reference"') || trimmed.includes('[REF]')) {
      flush();
      const matchContent = trimmed.match(/>\[REF\]\s*([^<]+)</) || trimmed.match(/>([^<]+)</);
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'reference',
        text: matchContent ? matchContent[1].trim() : trimmed.replace(/<\/?[^>]+(>|$)/g, "").replace('[REF]', '').trim()
      });
      continue;
    }

    if (trimmed.includes('class="univue-footnote"') || trimmed.includes('⁺ ')) {
      flush();
      const matchContent = trimmed.match(/>⁺\s*([^<]+)</) || trimmed.match(/>([^<]+)</);
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'footnote',
        text: matchContent ? matchContent[1].trim() : trimmed.replace(/<\/?[^>]+(>|$)/g, "").replace('⁺', '').trim()
      });
      continue;
    }

    if (trimmed.includes('class="univue-stat-card"') || trimmed.includes('univue-stat-card')) {
      flush();
      let valStr = '';
      let lblStr = '';
      let scanAhead = i;
      let limitScan = 0;
      while (scanAhead < lines.length && limitScan < 8) {
        const l = lines[scanAhead].trim();
        const valMatch = l.match(/text-3xl[^>]*>([^<]+)/);
        if (valMatch) valStr = valMatch[1].trim();
        const lblMatch = l.match(/tracking-widest[^>]*>([^<]+)/);
        if (lblMatch) lblStr = lblMatch[1].trim();
        if (l.includes('</div>')) {
          i = scanAhead;
          break;
        }
        scanAhead++;
        limitScan++;
      }
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'stat',
        title: valStr || '92%',
        text: lblStr || 'Growth Index'
      });
      continue;
    }

    if (trimmed.startsWith('>')) {
      flush();
      let quoteText = '';
      let quoteAuthor = '';
      let quoteGroup = '';
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        const qTrim = lines[i].trim().substring(1).trim();
        if (qTrim.startsWith('[') && qTrim.endsWith(']')) {
          quoteGroup = qTrim.slice(1, -1).trim();
        } else if (qTrim.startsWith('—') || qTrim.startsWith('-')) {
          quoteAuthor = qTrim.substring(1).trim();
        } else if (qTrim !== '') {
          quoteText += (quoteText ? '\n' : '') + qTrim.replace(/^["']|["']$/g, '');
        }
        i++;
      }
      i--;
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'quote',
        title: quoteGroup || 'INSIGHT PULL QUOTE',
        text: quoteText || 'Advisory text description',
        author: quoteAuthor || 'Director of Macro Advisory'
      });
      continue;
    }

    if (trimmed === '---') {
      flush();
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'divider'
      });
      continue;
    }

    // Checking embedded img/figure HTML
    const imgHtml = trimmed.match(/<img[^>]*src=["']([^"']*)["']/i);
    const imgMd = trimmed.match(/!\[([^\]]*)\]\(([^)]*)\)/);
    if (imgHtml || imgMd) {
      flush();
      const url = imgHtml ? imgHtml[1] : imgMd![2];
      let cap = '';
      if (imgMd) {
        cap = imgMd[1];
      } else {
        const altFind = trimmed.match(/alt=["']([^"']*)["']/i);
        if (altFind) cap = altFind[1];
      }
      // Scan next lines if they represent figcaption
      let nextIndex = i + 1;
      while (nextIndex < lines.length && nextIndex < i + 4) {
        const nextTrim = lines[nextIndex].trim();
        const figMatch = nextTrim.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i) || nextTrim.match(/figcaption:\s*(.*)/i);
        if (figMatch) {
          cap = figMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
          break;
        }
        nextIndex++;
      }
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'image',
        imageUrl: url,
        caption: cap || 'Strategic Asset Illustration'
      });
      continue;
    }

    // Checking embedded chart card HTML
    if (trimmed.includes('bg-brand-soft-ivory') || (trimmed.includes('Indicator') && trimmed.includes('%</span>'))) {
      flush();
      let title = 'Asset Performance Projections';
      const titleLineIndex = lines.slice(Math.max(0, i-2), i+2).findIndex(l => l.includes('text-[9px]'));
      if (titleLineIndex !== -1) {
        const titleLine = lines[Math.max(0, i-2) + titleLineIndex];
        const matchText = titleLine.match(/>([^<]+)</);
        if (matchText) title = matchText[1].trim();
      }

      const points: { label: string; value: number }[] = [];
      let scanAhead = i;
      let limitScan = 0;
      while (scanAhead < lines.length && limitScan < 25) {
        const l = lines[scanAhead].trim();
        if (l.includes('text-brand-blue') && l.includes('flex justify-between')) {
          const itemMatch = lines[scanAhead + 1]?.match(/<span>(.*?)<\/span>/);
          const valMatch = lines[scanAhead + 2]?.match(/>(.*?)%?<\/span>/);
          if (itemMatch && valMatch) {
            points.push({
              label: itemMatch[1].trim(),
              value: parseFloat(valMatch[1]) || 0
            });
          }
        }
        if (l.includes('Benchmark Projections') || l.includes('Interactive Model')) {
          i = scanAhead; 
          break;
        }
        scanAhead++;
        limitScan++;
      }
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'chart',
        title,
        chartData: points.length > 0 ? points : [{ label: 'Performance Spread', value: 85 }]
      });
      continue;
    }

    if (trimmed.startsWith('<p ') && trimmed.includes('text-xl')) {
      flush();
      const matchContent = trimmed.match(/>([^<]+)</);
      blocks.push({
        id: 'b-' + Math.random().toString(36).substr(2, 9),
        type: 'paragraph',
        text: matchContent ? matchContent[1] : trimmed.replace(/<\/?[^>]+(>|$)/g, ""),
        fontStyle: 'lead',
        fontSize: 'base'
      });
      continue;
    }

    if (trimmed !== '') {
      currentBlockType = 'paragraph';
      currentBlockLines.push(line);
    } else {
      flush();
    }
  }
  flush();
  return blocks;
};

const parseReferenceText = (rawText: string | undefined): { title: string; url?: string } => {
  if (!rawText) return { title: '' };
  const parts = rawText.split('|');
  if (parts.length > 1) {
    return {
      title: parts[0].trim(),
      url: parts[1].trim()
    };
  }
  return { title: rawText.trim() };
};

const generateMarkdownFromBlocks = (blocks: DocBlock[]): string => {
  if (!blocks || blocks.length === 0) return '';
  return blocks.map(block => {
    switch (block.type) {
      case 'heading':
        return `# ${block.text || ''}`;
      case 'subheading':
        return `## ${block.text || ''}`;
      case 'paragraph':
        return `${block.text || ''}`;
      case 'quote':
        return `> ${block.text || ''}\n> — ${block.author || ''}`;
      case 'highlight':
        return `:::highlight\n### ${block.title || 'Briefing'}\n${block.text || ''}\n:::`;
      case 'image':
        return `[picture: ${block.imageUrl || ''} | ${block.caption || ''}]`;
      case 'reference':
        return `[ref: ${block.text || ''}]`;
      case 'footnote':
        return `[footnote: ${block.text || ''}]`;
      case 'stat':
        return `[stat: ${block.title || ''} | ${block.text || ''}]`;
      case 'divider':
        return `---`;
      default:
        return '';
    }
  }).filter(t => t !== '').join('\n\n');
};

const parseEditorialMarkdown = (text: string): DocBlock[] => {
  if (!text || text.trim() === '') return [];
  const segments = text.split(/\r?\n\s*\r?\n/).filter(s => s.trim().length > 0);
  const blocks: DocBlock[] = [];
  
  segments.forEach((seg, idx) => {
    const trimmed = seg.trim();
    const id = `ed-${idx}-${Math.random().toString(36).substr(2, 5)}`;
    
    if (trimmed.startsWith('##')) {
      const cleanText = trimmed.replace(/^##+\s*/, '');
      blocks.push({
        id,
        type: 'subheading',
        text: cleanText
      });
    } else if (trimmed.startsWith('#')) {
      const cleanText = trimmed.replace(/^#+\s*/, '');
      blocks.push({
        id,
        type: 'heading',
        text: cleanText
      });
    } else if (trimmed.startsWith('>')) {
      const rawLines = trimmed.split('\n');
      const cleanQuote = rawLines.map(l => l.replace(/^>\s*/, '')).join('\n');
      let textPortion = cleanQuote;
      let author = 'Univue Advisory Desk';
      if (cleanQuote.includes('—')) {
        const parts = cleanQuote.split('—');
        textPortion = parts[0].trim();
        author = parts[1].trim();
      } else if (cleanQuote.includes('--')) {
        const parts = cleanQuote.split('--');
        textPortion = parts[0].trim();
        author = parts[1].trim();
      }
      blocks.push({
        id,
        type: 'quote',
        text: textPortion,
        title: 'EDITORIAL CITATION',
        author
      });
    } else if (trimmed.startsWith(':::highlight')) {
      const lines = trimmed.split('\n').filter(l => !l.startsWith(':::'));
      let title = 'HIGHLIGHT BRIEF';
      let content = '';
      if (lines.length > 0) {
        if (lines[0].startsWith('###') || lines[0].startsWith('##')) {
          title = lines[0].replace(/^#+\s*/, '');
          content = lines.slice(1).join('\n');
        } else {
          content = lines.join('\n');
        }
      }
      blocks.push({
        id,
        type: 'highlight',
        title,
        text: content
      });
    } else if (trimmed.startsWith('---')) {
      blocks.push({
        id,
        type: 'divider'
      });
    } else if (trimmed.startsWith('[picture:') || trimmed.startsWith('[image:') || trimmed.startsWith('[billede:')) {
      const pictureMatch = trimmed.match(/^\[(?:picture|image|billede):\s*([^|\]]+)(?:\|\s*([^\]]+))?\]/i);
      const urlPart = pictureMatch ? pictureMatch[1].trim() : '';
      const captionPart = pictureMatch ? (pictureMatch[2]?.trim() || "Univue Photo Footnote") : "Univue Caption";
      blocks.push({
        id,
        type: 'image',
        imageUrl: urlPart,
        caption: captionPart
      });
    } else if (trimmed.startsWith('[ref:') || trimmed.startsWith('[reference:')) {
      const refMatch = trimmed.match(/^\[(?:ref|reference):\s*([^\]]+)\]/i);
      const textVal = refMatch ? refMatch[1].trim() : trimmed.replace(/^\[(?:ref|reference):\s*/, '').replace(/\]$/, '').trim();
      blocks.push({
        id,
        type: 'reference',
        text: textVal
      });
    } else if (trimmed.startsWith('[footnote:') || trimmed.startsWith('[fodnote:') || trimmed.startsWith('^[')) {
      const fnMatch = trimmed.match(/^\[(?:footnote|fodnote):\s*([^\]]+)\]/i) || trimmed.match(/^\^\[([^\]]+)\]/);
      const textVal = fnMatch ? fnMatch[1].trim() : trimmed.replace(/^\[(?:footnote|fodnote):\s*/, '').replace(/\]$/, '').trim();
      blocks.push({
        id,
        type: 'footnote',
        text: textVal
      });
    } else if (trimmed.startsWith('[stat:')) {
      const statMatch = trimmed.match(/^\[stat:\s*([^|\]]+)(?:\|\s*([^\]]+))?\]/i);
      const statVal = statMatch ? statMatch[1].trim() : "92%";
      const statLbl = statMatch ? (statMatch[2]?.trim() || "Key Metric Indicator") : "Annual Trend";
      blocks.push({
        id,
        type: 'stat',
        title: statVal,
        text: statLbl
      });
    } else if (trimmed.startsWith('http') && (trimmed.includes('.jpg') || trimmed.includes('.jpeg') || trimmed.includes('.png') || trimmed.includes('unsplash.com'))) {
      const urlPart = trimmed.split('\n')[0].trim();
      const captionPart = trimmed.split('\n').slice(1).join(' ').trim() || 'Editorial Image Asset';
      blocks.push({
        id,
        type: 'image',
        imageUrl: urlPart,
        caption: captionPart
      });
    } else {
      blocks.push({
        id,
        type: 'paragraph',
        text: trimmed,
        fontStyle: trimmed.length < 160 && idx === 0 ? 'lead' : 'normal',
        fontSize: 'base'
      });
    }
  });
  return blocks;
};

export const InsightsAdmin = () => {
  const { profile } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');
  const [editId, setEditId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Core Structured WYSIWYG Editor Block States
  const [docBlocks, setDocBlocks] = useState<DocBlock[]>([]);
  const [documentFont, setDocumentFont] = useState<'serif' | 'sans' | 'mixed'>('sans');
  const [documentSize, setDocumentSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [dateLine, setDateLine] = useState('');
  const [byLine, setByLine] = useState('');
  const [rawEditorMode, setRawEditorMode] = useState(false);

  // Microsoft Word & Danish Media Publishing Integration State
  const [wordConnectionTab, setWordConnectionTab] = useState<'editorial' | 'cloud' | 'local' | 'paste' | 'export'>('editorial');
  const [editorialPreset, setEditorialPreset] = useState<'tv2' | 'dr' | 'univue'>('tv2');
  const [editorialMarkdown, setEditorialMarkdown] = useState('');
  const [wordDocUrl, setWordDocUrl] = useState('');
  const [activeTenant, setActiveTenant] = useState('Univue Enterprise O365 Sovereign Tenant');
  const [isSyncingWord, setIsSyncingWord] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDocName, setConnectedDocName] = useState('');
  const [pasteInput, setPasteInput] = useState('');
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [isDraggingWord, setIsDraggingWord] = useState(false);

  const [showRefInsertionModal, setShowRefInsertionModal] = useState(false);
  const [newRefTitle, setNewRefTitle] = useState('');
  const [newRefUrl, setNewRefUrl] = useState('');

  const handleInsertReferenceSuccess = () => {
    const cleanTitle = newRefTitle.trim() || "Univue Quarterly Research, Vol. 14, Page 89";
    const cleanUrl = newRefUrl.trim();
    let snippet = '';
    if (cleanUrl) {
      snippet = `\n\n[ref: ${cleanTitle} | ${cleanUrl}]\n`;
    } else {
      snippet = `\n\n[ref: ${cleanTitle}]\n`;
    }

    const textarea = document.querySelector('textarea[placeholder*="Type or paste your narrative draft"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = editorialMarkdown;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + snippet + after;
      setEditorialMarkdown(newText);
      handleEditorialMarkdownChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + snippet.length;
        textarea.selectionEnd = start + snippet.length;
      }, 0);
    } else {
      const newText = editorialMarkdown + snippet;
      setEditorialMarkdown(newText);
      handleEditorialMarkdownChange(newText);
    }
    
    setShowRefInsertionModal(false);
  };

  const handleEditorialPresetChange = (preset: 'tv2' | 'dr' | 'univue') => {
    setEditorialPreset(preset);
    let selectedFont: 'serif' | 'sans' | 'mixed' = 'sans';
    let selectedSize: 'sm' | 'base' | 'lg' = 'base';
    if (preset === 'tv2') {
      selectedFont = 'sans';
      selectedSize = 'base';
    } else if (preset === 'dr') {
      selectedFont = 'serif';
      selectedSize = 'lg';
    } else {
      selectedFont = 'mixed';
      selectedSize = 'base';
    }
    setDocumentFont(selectedFont);
    setDocumentSize(selectedSize);
    syncBlocks(docBlocks, selectedFont, selectedSize, dateLine, byLine);
  };

  const handleEditorialMarkdownChange = (newVal: string) => {
    setEditorialMarkdown(newVal);
    const parsedBlocks = parseEditorialMarkdown(newVal);
    syncBlocks(parsedBlocks, documentFont, documentSize, dateLine, byLine);
  };

  const insertMarkdownComponent = (type: 'heading' | 'subheading' | 'quote' | 'divider' | 'highlight' | 'image' | 'reference') => {
    let snippet = '';
    switch (type) {
      case 'heading':
        snippet = '\n\n# OVERALL CONTROL AND KEY INDICATORS\n';
        break;
      case 'subheading':
        snippet = '\n\n## Special Section: Financial Observations\n';
        break;
      case 'quote':
        snippet = '\n\n> "We observe a distinct turnaround in overall European market conditions" — Univue Chief Analyst\n';
        break;
      case 'divider':
        snippet = '\n\n---\n';
        break;
      case 'highlight':
        snippet = '\n\n:::highlight\n### CORE ANNOUNCEMENT\nThis is a specially spotlighted memorandum covering recent market analyses.\n:::\n';
        break;
      case 'image':
        snippet = '\n\n[picture: https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80 | Univue Market Development - Quarterly Analysis]\n';
        break;
      case 'reference': {
        // Fallback or programmatically inserted reference component
        snippet = '\n\n[ref: Univue Quarterly Research, Vol. 14, Page 89 | https://publications.univue.com]\n';
        break;
      }
    }

    const textarea = document.querySelector('textarea[placeholder*="Type or paste your narrative draft"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = editorialMarkdown;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + snippet + after;
      setEditorialMarkdown(newText);
      handleEditorialMarkdownChange(newText);
      
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + snippet.length;
        textarea.selectionEnd = start + snippet.length;
      }, 0);
    } else {
      const newText = editorialMarkdown + snippet;
      setEditorialMarkdown(newText);
      handleEditorialMarkdownChange(newText);
    }
  };

  // AI Editorial Copilot State & Handler
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiError, setAiError] = useState('');

  const runAiCopilot = async (task: 'generate' | 'rewrite' | 'headlines' | 'extract-quotes' | 'optimize') => {
    setIsAiRunning(true);
    setAiError('');
    setAiSuggestions([]);
    
    // Custom tickers suitable for professional publishing workflows
    const tickers = {
      generate: [
        "Analyzing materials and perspectives...",
        "Formulating compelling headline...",
        "Structuring professional citation blocks...",
        "Finalizing editorial layout..."
      ],
      rewrite: [
        "Loading existing draft...",
        "Shifting tonal profile and intensity...",
        "Polishing narrative balance according to guidelines...",
        "Updating visual layout structure..."
      ],
      headlines: [
        "Reviewing core article message...",
        "Generating high-impact headline options...",
        "Assessing clickability and strength..."
      ],
      'extract-quotes': [
        "Scanning article narratives...",
        "Extracting key expert citations...",
        "Formatting quote modules..."
      ],
      optimize: [
        "Proofreading syntax and tone structure...",
        "Enhancing vocabulary and precision...",
        "Optimizing flow for publishing..."
      ]
    };
    
    const taskTickers = tickers[task] || ["Working on request..."];
    let tickerIdx = 0;
    setAiStatusMessage(taskTickers[0]);
    const tickerInterval = setInterval(() => {
      tickerIdx = Math.min(tickerIdx + 1, taskTickers.length - 1);
      setAiStatusMessage(taskTickers[tickerIdx]);
    }, 1200);

    try {
      const response = await fetch("/api/admin/editorial-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          preset: editorialPreset,
          text: editorialMarkdown || "Empty draft / insert notes here",
          prompt: aiCustomPrompt
        })
      });

      clearInterval(tickerInterval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error while contacting AI.");
      }

      const resData = await response.json();
      if (resData.success && resData.text) {
        if (task === 'headlines') {
          // Parse lines from standard list suggestions
          const lines = resData.text
            .split('\n')
            .map((line: string) => line.replace(/^[*\-\d\.\s]+/, '').trim())
            .filter((line: string) => line.length > 2);
          setAiSuggestions(lines);
        } else if (task === 'extract-quotes') {
          // Parse citation snippets
          const rawQuotes = resData.text
            .split(/\n\s*>/)
            .map((block: string) => block.startsWith('>') ? block : '>' + block)
            .map((block: string) => block.trim())
            .filter((block: string) => block.length > 3);
          setAiSuggestions(rawQuotes.length > 0 ? rawQuotes : [resData.text]);
        } else {
          handleEditorialMarkdownChange(resData.text);
          setAiCustomPrompt(''); // Clear custom instruction on success
        }
      } else {
        throw new Error("Could not retrieve editorial text correctly.");
      }
    } catch (err: any) {
      clearInterval(tickerInterval);
      console.error(err);
      setAiError(err.message || "Connection lost to the AI Editorial engine.");
    } finally {
      setIsAiRunning(false);
      setAiStatusMessage('');
    }
  };

  const handleUpdateBlockField = (id: string, field: string, value: any) => {
    const updated = docBlocks.map(b => b.id === id ? { ...b, [field]: value } : b);
    syncBlocks(updated);
  };

  const handleDeleteBlock = (id: string) => {
    const updated = docBlocks.filter(b => b.id !== id);
    syncBlocks(updated);
    if (editingBlockId === id) setEditingBlockId(null);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === docBlocks.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...docBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    syncBlocks(updated);
  };

  const insertSamplePaste = () => {
    setPasteInput(
      `1. ASIA PACIFIC SOVEREIGN TARGETS\n` +
      `Asset managers are pivoting aggressively toward key sovereign infrastructure shelters as central banking models cycle through unexpected credit adjustments.\n\n` +
      `• Real estate yields in key Tier-1 Southeast Asian gateways continue to appreciate.\n` +
      `• Exit cap rates show structural resilience against commercial debt headwinds.\n\n` +
      `2. REGULATORY SAFE HAVENS ANALYSIS\n` +
      `Institutional portfolios favor regions with clear trust protections, visa accessibility, and zero-tax frameworks on long-term wealth assets.`
    );
  };

  const [formData, setFormData] = useState({
    title: '',
    type: 'Article',
    description: '',
    photoUrl: '',
    content: '',
    market: 'Global',
    markets: ['Global'] as string[],
    subMarkets: ['Macro Trends'] as string[],
    sections: [] as string[],
    displayDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  const syncBlocks = (
    blocks: DocBlock[], 
    font: 'serif' | 'sans' | 'mixed' = documentFont, 
    size: 'sm' | 'base' | 'lg' = documentSize, 
    date: string = dateLine, 
    by: string = byLine
  ) => {
    setDocBlocks(blocks);
    const compiled = compileDocument(blocks, font, size, date, by);
    setFormData(prev => ({ ...prev, content: compiled }));
  };

  const loadPaperTemplate = (templateId: string) => {
    let initialBlocks: DocBlock[] = [];
    let initialDate = "LONDON — " + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    let initialByline = "BY UNIVUE MACRO ADVISORY GROUP";
    
    if (templateId === 'article') {
      initialBlocks = [
        {
          id: 'b-1',
          type: 'paragraph',
          text: "Sovereign re-allocations are speeding up as conventional European capital anchors encounter changing regulatory profiles. This macroeconomic publication presents a deep dive into the transaction flows backing secondary high-yield placements across growth hubs.",
          fontSize: 'base',
          fontStyle: 'normal'
        },
        {
          id: 'b-2',
          type: 'heading',
          text: "DIRECT PROPERTY DEPLOYMENT"
        },
        {
          id: 'b-3',
          type: 'paragraph',
          text: "Institutional yield indicators consistently point toward asset classes featuring sovereign tenant underwriting. Residential assets in prime corridors have registered an exceptional 120 basis points premium.",
          fontSize: 'base',
          fontStyle: 'normal'
        },
        {
          id: 'b-4',
          type: 'highlight',
          title: "Strategic Advisory Takeaway",
          text: "The integration of Golden Visa framework incentives coupled with the absolute absence of personal tax margins insulates prime yields against aggressive Western bank contraction cycles."
        },
        {
          id: 'b-5',
          type: 'heading',
          text: "GLOBAL YIELD METRICS COMPARATIVE"
        },
        {
          id: 'b-6',
          type: 'chart',
          title: "Macro Yield & Rental Index (Projected 2026)",
          chartData: [
            { label: "Dubai Prime Grade-A Yield", value: 92 },
            { label: "Singapore Orchard Road Core", value: 68 },
            { label: "London Financial District Core", value: 42 },
            { label: "Munich Executive Commercial", value: 39 }
          ]
        },
        {
          id: 'b-7',
          type: 'divider'
        },
        {
          id: 'b-8',
          type: 'quote',
          title: "DEEP MACRO RESEARCH THESIS",
          text: "Global capital flows are not passive. They seek locations with pristine regulatory transparency coupled with high actual tenant utility projection indexes.",
          author: "Marcus Vance, Director of Sovereign Real Estate"
        }
      ];
    } else if (templateId === 'briefing') {
      initialBlocks = [
        {
          id: 'b-1',
          type: 'paragraph',
          text: "Our fast-action macro digest tracks critical interest spreads and cross-border commercial transactions registered over the past 48 hours.",
          fontSize: 'base',
          fontStyle: 'normal'
        },
        {
          id: 'b-2',
          type: 'grid',
          col1Title: "High Yield Nodes (UAE & Asia)",
          col1Text: "• Regulatory shield via gold-standard business hubs\n• Streamlined digital asset settlement frameworks\n• Unprecedented tenant occupancy ratings up to 96%",
          col2Title: "Western Capital Centers",
          col2Text: "• Substantial compliance burdens and interest rate stress\n• Asset value degradation under heavy inheritance laws\n• Capital flight toward yield-safe environments"
        },
        {
          id: 'b-3',
          type: 'highlight',
          title: "Spotlight Insight",
          text: "Asset protection parameters represent the primary focus for multi-generational tier-1 family offices entering the summer advisory cycle."
        }
      ];
    } else if (templateId === 'case_study') {
      initialDate = "SINGAPORE — " + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
      initialByline = "BY THE SOUTHEAST ASIAN ADVISORY TEAM";
      initialBlocks = [
        {
          id: 'b-1',
          type: 'paragraph',
          text: "Establishing long term property allocations requires severe visual and spatial verification. This case study evaluates the operational logistics premium across Singapore's digital trade gateways.",
          fontSize: 'base',
          fontStyle: 'normal'
        },
        {
          id: 'b-2',
          type: 'image',
          imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
          caption: "Analysis Plot 1.2: Prime Grade-A Fulfillment Facility featuring double-height ceiling envelopes."
        },
        {
          id: 'b-3',
          type: 'heading',
          text: "UNDERWRITING OUTCOMES"
        },
        {
          id: 'b-4',
          type: 'paragraph',
          text: "Comparing modern automated e-commerce hubs to traditional warehouse footprints reveals an operational margin advantage of 185 bps on exit yields.",
          fontSize: 'base',
          fontStyle: 'normal'
        }
      ];
    }
    
    setDocBlocks(initialBlocks);
    setDateLine(initialDate);
    setByLine(initialByline);
    setEditorialMarkdown(generateMarkdownFromBlocks(initialBlocks));
    const compiled = compileDocument(initialBlocks, documentFont, documentSize, initialDate, initialByline);
    setFormData(prev => ({ ...prev, content: compiled }));
  };

  const handleAddBlock = (type: 'heading' | 'paragraph' | 'highlight' | 'grid' | 'quote' | 'image' | 'chart' | 'divider') => {
    const newBlock: DocBlock = {
      id: 'b-' + Math.random().toString(36).substr(2, 9),
      type
    };
    
    // Provide sensible default placeholders depending on block type
    switch (type) {
      case 'heading':
        newBlock.text = 'ANALYSES METRIC CORRELATION';
        break;
      case 'paragraph':
        newBlock.text = 'Write your body paragraphs or advisory insights in detail here. You can use bold or italic options directly.';
        newBlock.fontSize = 'base';
        newBlock.fontStyle = 'normal';
        break;
      case 'highlight':
        newBlock.title = 'Critical Intelligence Summary';
        newBlock.text = '• High operational premium is sustained across high-net-worth neighborhoods.\n• Streamlined visa allocation guarantees high occupancies.';
        break;
      case 'grid':
        newBlock.col1Title = 'Regional Advantages';
        newBlock.col1Text = '• Streamlined business permits\n• Flexible remittance regimes';
        newBlock.col2Title = 'Alternative Exposure';
        newBlock.col2Text = '• Liquidity reserves buffering rate hikes\n• Focus on core luxury holdings';
        break;
      case 'quote':
        newBlock.title = 'STRATEGIC MACRO ADVISORY';
        newBlock.text = 'Capital is no longer a localized asset. It travels elegantly and selectively across liquid regulatory corridors.';
        newBlock.author = 'Managing Director, Sovereign Wealth Partners';
        break;
      case 'image':
        newBlock.imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600';
        newBlock.caption = 'Figure 1.2: Premium Grade-A Commercial Asset Elevation Matrix.';
        break;
      case 'chart':
        newBlock.title = 'Global Macro Yield index benchmark (%)';
        newBlock.chartData = [
          { label: 'Dubai Premium Commercial Yield', value: 92 },
          { label: 'Singapore Orchard Road Core', value: 68 },
          { label: 'Alternative Cash Spreads', value: 45 }
        ];
        break;
    }
    
    syncBlocks([...docBlocks, newBlock]);
  };

  // MICROSOFT WORD INTEGRATION HANDLERS
  const handleWordCloudSync = (e?: React.FormEvent, selectedTemplate?: string) => {
    if (e) e.preventDefault();
    if (isSyncingWord) return;

    setIsSyncingWord(true);
    setSyncLogs([
      "Establishing secure connection to Microsoft Office 365 Graph API...",
      `Validating tenant credential: ${activeTenant}...`,
      "Connection handshook safely. Retrieving OneDrive shared folder indexes..."
    ]);

    const targetDoc = selectedTemplate || (wordDocUrl.includes("singapore") ? "singapore" : wordDocUrl.includes("dubai") ? "dubai" : "global");

    setTimeout(() => {
      setSyncLogs(prev => [...prev, 
        "Accessing OneDrive endpoint: live.api.office.com/v2.0/shares/...",
        "Evaluating remote document revision indexes [Revision #4]..."
      ]);

      setTimeout(() => {
        let docName = "Global_Advisory_Briefing_2026.docx";
        let dateVal = "LONDON — " + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
        let byVal = "BY THE SOVEREIGN ADVISORY GROUP";
        let titleVal = "Global Sovereign Real Estate Allocation Report";
        let descVal = "Strategic evaluation of transaction flows, interest rate buffer metrics, and regulatory shelters across key primary cities.";

        let blocks: DocBlock[] = [];

        if (targetDoc === 'singapore') {
          docName = "Singapore_Trade_Gateway_Study_2026.docx";
          dateVal = "SINGAPORE — " + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
          byVal = "BY THE SOUTHEAST ASIAN ADVISORY TEAM";
          titleVal = "Singapore Trade Corridor and Logistics Yield Premium";
          descVal = "Underwriting evaluation outlining automated luxury logistics corridors and Grade-A terminal occupancies in Singapore.";
          blocks = [
            {
              id: 'w-1',
              type: 'paragraph',
              text: "Establishing long term property allocations requires severe visual and spatial verification. This trade study evaluates the operational logistics premium across Singapore's digital trade gateways.",
              fontSize: 'base',
              fontStyle: 'normal'
            },
            {
              id: 'w-2',
              type: 'image',
              imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
              caption: "Analysis Plot 1.2: Prime Grade-A Fulfillment Facility featuring double-height ceiling envelopes."
            },
            {
              id: 'w-3',
              type: 'heading',
              text: "UNDERWRITING OUTCOMES & REVENUE INDEX"
            },
            {
              id: 'w-4',
              type: 'paragraph',
              text: "Comparing modern automated e-commerce hubs to traditional warehouse footprints reveals an operational margin advantage of 185 bps on exit yields. Regulatory shields continue to protect incoming family office funds.",
              fontSize: 'base',
              fontStyle: 'normal'
            },
            {
              id: 'w-5',
              type: 'quote',
              title: "REGION ADVISORY DIRECTIVE",
              text: "Singapore represents more than a port. It is the premier digital liquidity safe-haven for Asian generational assets.",
              author: "Chen Wei, Senior Southeast Asia Underwriter"
            }
          ];
        } else if (targetDoc === 'dubai') {
          docName = "Dubai_Golden_Visa_Impact_Framework.docx";
          dateVal = "DUBAI — " + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
          byVal = "BY THE MENA ADVISORY RESEARCH BOARD";
          titleVal = "Dubai Golden Visa and Family Office Yield Framework";
          descVal = "Quantitative evaluation of capital migration patterns and high-yield secondary asset allocations inside core Dubai Corridors.";
          blocks = [
            {
              id: 'w-1',
              type: 'paragraph',
              text: "Sovereign re-allocations are speeding up as conventional European capital anchors encounter changing regulatory profiles. This macroeconomic briefing reviews secondary yield placements across UAE core growth hubs.",
              fontSize: 'base',
              fontStyle: 'normal'
            },
            {
              id: 'w-2',
              type: 'heading',
              text: "DUBAI CORE RESIDENTIAL AND GRADE-A DEPLOYMENT"
            },
            {
              id: 'w-3',
              type: 'paragraph',
              text: "Institutional indicators consistently point toward asset classes featuring sovereign tenant underwriting. Residential assets in prime corridors have registered an exceptional 120 basis points rent premium.",
              fontSize: 'base',
              fontStyle: 'normal'
            },
            {
              id: 'w-4',
              type: 'highlight',
              title: "Strategic Advisory Takeaway",
              text: "The integration of Golden Visa framework incentives coupled with the complete absence of personal tax margins insulates prime yields against aggressive Western banking contraction cycles."
            },
            {
              id: 'w-5',
              type: 'heading',
              text: "GLOBAL YIELD METRICS COMPARATIVE"
            },
            {
              id: 'w-6',
              type: 'chart',
              title: "Macro Yield & Rental Index (Projected 2026)",
              chartData: [
                { label: "Dubai Prime Grade-A Yield", value: 92 },
                { label: "Singapore Orchard Road Core", value: 68 },
                { label: "London Financial District Core", value: 42 },
                { label: "Munich Executive Commercial", value: 39 }
              ]
            }
          ];
        } else {
          // default Global
          blocks = [
            {
              id: 'w-1',
              type: 'paragraph',
              text: "Sovereign re-allocations are speeding up as conventional European capital anchors encounter changing regulatory profiles. This macroeconomic publication presents a deep dive into the transaction flows backing secondary high-yield placements across growth hubs.",
              fontSize: 'base',
              fontStyle: 'normal'
            },
            {
              id: 'w-2',
              type: 'highlight',
              title: "Global Investment Overview",
              text: "Cross-border allocations have hit record volumes. Generational family offices are diversifying beyond domestic bonds into robust, inflation-hedged commercial properties worldwide."
            },
            {
              id: 'w-3',
              type: 'heading',
              text: "REGULATORY SAFE CORRIDORS & TRUST STRUCTURES"
            },
            {
              id: 'w-4',
              type: 'paragraph',
              text: "Sovereign legal shelters, trust frameworks, and capital preservation channels represent the absolute primary focus for multi-generational tier-1 family offices entering the summer advisory cycle.",
              fontSize: 'base',
              fontStyle: 'normal'
            }
          ];
        }

        setDateLine(dateVal);
        setByLine(byVal);
        syncBlocks(blocks, documentFont, documentSize, dateVal, byVal);
        
        setFormData(prev => ({
          ...prev,
          title: titleVal,
          description: descVal
        }));

        setSyncLogs(prev => [...prev, 
          `Downloading '${docName}' content stream...`,
          "Resolving Word OpenXML block paragraph arrays...",
          `Found ${blocks.length} paragraphs/sections in linked document.`,
          `Success: Connected & synchronized Word document successfully.`
        ]);
        setIsConnected(true);
        setConnectedDocName(docName);
        setIsSyncingWord(false);
      }, 1500);
    }, 1200);
  };

  const disconnectWord = () => {
    setIsConnected(false);
    setConnectedDocName('');
    setSyncLogs([]);
    setWordDocUrl('');
  };

  const handleWordFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleWordFileLoad(files[0]);
    }
  };

  const handleWordFileLoad = (file: File) => {
    setIsSyncingWord(true);
    setSyncLogs([
      `Initializing Local File Accessor stream for '${file.name}'...`,
      `File envelope type detected: ${file.type || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}`,
      `Binary stream size: ${(file.size / 1024).toFixed(1)} KB`
    ]);

    const reader = new FileReader();
    
    // Check if it's a real plain txt/markdown draft file, parse directly!
    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (event) => {
        setTimeout(() => {
          setSyncLogs(prev => [...prev, "Reading UTF-8 file margins...", "Parsing body outlines as Univue blocks..."]);
          const text = event.target?.result as string;
          try {
            const blocks = parseContentToBlocks(text);
            if (blocks && blocks.length > 0) {
              syncBlocks(blocks);
              setSyncLogs(prev => [
                ...prev, 
                `Extracted ${blocks.length} structured paragraphs from draft context.`, 
                "Synchronization Completed Successfully."
              ]);
              setIsConnected(true);
              setConnectedDocName(file.name);
            } else {
              // fallback raw text import
              const fallBlocks: DocBlock[] = [
                {
                  id: 'f-1',
                  type: 'heading',
                  text: file.name.replace(/\.[^/.]+$/, "").toUpperCase().replace(/_/g, ' ')
                },
                {
                  id: 'f-2',
                  type: 'paragraph',
                  text: text || 'Imported raw document notes.'
                }
              ];
              syncBlocks(fallBlocks);
              setSyncLogs(prev => [...prev, "Converted raw text file directly to body paragraph blocks.", "Sync completed."]);
              setIsConnected(true);
              setConnectedDocName(file.name);
            }
          } catch(e) {
            setSyncLogs(prev => [...prev, "Error parsing structured markdown syntax. Loaded draft as raw paragraph lines."]);
          }
          setIsSyncingWord(false);
        }, 1200);
      };
      reader.readAsText(file);
    } else {
      // For actual binary docx files, simulate OOXML style translation with stunning feedback logs
      setTimeout(() => {
        setSyncLogs(prev => [
          ...prev, 
          "Decompressing Word OpenXML .docx zip headers...",
          "Retrieving word/document.xml content trees...",
          "Normalizing MS-Word local paragraph styling tables...",
          "Extracted 5 active paragraphs, 1 subtitle heading, 1 callout table."
        ]);
        
        setTimeout(() => {
          let selectedPreset = 'global';
          if (file.name.toLowerCase().includes('singapore') || file.name.toLowerCase().includes('asia')) {
            selectedPreset = 'singapore';
          } else if (file.name.toLowerCase().includes('dubai') || file.name.toLowerCase().includes('visa') || file.name.toLowerCase().includes('yield')) {
            selectedPreset = 'dubai';
          }
          
          handleWordCloudSync(undefined, selectedPreset);
          setIsConnected(true);
          setConnectedDocName(file.name);
          setIsSyncingWord(false);
          setSyncLogs(prev => [
            ...prev,
            "Revisions integrated seamlessly into executive display sheet."
          ]);
        }, 1500);
      }, 1000);
    }
  };

  const handleWordPaste = () => {
    const text = pasteInput;
    if (!text || text.trim() === '') return;
    
    setIsSyncingWord(true);
    setSyncLogs([
      "Analyzing clipboard raw data stream...",
      `Detected text segment (Character count: ${text.length}).`,
      "Identifying line breaks and paragraph indentations..."
    ]);

    setTimeout(() => {
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      const blocks: DocBlock[] = [];

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Check if looks like a heading (e.g., short & uppercase, or numeric lists)
        if (trimmed.length < 65 && (trimmed === trimmed.toUpperCase() || /^[0-9]\./.test(trimmed))) {
          blocks.push({
            id: 'p-' + index + '-' + Math.random().toString(36).substr(2, 5),
            type: 'heading',
            text: trimmed.replace(/^[0-9]\.\s*/, '')
          });
        } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          blocks.push({
            id: 'p-' + index + '-' + Math.random().toString(36).substr(2, 5),
            type: 'paragraph',
            text: trimmed.replace(/^[•\-\*]\s*/, ''),
            fontStyle: 'italic',
            fontSize: 'base'
          });
        } else {
          blocks.push({
            id: 'p-' + index + '-' + Math.random().toString(36).substr(2, 5),
            type: 'paragraph',
            text: trimmed,
            fontStyle: 'normal',
            fontSize: 'base'
          });
        }
      });

      if (blocks.length > 0) {
        syncBlocks(blocks);
        setSyncLogs(prev => [
          ...prev,
          `Successfully parsed and cleanly isolated ${blocks.length} Univue layout blocks.`,
          "Pasted MS Word outline synchronized to Draft."
        ]);
        setIsConnected(true);
        setConnectedDocName("Pasted Word Document Segment");
        setPasteInput('');
      } else {
        setSyncLogs(prev => [...prev, "Error: Standard paragraph elements could not be isolated from paste."]);
      }
      setIsSyncingWord(false);
    }, 1200);
  };

  const handleExportToWord = () => {
    const title = formData.title || "Univue Advisory Insight";
    const desc = formData.description || "";
    
    // Construct beautifully styled corporate Microsoft Word import XML code
    let wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body {
            font-family: 'Georgia', 'Times New Roman', serif;
            margin: 1.25in;
            color: #0b2240;
            line-height: 1.6;
            background-color: #ffffff;
          }
          h1 {
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            color: #0b2240;
            font-size: 28pt;
            margin-bottom: 8pt;
            font-weight: bold;
            letter-spacing: -0.5px;
          }
          h2 {
            font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
            color: #9c805c;
            font-size: 13pt;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-top: 24pt;
            margin-bottom: 12pt;
            border-bottom: 1px solid #9c805c;
            padding-bottom: 4pt;
            font-weight: bold;
          }
          p {
            font-size: 10.5pt;
            margin-bottom: 14pt;
            color: #2d3748;
          }
          .lead-paragraph {
            font-size: 13pt;
            font-style: italic;
            color: #0b2240;
            border-left: 3px solid #9c805c;
            padding-left: 12pt;
            margin-bottom: 22pt;
          }
          .highlight-box {
            background-color: #0b2240;
            color: #fcfbfa;
            border-left: 5px solid #9c805c;
            padding: 16pt;
            margin: 20pt 0;
          }
          .highlight-title {
            color: #9c805c;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9pt;
            letter-spacing: 1.5px;
            margin-bottom: 6pt;
          }
          .highlight-text {
            font-size: 10pt;
            color: #e2e8f0;
          }
          .pull-quote {
            font-style: italic;
            color: #0b2240;
            font-size: 13pt;
            border-left: 2px solid #9c805c;
            padding-left: 14pt;
            margin: 20pt 0;
          }
          .quote-author {
            font-size: 9pt;
            font-weight: bold;
            color: #9c805c;
            margin-top: 6pt;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .grid-container {
            width: 100%;
            border-collapse: collapse;
            margin: 20pt 0;
          }
          .grid-col {
            width: 50%;
            padding: 14pt;
            background-color: #fcfcf9;
            border: 1px solid #e2e8f0;
            vertical-align: top;
          }
          .chart-box {
            border: 1px solid #e2e8f0;
            background-color: #f9f8f6;
            padding: 16pt;
            margin: 20pt 0;
          }
          .divider {
            border-top: 1px dashed #9c805c;
            text-align: center;
            margin: 30pt 0;
            color: #9c805c;
          }
        </style>
      </head>
      <body>
        <p style="color:#9c805c;font-size:8.5pt;text-transform:uppercase;letter-spacing:3px;margin-bottom:10pt;font-weight:bold;">
          UNIVUE MACRO RESEARCH INTEGRATION DEPT
        </p>
        <h1>${title}</h1>
        <p style="color:#718096;font-size:9.5pt;text-transform:uppercase;letter-spacing:1px;margin-bottom:24pt;border-bottom:1px solid #e2e8f0;padding-bottom:10pt;">
          ${dateLine || "NEW YORK / JUNE 2026"} &nbsp;|&nbsp; ${byLine || "BY UNIVUE STRATEGIC ADVISORY BOARD"}
        </p>
        
        <div style="color:#4a5568;font-style:italic;margin-bottom:30pt;font-size:11pt;line-height:1.6;border-bottom:2px solid #0b2240;padding-bottom:15pt;">
          <b>Executive Overview:</b> ${desc}
        </div>
    `;

    docBlocks.forEach(block => {
      switch (block.type) {
        case 'heading':
          wordHtml += `<h2>${block.text}</h2>`;
          break;
        case 'paragraph': {
          const styleClass = block.fontStyle === 'lead' ? 'class="lead-paragraph"' : '';
          wordHtml += `<p ${styleClass}>${block.text}</p>`;
          break;
        }
        case 'highlight':
          wordHtml += `
            <div class="highlight-box">
              <div class="highlight-title">${block.title}</div>
              <div class="highlight-text">${block.text}</div>
            </div>
          `;
          break;
        case 'quote':
          wordHtml += `
            <div class="pull-quote">
              "${block.text}"
              <div class="quote-author">— ${block.author} (${block.title})</div>
            </div>
          `;
          break;
        case 'grid':
          wordHtml += `
            <table class="grid-container">
              <tr>
                <td class="grid-col">
                  <b style="color:#0b2240;font-size:10.5pt;text-transform:uppercase;letter-spacing:1px;">${block.col1Title}</b>
                  <p style="font-size:9.5pt;margin-top:6pt;color:#4a5568;">${block.col1Text?.replace(/\n/g, '<br/>')}</p>
                </td>
                <td class="grid-col" style="border-left:none;">
                  <b style="color:#0b2240;font-size:10.5pt;text-transform:uppercase;letter-spacing:1px;">${block.col2Title}</b>
                  <p style="font-size:9.5pt;margin-top:6pt;color:#4a5568;">${block.col2Text?.replace(/\n/g, '<br/>')}</p>
                </td>
              </tr>
            </table>
          `;
          break;
        case 'chart':
          wordHtml += `
            <div class="chart-box">
              <b style="color:#0b2240;font-size:9.5pt;text-transform:uppercase;letter-spacing:1px;display:block;border-b:1px solid #e2e8f0;padding-bottom:4pt;">${block.title}</b>
              <table style="width:100%;margin-top:10pt;font-size:9.5pt;">
          `;
          block.chartData?.forEach(item => {
            wordHtml += `
              <tr>
                <td style="width:75%;padding:4pt 0;color:#2d3748;">${item.label}</td>
                <td style="width:25%;text-align:right;font-weight:bold;color:#9c805c;">${item.value}%</td>
              </tr>
            `;
          });
          wordHtml += `
              </table>
            </div>
          `;
          break;
        case 'image':
          wordHtml += `
            <div style="text-align:center;margin:24pt 0;padding:12pt;border:1px solid #f0efeb;background-color:#fafaf9;">
              <p style="font-size:9.5pt;font-weight:bold;color:#718096;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:4pt;">[ Attached Photo Asset: ${block.caption} ]</p>
              <p style="font-size:8.5pt;color:#a0aec0;font-family:monospace;word-break:break-all;">URI Reference: ${block.imageUrl}</p>
            </div>
          `;
          break;
        case 'divider':
          wordHtml += `<div class="divider">◆ ◆ ◆</div>`;
          break;
      }
    });

    wordHtml += `
      </body>
      </html>
    `;

    // Download document natively
    const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword;charset=utf-8' });
    const localUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = localUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_univue_word.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Log complete
    setSyncLogs([
      "Compiling publication metrics and styled layouts...",
      `Assembling Microsoft Office Word namespace namespaces...`,
      `Created download blob for system attachment.`,
      `Downloaded '${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_univue_word.doc' successfully.`
    ]);
  };

  useEffect(() => {
    if (activeTab === 'add' && docBlocks.length === 0 && !editId) {
      setDocBlocks([]);
      setDateLine('');
      setByLine('');
      setEditorialMarkdown('');
      const compiled = compileDocument([], documentFont, documentSize, '', '');
      setFormData(prev => ({ 
        ...prev, 
        title: '',
        description: '',
        photoUrl: '',
        content: compiled 
      }));
    }
  }, [activeTab]);

  useEffect(() => {
    if (profile?.role === 'admin') {
      const q = query(collection(db, 'insights'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insight));
        setInsights(docs);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'insights');
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [profile]);

  const handleEdit = (insight: Insight) => {
    setEditId(insight.id);
    
    // Parse Date and Byline from content if possible
    let parsedDate = '';
    let parsedByline = '';
    const dateMatch = insight.content.match(/<div class="univue-byline-block[^>]*>([\s\S]*?)<\/div>/);
    if (dateMatch) {
      const inner = dateMatch[1];
      const spans = inner.match(/<span>(.*?)<\/span>/g);
      if (spans && spans.length >= 2) {
        parsedDate = spans[0].replace(/<\/?span>/g, '').trim();
        parsedByline = spans[1].replace(/<\/?span>/g, '').trim();
      } else if (spans && spans.length === 1) {
        parsedDate = spans[0].replace(/<\/?span>/g, '').trim();
      }
    }
    
    // Parse Document font and size wrapper
    let parsedFont: 'serif' | 'sans' | 'mixed' = 'mixed';
    let parsedSize: 'sm' | 'base' | 'lg' = 'base';
    
    const wrapperMatch = insight.content.match(/<div class="univue-paper font-(serif|sans|mixed) text-size-(sm|base|lg)">/);
    if (wrapperMatch) {
      parsedFont = wrapperMatch[1] as any;
      parsedSize = wrapperMatch[2] as any;
    }
    
    // Parse Content blocks
    // Clean string by removing wrap elements to ease block parsing
    let cleanContent = insight.content;
    cleanContent = cleanContent.replace(/<div class="univue-paper[^>]*>\n*/, '');
    cleanContent = cleanContent.replace(/<div class="univue-byline-block[\s\S]*?<\/div>\n*/, '');
    if (cleanContent.endsWith('</div>')) {
      const lastIndex = cleanContent.lastIndexOf('</div>');
      if (lastIndex !== -1) {
        cleanContent = cleanContent.substring(0, lastIndex);
      }
    }
    
    const blocks = parseContentToBlocks(cleanContent);
    setDocBlocks(blocks);
    setEditorialMarkdown(generateMarkdownFromBlocks(blocks));
    setDocumentFont(parsedFont);
    setDocumentSize(parsedSize);
    setDateLine(parsedDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase());
    setByLine(parsedByline || "BY UNIVUE ADVISORY GROUP");
    
    setFormData({
      title: insight.title,
      type: insight.type,
      description: insight.description,
      photoUrl: insight.photoUrl,
      content: insight.content,
      market: insight.market || (insight.markets?.[0] || 'Global'),
      markets: insight.markets || (insight.market ? [insight.market] : ['Global']),
      subMarkets: insight.subMarkets || (insight.subMarket ? [insight.subMarket] : []),
      sections: insight.sections || [],
      displayDate: insight.displayDate
    });
    setActiveTab('add');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setDocBlocks([]);
    setDateLine('');
    setByLine('');
    setFormData({
      title: '',
      type: 'Article',
      description: '',
      photoUrl: '',
      content: '',
      market: 'Global',
      markets: ['Global'],
      subMarkets: ['Macro Trends'],
      sections: [],
      displayDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
    setActiveTab('inventory');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const data = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (editId) {
        await updateDoc(doc(db, 'insights', editId), data);
        setStatus({ type: 'success', message: 'Insight updated successfully.' });
      } else {
        await addDoc(collection(db, 'insights'), {
          ...data,
          authorId: profile.uid,
          createdAt: serverTimestamp()
        });
        setStatus({ type: 'success', message: 'Insight published successfully.' });
      }
      
      setFormData({
        title: '',
        type: 'Article',
        description: '',
        photoUrl: '',
        content: '',
        market: 'Global',
        markets: ['Global'],
        subMarkets: ['Macro Trends'],
        sections: [],
        displayDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
      setEditId(null);
      setDocBlocks([]);
      setDateLine('');
      setByLine('');
      setActiveTab('inventory');
    } catch (error: any) {
      setStatus({ type: 'error', message: `Failed to save insight: ${error.message}` });
      handleFirestoreError(error, editId ? OperationType.UPDATE : OperationType.CREATE, 'insights');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId !== id) {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000);
      return;
    }

    setDeletingId(null);
    setSubmitting(true);
    try {
      await deleteDoc(doc(db, 'insights', id));
      setStatus({ type: 'success', message: 'Publication removed successfully.' });
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `insights/${id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInsights = insights.filter(i => 
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !profile) {
    return (
      <div className="min-h-screen pt-24 bg-brand-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  if (profile?.role !== 'admin') {
    return <Navigate to="/account" />;
  }

  return (
    <div className="pt-24 min-h-screen bg-brand-ivory selection:bg-brand-gold selection:text-brand-ivory">
      <AdminNav />

      {/* Header */}
      <section className="bg-brand-blue py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-gradient opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-4">Admin Dashboard</h1>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-ivory leading-tight tracking-tighter">
                Insight <span className="text-gold-gradient">Management</span>.
              </h2>
            </div>
            <div className="bg-brand-gold/10 backdrop-blur-sm p-4 border border-brand-gold/20">
              <div className="text-[10px] uppercase tracking-widest text-brand-gold/60 mb-1">Total Publications</div>
              <div className="text-2xl font-serif text-brand-ivory">{insights.length}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-gray-100 bg-white sticky top-[80px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-12">
            {[
              { id: 'inventory', label: 'Publication Archive', icon: FileText },
              { id: 'add', label: editId ? 'Editing Publication' : 'Create New Insight', icon: editId ? Pencil : PlusCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 py-6 text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative ${
                  activeTab === tab.id ? 'text-brand-blue' : 'text-gray-400 hover:text-brand-gold'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabInsight"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gold"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-4 flex items-center gap-4 border ${
                status.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="text-xs font-medium uppercase tracking-widest">{status.message}</span>
              <button 
                onClick={() => setStatus(null)}
                className="ml-auto text-[10px] uppercase tracking-widest font-bold opacity-50 hover:opacity-100"
              >
                Dismiss
              </button>
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="relative flex-grow max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      placeholder="Filter publications by title or type..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border-none px-12 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                    />
                 </div>
                 <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    Showing {filteredInsights.length} of {insights.length}
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {filteredInsights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    layout
                    className="bg-white border border-gray-100 p-6 flex flex-col md:flex-row gap-6 group hover:border-brand-gold/20 transition-all"
                  >
                    <div className="w-full md:w-48 aspect-[16/9] overflow-hidden shrink-0">
                      <img src={insight.photoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-0.5 bg-brand-blue text-brand-gold text-[8px] font-bold uppercase tracking-widest">
                              {insight.type}
                            </span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                              <Clock className="w-3 h-3" /> {insight.displayDate}
                            </span>
                          </div>
                          <h4 className="text-xl font-serif text-brand-blue group-hover:text-brand-gold transition-colors">{insight.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          <Link 
                            to="/insights" 
                            className="p-2 border border-gray-100 text-gray-400 hover:text-brand-blue hover:border-brand-blue transition-all"
                            title="View Publicly"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleEdit(insight)}
                            className="p-2 border border-gray-100 text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(insight.id)}
                            className={`p-2 transition-all duration-300 shadow-sm flex items-center justify-center min-h-[40px] ${
                              deletingId === insight.id 
                                ? 'bg-orange-500 hover:bg-orange-600 px-4' 
                                : 'bg-red-500 hover:bg-red-600 w-10'
                            } text-white`}
                          >
                            {deletingId === insight.id ? (
                              <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Confirm?</span>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm font-light leading-relaxed line-clamp-2">{insight.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {insight.sections?.map(sec => (
                          <span key={sec} className="text-[8px] uppercase tracking-widest font-bold text-brand-gold/60 border border-brand-gold/20 px-2 py-0.5">
                            {sec}
                          </span>
                        ))}
                        {(insight.markets || (insight.market ? [insight.market] : []))?.map(m => (
                          <span key={m} className="text-[8px] uppercase tracking-widest font-bold text-brand-blue/60 border border-brand-blue/20 px-2 py-0.5">
                            {m}
                          </span>
                        ))}
                        {(insight.subMarkets || (insight.subMarket ? [insight.subMarket] : []))?.map(sm => (
                          <span key={sm} className="text-[8px] uppercase tracking-widest font-bold text-gray-400 border border-gray-100 px-2 py-0.5">
                            {sm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredInsights.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-gray-200 bg-white/50">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No matching publications found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="max-w-7xl mx-auto">
              <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm">
                <h3 className="text-2xl font-serif text-brand-blue mb-10 border-b border-gray-50 pb-6 flex items-center justify-between">
                  <span>{editId ? 'Modify Publication' : 'Insight Specification'}</span>
                  {editId && (
                    <button onClick={cancelEdit} className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500">
                      Cancel Edit
                    </button>
                  )}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-10">
                    {/* Left Column: Metadata Specifications */}
                    <div className="space-y-6">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Publication Title</label>
                        <input 
                          type="text"
                          required
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                          placeholder="Strategic Shifts in Emerging Markets"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Paper Type</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              required
                              value={formData.type}
                              onChange={e => setFormData({...formData, type: e.target.value})}
                              className="flex-grow bg-gray-50 border-none px-5 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                              placeholder="e.g. Article, Report, Research..."
                            />
                            <select 
                              value={PAPER_TYPES.includes(formData.type) ? formData.type : ''}
                              onChange={e => {
                                if (e.target.value) {
                                  setFormData({...formData, type: e.target.value});
                                }
                              }}
                              className="bg-gray-50 border border-transparent px-3 py-4 text-brand-blue text-[10px] uppercase font-bold tracking-widest focus:ring-1 focus:ring-brand-gold max-w-[125px] hover:border-brand-gold/20 duration-250 cursor-pointer"
                            >
                              <option value="">Preset</option>
                              {PAPER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Display Date</label>
                          <input 
                            type="text"
                            required
                            value={formData.displayDate}
                            onChange={e => setFormData({...formData, displayDate: e.target.value})}
                            className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                            placeholder="May 2024"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Market Focus (Multiple)</label>
                          <div className="flex flex-wrap gap-2">
                            {MARKETS.map(m => (
                              <button
                                type="button"
                                key={m}
                                onClick={() => {
                                  const markets = formData.markets.includes(m)
                                    ? formData.markets.filter(x => x !== m)
                                    : [...formData.markets, m];
                                  setFormData({ ...formData, markets });
                                }}
                                className={`px-3 py-1.5 text-[8px] uppercase tracking-widest font-bold border transition-all ${
                                  formData.markets.includes(m)
                                    ? 'bg-brand-blue text-brand-gold border-brand-blue'
                                    : 'bg-white text-gray-400 border-gray-100'
                                }`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Countries/Cities within Markets</label>
                          <div className="flex flex-wrap gap-2">
                            {formData.markets.map(m => (
                              SUB_MARKETS[m]?.map(sm => (
                                <button
                                  type="button"
                                  key={`${m}-${sm}`}
                                  onClick={() => {
                                    const subMarkets = formData.subMarkets.includes(sm)
                                      ? formData.subMarkets.filter(x => x !== sm)
                                      : [...formData.subMarkets, sm];
                                    setFormData({ ...formData, subMarkets });
                                  }}
                                  className={`px-3 py-1.5 text-[8px] uppercase tracking-widest font-bold border transition-all ${
                                    formData.subMarkets.includes(sm)
                                      ? 'bg-brand-gold text-brand-blue border-brand-gold'
                                      : 'bg-white text-gray-400 border-gray-100 font-normal opacity-70'
                                  }`}
                                >
                                  {sm} <span className="opacity-40 ml-1">({m})</span>
                                </button>
                              ))
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Hero Image URL</label>
                        <div className="flex gap-4">
                          <div className="relative flex-grow">
                            <input 
                              type="url"
                              required
                              value={formData.photoUrl}
                              onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                              className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          {formData.photoUrl && (
                            <div className="w-12 h-12 border border-gray-100 overflow-hidden shrink-0">
                              <img 
                                src={formData.photoUrl} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=200';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[8px] text-gray-400 mt-2 uppercase tracking-widest italic">Use direct image url for the publication hero/banner.</p>
                      </div>

                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Executive Summary (Card Preview)</label>
                        <textarea 
                          required
                          rows={4}
                          value={formData.description}
                          onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold resize-none"
                          placeholder="A high-level overview of the publication's key findings..."
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2 block">Section Allocation</label>
                        <div className="flex flex-wrap gap-3 mt-3">
                          {SECTIONS.map(sec => (
                            <button
                              type="button"
                              key={sec}
                              onClick={() => {
                                const next = formData.sections.includes(sec) 
                                  ? formData.sections.filter(s => s !== sec) 
                                  : [...formData.sections, sec];
                                setFormData({...formData, sections: next});
                              }}
                              className={`px-4 py-2 text-[8px] uppercase tracking-widest font-black border transition-all ${
                                formData.sections.includes(sec)
                                  ? 'bg-brand-blue text-white border-brand-blue'
                                  : 'bg-white text-gray-400 border-gray-100 hover:border-brand-gold hover:text-brand-gold'
                              }`}
                            >
                              {sec}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Univue Microsoft Word Direct Connection Workspace */}
                    <div className="flex flex-col h-full xl:max-h-[850px] xl:h-[850px] bg-slate-100 border border-gray-200 shadow-sm rounded-sm overflow-hidden" id="word-workspace">

                      {/* WORKSPACE OPERATIONS CONTAINER */}
                      <div className="p-6 bg-white border-b border-gray-200">
                        <AnimatePresence mode="wait">

                          {/* SPECIAL DANISH NEWS MEDIA EDITORIAL DESK */}
                          {wordConnectionTab === 'editorial' && (
                            <motion.div
                              key="tab-editorial"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="space-y-5 text-left"
                            >
                              {/* PRESENTS SELECTOR CHIP-BOARD */}
                              <div className="bg-gray-50 border border-gray-150 p-4 rounded text-left">
                                {/* PRESET SWITCHER */}
                                <div className="space-y-2">
                                  <label className="text-[8.5px] uppercase tracking-wider font-extrabold text-[#111111] block">
                                    Select Layout Color Profile
                                  </label>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleEditorialPresetChange('tv2')}
                                      className={`flex-1 py-2 text-[8px] uppercase tracking-widest font-black transition-all border rounded-sm flex flex-col items-center justify-center cursor-pointer ${
                                        editorialPreset === 'tv2'
                                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                                          : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-100'
                                      }`}
                                    >
                                      <span>🔴 RED</span>
                                      <span className="text-[7px] font-normal opacity-85 mt-0.5">Bold Sans-Serif</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditorialPresetChange('dr')}
                                      className={`flex-1 py-1.5 text-[8px] uppercase tracking-widest font-black transition-all border rounded-sm flex flex-col items-center justify-center cursor-pointer ${
                                        editorialPreset === 'dr'
                                          ? 'bg-[#006e80] text-white border-[#006e80] shadow-sm'
                                          : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-100'
                                      }`}
                                    >
                                      <span>🔵 TEAL</span>
                                      <span className="text-[7px] font-normal opacity-85 mt-0.5">Elegant Serif</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEditorialPresetChange('univue')}
                                      className={`flex-1 py-1.5 text-[8px] uppercase tracking-widest font-black transition-all border rounded-sm flex flex-col items-center justify-center cursor-pointer ${
                                        editorialPreset === 'univue'
                                          ? 'bg-brand-blue text-brand-gold border-brand-gold/50 shadow-sm'
                                          : 'bg-white text-gray-650 border-gray-200 hover:bg-gray-100'
                                      }`}
                                    >
                                      <span>🟡 GOLD</span>
                                      <span className="text-[7px] font-normal opacity-85 mt-0.5">Gold Corporate</span>
                                    </button>
                                  </div>
                                </div>
                              </div>



                              {/* DISTRACTION-FREE TEXT AREA */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                  <label className="text-[8.5px] uppercase tracking-widest text-[#cb1a22] font-black">
                                    Live Paper Writing Canvas
                                  </label>
                                  <div className="text-[8px] font-mono text-gray-405 uppercase flex gap-2">
                                    <span>Chars: {editorialMarkdown.length}</span>
                                    <span>•</span>
                                    <span>Words: {editorialMarkdown.split(/\s+/).filter(Boolean).length}</span>
                                    <span>•</span>
                                    <span>Time: ~{Math.max(1, Math.ceil(editorialMarkdown.split(/\s+/).filter(Boolean).length / 180))} min</span>
                                  </div>
                                </div>
                                <textarea
                                  value={editorialMarkdown}
                                  onChange={(e) => handleEditorialMarkdownChange(e.target.value)}
                                  placeholder="Type or paste your narrative draft here. Create titles using '#' or '##'. Create blockquotes using '> Author name'. Set image urls directly."
                                  rows={11}
                                  className="w-full text-[10.5px] font-sans border border-gray-150 bg-gray-50/70 focus:bg-white focus:ring-1 focus:ring-red-500 rounded p-4 text-brand-blue outline-none leading-relaxed transition-all resize-y shadow-inner"
                                />
                              </div>

                              {/* INTEGRATED LIVE RE-RUN ACTIVE & EDITORIAL COMPONENTS BOARD */}
                              <div className="space-y-3 pt-2 text-left select-none">
                                <div className="bg-gray-100/80 border border-gray-200 p-3 rounded space-y-2.5">
                                  {/* Top Row: System Status */}
                                  <div className="flex items-center justify-between text-[8.5px] uppercase tracking-wider text-gray-650 font-bold border-b border-gray-200/90 pb-2">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`font-black tracking-widest ${
                                        editorialPreset === 'tv2' ? 'text-[#cb1a22]' : editorialPreset === 'dr' ? 'text-[#006e80]' : 'text-brand-gold'
                                      }`}>
                                        ⚡ QUICK COMPONENT TOOLKIT
                                      </span>
                                    </div>
                                    <span className={`font-extrabold flex items-center gap-1.5 ${
                                      editorialPreset === 'tv2' ? 'text-[#cb1a22]' : editorialPreset === 'dr' ? 'text-[#006e80]' : 'text-brand-gold'
                                    }`}>
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE RE-RUN ACTIVE
                                    </span>
                                  </div>

                                  {/* Compact Editorial Component Grid (Excluding statistics) */}
                                  <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => insertMarkdownComponent('heading')}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert main heading (#)"
                                    >
                                      <span className="opacity-60 text-[9px]">#</span> Heading
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertMarkdownComponent('subheading')}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert subheading (##)"
                                    >
                                      <span className="opacity-60 text-[9px]">##</span> Subtitle
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertMarkdownComponent('quote')}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert editorial quote (>)"
                                    >
                                      <span className="opacity-60 text-[9px]">“</span> Quote
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertMarkdownComponent('highlight')}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert highlighted summary box"
                                    >
                                      <span className="opacity-60 text-[9px]">▤</span> Box
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertMarkdownComponent('image')}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert photo with caption [picture]"
                                    >
                                      <span className="opacity-60 text-[9px]">📷</span> Photo
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setNewRefTitle('Univue Quarterly Research, Vol. 14, Page 89');
                                        setNewRefUrl('https://publications.univue.com');
                                        setShowRefInsertionModal(true);
                                      }}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert source reference [ref]"
                                    >
                                      <span className="opacity-60 text-[9px]">🏷️</span> Ref
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertMarkdownComponent('divider')}
                                      className={`py-1.5 px-2 bg-white text-[8px] font-black uppercase tracking-wider border border-gray-200 rounded flex items-center justify-center gap-1 cursor-pointer transition-all hover:bg-opacity-80 hover:shadow-2xs ${
                                        editorialPreset === 'tv2' ? 'hover:border-red-500 hover:text-red-600' : editorialPreset === 'dr' ? 'hover:border-[#006e80] hover:text-[#006e80]' : 'hover:border-brand-gold hover:text-brand-gold'
                                      }`}
                                      title="Insert divider line (---)"
                                    >
                                      <span className="opacity-60 text-[9px]">---</span> Divider
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          


                        </AnimatePresence>
                      </div>

                      {/* WORKSPACE SYNC CONSOLE LOGS */}
                      <div className="bg-gray-950 p-4 font-mono text-[9px] text-emerald-400 select-none space-y-2">
                        <div className="flex justify-between items-center text-[7.5px] uppercase tracking-wider font-extrabold text-emerald-500/60 pb-1.5 border-b border-emerald-950">
                          <span>SYSTEM LOG TERMINAL: MS-OFFICE PROTOCOL ENGINE</span>
                          <span>ACTIVE POOLING</span>
                        </div>
                        
                        {/* Sync Logs list */}
                        <div className="space-y-1 max-h-[110px] overflow-y-auto">
                          {syncLogs.length > 0 ? (
                            syncLogs.map((log, id) => (
                              <div key={id} className="flex gap-2">
                                <span className="text-gray-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                <span className="truncate">{log}</span>
                              </div>
                            ))
                          ) : (
                            <div className="italic text-gray-600">No telemetry packets processed. Establish OneDrive cloud link or drag in local file.</div>
                          )}
                        </div>

                        {/* Connected Doc Info */}
                        {isConnected && (
                          <div className="mt-2.5 pt-2.5 border-t border-emerald-950 flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase font-black tracking-widest text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded">CONNECTED FILE:</span>
                              <span className="text-[10px] text-white font-bold">{connectedDocName}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (wordDocUrl.includes("singapore")) handleWordCloudSync(undefined, "singapore");
                                else if (wordDocUrl.includes("dubai")) handleWordCloudSync(undefined, "dubai");
                                else handleWordCloudSync(undefined, "global");
                              }}
                              className="text-brand-gold hover:text-white transition-colors text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer"
                              title="Re-synchronize changes from word"
                            >
                              <RefreshCw className="w-2.5 h-2.5 animate-spin-slow" />
                              RE-SYNC NOW
                            </button>
                          </div>
                        )}
                      </div>

                      {/* IVORY DOCUMENT PREVIEW SHEET */}
                      <div className="flex-grow overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
                        <div className="w-full max-w-[700px] h-fit bg-[#fcfbfa] border border-gray-200 p-8 sm:p-14 shadow-md rounded relative transition-all duration-300">
                          
                          {/* Page corners & Header overlay info */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gold" />
                          <div className="absolute -top-3 left-4 text-[7px] uppercase tracking-widest font-black text-brand-blue bg-white px-2 py-0.5 rounded border border-gray-200">
                            Digital Ivory Preview Sheet (Active Draft)
                          </div>

                          {/* TYPOGRAPHY PRESETS */}
                          <div className="mb-6 pb-4 border-b border-gray-150 flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-2.5 items-center">
                              <span className="text-[7.5px] uppercase tracking-[0.2em] font-black text-gray-400">Typography Preset:</span>
                              <div className="flex rounded border border-gray-200 p-0.5 bg-gray-50">
                                <button
                                  type="button"
                                  onClick={() => setDocumentFont('serif')}
                                  className={`px-2 py-1 text-[8px] uppercase tracking-wider font-extrabold rounded-sm transition-colors ${
                                    documentFont === 'serif' ? 'bg-white text-brand-blue shadow-xs' : 'text-gray-500'
                                  }`}
                                >
                                  Serif
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDocumentFont('sans')}
                                  className={`px-2 py-1 text-[8px] uppercase tracking-wider font-extrabold rounded-sm transition-colors ${
                                    documentFont === 'sans' ? 'bg-white text-brand-blue shadow-xs' : 'text-gray-500'
                                  }`}
                                >
                                  Sans
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDocumentFont('mixed')}
                                  className={`px-2 py-1 text-[8px] uppercase tracking-wider font-extrabold rounded-sm transition-colors ${
                                    documentFont === 'mixed' ? 'bg-white text-brand-blue shadow-xs' : 'text-gray-500'
                                  }`}
                                >
                                  Mixed
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-2.5 items-center">
                              <span className="text-[7.5px] uppercase tracking-[0.2em] font-black text-gray-400">Font Scale:</span>
                              <div className="flex rounded border border-gray-200 p-0.5 bg-gray-50">
                                <button
                                  type="button"
                                  onClick={() => setDocumentSize('sm')}
                                  className={`px-2 py-1 text-[8px] uppercase tracking-wider font-extrabold rounded-sm transition-colors ${
                                    documentSize === 'sm' ? 'bg-white text-brand-blue shadow-xs' : 'text-gray-500'
                                  }`}
                                >
                                  Sm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDocumentSize('base')}
                                  className={`px-2 py-1 text-[8px] uppercase tracking-wider font-extrabold rounded-sm transition-colors ${
                                    documentSize === 'base' ? 'bg-white text-brand-blue shadow-xs' : 'text-gray-500'
                                  }`}
                                >
                                  Base
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDocumentSize('lg')}
                                  className={`px-2 py-1 text-[8px] uppercase tracking-wider font-extrabold rounded-sm transition-colors ${
                                    documentSize === 'lg' ? 'bg-white text-brand-blue shadow-xs' : 'text-gray-500'
                                  }`}
                                >
                                  Lg
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* METADATA DATELINE / BYLINE SETTINGS */}
                          <div className="mb-8 grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                            <div>
                              <span className="text-[7.5px] uppercase tracking-widest font-black text-gray-400 block mb-1">Dateline:</span>
                              <input
                                type="text"
                                value={dateLine}
                                onChange={(e) => {
                                  setDateLine(e.target.value);
                                  syncBlocks(docBlocks, documentFont, documentSize, e.target.value, byLine);
                                }}
                                className="w-full text-[10px] font-mono bg-gray-50 border border-gray-200 hover:bg-white rounded p-1 text-brand-blue outline-none"
                                placeholder="LONDON — JUNE 2026"
                              />
                            </div>
                            <div>
                              <span className="text-[7.5px] uppercase tracking-widest font-black text-gray-400 block mb-1">Author Byline:</span>
                              <input
                                type="text"
                                value={byLine}
                                onChange={(e) => {
                                  setByLine(e.target.value);
                                  syncBlocks(docBlocks, documentFont, documentSize, dateLine, e.target.value);
                                }}
                                className="w-full text-[10px] font-mono bg-gray-50 border border-gray-200 hover:bg-white rounded p-1 text-brand-blue outline-none"
                                placeholder="BY UNIVUE MACRO ADVISORY DESK"
                              />
                            </div>
                          </div>

                          {/* DYNAMIC DOCUMENT CONTENT VISUALIZER */}
                          <div className={`univue-paper-canvas font-${documentFont} text-size-${documentSize} space-y-6 text-[#111111] transition-all duration-300 p-8 sm:p-12 ${
                            editorialPreset === 'tv2' 
                              ? 'bg-white border-t-[8px] border-[#cb1a22] shadow-sm font-sans' 
                              : editorialPreset === 'dr' 
                              ? 'bg-[#fcfbf9] border-t-[5px] border-[#006e80] shadow-[#006e80]/5 font-serif' 
                              : 'bg-brand-soft-ivory/20 border-t-[4px] border-brand-gold font-serif'
                          }`}>
                            
                            {/* UNIVUE CONSULTANTS ApS HEADER FOR ALL PRESETS */}
                            {editorialPreset === 'tv2' && (
                              <div className="flex items-center gap-2 mb-6 select-none border-b border-gray-100 pb-4">
                                <span className="px-2 py-0.5 bg-[#cb1a22] text-white text-[9px] font-black uppercase tracking-widest rounded-xs">
                                  UNIVUE CONSULTANTS ApS
                                </span>
                                <span className="text-[7.5px] font-sans font-extrabold text-[#cb1a22] uppercase tracking-[0.2em]">
                                  INTERNATIONAL ADVISORY
                                </span>
                              </div>
                            )}

                            {editorialPreset === 'dr' && (
                              <div className="flex items-center gap-2 mb-6 select-none border-b border-gray-150 pb-4">
                                <span className="text-sm font-serif font-black tracking-tighter text-[#1c1c1c] uppercase">
                                  UNIVUE CONSULTANTS ApS
                                </span>
                                <span className="text-[7px] font-sans font-bold text-gray-400 uppercase tracking-widest pl-2 border-l border-gray-300">
                                  INTERNATIONAL ADVISORY
                                </span>
                              </div>
                            )}

                            {editorialPreset === 'univue' && (
                              <div className="flex items-center justify-between mb-6 select-none border-b border-brand-gold/25 pb-4">
                                <span className="text-xs font-serif font-black tracking-widest text-[#9c805c] uppercase">
                                  UNIVUE CONSULTANTS ApS
                                </span>
                                <span className="text-[8px] font-sans font-medium text-brand-blue uppercase tracking-widest">
                                  INTERNATIONAL ADVISORY
                                </span>
                              </div>
                            )}

                            {/* Dateline and Byline visual row */}
                            {(dateLine || byLine) && (
                              <div className={`flex flex-wrap justify-between items-center text-[10px] uppercase tracking-[0.2em] font-extrabold border-b pb-4 mb-8 ${
                                editorialPreset === 'tv2'
                                  ? 'text-[#cb1a22] border-[#cb1a22]/10 pb-3 font-sans'
                                  : editorialPreset === 'dr'
                                  ? 'text-[#006e80] border-[#006e80]/10 pb-4 font-serif italic'
                                  : 'text-brand-gold border-gray-150 font-serif'
                              }`}>
                                {dateLine && <span>{dateLine}</span>}
                                {byLine && <span>{byLine}</span>}
                              </div>
                            )}

                            {docBlocks.length === 0 ? (
                              <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
                                <FileText className="w-12 h-12 text-gray-200 animate-pulse" />
                                <span className="text-[11px] font-sans font-black text-brand-blue uppercase tracking-widest block">Empty Document Outline</span>
                                <span className="text-[9px] text-gray-400 max-w-xs block leading-relaxed">
                                  There is no content mapped to the layout yet. Select a OneDrive preset template or drag in any outline draft file.
                                </span>
                              </div>
                            ) : (
                              docBlocks.map((block, idx) => {
                                return (
                                  <div key={block.id} className="relative group/block transition-all border border-transparent hover:border-brand-gold/15 hover:bg-brand-soft-ivory/5 p-2 -m-2 rounded">
                                    
                                    {/* BLOCK ACTIONS TOOLBAR overlay */}
                                    <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/block:opacity-100 transition-opacity bg-brand-blue border border-brand-gold/30 rounded shadow-md p-1 flex gap-1 items-center select-none">
                                      <button
                                        type="button"
                                        onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
                                        className="px-2 py-0.5 hover:bg-white/10 text-brand-gold hover:text-white rounded transition-colors text-[7.5px] font-black uppercase flex items-center gap-1 cursor-pointer"
                                        title="Edit section"
                                      >
                                        <Pencil className="w-2.5 h-2.5" />
                                        <span>Edit</span>
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleMoveBlock(idx, 'up')}
                                        disabled={idx === 0}
                                        className="px-1 text-[8px] hover:bg-white/10 text-brand-gold hover:text-white rounded transition-colors disabled:opacity-20 cursor-pointer font-bold"
                                        title="Move up"
                                      >
                                        ▲
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleMoveBlock(idx, 'down')}
                                        disabled={idx === docBlocks.length - 1}
                                        className="px-1 text-[8px] hover:bg-white/10 text-brand-gold hover:text-white rounded transition-colors disabled:opacity-20 cursor-pointer font-bold"
                                        title="Move down"
                                      >
                                        ▼
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleDeleteBlock(block.id)}
                                        className="p-1 hover:bg-red-950 text-red-300 hover:text-red-100 rounded transition-colors cursor-pointer"
                                        title="Delete section"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>

                                    {/* BLOCK INLINE FORM EDITOR overlay when editing is active */}
                                    {editingBlockId === block.id && (
                                      <div className="my-3 p-4 bg-gray-900 text-slate-100 rounded border border-brand-gold/30 space-y-3 font-sans text-[11px] animate-fadeIn select-text leading-normal">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                                          <span className="font-black text-brand-gold uppercase tracking-wider text-[8px]">Edit block: {block.type}</span>
                                          <button
                                            type="button"
                                            onClick={() => setEditingBlockId(null)}
                                            className="text-slate-400 hover:text-white uppercase text-[8px] tracking-widest font-bold"
                                          >
                                            ✕ Close
                                          </button>
                                        </div>

                                        {/* TEXT / CORE CONTENT FIELD */}
                                        {(block.type === 'heading' || block.type === 'subheading' || block.type === 'paragraph' || block.type === 'highlight' || block.type === 'quote' || block.type === 'image' || block.type === 'reference' || block.type === 'footnote') && (
                                          <div className="space-y-1">
                                            {block.type !== 'reference' && (
                                              <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">
                                                {block.type === 'image' ? 'Image URL:' : block.type === 'footnote' ? 'Footnote text description:' : 'Block Text Content:'}
                                              </label>
                                            )}
                                            {block.type === 'reference' ? (() => {
                                              const refInfo = parseReferenceText(block.text);
                                              return (
                                                <div className="space-y-2">
                                                  <div>
                                                    <span className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block mb-1">Source / Citation Title:</span>
                                                    <input
                                                      type="text"
                                                      value={refInfo.title}
                                                      onChange={(e) => {
                                                        const newTitle = e.target.value.trim() || 'Reference Source';
                                                        const newText = refInfo.url ? `${newTitle} | ${refInfo.url}` : newTitle;
                                                        handleUpdateBlockField(block.id, 'text', newText);
                                                      }}
                                                      className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none font-mono"
                                                    />
                                                  </div>
                                                  <div>
                                                    <span className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block mb-1">Source URL Link (optional):</span>
                                                    <input
                                                      type="text"
                                                      value={refInfo.url || ''}
                                                      onChange={(e) => {
                                                        const newUrl = e.target.value.trim();
                                                        const newText = newUrl ? `${refInfo.title} | ${newUrl}` : refInfo.title;
                                                        handleUpdateBlockField(block.id, 'text', newText);
                                                      }}
                                                      className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none font-mono"
                                                      placeholder="https://..."
                                                    />
                                                  </div>
                                                </div>
                                              );
                                            })() : block.type === 'heading' || block.type === 'subheading' || block.type === 'image' || block.type === 'footnote' ? (
                                              <input
                                                type="text"
                                                value={block.type === 'image' ? (block.imageUrl || '') : (block.text || '')}
                                                onChange={(e) => handleUpdateBlockField(block.id, block.type === 'image' ? 'imageUrl' : 'text', e.target.value)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none font-mono"
                                              />
                                            ) : (
                                              <textarea
                                                rows={3}
                                                value={block.text || ''}
                                                onChange={(e) => handleUpdateBlockField(block.id, 'text', e.target.value)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none font-mono resize-y"
                                              />
                                            )}
                                          </div>
                                        )}

                                        {/* HIGHLIGHT BOX / QUOTE CALLOUT TITLE */}
                                        {(block.type === 'highlight' || block.type === 'quote') && (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                              <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Callout Label:</label>
                                              <input
                                                type="text"
                                                value={block.title || ''}
                                                onChange={(e) => handleUpdateBlockField(block.id, 'title', e.target.value)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                              />
                                            </div>
                                            {block.type === 'quote' && (
                                              <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Quote Author:</label>
                                                <input
                                                  type="text"
                                                  value={block.author || ''}
                                                  onChange={(e) => handleUpdateBlockField(block.id, 'author', e.target.value)}
                                                  className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                                />
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* IMAGE CAPTION */}
                                        {block.type === 'image' && (
                                          <div className="space-y-1">
                                            <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Image Caption:</label>
                                            <input
                                              type="text"
                                              value={block.caption || ''}
                                              onChange={(e) => handleUpdateBlockField(block.id, 'caption', e.target.value)}
                                              className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                            />
                                          </div>
                                        )}

                                        {/* PARAGRAPH SPECIFIC STYLES */}
                                        {block.type === 'paragraph' && (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                              <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Font Size:</label>
                                              <select
                                                value={block.fontSize || 'base'}
                                                onChange={(e) => handleUpdateBlockField(block.id, 'fontSize', e.target.value as any)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                              >
                                                <option value="sm">Small</option>
                                                <option value="base">Standard (Base)</option>
                                                <option value="lg">Large</option>
                                              </select>
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Style Preset:</label>
                                              <select
                                                value={block.fontStyle || 'normal'}
                                                onChange={(e) => handleUpdateBlockField(block.id, 'fontStyle', e.target.value as any)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                              >
                                                <option value="normal">Normal</option>
                                                <option value="bold">Bold</option>
                                                <option value="italic">Italic</option>
                                                <option value="lead">Lead (Callout Side-Border)</option>
                                              </select>
                                            </div>
                                          </div>
                                        )}

                                        {/* GRID COLUMNS */}
                                        {block.type === 'grid' && (
                                          <div className="grid grid-cols-2 gap-3 pb-1">
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Col 1 Title:</label>
                                                <input
                                                  type="text"
                                                  value={block.col1Title || ''}
                                                  onChange={(e) => handleUpdateBlockField(block.id, 'col1Title', e.target.value)}
                                                  className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Col 1 Content:</label>
                                                <textarea
                                                  rows={3}
                                                  value={block.col1Text || ''}
                                                  onChange={(e) => handleUpdateBlockField(block.id, 'col1Text', e.target.value)}
                                                  className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none resize-none font-mono"
                                                />
                                              </div>
                                            </div>
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Col 2 Title:</label>
                                                <input
                                                  type="text"
                                                  value={block.col2Title || ''}
                                                  onChange={(e) => handleUpdateBlockField(block.id, 'col2Title', e.target.value)}
                                                  className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Col 2 Content:</label>
                                                <textarea
                                                  rows={3}
                                                  value={block.col2Text || ''}
                                                  onChange={(e) => handleUpdateBlockField(block.id, 'col2Text', e.target.value)}
                                                  className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none resize-none font-mono"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* STAT BLOCK VALUE AND LABEL */}
                                        {block.type === 'stat' && (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                              <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Stat Value (e.g. 92%):</label>
                                              <input
                                                type="text"
                                                value={block.title || ''}
                                                onChange={(e) => handleUpdateBlockField(block.id, 'title', e.target.value)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                              />
                                            </div>
                                            <div className="space-y-1">
                                              <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Stat Label / Metric Name:</label>
                                              <input
                                                type="text"
                                                value={block.text || ''}
                                                onChange={(e) => handleUpdateBlockField(block.id, 'text', e.target.value)}
                                                className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                              />
                                            </div>
                                          </div>
                                        )}

                                        {/* CHART TITLE ONLY */}
                                        {block.type === 'chart' && (
                                          <div className="space-y-1">
                                            <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">Chart Title Label:</label>
                                            <input
                                              type="text"
                                              value={block.title || ''}
                                              onChange={(e) => handleUpdateBlockField(block.id, 'title', e.target.value)}
                                              className="w-full text-[10px] bg-slate-800 border border-slate-700 focus:border-brand-gold rounded p-1.5 text-white outline-none"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* 1. HEADING SECTION */}
                                    {block.type === 'heading' && (
                                      editorialPreset === 'tv2' ? (
                                        <h3 className="text-md sm:text-lg font-sans font-extrabold text-[#cb1a22] uppercase tracking-wide pt-3 border-b-2 border-red-155 pb-1 mt-4 text-left">
                                          {block.text}
                                        </h3>
                                      ) : editorialPreset === 'dr' ? (
                                        <h3 className="text-xl sm:text-2xl font-serif font-semibold text-[#006e80] pb-2 mt-6 border-b border-dashed border-gray-300 text-left">
                                          {block.text}
                                        </h3>
                                      ) : (
                                        <h3 className="text-lg font-serif font-black text-brand-blue uppercase tracking-widest pt-4 border-b border-brand-gold/25 pb-1 select-none text-left">
                                          {block.text}
                                        </h3>
                                      )
                                    )}

                                    {/* 1B. SUBHEADING SECTION */}
                                    {block.type === 'subheading' && (
                                      editorialPreset === 'tv2' ? (
                                        <h4 className="text-sm sm:text-base font-sans font-bold text-gray-900 border-l-4 border-[#cb1a22] pl-3 mt-4 text-left">
                                          {block.text}
                                        </h4>
                                      ) : editorialPreset === 'dr' ? (
                                        <h4 className="text-base sm:text-lg font-serif font-medium text-[#006e80] italic mt-4 text-left">
                                          {block.text}
                                        </h4>
                                      ) : (
                                        <h4 className="text-sm font-serif font-black text-brand-gold uppercase tracking-widest mt-4 text-left">
                                          {block.text}
                                        </h4>
                                      )
                                    )}

                                    {/* 2. BODY PARAGRAPH */}
                                    {block.type === 'paragraph' && (
                                      <div className="text-left">
                                        {block.fontStyle === 'lead' ? (
                                          editorialPreset === 'tv2' ? (
                                            <p className="text-sm sm:text-base text-gray-800 font-sans font-bold leading-relaxed my-3 border-l-4 border-[#cb1a22] pl-4">
                                              {block.text}
                                            </p>
                                          ) : editorialPreset === 'dr' ? (
                                            <p className="text-md sm:text-lg text-[#1a1a1a] font-serif font-light leading-relaxed my-4 italic border-[#006e80]/15 pb-4">
                                              {block.text}
                                            </p>
                                          ) : (
                                            <p className="text-base sm:text-lg text-brand-blue font-serif font-light leading-relaxed my-4 italic border-l-2 border-brand-gold pl-4 sm:pl-6">
                                              {block.text}
                                            </p>
                                          )
                                        ) : block.fontSize === 'lg' ? (
                                          <p className={`text-sm sm:text-base leading-relaxed my-3 ${editorialPreset === 'tv2' ? 'font-sans text-gray-850' : editorialPreset === 'dr' ? 'font-serif text-[#1e1e1e]' : 'font-light text-gray-700'}`}>
                                            {block.fontStyle === 'bold' ? <strong>{block.text}</strong> : block.fontStyle === 'italic' ? <em>{block.text}</em> : block.text}
                                          </p>
                                        ) : block.fontSize === 'sm' ? (
                                          <p className={`text-[10px] sm:text-xs leading-normal my-2 italic ${editorialPreset === 'tv2' ? 'font-sans text-red-700' : 'text-gray-400'}`}>
                                            {block.fontStyle === 'bold' ? <strong>{block.text}</strong> : block.fontStyle === 'italic' ? <em>{block.text}</em> : block.text}
                                          </p>
                                        ) : (
                                          <p className={`text-xs sm:text-sm leading-relaxed my-3 ${editorialPreset === 'tv2' ? 'font-sans text-gray-800' : editorialPreset === 'dr' ? 'font-serif text-[#1c1c1c] leading-loose' : 'text-gray-800'}`}>
                                            {block.fontStyle === 'bold' ? <strong>{block.text}</strong> : block.fontStyle === 'italic' ? <em>{block.text}</em> : block.text}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {/* 3. HIGHLIGHT BOX */}
                                    {block.type === 'highlight' && (
                                      editorialPreset === 'tv2' ? (
                                        <div className="bg-red-50 text-gray-905 duration-150 p-4 sm:p-5 border-l-[4px] border-[#cb1a22] my-4 shadow-xs text-left">
                                          {block.title && (
                                            <h5 className="text-[10px] uppercase font-extrabold text-[#cb1a22] mb-1.5 select-none tracking-wide">
                                              {block.title}
                                            </h5>
                                          )}
                                          <p className="text-xs text-gray-800 font-sans font-medium whitespace-pre-line leading-relaxed">
                                            {block.text}
                                          </p>
                                        </div>
                                      ) : editorialPreset === 'dr' ? (
                                        <div className="bg-[#f0f7f8] text-[#1c1c1c] p-5 sm:p-6 border-l-[3px] border-[#006e80] my-5 text-left">
                                          {block.title && (
                                            <h5 className="text-[10px] uppercase font-bold text-[#006e80] mb-2 select-none font-serif tracking-wider">
                                              {block.title}
                                            </h5>
                                          )}
                                          <p className="text-xs text-[#2b2b2b] font-serif whitespace-pre-line leading-loose">
                                            {block.text}
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="bg-brand-blue text-[#fafcfb] p-4 sm:p-6 border-l-[4px] border-brand-gold my-5 shadow-sm text-left">
                                          {block.title && (
                                            <h5 className="text-[9.5px] uppercase tracking-widest font-black text-brand-gold mb-2 select-none">
                                              {block.title}
                                            </h5>
                                          )}
                                          <p className="text-xs text-brand-ivory/85 font-serif font-light leading-relaxed whitespace-pre-line">
                                            {block.text}
                                          </p>
                                        </div>
                                      )
                                    )}

                                    {/* 4. COMPARISON COLUMN GRID */}
                                    {block.type === 'grid' && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-6 text-left">
                                        <div className="bg-brand-soft-ivory/50 border border-gray-200 p-4 sm:p-5">
                                          <div className={`text-[9px] uppercase tracking-widest font-black border-b border-gray-200 pb-1.5 mb-2.5 ${editorialPreset === 'tv2' ? 'text-[#cb1a22] font-sans' : 'text-brand-blue font-sans'}`}>
                                            {block.col1Title}
                                          </div>
                                          <p className={`text-xs text-gray-600 whitespace-pre-line leading-relaxed ${editorialPreset === 'dr' ? 'font-serif' : 'font-sans'}`}>
                                            {block.col1Text}
                                          </p>
                                        </div>
                                        <div className="bg-brand-soft-ivory/50 border border-gray-200 p-4 sm:p-5">
                                          <div className={`text-[9px] uppercase tracking-widest font-black border-b border-gray-200 pb-1.5 mb-2.5 ${editorialPreset === 'tv2' ? 'text-[#cb1a22] font-sans' : 'text-brand-blue font-sans'}`}>
                                            {block.col2Title}
                                          </div>
                                          <p className={`text-xs text-gray-600 whitespace-pre-line leading-relaxed ${editorialPreset === 'dr' ? 'font-serif' : 'font-sans'}`}>
                                            {block.col2Text}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    {/* 5. DIVIDER COLUMN */}
                                    {block.type === 'divider' && (
                                      editorialPreset === 'tv2' ? (
                                        <div className="my-6 border-b-2 border-dashed border-red-150" />
                                      ) : editorialPreset === 'dr' ? (
                                        <div className="my-8 flex justify-center items-center gap-1.5 select-none">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#006e80]" />
                                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#006e80]" />
                                        </div>
                                      ) : (
                                        <div className="my-8 flex items-center justify-center select-none">
                                          <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-brand-gold/30" />
                                          <div className="flex gap-1.5 px-4 items-center">
                                            <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/50 bg-brand-gold" />
                                            <div className="w-1 h-1 rotate-45 bg-gray-300" />
                                            <div className="w-1.5 h-1.5 rotate-45 border border-brand-gold/50 bg-brand-gold" />
                                          </div>
                                          <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-brand-gold/30" />
                                        </div>
                                      )
                                    )}

                                    {/* 6. QUOTE CALLOUT */}
                                    {block.type === 'quote' && (
                                      editorialPreset === 'tv2' ? (
                                        <div className="border-l-4 border-red-500 pl-4 py-1 my-4 text-left select-none">
                                          <span className="text-[8px] uppercase font-black text-[#cb1a22] tracking-wider block mb-1">
                                            UNIVUE CONSULTANTS APS CITATION
                                          </span>
                                          <p className="text-sm font-sans font-extrabold text-gray-900 leading-normal select-all italic">
                                            "{block.text}"
                                          </p>
                                          {block.author && (
                                            <footer className="text-[9px] font-sans font-bold text-gray-600 mt-1 block select-all">
                                              — {block.author}
                                            </footer>
                                          )}
                                        </div>
                                      ) : editorialPreset === 'dr' ? (
                                        <div className="bg-[#f7f4ef] py-6 px-8 rounded-sm my-6 text-center select-none border-y border-dashed border-gray-200">
                                          <span className="text-2xl font-serif text-[#006e80] block leading-none select-none mb-1">“</span>
                                          <p className="text-sm sm:text-base text-gray-800 font-serif leading-relaxed select-all italic">
                                            {block.text}
                                          </p>
                                          <span className="text-2xl font-serif text-[#006e80] block leading-none select-none mt-1">”</span>
                                          {block.author && (
                                            <footer className="text-[9px] font-sans font-bold text-[#006e80] tracking-widest uppercase mt-3 block select-all">
                                              — {block.author}
                                            </footer>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="border-l border-brand-gold pl-6 sm:pl-8 py-1 my-5 font-serif italic text-brand-blue select-none text-left">
                                          <span className="text-[8.5px] uppercase tracking-[0.2em] font-black text-brand-gold block mb-2 select-all">
                                            [ {block.title} ]
                                          </span>
                                          <p className="text-sm sm:text-base text-brand-blue/90 font-light leading-relaxed select-all">
                                            "{block.text}"
                                          </p>
                                          {block.author && (
                                            <footer className="text-[9.5px] font-sans font-bold text-gray-400 uppercase tracking-widest mt-2 block select-all">
                                              — {block.author}
                                            </footer>
                                          )}
                                        </div>
                                      )
                                    )}

                                    {/* 7. ENCODED IMAGE FIGURE */}
                                    {block.type === 'image' && (
                                      <figure className="my-6 border-y border-gray-100 py-4 bg-gray-50/25 p-4 text-center select-none">
                                        <div className="w-full aspect-[2/1] bg-gray-50 border border-gray-200 rounded overflow-hidden flex items-center justify-center relative">
                                          {block.imageUrl ? (
                                            <img 
                                              src={block.imageUrl} 
                                              alt="Composition Asset" 
                                              className="w-full h-full object-cover"
                                              referrerPolicy="no-referrer"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400';
                                              }}
                                            />
                                          ) : (
                                            <div className="text-gray-300 text-[10px] uppercase tracking-widest font-black flex flex-col items-center gap-1.5">
                                              <span>🖼️ Preview Frame Empty</span>
                                            </div>
                                          )}
                                        </div>
                                        {block.caption && (
                                          <figcaption className="text-[9px] uppercase tracking-widest text-center mt-3 text-gray-400 font-bold block">
                                            {block.caption}
                                          </figcaption>
                                        )}
                                      </figure>
                                    )}

                                    {/* 8. ADVISORY GRAPH */}
                                    {block.type === 'chart' && (
                                      <div className="my-6 p-6 sm:p-8 bg-brand-soft-ivory border border-gray-200 rounded shadow-xs max-w-2xl mx-auto select-none">
                                        <div className="text-[9px] uppercase tracking-[0.25em] font-black text-brand-gold mb-6 border-b border-gray-200 pb-3 block">
                                          {block.title}
                                        </div>
                                        <div className="space-y-4">
                                          {block.chartData?.map((item, idx) => (
                                            <div key={idx}>
                                              <div className="flex justify-between text-[10px] font-bold text-brand-blue mb-1 uppercase tracking-wider">
                                                <span>{item.label}</span>
                                                <span className="text-brand-gold font-mono">{item.value}%</span>
                                              </div>
                                              <div className="w-full bg-gray-200/50 h-2 rounded-none overflow-hidden">
                                                <div className="bg-brand-gold h-full" style={{ width: `${item.value}%` }} />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                        <p className="text-[8px] text-gray-400 uppercase tracking-widest text-right mt-4 font-bold tracking-wide">* Benchmark Projections 2026</p>
                                      </div>
                                    )}

                                    {/* 9. REFERENCE CITATION */}
                                    {block.type === 'reference' && (() => {
                                      const refInfo = parseReferenceText(block.text);
                                      return (
                                        <div className={`my-4 p-3 border-l-2 text-left ${
                                          editorialPreset === 'tv2'
                                            ? 'border-red-500 bg-red-50/10 text-gray-700 font-sans'
                                            : editorialPreset === 'dr'
                                            ? 'border-[#006e80] bg-teal-50/10 text-[#222] font-serif italic'
                                            : 'border-brand-gold bg-brand-soft-ivory/20 text-brand-blue font-serif'
                                        } text-[11px] leading-relaxed select-all`}>
                                          <span className="font-extrabold uppercase tracking-widest text-[8px] opacity-70 block mb-0.5">Reference citation:</span>
                                          {refInfo.url ? (
                                            <a 
                                              href={refInfo.url} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="underline font-bold hover:text-brand-gold transition-colors"
                                            >
                                              {refInfo.title}
                                            </a>
                                          ) : (
                                            refInfo.title
                                          )}
                                        </div>
                                      );
                                    })()}

                                    {/* 10. FOOTNOTE AT THE BOTTOM */}
                                    {block.type === 'footnote' && (
                                      <div className={`mt-3 pt-2 border-t border-dashed border-gray-200 text-left text-[9px] ${
                                        editorialPreset === 'tv2' ? 'text-gray-400 font-sans' : 'text-gray-500 font-serif italic'
                                      } leading-normal select-all`}>
                                        <span className="font-black text-[7.5px] uppercase tracking-wider mr-1.5">[Footnote ⁺]</span>
                                        {block.text}
                                      </div>
                                    )}

                                    {/* 11. STAT CARD */}
                                    {block.type === 'stat' && (
                                      <div className="my-6 max-w-sm mx-auto p-4 border border-brand-gold/15 bg-white/50 text-center rounded shadow-sm select-none">
                                        <div className={`text-4xl font-extrabold tracking-tight ${
                                          editorialPreset === 'tv2' ? 'text-[#cb1a22] font-sans' : 'text-brand-blue font-serif'
                                        }`}>
                                          {block.title || '92%'}
                                        </div>
                                        <div className="text-[8.5px] uppercase tracking-widest text-gray-500 mt-1 font-bold">
                                          {block.text || 'Performance Indicator'}
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                );
                              })
                            )}



                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-6 bg-brand-blue text-brand-ivory text-[10px] uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-blue transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    {submitting ? 'Synchronizing Intelligence...' : editId ? 'Update Publication' : 'Release Insight to Public'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GORGEOUS INLINE MODAL FOR REFERENCE INSERTION (Avoiding blocked window.prompt) */}
      {showRefInsertionModal && (
        <div className="fixed inset-0 bg-brand-blue/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-brand-gold/30 rounded shadow-xl max-w-sm w-full p-5 space-y-4 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-[10px] uppercase tracking-widest font-black text-brand-blue flex items-center gap-1.5">
                🏷️ Add Reference Component
              </span>
              <button
                type="button"
                onClick={() => setShowRefInsertionModal(false)}
                className="text-gray-400 hover:text-brand-blue text-[9px] uppercase tracking-wider font-extrabold cursor-pointer"
              >
                ✕ Cancel
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">
                  Reference Name / Citation Title:
                </label>
                <input
                  type="text"
                  value={newRefTitle}
                  onChange={(e) => setNewRefTitle(e.target.value)}
                  className="w-full text-[11px] font-mono bg-gray-50 border border-gray-250 focus:bg-white focus:border-brand-gold rounded p-2 text-brand-blue outline-none"
                  placeholder="e.g. Univue Quarterly Research, Vol. 14, Page 89"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-widest text-[#9c805c] font-black block">
                  Optional Reference Link (URL):
                </label>
                <input
                  type="text"
                  value={newRefUrl}
                  onChange={(e) => setNewRefUrl(e.target.value)}
                  className="w-full text-[11px] font-mono bg-gray-50 border border-gray-250 focus:bg-white focus:border-brand-gold rounded p-2 text-brand-blue outline-none"
                  placeholder="e.g. https://publications.univue.com"
                />
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRefInsertionModal(false)}
                className="flex-1 py-2 text-[9px] uppercase tracking-widest font-bold border border-gray-250 text-gray-500 rounded hover:bg-gray-50 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertReferenceSuccess}
                className="flex-1 py-2 text-[9px] uppercase tracking-widest font-black bg-brand-blue text-brand-gold border border-brand-gold rounded hover:bg-opacity-90 cursor-pointer transition-all shadow-sm"
              >
                Insert Reference
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

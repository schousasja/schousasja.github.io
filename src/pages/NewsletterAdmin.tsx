import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Users, 
  Send, 
  History, 
  Mail, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  FileText,
  LayoutDashboard,
  Sparkles,
  Wand2,
  Code,
  Eye,
  Maximize2
} from 'lucide-react';
import { AdminNav } from '../components/AdminNav';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { Link } from 'react-router-dom';

export const NewsletterAdmin = () => {
  const { profile } = useAuth();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'subscribers'>('compose');
  
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [confirmSend, setConfirmSend] = useState(false);

  // Automated Newsletter Generator States
  const [showAutoToolkit, setShowAutoToolkit] = useState(false);
  const [autoMode, setAutoMode] = useState<'digest' | 'ai_brief' | 'template'>('digest');
  const [insightsList, setInsightsList] = useState<any[]>([]);
  const [selectedInsights, setSelectedInsights] = useState<string[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [customRemarks, setCustomRemarks] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'univue' | 'tv2' | 'dr'>('univue');
  const [isCompiling, setIsCompiling] = useState(false);
  const [autoPreview, setAutoPreview] = useState(true);
  const [compileStatus, setCompileStatus] = useState<string | null>(null);

  // Editor View Mode & Preview Screen States
  const [editorTab, setEditorTab] = useState<'visual' | 'edit' | 'preview'>('visual');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewScreenSize, setPreviewScreenSize] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Subscribers (both registered users who subscribed and guest newsletter submissions)
      const subQuery = query(collection(db, 'users'), where('isSubscribed', '==', true));
      const subSnap = await getDocs(subQuery);
      const subList = subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const guestQuery = query(collection(db, 'newsletter_subscribers'));
      const guestSnap = await getDocs(guestQuery);
      const guestList = guestSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Merge and remove duplicates by email
      const mergedMap = new Map<string, any>();
      subList.forEach((sub: any) => {
        if (sub.email) {
          mergedMap.set(sub.email.toLowerCase(), sub);
        }
      });
      guestList.forEach((sub: any) => {
        if (sub.email) {
          const emailLower = sub.email.toLowerCase();
          if (!mergedMap.has(emailLower)) {
            mergedMap.set(emailLower, sub);
          }
        }
      });

      setSubscribers(Array.from(mergedMap.values()));

      // Fetch History
      const historyQuery = query(collection(db, 'newsletters'), orderBy('sentAt', 'desc'));
      const historySnap = await getDocs(historyQuery);
      const historyList = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(historyList);

      // Fetch Published Insights for compiler
      const insightsQuery = query(collection(db, 'insights'), orderBy('createdAt', 'desc'));
      const insightsSnap = await getDocs(insightsQuery);
      const list = insightsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInsightsList(list);

      // Fetch Published Properties for compiler
      const propertiesQuery = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
      const propertiesSnap = await getDocs(propertiesQuery);
      const propsList = propertiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPropertiesList(propsList);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'multiple collections');
    } finally {
      setLoading(false);
    }
  };

  // HTML Email Layout Base Wrapper
  const createEmailTemplateHTML = (title: string, bodyHTML: string) => {
    const currentYear = new Date().getFullYear();
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #faf8f5;
      color: #0f1e36;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #faf8f5;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #ffffff;
      padding: 40px 30px 25px 30px;
      text-align: center;
    }
    .content {
      padding: 0 30px 30px 30px;
    }
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      background-color: #0f1e36;
      color: #faf8f5 !important;
      text-decoration: none;
      padding: 10px 20px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 1px;
      border: 1px solid #d4af37;
    }
    .button:hover {
      background-color: #d4af37;
      color: #0f1e36 !important;
    }
    .footer {
      background-color: #0a1424;
      padding: 35px 30px;
      text-align: center;
      border-top: 3px solid #d4af37;
      font-size: 11px;
      color: #94a3b8;
    }
    .footer p {
      margin: 0 0 10px 0;
      line-height: 1.5;
    }
    .footer a {
      color: #d4af37;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div style="text-align: center; margin-bottom: 15px;">
      <a href="${window.location.origin}/market-catalog" style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; text-decoration: none;">View in browser</a>
    </div>
    <div class="container">
      <div class="header">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; margin-bottom: 8px;">
          <path d="M20 5L6 19H11V33H17V25H23V33H29V19H34L20 5Z" stroke="#d4af37" stroke-width="1.5" stroke-linejoin="round" fill="none" />
          <path d="M20 12L25 16.5M20 12L15 16.5" stroke="#d4af37" stroke-width="1" />
        </svg>
        <h1 style="color: #0f1e36; font-size: 16px; text-transform: uppercase; letter-spacing: 5px; margin: 0 0 4px 0; font-weight: normal; font-family: Georgia, serif;">UNIVUE</h1>
        <div style="font-size: 8.5px; text-transform: uppercase; letter-spacing: 3px; color: #d4af37; font-weight: bold; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">PORTFOLIO INTELLIGENCE</div>
      </div>
      
      <div class="content">
        ${bodyHTML}
      </div>
      
      <div class="footer">
        <p style="margin: 0 0 10px 0; font-family: Georgia, serif; font-size: 12px; color: #ffffff;">UNIVUE PORTFOLIO ADVISORY</p>
        <p>© ${currentYear} Univue Consultants ApS. All institutional privileges reserved.</p>
        <p style="font-size: 10px; color: #94a3b8; margin: 0;">You received this newsletter as a registered client of Univue research networks. To opt-out of corporate announcements, you may <a href="{{unsub}}">unsubscribe immediately</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const getPreviewHTMLBase = (html: string) => {
    if (!html) return '';
    const namePreview = profile?.displayName || profile?.firstName || "Alex Mercer";
    const emailPreview = profile?.email || "subscriber@univue-clients.com";
    const unsubPreview = `${window.location.origin}/insights?unsub=${encodeURIComponent(emailPreview)}`;
    return html
      .replace(/\{\{\s*name\s*\}\}/gi, namePreview)
      .replace(/%7[bB]%7[bB](\s*(%20)*)*name(\s*(%20)*)*%7[dD]%7[dD]/gi, namePreview)
      .replace(/\{\{\s*unsub\s*\}\}/gi, unsubPreview)
      .replace(/%7[bB]%7[bB](\s*(%20)*)*unsub(\s*(%20)*)*%7[dD]%7[dD]/gi, unsubPreview)
      .replace(/\{\{\s*email\s*\}\}/gi, emailPreview)
      .replace(/%7[bB]%7[bB](\s*(%20)*)*email(\s*(%20)*)*%7[dD]%7[dD]/gi, emailPreview);
  };

  // Helper to extract the HTML content specifically within the <div class="container"> wrapper
  const extractContainerHTML = (html: string): string => {
    if (!html) return '';
    const startIdx = html.indexOf('<div class="container">');
    const endStr = '</div>\n  </div>\n</body>';
    const endStrWithCR = '</div>\r\n  </div>\r\n</body>';
    let endIdx = html.lastIndexOf(endStr);
    if (endIdx === -1) {
      endIdx = html.lastIndexOf(endStrWithCR);
    }
    if (endIdx === -1) {
      const bodyEndIdx = html.indexOf('</body>');
      if (bodyEndIdx !== -1) {
        endIdx = html.lastIndexOf('</div>', bodyEndIdx);
      }
    }
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      return html.substring(startIdx + '<div class="container">'.length, endIdx);
    }

    // Look for <div class="container">...</div> right before the trailing layout elements
    const regex = /<div class="container">([\s\S]*)<\/div>\s*<\/div>\s*<\/body>/i;
    const match = html.match(regex);
    if (match) {
      return match[1];
    }
    // Fallback: extract anything between the body tags if present
    const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1];
    }
    return html;
  };

  // Helper to replace the <div class="container"> content with user edits and rebuild the entire email outer layout
  const rebuildFullHTML = (oldHTML: string, newContainerContent: string): string => {
    if (!oldHTML) {
      return createEmailTemplateHTML(subject || "Univue Focus Briefing: Strategic Market Realignment", newContainerContent);
    }
    const startIdx = oldHTML.indexOf('<div class="container">');
    const endStr = '</div>\n  </div>\n</body>';
    const endStrWithCR = '</div>\r\n  </div>\r\n</body>';
    let endIdx = oldHTML.lastIndexOf(endStr);
    if (endIdx === -1) {
      endIdx = oldHTML.lastIndexOf(endStrWithCR);
    }
    if (endIdx === -1) {
      const bodyEndIdx = oldHTML.indexOf('</body>');
      if (bodyEndIdx !== -1) {
        endIdx = oldHTML.lastIndexOf('</div>', bodyEndIdx);
      }
    }
    
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      return oldHTML.substring(0, startIdx + '<div class="container">'.length) +
             newContainerContent +
             oldHTML.substring(endIdx);
    }

    const regex = /<div class="container">([\s\S]*)<\/div>\s*<\/div>\s*<\/body>/i;
    if (regex.test(oldHTML)) {
      return oldHTML.replace(regex, `<div class="container">${newContainerContent}</div>\n  </div>\n</body>`);
    }
    const bodyRegex = /<body>([\s\S]*)<\/body>/i;
    if (bodyRegex.test(oldHTML)) {
      return oldHTML.replace(bodyRegex, `<body>${newContainerContent}</body>`);
    }
    return createEmailTemplateHTML(subject || "Univue Focus Briefing: Strategic Market Realignment", newContainerContent);
  };

  const editableRef = useRef<HTMLDivElement>(null);

  // Sync ref with state unless they are identical, which blocks cursor jump when typing
  useEffect(() => {
    if (editorTab === 'visual' && editableRef.current) {
      const currentEditorHTML = editableRef.current.innerHTML;
      const incomingExtracted = extractContainerHTML(content);
      if (currentEditorHTML !== incomingExtracted) {
        editableRef.current.innerHTML = incomingExtracted;
      }
    }
  }, [content, editorTab]);

  const handleVisualInput = () => {
    if (!editableRef.current) return;
    const newRawBody = editableRef.current.innerHTML;
    const newFullHTML = rebuildFullHTML(content, newRawBody);
    setContent(newFullHTML);
  };

  const runCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editableRef.current) {
      const newRawBody = editableRef.current.innerHTML;
      const newFullHTML = rebuildFullHTML(content, newRawBody);
      setContent(newFullHTML);
    }
  };

  const insertDivider = () => {
    runCommand('insertHTML', '<div class="divider"></div><p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;"><br></p>');
  };

  const insertQuote = () => {
    runCommand('insertHTML', `
      <div style="background-color: #0f1e36; border-left: 3px solid #d4af37; padding: 25px 20px; text-align: center; margin: 25px 0; box-sizing: border-box;">
        <p style="font-family: Georgia, serif; font-size: 14px; font-style: italic; color: #faf8f5; line-height: 1.6; margin: 0 0 8px 0;">
          "Real estate is not merely acquisition. It is the tactical assembly of environments that catalyze sovereign wealth projection."
        </p>
        <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #d4af37; font-weight: bold;">
          — UNIVUE CORRIDOR INTEL
        </div>
      </div>
      <p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;"><br></p>
    `);
  };

  const insertLink = () => {
    const url = prompt('Enter the link URL (e.g., https://example.com/catalog):');
    if (url) {
      runCommand('createLink', url);
    }
  };

  // Convert markdown standard blocks from AI Copilot response to email-safe HTML markup
  const parseMarkdownToHTML = (markdown: string) => {
    let html = markdown;
    
    // Convert breakout blocks: :::highlight ... :::
    html = html.replace(/:::highlight[^]*?###\s*([^\n]+)[^]*?([^]*?):::/gi, (match, title, text) => {
      return `
        <div style="background-color: #faf8f5; border-left: 3px solid #d4af37; padding: 20px; margin: 25px 0;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0f1e36;">${title}</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">${text.trim()}</p>
        </div>
      `;
    });

    // Subheadings ##
    html = html.replace(/^##\s+([^\n]+)/gmi, '<h3 style="font-family: Georgia, serif; font-size: 18px; color: #0f1e36; margin: 30px 0 12px 0; font-weight: normal;">$1</h3>');
    // Main Headings #
    html = html.replace(/^#\s+([^\n]+)/gmi, '<h2 style="font-family: Georgia, serif; font-size: 22px; color: #0f1e36; margin: 20px 0 15px 0; font-weight: normal; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">$1</h2>');
    
    // Lists/Bullet points
    html = html.replace(/^\*\s+([^\n]+)/gmi, '<li style="font-size: 13.5px; line-height: 1.6; color: #475569; margin-bottom: 8px;">$1</li>');
    html = html.replace(/((?:<li[^>]*>[^<]*<\/li>\s*)+)/gi, '<ul style="padding-left: 20px; margin: 20px 0;">$1</ul>');

    // Blockquotes
    html = html.replace(/^>\s*"([^"]+)"\s*—\s*([^\n]+)/gmi, `
      <blockquote style="border-left: 2px solid #d4af37; margin: 25px 0; padding-left: 20px; font-style: italic; color: #334155; font-family: Georgia, serif; font-size: 15px; line-height: 1.6;">
        "${1}"
        <cite style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #d4af37; margin-top: 8px; font-style: normal; font-weight: bold;">— $2</cite>
      </blockquote>
    `);

    // Standard paragraphs (split by double newline, wrap non-HTML elements)
    const blocks = html.split(/\n{2,}/);
    html = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<block') || trimmed.startsWith('<div')) {
        return trimmed;
      }
      return `<p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    }).join('\n');

    return html;
  };

  const handleCompileNewsletter = async () => {
    setIsCompiling(true);
    setCompileStatus(null);
    try {
      if (autoMode === 'digest') {
        if (insightsList.length === 0 && propertiesList.length === 0) {
          throw new Error("No properties or insights are published inside the workspace to compile.");
        }

        // Introduction Row
        const introText = customRemarks.trim() 
          ? customRemarks.trim().replace(/\n/g, '<br/>')
          : "We are pleased to present our latest curated macroeconomic briefings, sovereign asset insights, and premium real estate opportunities. Move through our verified developer entries and global corridor analyses below.";

        const introSectionHTML = `
          <div style="margin-bottom: 25px; border-radius: 2px; overflow: hidden; max-height: 250px;">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" alt="Univue Main Banner" style="width: 100%; height: auto; display: block;" />
          </div>
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-collapse: collapse;">
            <tr>
              <td valign="top" style="width: 42%; padding-right: 20px; text-align: left; box-sizing: border-box;">
                <h3 style="font-family: Georgia, serif; font-size: 15px; font-weight: bold; line-height: 1.4; color: #0f1e36; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Sovereign Capital & Precision Real Estate Advisory
                </h3>
                <div style="width: 30px; height: 1px; background-color: #d4af37; margin-top: 15px;"></div>
              </td>
              <td valign="top" style="width: 58%; padding-left: 15px; border-left: 1px solid #e2e8f0; text-align: left; box-sizing: border-box;">
                <p style="font-size: 13px; line-height: 1.7; color: #475569; margin: 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
                  Dear Subscriber,<br/><br/>${introText}
                </p>
              </td>
            </tr>
          </table>
          <div style="height: 1px; background-color: #e2e8f0; margin: 30px 0;"></div>
        `;

        // II. Properties Grid
        let propertiesGridHTML = '';
        const propsToRender = selectedProperties.length > 0
          ? selectedProperties.map(id => propertiesList.find(p => p.id === id)).filter(Boolean)
          : propertiesList.slice(0, 3);

        if (propsToRender.length > 0) {
          const propertiesRows: string[] = [];
          for (let i = 0; i < propsToRender.length; i += 3) {
            const chunk = propsToRender.slice(i, i + 3);
            const cellsHTML = chunk.map((prop, idx) => {
              const numLabel = String(i + idx + 1).padStart(2, '0');
              const propertyUrl = `${window.location.origin}/market-catalog`;
              const pImg = prop.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80";
              const devName = prop.developer?.name || "Premium Partner";
              return `
                <td valign="top" style="width: 33.3%; padding: 0 8px; text-align: left; box-sizing: border-box;">
                  <div style="background-color: #ffffff; overflow: hidden; border-radius: 2px;">
                    <img src="${pImg}" alt="${prop.name}" style="width: 100%; height: 110px; display: block; object-fit: cover;" />
                    <div style="padding-top: 10px;">
                      <div style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #0f1e36; margin: 6px 0 4px 0; line-height: 1;">${numLabel}</div>
                      <div style="font-size: 7.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #d4af37; margin-bottom: 6px;">${(prop.type || 'Showcase').toUpperCase()}</div>
                      <h4 style="font-family: Georgia, serif; font-size: 11.5px; color: #0f1e36; margin: 0 0 4px 0; font-weight: bold; line-height: 1.35; height: 32px; overflow: hidden;">${prop.name}</h4>
                      <p style="font-size: 9px; color: #475569; margin: 0 0 10px 0; height: 26px; overflow: hidden; line-height: 1.4;">${devName} (${prop.location || 'UAE'})</p>
                      <div style="font-size: 10px; color: #0f1e36; font-family: monospace; font-weight: bold; margin-bottom: 12px;">Yield: ${prop.expectedYield || 'Target 6.5%+'}</div>
                      <div style="margin-top: 8px;">
                        <a href="${propertyUrl}" style="display: block; text-align: center; background-color: #faf8f5; border: 1px solid #d4af37; color: #0f1e36 !important; text-decoration: none; padding: 7px 10px; font-size: 8.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px;">LOOK INSIDE</a>
                      </div>
                    </div>
                  </div>
                </td>
              `;
            }).join('');

            const missingAmount = 3 - chunk.length;
            const fillerHTML = missingAmount > 0
              ? Array(missingAmount).fill(`<td style="width: 33.3%;"></td>`).join('')
              : '';

            propertiesRows.push(`
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px; border-collapse: collapse;">
                <tr>
                  ${cellsHTML}${fillerHTML}
                </tr>
              </table>
            `);
          }

          propertiesGridHTML = `
            <div style="text-align: center; margin: 15px 0 25px 0;">
              <h2 style="font-family: Georgia, serif; font-size: 18px; color: #0f1e36; font-weight: normal; margin: 0 0 6px 0; letter-spacing: 1px; text-transform: uppercase;">New on the Market</h2>
              <div style="width: 40px; height: 1.5px; background-color: #d4af37; margin: 0 auto 20px auto;"></div>
            </div>
            ${propertiesRows.join('\n')}
            <div style="height: 1px; background-color: #e2e8f0; margin: 30px 0;"></div>
          `;
        }

        // III. Testimonial Quote
        const quoteSectionHTML = `
          <div style="background-color: #0f1e36; border-left: 3px solid #d4af37; padding: 25px 20px; text-align: center; margin: 35px 0; box-sizing: border-box;">
            <p style="font-family: Georgia, serif; font-size: 14px; font-style: italic; color: #faf8f5; line-height: 1.6; margin: 0 0 8px 0;">
              "Real estate is not merely acquisition. It is the tactical assembly of environments that catalyze sovereign wealth projection."
            </p>
            <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 2px; color: #d4af37; font-weight: bold;">
              — UNIVUE CORRIDOR INTEL
            </div>
          </div>
        `;

        // IV. Insights Row
        let insightsSectionHTML = '';
        const insightsToRender = selectedInsights.length > 0
          ? selectedInsights.map(id => insightsList.find(i => i.id === id)).filter(Boolean)
          : insightsList.slice(0, 2);

        if (insightsToRender.length > 0) {
          const rowsHTML = insightsToRender.map((ins, index) => {
            const articleUrl = `${window.location.origin}/insights?id=${ins.id}`;
            const rightImg = index % 2 === 0
              ? "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80"
              : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80";

            return `
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 30px; border-collapse: collapse; text-align: left;">
                <tr>
                  <td valign="top" style="width: 68%; padding-right: 15px; box-sizing: border-box;">
                    <div style="font-size: 8px; text-transform: uppercase; letter-spacing: 1.5px; color: #d4af37; font-weight: bold; margin-bottom: 6px;">
                      ${(ins.type || 'Macro Briefing').toUpperCase()} • ${ins.displayDate || 'CURRENT RELEASE'}
                    </div>
                    <h3 style="font-family: Georgia, serif; font-size: 14.5px; color: #0f1e36; margin: 0 0 8px 0; font-weight: bold; line-height: 1.35;">
                      ${ins.title}
                    </h3>
                    <p style="font-size: 12.5px; line-height: 1.55; color: #475569; margin: 0 0 15px 0;">
                      ${ins.description || 'Access latest strategic advisor insights on global capital markets and emerging industrial corridors.'}
                    </p>
                    <div>
                      <a href="${articleUrl}" target="_blank" style="display: inline-block; background-color: #0f1e36; color: #faf8f5 !important; text-decoration: none; padding: 7px 14px; font-size: 8.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 1px; border: 1px solid #d4af37;">READ REPORT</a>
                    </div>
                  </td>
                  <td valign="middle" style="width: 32%; text-align: right; box-sizing: border-box;">
                    <div style="border-radius: 1px; overflow: hidden; border: 1px solid #e2e8f0; max-height: 90px;">
                      <img src="${rightImg}" alt="Report" style="width: 100%; height: 85px; display: block; object-fit: cover;" />
                    </div>
                  </td>
                </tr>
              </table>
              ${index < insightsToRender.length - 1 ? '<div style="height: 1px; background-color: #f1f5f9; margin-bottom: 25px;"></div>' : ''}
            `;
          }).join('\n');

          insightsSectionHTML = `
            <div style="text-align: center; margin: 35px 0 25px 0;">
              <h2 style="font-family: Georgia, serif; font-size: 18px; color: #0f1e36; font-weight: normal; margin: 0 0 6px 0; letter-spacing: 1px; text-transform: uppercase;">Curated Macro Intelligence</h2>
              <div style="width: 40px; height: 1.5px; background-color: #d4af37; margin: 0 auto 20px auto;"></div>
            </div>
            ${rowsHTML}
          `;
        }

        // V. Call to Action
        const contactSectionHTML = `
          <div style="height: 1px; background-color: #e2e8f0; margin: 35px 0;"></div>
          <div style="text-align: center; padding: 15px 0 15px 0;">
            <p style="font-family: Georgia, serif; font-size: 16px; color: #0f1e36; font-weight: normal; margin: 0 0 15px 0; letter-spacing: 0.5px;">Any questions?</p>
            <a href="${window.location.origin}/questionnaire" target="_blank" style="display: inline-block; background-color: #ffffff; border: 1.5px solid #0f1e36; color: #0f1e36 !important; text-decoration: none; padding: 11px 25px; font-size: 9.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 1px;">JUST ASK US</a>
          </div>
        `;

        const finalBody = `${introSectionHTML}${propertiesGridHTML}${quoteSectionHTML}${insightsSectionHTML}${contactSectionHTML}`;
        const selectedTitles = selectedInsights
          .map(id => insightsList.find(i => i.id === id)?.title)
          .filter(Boolean);
        const selectedPropNames = selectedProperties
          .map(id => propertiesList.find(p => p.id === id)?.name)
          .filter(Boolean);

        let compiledSubject = "Univue Weekly Intelligence: Curated Strategic Briefing";
        if (selectedTitles.length > 0 && selectedPropNames.length > 0) {
          compiledSubject = `Univue Update: ${selectedTitles[0]} & Premium Asset Opportunities`;
        } else if (selectedTitles.length > 0) {
          compiledSubject = selectedTitles.length === 1 ? `Univue Focus: ${selectedTitles[0]}` : `Univue Intelligence: ${selectedTitles[0]} & Updates`;
        } else if (selectedPropNames.length > 0) {
          compiledSubject = selectedPropNames.length === 1 ? `Featured Property Opportunity: ${selectedPropNames[0]}` : `Strategic Portfolio View: Premium Real Estate Assets`;
        }

        const fullHTML = createEmailTemplateHTML(compiledSubject, finalBody);
        setSubject(compiledSubject);
        setContent(fullHTML);
        setCompileStatus("Successfully compiled digest and loaded into editor!");
        setShowAutoToolkit(false); // Close toolkit
        setEditorTab('visual'); // Instantly switch to visual tab so user sees the visual draft immediately
        if (autoPreview) {
          setShowPreviewModal(true); // Open the premium preview overlay as well so they can inspect immediately
        }
      } else if (autoMode === 'ai_brief') {
        if (!aiTopic.trim()) {
          throw new Error("Please enter a narrative topic for the AI.");
        }

        // Build context from selected insights if any
        let insightsContext = "";
        if (selectedInsights.length > 0) {
          insightsContext = "Here are the headlines and summaries of our actual latest publications, weave or reference their topics if helpful:\n" + selectedInsights.map(id => {
            const ins = insightsList.find(i => i.id === id);
            return ins ? `- ${ins.title}: ${ins.description}` : '';
          }).filter(Boolean).join('\n');
        }

        let propertiesContext = "";
        if (selectedProperties.length > 0) {
          propertiesContext = "\nHere is structured data about real premium assets available right now, highlight or reference these opportunities in your brief if applicable:\n" + selectedProperties.map(id => {
            const prop = propertiesList.find(p => p.id === id);
            return prop ? `- Property Name: ${prop.name}, Location: ${prop.location}, Type: ${prop.type}, Starting Price: ${prop.startingPrice}, Expected Yield: ${prop.expectedYield}` : '';
          }).filter(Boolean).join('\n');
        }

        const promptDirections = `
          Draft a highly engaging, professional financial and real estate client newsletter overview.
          Core Topic/Instructions: ${aiTopic}
          ${insightsContext}
          ${propertiesContext}
          
          Format it strictly as a direct corporate memo/executive letter with:
          - A clear display title top header (e.g. "# STRATEGIC INTELLIGENCE: REALIGNMENT")
          - An introductory executive address (e.g. "Dear Client/Subscriber,")
          - 2-3 narrative sections summarizing macroeconomic shifts under headers (using '##'), focusing on facts.
          - 1 client-specific breakout highlight box (':::highlight ... :::') summarizing key advisory takeaways.
          - A professional sign-off formula ("Yours sincerely, Univue Advisory Group").
        `;

        const response = await fetch('/api/admin/editorial-copilot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task: 'generate',
            preset: aiTone,
            text: aiTopic,
            prompt: promptDirections
          })
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Failed to contact Editorial Desk AI Copilot");
        }

        const rawMarkdown = result.text;
        const convertedBodyHTML = parseMarkdownToHTML(rawMarkdown);

        const compiledSubject = `Strategic Brief: ${aiTopic.slice(0, 50)}${aiTopic.length > 50 ? '...' : ''}`;
        const fullHTML = createEmailTemplateHTML(compiledSubject, convertedBodyHTML);
        
        setSubject(compiledSubject);
        setContent(fullHTML);
        setCompileStatus("Successfully generated AI briefing and loaded into editor!");
        setShowAutoToolkit(false); // Close toolkit
        setEditorTab('visual'); // Switch directly to visual editor
        if (autoPreview) {
          setShowPreviewModal(true);
        }
      } else if (autoMode === 'template') {
        const blankBody = `
          <div class="intro">
            Dear valued partner,<br/><br/>
            Add your custom campaign introduction or executive greeting here. Use short, high-impact statements to set the stage for your strategic analysis.
          </div>
          <div class="divider"></div>
          
          <div class="insight-card">
            <div class="insight-meta">Market Intelligence • Focus Segment</div>
            <h3 class="insight-title">Title of Your Featured Report</h3>
            <p class="insight-desc">Write your key analysis overview, capital flows, or macroeconomic summary of the report here to hook readers. Keep it concise and clinical.</p>
            <div style="margin-top: 15px;">
              <a href="${window.location.origin}/insights" target="_blank" class="button" style="color: #faf8f5 !important;">Access Full Briefing</a>
            </div>
          </div>
        `;
        const compiledSubject = "Univue Focus Briefing: Strategic Market Realignment";
        const fullHTML = createEmailTemplateHTML(compiledSubject, blankBody);
        setSubject(compiledSubject);
        setContent(fullHTML);
        setCompileStatus("Loaded styled email template in workspace!");
        setShowAutoToolkit(false);
        setEditorTab('visual'); // Switch directly to visual editor
        if (autoPreview) {
          setShowPreviewModal(true);
        }
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content || subscribers.length === 0) return;

    if (!confirmSend) {
      setConfirmSend(true);
      setTimeout(() => setConfirmSend(false), 5000);
      return;
    }

    setConfirmSend(false);
    setSending(true);
    setStatus(null);

    const recipientObjects = subscribers.map(s => ({
      email: s.email,
      name: s.displayName || s.firstName || s.name || s.email.split('@')[0]
    }));

    try {
      // 1. Send via Server API
      const response = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          html: content, // Already compliant full HTML document, no need for raw replace
          recipients: recipientObjects
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send newsletter');
      }

      // 2. Log in Firestore
      await addDoc(collection(db, 'newsletters'), {
        subject,
        content,
        recipientCount: subscribers.length,
        sentBy: profile.uid,
        sentAt: serverTimestamp(),
      });

      setStatus({ type: 'success', message: `Successfully sent to ${subscribers.length} subscribers.` });
      setSubject('');
      setContent('');
      fetchData(); // Refresh history
      setActiveTab('history');
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSending(false);
    }
  };

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
              <h1 className="text-brand-gold font-normal uppercase tracking-[0.4em] text-[10px] mb-4">Newsletter Broadcasting</h1>
              <h2 className="text-4xl md:text-5xl font-serif text-brand-ivory leading-tight tracking-tighter">
                Newsletter <span className="text-gold-gradient">Command</span>.
              </h2>
            </div>
            <div className="flex gap-4">
              <div className="bg-brand-gold/10 backdrop-blur-sm p-4 border border-brand-gold/20">
                <div className="text-[10px] uppercase tracking-widest text-brand-gold/60 mb-1">Subscribers</div>
                <div className="text-2xl font-serif text-brand-ivory">{subscribers.length}</div>
              </div>
              <div className="bg-brand-gold/10 backdrop-blur-sm p-4 border border-brand-gold/20">
                <div className="text-[10px] uppercase tracking-widest text-brand-gold/60 mb-1">Campaigns</div>
                <div className="text-2xl font-serif text-brand-ivory">{history.length}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="border-b border-gray-100 bg-white sticky top-[80px] z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-12">
            {[
              { id: 'compose', label: 'Compose Newsletter', icon: Send },
              { id: 'history', label: 'Campaign History', icon: History },
              { id: 'subscribers', label: 'Subscribers List', icon: Users },
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
                    layoutId="activeTab"
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

          {activeTab === 'compose' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-serif text-brand-blue mb-8 border-b border-gray-50 pb-4">Draft New Campaign</h3>

                  {/* 🪄 AUTOMATED CAMPAIGN ASSISTANT PANEL */}
                  <div className="mb-8 border border-brand-gold/20 bg-[#fbf9f6] p-6 shadow-sm">
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-blue text-brand-gold rounded-full shrink-0">
                          <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-serif text-brand-blue font-bold">Automated Newsletter Assistant</h4>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Auto-compile website publications or draft briefings with AI</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAutoToolkit(!showAutoToolkit)}
                        className="px-4 py-2.5 bg-brand-blue text-brand-ivory text-[9px] uppercase tracking-widest font-black transition-all hover:bg-brand-gold hover:text-brand-blue whitespace-nowrap"
                      >
                        {showAutoToolkit ? "Collapse Toolkit" : "Open Assistant Desk"}
                      </button>
                    </div>

                    {compileStatus && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-100 text-green-800 text-[10px] uppercase tracking-widest font-bold flex items-center justify-between">
                        <span>{compileStatus}</span>
                        <button type="button" onClick={() => setCompileStatus(null)} className="opacity-50 hover:opacity-100">Dismiss</button>
                      </div>
                    )}

                    {showAutoToolkit && (
                      <div className="mt-6 border-t border-gray-150 pt-6 space-y-6">
                        {/* Selector tabs for automation modes */}
                        <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-3">
                          {[
                            { id: 'digest', label: 'Curate Publication Digest', icon: Sparkles },
                            { id: 'ai_brief', label: 'AI Custom Memo Briefing', icon: Wand2 },
                            { id: 'template', label: 'Styled Blank Envelope', icon: FileText },
                          ].map(mode => (
                            <button
                              key={mode.id}
                              type="button"
                              onClick={() => { setAutoMode(mode.id as any); setCompileStatus(null); }}
                              className={`flex items-center gap-2 px-4 py-2.5 text-[9px] uppercase tracking-widest font-black border transition-all ${
                                autoMode === mode.id
                                  ? 'bg-brand-blue text-brand-gold border-brand-blue'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-gold hover:text-brand-blue'
                              }`}
                            >
                              <mode.icon className="w-3.5 h-3.5" />
                              {mode.label}
                            </button>
                          ))}
                        </div>

                        {autoMode === 'digest' && (
                          <div className="space-y-6">
                            <div>
                              <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue/80 mb-2 block">
                                Step 1: Select Publications to Include (Checked items appear in email cards)
                              </label>
                              <div className="bg-white border border-gray-150 p-4 max-h-48 overflow-y-auto space-y-3.5 divide-y divide-gray-50">
                                {insightsList.map((ins, idx) => (
                                  <label key={ins.id} className={`flex items-start gap-4 pt-3 cursor-pointer group ${idx === 0 ? 'pt-0' : ''}`}>
                                    <input
                                      type="checkbox"
                                      checked={selectedInsights.includes(ins.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedInsights([...selectedInsights, ins.id]);
                                        } else {
                                          setSelectedInsights(selectedInsights.filter(id => id !== ins.id));
                                        }
                                      }}
                                      className="mt-0.5 accent-brand-gold w-4 h-4 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                      <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="text-[8px] bg-brand-gold/10 text-brand-gold font-black uppercase tracking-widest px-1.5 py-0.5">
                                          {ins.type || "Insight"}
                                        </span>
                                        <span className="text-[9px] text-gray-400">{ins.displayDate}</span>
                                      </div>
                                      <h5 className="text-[12px] font-medium text-brand-blue font-serif group-hover:text-brand-gold transition-colors">{ins.title}</h5>
                                    </div>
                                  </label>
                                ))}
                                {insightsList.length === 0 && (
                                  <div className="text-[9px] text-gray-400 uppercase tracking-widest text-center py-6">
                                    No published insights found in database.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue/80 mb-2 block">
                                Step 2: Select Properties to Include (Checked items appear as interactive property showcase cards)
                              </label>
                              <div className="bg-white border border-gray-150 p-4 max-h-48 overflow-y-auto space-y-3.5 divide-y divide-gray-50">
                                {propertiesList.map((prop, idx) => (
                                  <label key={prop.id} className={`flex items-start gap-4 pt-3 cursor-pointer group ${idx === 0 ? 'pt-0' : ''}`}>
                                    <input
                                      type="checkbox"
                                      checked={selectedProperties.includes(prop.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedProperties([...selectedProperties, prop.id]);
                                        } else {
                                          setSelectedProperties(selectedProperties.filter(id => id !== prop.id));
                                        }
                                      }}
                                      className="mt-0.5 accent-brand-gold w-4 h-4 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                      <div className="flex justify-between items-baseline mb-0.5">
                                        <span className="text-[8px] bg-brand-gold/10 text-brand-gold font-black uppercase tracking-widest px-1.5 py-0.5 font-bold">
                                          {prop.type || "Property"} • {prop.location || "UAE"}
                                        </span>
                                        {prop.startingPrice && (
                                          <span className="text-[9px] text-brand-gold font-bold">{prop.startingPrice}</span>
                                        )}
                                      </div>
                                      <h5 className="text-[12px] font-medium text-brand-blue font-serif group-hover:text-brand-gold transition-colors">{prop.name}</h5>
                                      {prop.expectedYield && (
                                        <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">
                                          Expected Net Yield: <span className="text-gray-700 font-bold">{prop.expectedYield}</span>
                                        </p>
                                      )}
                                    </div>
                                  </label>
                                ))}
                                {propertiesList.length === 0 && (
                                  <div className="text-[9px] text-gray-400 uppercase tracking-widest text-center py-6">
                                    No published properties found in database.
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue/80 mb-2 block">
                                Step 3: Custom Introductory Remarks (Optional - prepended to e-mail body)
                              </label>
                              <textarea
                                value={customRemarks}
                                onChange={(e) => setCustomRemarks(e.target.value)}
                                rows={3}
                                placeholder="e.g., Dear Client, this week we examine cross-border capital flows realignments and high-yield real estate corridors in Dubai..."
                                className="w-full bg-white border border-gray-200 px-4 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold resize-none focus:outline-none placeholder:text-gray-300 font-light"
                              />
                            </div>
                          </div>
                        )}

                        {autoMode === 'ai_brief' && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue/80 mb-2 block">
                                Step 1: AI Prompt / Directive (What should the briefing analyze?)
                              </label>
                              <textarea
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                rows={4}
                                placeholder="e.g., An intelligence synthesis exploring Dubai Business Bay commercial office yields versus residential investment realignments in Q3."
                                className="w-full bg-white border border-gray-200 px-4 py-3 text-brand-blue text-xs focus:ring-1 focus:ring-brand-gold resize-none focus:outline-none placeholder:text-gray-300 font-light"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue/80 mb-2 block">
                                  Step 2: Brand/Editorial Preset Tone
                                </label>
                                <select
                                  value={aiTone}
                                  onChange={(e: any) => setAiTone(e.target.value)}
                                  className="w-full bg-white border border-gray-200 px-4 py-2.5 text-xs text-brand-blue focus:ring-1 focus:ring-brand-gold focus:outline-none"
                                >
                                  <option value="univue">Academic Elite (Univue Advisory style)</option>
                                  <option value="dr">Deeply Analytical Editorial (DR style)</option>
                                  <option value="tv2">High-Intensity Direct (TV2 style)</option>
                                </select>
                              </div>
                              <div className="flex flex-col justify-end">
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue/80 mb-1.5 block">
                                  Editorial Context References
                                </label>
                                <p className="text-[9px] text-gray-400 font-light leading-relaxed italic">
                                  Select real database insights and premium assets to enrich the AI memorandum draft.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue mb-2 block">
                                  Step 3: Select Publications Background Context
                                </label>
                                <div className="bg-white border border-gray-150 p-4 max-h-48 overflow-y-auto space-y-3.5 divide-y divide-gray-50">
                                  {insightsList.map((ins, idx) => (
                                    <label key={ins.id} className={`flex items-start gap-4 pt-3 cursor-pointer group ${idx === 0 ? 'pt-0' : ''}`}>
                                      <input
                                        type="checkbox"
                                        checked={selectedInsights.includes(ins.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedInsights([...selectedInsights, ins.id]);
                                          } else {
                                            setSelectedInsights(selectedInsights.filter(id => id !== ins.id));
                                          }
                                        }}
                                        className="mt-0.5 accent-brand-gold w-4 h-4 cursor-pointer"
                                      />
                                      <div className="flex-1">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                          <span className="text-[8px] bg-brand-gold/10 text-brand-gold font-bold uppercase tracking-widest px-1.5 py-0.5">
                                            {ins.type || "Insight"}
                                          </span>
                                          <span className="text-[9px] text-gray-400">{ins.displayDate}</span>
                                        </div>
                                        <h5 className="text-[12px] font-medium text-brand-blue font-serif group-hover:text-brand-gold transition-colors">{ins.title}</h5>
                                      </div>
                                    </label>
                                  ))}
                                  {insightsList.length === 0 && (
                                    <div className="text-[9px] text-gray-400 uppercase tracking-widest text-center py-6">
                                      No published insights found in database.
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="text-[9px] uppercase tracking-widest font-black text-brand-blue mb-2 block">
                                  Step 4: Select Real Estate Catalog Context
                                </label>
                                <div className="bg-white border border-gray-150 p-4 max-h-48 overflow-y-auto space-y-3.5 divide-y divide-gray-50">
                                  {propertiesList.map((prop, idx) => (
                                    <label key={prop.id} className={`flex items-start gap-4 pt-3 cursor-pointer group ${idx === 0 ? 'pt-0' : ''}`}>
                                      <input
                                        type="checkbox"
                                        checked={selectedProperties.includes(prop.id)}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedProperties([...selectedProperties, prop.id]);
                                          } else {
                                            setSelectedProperties(selectedProperties.filter(id => id !== prop.id));
                                          }
                                        }}
                                        className="mt-0.5 accent-brand-gold w-4 h-4 cursor-pointer"
                                      />
                                      <div className="flex-1">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                          <span className="text-[8px] bg-brand-gold/10 text-brand-gold font-bold uppercase tracking-widest px-1.5 py-0.5">
                                            {prop.type || "Property"} • {prop.location || "UAE"}
                                          </span>
                                          {prop.startingPrice && (
                                            <span className="text-[9px] text-brand-gold font-bold">{prop.startingPrice}</span>
                                          )}
                                        </div>
                                        <h5 className="text-[12px] font-medium text-brand-blue font-serif group-hover:text-brand-gold transition-colors">{prop.name}</h5>
                                        {prop.expectedYield && (
                                          <p className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">
                                            Expected Net Yield: <span className="text-gray-700 font-bold">{prop.expectedYield}</span>
                                          </p>
                                        )}
                                      </div>
                                    </label>
                                  ))}
                                  {propertiesList.length === 0 && (
                                    <div className="text-[9px] text-gray-400 uppercase tracking-widest text-center py-6">
                                      No published properties found in database.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {autoMode === 'template' && (
                          <div className="bg-white border border-gray-100 p-4">
                            <p className="text-xs text-brand-blue/70 leading-relaxed font-light mb-2">
                              This mode loads a beautifully responsive envelope styled specifically for the **Univue advisory network**. Perfect if you want to write a completely custom corporate newsletter by hand inside a bulletproof HTML grid.
                            </p>
                          </div>
                        )}

                        {/* Trigger compilation buttons */}
                        <div className="border-t border-gray-150 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                          <label className="flex items-center gap-2.5 cursor-pointer group select-none">
                            <input
                              type="checkbox"
                              checked={autoPreview}
                              onChange={(e) => setAutoPreview(e.target.checked)}
                              className="accent-brand-gold w-4 h-4 cursor-pointer"
                            />
                            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-blue/80 group-hover:text-brand-gold transition-colors">
                              Auto-Launch Public View On Compile
                            </span>
                          </label>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowAutoToolkit(false)}
                              className="px-5 py-3 text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-black transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleCompileNewsletter}
                              disabled={isCompiling}
                              className="bg-brand-gold text-brand-blue px-6 py-3 text-[9px] uppercase tracking-[0.2em] font-black flex items-center justify-center gap-2 hover:bg-brand-blue hover:text-brand-gold transition-all disabled:opacity-50"
                            >
                              {isCompiling ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  Processing compilation...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Compile and Load Draft
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSend} className="space-y-8">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block">
                        Subject Line
                      </label>
                      <input 
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Weekly Intelligence: High-Growth Corridors in Business Bay"
                        className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-sm focus:ring-1 focus:ring-brand-gold"
                        required
                      />
                    </div>

                    <div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3.5 border-b border-gray-100 pb-3">
                        <label className="text-[10px] uppercase tracking-widest font-black text-brand-blue/80">
                          Campaign Deliverable Canvas
                        </label>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setEditorTab('visual')}
                            className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold border transition-all flex items-center gap-1.5 ${
                              editorTab === 'visual'
                                ? 'bg-brand-blue text-brand-gold border-brand-blue'
                                : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-brand-blue'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                            Visual Rich Editor
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditorTab('edit')}
                            className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold border transition-all flex items-center gap-1.5 ${
                              editorTab === 'edit'
                                ? 'bg-brand-blue text-brand-gold border-brand-blue'
                                : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-brand-blue'
                            }`}
                          >
                            <Code className="w-3.5 h-3.5" />
                            Source HTML
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setEditorTab('preview')}
                            className={`px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold border transition-all flex items-center gap-1.5 ${
                              editorTab === 'preview'
                                ? 'bg-brand-blue text-brand-gold border-brand-blue'
                                : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-brand-blue'
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Real-time Preview
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowPreviewModal(true)}
                            className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold border border-brand-gold/40 text-brand-gold hover:bg-brand-gold hover:text-brand-blue transition-all flex items-center gap-1.5"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            Expand Simulator
                          </button>
                        </div>
                      </div>

                      {editorTab === 'visual' ? (
                        <div className="w-full bg-gray-100 border border-gray-200 p-4 rounded-sm flex flex-col gap-3">
                          <style dangerouslySetInnerHTML={{ __html: `
                            .visual-editor-sandbox .container {
                              max-width: 600px;
                              margin: 0 auto;
                              background-color: #ffffff;
                              border: 1px solid #e2e8f0;
                              border-radius: 4px;
                              overflow: hidden;
                              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                              text-align: left;
                            }
                            .visual-editor-sandbox .header {
                              background-color: #ffffff;
                              padding: 40px 30px 25px 30px;
                              text-align: center;
                            }
                            .visual-editor-sandbox .content {
                              padding: 0 30px 30px 30px;
                            }
                            .visual-editor-sandbox .divider {
                              height: 1px;
                              background-color: #e2e8f0;
                              margin: 30px 0;
                            }
                            .visual-editor-sandbox .button {
                              display: inline-block;
                              background-color: #0f1e36;
                              color: #faf8f5 !important;
                              text-decoration: none;
                              padding: 10px 20px;
                              font-size: 10px;
                              font-weight: bold;
                              text-transform: uppercase;
                              letter-spacing: 1.5px;
                              border-radius: 1px;
                              border: 1px solid #d4af37;
                            }
                            .visual-editor-sandbox .footer {
                              background-color: #0a1424;
                              padding: 35px 30px;
                              text-align: center;
                              border-top: 3px solid #d4af37;
                              font-size: 11px;
                              color: #94a3b8;
                            }
                            .visual-editor-sandbox .footer p {
                              margin: 0 0 10px 0;
                              line-height: 1.5;
                            }
                            .visual-editor-sandbox .footer a {
                              color: #d4af37;
                              text-decoration: underline;
                            }
                          `}} />

                          <div className="bg-brand-blue/5 border-l-2 border-brand-gold p-3 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] font-bold text-brand-blue uppercase tracking-wider mb-0.5">Visual Editorial Studio</p>
                              <p className="text-[11.5px] text-brand-blue/80 font-light leading-relaxed">
                                Click directly on any text inside the newsletter mockup below to edit words, headers, numbers, and prices instantly without code. Highlight text to apply custom styles or insert elegant layout elements.
                              </p>
                            </div>
                          </div>

                          <div className="bg-white border border-gray-150 p-2 rounded-sm flex flex-wrap gap-2 items-center justify-between">
                            <div className="flex flex-wrap gap-1.5 items-center divide-x divide-gray-150">
                              <div className="flex gap-0.5 pr-1.5">
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('bold'); }}
                                  title="Bold text"
                                  className="p-1 px-2.5 text-xs font-bold hover:bg-gray-100 text-brand-blue hover:text-brand-gold transition-all rounded-sm border border-transparent"
                                >
                                  B
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('italic'); }}
                                  title="Italic text"
                                  className="p-1 px-2.5 text-xs italic hover:bg-gray-100 text-brand-blue hover:text-brand-gold transition-all rounded-sm border border-transparent"
                                >
                                  I
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('underline'); }}
                                  title="Underline text"
                                  className="p-1 px-2.5 text-xs underline hover:bg-gray-100 text-brand-blue hover:text-brand-gold transition-all rounded-sm border border-transparent"
                                >
                                  U
                                </button>
                              </div>

                              <div className="flex gap-1 px-1.5 items-center">
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('formatBlock', '<h3>'); }}
                                  title="Apply Heading Style"
                                  className="p-1 px-2 text-[9px] uppercase tracking-wider font-extrabold border border-gray-150 hover:bg-gray-50 text-brand-blue hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  Heading
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('formatBlock', '<p>'); }}
                                  title="Apply Paragraph Style"
                                  className="p-1 px-2 text-[9px] uppercase tracking-wider font-extrabold border border-gray-150 hover:bg-gray-50 text-brand-blue hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  Paragraph
                                </button>
                              </div>

                              <div className="flex gap-1 px-1.5 items-center">
                                <span className="text-[8px] text-gray-400 uppercase tracking-widest font-bold">Theme Colors:</span>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('foreColor', '#d4af37'); }}
                                  title="Univue Gold"
                                  className="w-4 h-4 bg-brand-gold border border-brand-gold/50 rounded-sm hover:scale-110 transition-all"
                                />
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('foreColor', '#0f1e36'); }}
                                  title="Sovereign Navy"
                                  className="w-4 h-4 bg-brand-blue border border-white/50 rounded-sm hover:scale-110 transition-all"
                                />
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('foreColor', '#475569'); }}
                                  title="Neutral Slate"
                                  className="w-4 h-4 bg-slate-500 border border-slate-500/50 rounded-sm hover:scale-110 transition-all"
                                />
                              </div>

                              <div className="flex gap-1 px-1.5">
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); insertDivider(); }}
                                  title="Insert gold divider line"
                                  className="p-1 px-2 text-[9px] uppercase tracking-wider font-extrabold text-brand-blue hover:bg-gray-50 hover:text-brand-gold transition-colors rounded-sm border border-gray-150"
                                >
                                  + Divider
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); insertQuote(); }}
                                  title="Insert gold blockquote callout"
                                  className="p-1 px-2 text-[9px] uppercase tracking-wider font-extrabold text-brand-blue hover:bg-gray-50 hover:text-brand-gold transition-colors rounded-sm border border-gray-150"
                                >
                                  + Quote
                                </button>
                              </div>

                              <div className="flex gap-1 px-1.5">
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('insertUnorderedList'); }}
                                  title="Insert Bullet Points"
                                  className="p-1 px-2 text-[9px] uppercase tracking-wider font-extrabold border border-gray-150 hover:bg-gray-50 text-brand-blue hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  • List
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
                                  title="Insert link URL"
                                  className="p-1 px-2 text-[9px] uppercase tracking-wider font-extrabold border border-gray-150 hover:bg-gray-50 text-brand-blue hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  Link
                                </button>
                                <button
                                  type="button"
                                  onMouseDown={(e) => { e.preventDefault(); runCommand('unlink'); }}
                                  title="Remove hyperlink"
                                  className="p-1 px-1.5 text-[9px] hover:bg-gray-100 text-gray-400 rounded-sm"
                                >
                                  Unlink
                                </button>
                              </div>
                            </div>

                            <button
                              type="button"
                              onMouseDown={(e) => { e.preventDefault(); runCommand('removeFormat'); }}
                              className="text-[9px] font-black uppercase tracking-wider text-gray-400 hover:text-brand-blue transition-colors border border-dashed border-gray-250 hover:border-brand-blue px-2 py-1"
                            >
                              Reset Styling
                            </button>
                          </div>

                          <div className="visual-editor-sandbox bg-gray-50 border border-gray-250 p-6 min-h-[450px] overflow-x-auto flex justify-center shadow-inner rounded-sm">
                            <div 
                              ref={editableRef}
                              contentEditable={true}
                              onInput={handleVisualInput}
                              onBlur={handleVisualInput}
                              className="container bg-white border border-gray-300 shadow-md outline-none focus:ring-1 focus:ring-brand-gold p-0 select-text"
                              style={{ minHeight: '600px', width: '600px' }}
                              suppressContentEditableWarning={true}
                            />
                          </div>
                        </div>
                      ) : editorTab === 'edit' ? (
                        <textarea 
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={18}
                          placeholder="Write your newsletter here... (HTML tags supported)"
                          className="w-full bg-gray-50 border-none px-6 py-4 text-brand-blue text-sm font-mono focus:ring-1 focus:ring-brand-gold resize-none focus:outline-none"
                          required
                        />
                      ) : (
                        <div className="w-full bg-gray-100 border border-gray-200 p-4 rounded-sm flex flex-col gap-3">
                          <div className="flex justify-between items-center bg-white p-2.5 border-b border-gray-100 shadow-sm">
                            <span className="text-[10px] text-brand-blue font-bold uppercase tracking-widest">Rendering Sandbox</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewScreenSize('desktop')}
                                className={`px-2.5 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-wider transition-all ${
                                  previewScreenSize === 'desktop' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                Desktop Envelope (600px)
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewScreenSize('mobile')}
                                className={`px-2.5 py-1.5 rounded-sm text-[8px] font-black uppercase tracking-wider transition-all ${
                                  previewScreenSize === 'mobile' ? 'bg-brand-blue text-white' : 'text-gray-400 hover:bg-gray-50'
                                }`}
                              >
                                Mobile View (375px)
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex justify-center bg-gray-50 p-2 overflow-x-auto min-h-[400px]">
                            <div 
                              className="bg-white border shadow-md transition-all duration-300" 
                              style={{ width: previewScreenSize === 'desktop' ? '600px' : '375px', height: '550px' }}
                            >
                              <iframe
                                srcDoc={getPreviewHTMLBase(content) || "<p style='padding: 20px; font-family: Georgia, serif; font-size: 13.5px; text-align: center; color: #a1a1a1;'>Your compiled content is empty. Choose select modes above and compile to auto-load draft.</p>"}
                                title="Newsletter Real Time Rendering Sandbox"
                                className="w-full h-full border-none bg-white"
                                sandbox="allow-same-origin"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={sending || subscribers.length === 0}
                      className={`w-full py-5 text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 transition-all disabled:opacity-50 ${
                        confirmSend ? 'bg-orange-500 text-white animate-pulse' : 'bg-brand-blue text-brand-ivory hover:bg-brand-gold hover:text-brand-blue'
                      }`}
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Broadcasting...
                        </>
                      ) : confirmSend ? (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          CONFIRM BROADCAST TO {subscribers.length} USERS
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Initiate Distribution
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-brand-blue text-brand-ivory p-8 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <AlertCircle className="w-24 h-24" />
                  </div>
                  <h4 className="text-brand-gold text-[10px] uppercase tracking-widest font-bold mb-4">Distribution Note</h4>
                  <p className="text-sm leading-relaxed text-brand-ivory/60 font-light italic">
                    "Broadcasts are permanent. Please ensure all content is vetted for institutional compliance and accuracy before triggering the distribution cycle."
                  </p>
                </div>

                <div className="bg-white border border-gray-100 p-8">
                  <h4 className="text-brand-blue text-[10px] uppercase tracking-widest font-bold mb-6">Variable Guide</h4>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 text-[10px] text-gray-500 font-mono">
                      {"{{name}}"} - User Display Name
                    </div>
                    <div className="p-3 bg-gray-50 text-[10px] text-gray-500 font-mono">
                      {"{{unsub}}"} - Unsubscribe URL
                    </div>
                  </div>
                  <p className="mt-6 text-[9px] text-gray-400 uppercase tracking-widest font-medium">
                    Note: Global variables pending full integration.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Date Sent</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Subject</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Recipients</th>
                    <th className="px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6 text-xs text-gray-500">
                        {log.sentAt?.toDate ? log.sentAt.toDate().toLocaleDateString() : 'Pending'}
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-serif text-brand-blue font-medium group-hover:text-brand-gold transition-colors">{log.subject}</div>
                      </td>
                      <td className="px-8 py-6 text-xs text-gray-400">
                        {log.recipientCount} Users
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 text-[8px] font-bold uppercase tracking-widest">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Delivered
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        No campaign history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscribers.map((sub) => (
                <div key={sub.id} className="bg-white border border-gray-100 p-6 flex items-center gap-4 shadow-sm">
                  <img 
                    src={sub.photoURL} 
                    alt={sub.displayName}
                    className="w-12 h-12 rounded-full border border-gray-100"
                  />
                  <div>
                    <div className="text-sm font-serif text-brand-blue">{sub.displayName}</div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" />
                      {sub.email}
                    </div>
                  </div>
                </div>
              ))}
              {subscribers.length === 0 && (
                <div className="col-span-full py-20 text-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  No active subscribers.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 📬 FULL SCREEN HIGH FIDELITY MAIL INBOX INFRASTRUCTURE SIMULATOR */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-brand-blue/90 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-brand-gold/30"
          >
            {/* Simulator Master Heading Bar */}
            <div className="bg-brand-blue text-brand-ivory px-6 py-4 flex justify-between items-center border-b border-brand-gold/20">
              <div className="flex items-center gap-3">
                <div className="p-1 px-2.5 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-[9px] uppercase tracking-widest font-black rounded-sm">
                  Univue Mail Simulator
                </div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-gray-200">
                  Broadcasting Real-time Desktop & Mobile Render
                </h4>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5 bg-brand-blue/60 p-1 border border-brand-gold/10">
                  <button
                    type="button"
                    onClick={() => setPreviewScreenSize('desktop')}
                    className={`px-3 py-1.5 text-[8px] uppercase tracking-wider font-extrabold transition-all ${
                      previewScreenSize === 'desktop' ? 'bg-brand-gold text-brand-blue' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Desktop Layout
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewScreenSize('mobile')}
                    className={`px-3 py-1.5 text-[8px] uppercase tracking-wider font-extrabold transition-all ${
                      previewScreenSize === 'mobile' ? 'bg-brand-gold text-brand-blue' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Mobile Viewport
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors"
                >
                  Close Simulator
                </button>
              </div>
            </div>

            {/* Corporate Email Client Header Info */}
            <div className="bg-gray-50 border-b border-gray-100 p-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="mb-2"><span className="text-gray-400 font-bold uppercase tracking-wider mr-2 text-[10px]">From:</span> <span className="font-serif text-brand-blue font-bold">Univue Intelligence Advisory &lt;broadcaster@univue.assets&gt;</span></div>
                  <div><span className="text-gray-400 font-bold uppercase tracking-wider mr-2 text-[10px]">To:</span> <span className="text-gray-600 font-light">Subscribed Asset Client Portal Recipients ({subscribers.length} Vetted Partners)</span></div>
                </div>
                <div>
                  <div className="mb-2 truncate"><span className="text-gray-400 font-bold uppercase tracking-wider mr-2 text-[10px]">Subject:</span> <span className="font-bold text-brand-blue font-serif text-sm">{subject || "(No Subject Configured)"}</span></div>
                  <div><span className="text-gray-400 font-bold uppercase tracking-wider mr-2 text-[10px]">Delivery Format:</span> <span className="bg-green-100 text-green-800 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">HTML Mime Sandbox</span></div>
                </div>
              </div>
            </div>

            {/* Simulator Enclosed Viewport Frame */}
            <div className="flex-1 bg-gray-100 p-6 flex justify-center items-center overflow-hidden">
              <div 
                className="bg-white border border-gray-300 shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
                style={{ width: previewScreenSize === 'desktop' ? '100%' : '375px', maxWidth: '650px' }}
              >
                <iframe
                  srcDoc={getPreviewHTMLBase(content) || "<p style='padding: 40px; font-family: sans-serif; text-align: center; color: #a1a1a1; font-size: 13px;'>No compiled content to display. Select publications and assets above and click 'Compile and Load Draft' to load visual rendering.</p>"}
                  title="Full Broadcast Sandbox Simulator"
                  className="w-full flex-1 border-none bg-white font-serif"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

            {/* Simulator Footer Action Panel */}
            <div className="bg-gray-50 border-t border-gray-150 p-4 px-6 flex justify-between items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest font-mono">Status: Awaiting administrative clearance...</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="px-5 py-2.5 bg-brand-blue text-brand-ivory hover:bg-[#a37f22] bg-brand-gold hover:text-brand-blue transition-all uppercase tracking-widest text-[9px] font-bold"
                >
                  Confirm & Review Source HTML
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    setEditorTab('edit');
                  }}
                  className="px-5 py-2.5 border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition-all uppercase tracking-widest text-[9px] font-black"
                >
                  Modify Content
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

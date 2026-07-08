import { useEffect } from 'react';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: string;
  ogImage?: string;
}

export const useDocumentMetadata = ({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = '/og-image.jpg'
}: MetadataProps) => {
  useEffect(() => {
    // 1. Update Document Title
    const baseTitle = 'Univue Consultants';
    const fullTitle = title 
      ? `${title} | ${baseTitle}` 
      : `${baseTitle} | Dubai Investment & India Expansion Advisory`;
    document.title = fullTitle;

    // Helper to get or create meta tag
    const setMetaTag = (attribute: string, attrValue: string, contentValue: string) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // 2. Update Description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('property', 'twitter:description', description);
    } else {
      // fallback to default description
      const defaultDesc = 'Turnkey international cross-border advisory firm specializing in Dubai investment and India operational expansion for European clients.';
      setMetaTag('name', 'description', defaultDesc);
      setMetaTag('property', 'og:description', defaultDesc);
      setMetaTag('property', 'twitter:description', defaultDesc);
    }

    // 3. Update Keywords
    if (keywords) {
      setMetaTag('name', 'keywords', keywords);
    } else {
      const defaultKeywords = 'Dubai investment, India business expansion, cross-border advisory, turnkey investment solutions, European business consulting, Univue Consultants, international advisory';
      setMetaTag('name', 'keywords', defaultKeywords);
    }

    // 4. Update Open Graph and Twitter Titles
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'twitter:title', fullTitle);

    // 5. Update Type & Image
    setMetaTag('property', 'og:type', ogType);
    if (ogImage) {
      // If it's a relative URL or starts with http, use it directly
      const finalImage = ogImage.startsWith('http') || ogImage.startsWith('/')
        ? ogImage
        : `/${ogImage}`;
      setMetaTag('property', 'og:image', finalImage);
      setMetaTag('property', 'twitter:image', finalImage);
    }
  }, [title, description, keywords, ogType, ogImage]);
};

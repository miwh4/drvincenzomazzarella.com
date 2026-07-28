import React from 'react';
import { useSiteContent } from '../siteContent';

interface LogoProps {
  className?: string;
  forgeId?: string;
}

const imageUrlFromCssBackground = (value: unknown) => {
  const background = String(value || '').trim();
  if (!background || background === 'none') return '';
  return background.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
};

const classNameWithoutFixedSize = (value: string) =>
  value
    .split(/\s+/)
    .filter((token) => token && !/^w-/.test(token) && !/^h-/.test(token))
    .join(' ');

const logoBounds = (forgeId?: string) => {
  if (forgeId?.includes('footer')) return { maxWidth: '140px', maxHeight: '38px', minWidth: '36px' };
  if (forgeId?.includes('mobile')) return { maxWidth: '92px', maxHeight: '30px', minWidth: '28px' };
  return { maxWidth: '96px', maxHeight: '34px', minWidth: '32px' };
};

export default function Logo({ className = "w-8 h-8", forgeId }: LogoProps) {
  const { customMedia, customStyles, isContentLoaded } = useSiteContent();
  const styledReplacementSrc = forgeId ? imageUrlFromCssBackground(customStyles?.[forgeId]?.backgroundImage) : '';
  const replacementSrc = forgeId ? customMedia?.[forgeId] || styledReplacementSrc : '';

  if (replacementSrc) {
    const bounds = logoBounds(forgeId);
    return (
      <img
        data-forge-id={forgeId}
        src={replacementSrc}
        alt="Logo"
        className={classNameWithoutFixedSize(className)}
        decoding="sync"
        loading="eager"
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: bounds.maxWidth,
          maxHeight: bounds.maxHeight,
          minWidth: bounds.minWidth,
          flexShrink: 0,
          objectFit: 'contain',
        }}
      />
    );
  }

  if (forgeId && forgeId.includes('logo') && !isContentLoaded) {
    const bounds = logoBounds(forgeId);
    return (
      <span
        data-forge-id={forgeId}
        className={classNameWithoutFixedSize(className)}
        style={{
          display: 'inline-block',
          width: bounds.minWidth,
          height: bounds.maxHeight,
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <svg
      data-forge-id={forgeId}
      viewBox="0 0 1000 680"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 
        The geometric monogram MV designed with pristine high-fidelity vectors:
        - Shape 1: Central V-shape with horizontal top endings
        - Shape 2 & 3: Top-left and top-right diagonal bars parallel to the center V outer edges, sliced at the opposite angle
        - Shape 4 & 5: Bottom-left and bottom-right foot shapes with vertical outer/inner boundaries and opposite-angle diagonal cuts
      */}
      
      {/* Central V Shape */}
      <polygon
        points="260,0 370,0 500,340 630,0 740,0 500,680"
        fill="currentColor"
      />
      
      {/* Top Left Wing (Left Pillar) */}
      <polygon
        points="0,0 180,0 180,250 0,450"
        fill="currentColor"
      />
      
      {/* Bottom Left Foot (Left Pillar) */}
      <polygon
        points="0,510 180,310 180,680 0,680"
        fill="currentColor"
      />
      
      {/* Top Right Wing (Right Pillar) */}
      <polygon
        points="1000,0 820,0 820,250 1000,450"
        fill="currentColor"
      />
      
      {/* Bottom Right Foot (Right Pillar) */}
      <polygon
        points="820,310 1000,510 1000,680 820,680"
        fill="currentColor"
      />
    </svg>
  );
}

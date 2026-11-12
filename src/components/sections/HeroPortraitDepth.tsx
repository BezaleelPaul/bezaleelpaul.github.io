'use client';

import React from 'react';

/**
 * Static portrait treatment.
 * The pointer-driven 3D distortion was removed to keep the face natural
 * across hover devices and prevent visual tearing at different scales.
 */
export const HeroPortraitDepth: React.FC = () => (
  <div className="hero-portrait-depth" aria-hidden="true">
    <div className="hero-portrait-depth__image" />
    <div className="hero-portrait-depth__shade" />
    <div className="hero-portrait-depth__light" />
    <span className="hero-portrait-depth__label">BUILDER / BENGALURU</span>
  </div>
);

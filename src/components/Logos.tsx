/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import schoolLogoImg from '../assets/images/school_logo_1783165007211.jpg';
import vidyaBharatiLogoImg from '../assets/images/vidya_bharati_logo_1783165030333.jpg';

export const SchoolLogo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <img 
      src={schoolLogoImg} 
      className={`${className} object-contain rounded-full`} 
      alt="PKLJSVM School Logo" 
      referrerPolicy="no-referrer"
    />
  );
};

export const VidyaBharatiLogo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <img 
      src={vidyaBharatiLogoImg} 
      className={`${className} object-contain`} 
      alt="Vidya Bharati Logo" 
      referrerPolicy="no-referrer"
    />
  );
};

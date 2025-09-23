'use client';

import { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  speed?: number;
  pauseTime?: number;
}

export function TypewriterEffect({ 
  words, 
  className = '', 
  speed = 100, 
  pauseTime = 2000 
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (isWaiting) {
      const waitTimer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(waitTimer);
    }

    const targetWord = words[currentWordIndex];
    
    if (!isDeleting && currentText === targetWord) {
      setIsWaiting(true);
      return;
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(targetWord.substring(0, currentText.length + 1));
      } else {
        setCurrentText(targetWord.substring(0, currentText.length - 1));
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [currentText, currentWordIndex, isDeleting, isWaiting, words, speed, pauseTime]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
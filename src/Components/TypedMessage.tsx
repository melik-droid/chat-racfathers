import React, { useState, useEffect } from 'react';

interface TypedMessageProps {
  text: string;
  isLatest: boolean;
}

const TypedMessage: React.FC<TypedMessageProps> = ({ text, isLatest }) => {
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    if (!isLatest) return;
    
    setDisplayedText("");
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 15);

    return () => clearInterval(typingInterval);
  }, [text, isLatest]);

  return <span>{displayedText}</span>;
};

export default TypedMessage; 
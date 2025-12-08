import { useState } from "react";

const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyCurrentUrl = () => {
    copyToClipboard(window.location.href);
  };

  return {
    isCopied,
    copyCurrentUrl,
    copyToClipboard,
  };
};

export default useCopyToClipboard;

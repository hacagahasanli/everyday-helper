export const useDownloadFile = ({
  errorMessage = 'Endirmə uğursuz oldu.',
}: {
  errorMessage: string;
}) => {
  const downloadImage = async (src: string, filename: string) => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert(errorMessage);
    }
  };

  return { downloadImage };
};

import React from 'react';
import { Button } from "@/components/ui/button"

const DownloadButton = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download'); // Replace with your API endpoint

      if (response.ok) {
        const blob = await response.blob();

        // Create a link element and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bookHighlights.zip'; // Specify the desired file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to download file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Button onClick={handleDownload} variant={'outline'}>
      Download File
    </Button>
  );
};

export default DownloadButton;

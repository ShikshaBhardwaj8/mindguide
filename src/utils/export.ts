import jsPDF from 'jspdf';
import { MoodLog } from '../types';

export const exportToCSV = (data: MoodLog[], filename: string) => {
  const headers = ['Date', 'Mood', 'Activity'];
  const rows = data.map(log => [
    log.date,
    log.mood.toString(),
    log.activity || 'N/A',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: MoodLog[], filename: string) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('MindGuide - Mood Log Report', 20, 20);

  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  let yPosition = 50;
  doc.setFontSize(10);

  data.forEach((log) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    const moodEmoji = ['😢', '😕', '😐', '🙂', '😊'][log.mood - 1] || '😐';
    doc.text(
      `${log.date} - Mood: ${moodEmoji} (${log.mood}/5) - Activity: ${log.activity || 'N/A'}`,
      20,
      yPosition
    );

    yPosition += 10;
  });

  doc.save(filename);
};

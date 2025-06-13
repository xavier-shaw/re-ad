import React from 'react';
import { useReadingAnalytics } from '../contexts/ReadingAnalyticsContext';
import { Box, Typography, Paper } from '@mui/material';

const formatTime = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
};

// Add prop type for readRecords
interface ReadingAnalyticsProps {
  readRecords: Record<string, { id: string; title: string; color: string }>;
}

export const ReadingAnalytics: React.FC<ReadingAnalyticsProps> = ({ readRecords }) => {
  const {
    analytics,
    getCategoryStats,
    getTotalReadingTime,
    getMostReadCategory,
  } = useReadingAnalytics();

  const mostReadCategory = getMostReadCategory();
  const totalTime = getTotalReadingTime();

  return (
    <Box sx={{ p: 2.5, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h4" sx={{ mb: 2.5, color: 'text.primary' }}>
        Reading Analytics
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 2.5,
        mb: 3.75
      }}>
        <Paper sx={{ p: 2, bgcolor: 'black', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 1.25, color: 'white' }}>
            Total Reading Time
          </Typography>
          <Typography variant="h5" sx={{ color: 'white' }}>
            {formatTime(totalTime)}
          </Typography>
        </Paper>

        {mostReadCategory && readRecords[mostReadCategory] && (
          <Paper sx={{ p: 2, bgcolor: 'black', color: 'white' }}>
            <Typography variant="h6" sx={{ mb: 1.25, color: 'white' }}>
              Most Read Category
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {readRecords[mostReadCategory].title}
            </Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              Time: {formatTime(getCategoryStats(mostReadCategory)?.totalTimeSpent || 0)}
            </Typography>
          </Paper>
        )}
      </Box>

      <Box sx={{ mt: 3.75 }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
          Category Breakdown
        </Typography>
        {Object.keys(readRecords).map((categoryId) => {
          const stats = analytics.categories[categoryId];
          if (!stats) return null;
          return (
            <Paper 
              key={categoryId} 
              sx={{ 
                p: 2, 
                mb: 2, 
                bgcolor: 'black', 
                color: 'white',
                '&:last-child': { mb: 0 }
              }}
            >
              <Typography variant="h6" sx={{ mb: 1.25, color: 'white' }}>
                {readRecords[categoryId].title}
              </Typography>
              <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 0.625,
                  color: 'white'
                }}>
                  Total Time: {formatTime(stats.totalTimeSpent)}
                </Box>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 0.625,
                  color: 'white'
                }}>
                  Highlights: {stats.highlightCount}
                </Box>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 0.625,
                  color: 'white'
                }}>
                  Image Highlights: {stats.imageHighlightCount}
                </Box>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 0.625,
                  color: 'white'
                }}>
                  Text Highlights: {stats.textHighlightCount}
                </Box>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  color: 'white'
                }}>
                  Last Read: {new Date(stats.lastRead).toLocaleDateString()}
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}; 
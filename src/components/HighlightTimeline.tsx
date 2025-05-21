import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter } from 'recharts';
import { PaperContext } from '../contexts/PaperContext';
import { useContext } from 'react';
import { Box, Typography } from '@mui/material';

export const HighlightTimeline: React.FC = () => {
    const paperContext = useContext(PaperContext);
    if (!paperContext) {
        throw new Error("PaperContext not found");
    }
    const { highlights, readRecords } = paperContext;

    // Add debugging
    console.log('Highlights:', highlights);
    console.log('ReadRecords:', readRecords);

    // Transform highlights data for the chart
    const chartData = highlights.map(highlight => {
        console.log('Processing highlight:', highlight);  // Add debugging
        return {
            timestamp: new Date(highlight.timestamp).toLocaleTimeString(),
            pageNumber: highlight.position.boundingRect.pageNumber,
            type: highlight.type,
            readType: readRecords[highlight.readRecordId].title,
            color: readRecords[highlight.readRecordId].color
        };
    });

    console.log('Chart Data:', chartData);  // Add debugging

    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
                Highlight Timeline
            </Typography>
            <LineChart width={800} height={400} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="timestamp" 
                    label={{ value: 'Time', position: 'bottom' }} 
                />
                <YAxis 
                    dataKey="pageNumber" 
                    label={{ value: 'Page Number', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip />
                <Legend />
                {Object.keys(readRecords).map(readId => (
                    <Scatter
                        key={readId}
                        data={chartData.filter(d => d.readType === readRecords[readId].title)}
                        dataKey="pageNumber"
                        name={readRecords[readId].title}
                        fill={readRecords[readId].color}
                    />
                ))}
            </LineChart>
        </Box>
    );
}; 
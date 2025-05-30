import React, { useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, Scatter } from 'recharts';
import { PaperContext } from '../contexts/PaperContext';
import { Box, Typography, IconButton } from '@mui/material';
import { CloudDownload, CloudUpload } from "@mui/icons-material";
import Tooltip from '@mui/material/Tooltip';
import { exportGraph, importGraph } from '../utils/graphIO';

export const HighlightTimeline: React.FC = () => {
    const paperContext = useContext(PaperContext);
    if (!paperContext) {
        throw new Error("PaperContext not found");
    }
    const { highlights, readRecords, nodes, edges, setHighlights, setNodes, setEdges, setReadRecords } = paperContext;

    // Add debugging
    console.log('Highlights:', highlights);
    console.log('ReadRecords:', readRecords);

    // Transform highlights data for the chart
    const chartData = highlights.map(highlight => {
        console.log('Processing highlight:', highlight);  // Add debugging
        return {
            timestamp: new Date(highlight.timestamp).toLocaleTimeString(),
            pageNumber: highlight.position.boundingRect.pageNumber,
            relativeY: highlight.position.boundingRect.y1, // Add relative y-coordinate
            absoluteY: ((highlight.position.boundingRect.pageNumber-1)*1200 + highlight.position.boundingRect.y1)/1200,
            type: highlight.type,
            readType: readRecords[highlight.readRecordId].title,
            color: readRecords[highlight.readRecordId].color
        };
    });

    console.log('Chart Data:', chartData);  // Add debugging

    const handleExportGraph = () => {
        exportGraph({
            highlights,
            nodes,
            edges,
            readRecords,
        });
    };

    const handleImportGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importGraph(file, setGraphState);
        }
    };

    const setGraphState = (data: any) => {
        setHighlights(data.highlights || []);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        setReadRecords(data.readRecords || {});
    };

    return (
        <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
                Highlight Timeline
            </Typography>
            <LineChart width={800} height={400} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="timestamp"
                    label={{ value: 'Time', position: 'insideTop' }}
                    orientation="top"
                />
                <YAxis
                    dataKey="absoluteY"
                    label={{ value: 'Absolute Y Position', angle: -90, position: 'insideLeft' }}
                    reversed={true}
                />
                <RechartsTooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="absoluteY"
                    stroke="black"
                    dot={{ stroke: 'black', fill: 'black' }}
                />
            </LineChart>
            <Box sx={{ mx: 2, display: 'flex', gap: 1 }}>
                <Tooltip title="Export Graph">
                    <IconButton onClick={handleExportGraph}>
                        <CloudDownload />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Import Graph">
                    <IconButton component="label">
                        <CloudUpload />
                        <input type="file" accept="application/json" hidden onChange={handleImportGraph} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}; 
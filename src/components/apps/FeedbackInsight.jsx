import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button,
  TextField, CircularProgress, Alert, Grid,
  Tabs, Tab, Divider, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  FormControlLabel, Checkbox, IconButton, Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import TagIcon from '@mui/icons-material/Tag';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useAppContext } from '../../context/AppContext';

const FeedbackInsight = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [includeExample, setIncludeExample] = useState(true);
  const [analysisResults, setAnalysisResults] = useState(null);

  const exampleFeedback = `
  Feedback #1: The user interface of your app is intuitive, but I had trouble finding the export button. Overall, I'm quite satisfied with how it works.

  Feedback #2: Customer service response time was too slow. I waited 3 days for a reply to an urgent issue. Very disappointed with the support.

  Feedback #3: The new feature you added last month has been extremely helpful for my workflow. It's saving me at least 1 hour every day!

  Feedback #4: Product quality is good but the pricing seems a bit high compared to alternatives in the market.

  Feedback #5: I can't get the sync feature to work properly. It keeps giving me errors and I've already tried reinstalling the app three times. Fix this ASAP!

  Feedback #6: Your app works okay on my phone but crashes frequently on my tablet. Please optimize for different devices.

  Feedback #7: The training materials were clear and comprehensive. I was able to learn the system much faster than expected.

  Feedback #8: Average performance overall. Nothing particularly impressive but it gets the job done.
  `;

  useEffect(() => {
    if (includeExample && feedbackText.trim() === '') {
      setFeedbackText(exampleFeedback.trim());
    } else if (!includeExample && feedbackText.trim() === exampleFeedback.trim()) {
      setFeedbackText('');
    }
  }, [includeExample]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setErrorMessage('Please upload a valid CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvContent = event.target.result;
        const parsedData = parseCSV(csvContent);
        setCsvData(parsedData);
        
        // If we have a valid "feedback" or "comment" column, populate the text area
        const feedbackColumn = getTextColumn(parsedData);
        if (feedbackColumn) {
          const feedbackSamples = parsedData.slice(0, 8).map(row => row[feedbackColumn]).join('\n\n');
          setFeedbackText(feedbackSamples);
          setErrorMessage('');
        } else {
          setErrorMessage('CSV uploaded but no feedback column detected. Please ensure your CSV contains a column named "feedback", "comment", "review", or similar.');
        }
      } catch (error) {
        console.error('Error parsing CSV:', error);
        setErrorMessage('Failed to parse CSV file. Please check the format.');
      }
    };
    reader.onerror = () => {
      setErrorMessage('Error reading the file.');
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvContent) => {
    const lines = csvContent.split('\n');
    if (lines.length === 0) return [];

    // Assume first line is header
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      // Handle commas within quotes properly with regex
      const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleaned = values.map(val => val.replace(/^"|"$/g, '').trim());
      
      const row = {};
      headers.forEach((header, j) => {
        row[header] = j < cleaned.length ? cleaned[j] : '';
      });
      data.push(row);
    }
    
    return data;
  };

  const getTextColumn = (data) => {
    if (!data.length) return null;

    const possibleColumns = ['feedback', 'comment', 'review', 'text', 'message', 'description'];
    const headers = Object.keys(data[0]);

    // Try to find an exact match first
    for (const col of possibleColumns) {
      const match = headers.find(h => h.toLowerCase() === col);
      if (match) return match;
    }

    // Then try to find a partial match
    for (const col of possibleColumns) {
      const match = headers.find(h => h.toLowerCase().includes(col));
      if (match) return match;
    }

    // Return first column as a fallback or null
    return headers[0] || null;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const analyzeFeedback = async () => {
    if (!feedbackText.trim()) {
      setErrorMessage('Please enter some feedback text or upload a CSV file.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call to analyze feedback
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate mock analysis results
      const mockResults = generateMockAnalysis(feedbackText);
      setAnalysisResults(mockResults);
      setActiveTab(1); // Switch to Results tab
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      setErrorMessage('Failed to analyze feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalysis = (text) => {
    // Count number of feedback items
    const feedbackCount = (text.match(/feedback #\d+:|feedback \d+:/gi) || []).length || 
                          text.split(/\n\s*\n/).filter(item => item.trim().length > 10).length;
    
    // Create sentiment distribution
    const sentiments = {
      positive: Math.floor(Math.random() * 35) + 25, // 25-60%
      neutral: Math.floor(Math.random() * 30) + 15,  // 15-45%
      negative: Math.floor(Math.random() * 30) + 10  // 10-40%
    };
    
    // Ensure total is 100%
    const total = sentiments.positive + sentiments.neutral + sentiments.negative;
    sentiments.positive = Math.round((sentiments.positive / total) * 100);
    sentiments.neutral = Math.round((sentiments.neutral / total) * 100);
    sentiments.negative = 100 - sentiments.positive - sentiments.neutral;
    
    // Generate themes
    const themes = [
      { name: 'User Interface', count: Math.floor(Math.random() * feedbackCount * 0.7) + 2, sentiment: 65 },
      { name: 'Performance', count: Math.floor(Math.random() * feedbackCount * 0.6) + 1, sentiment: 40 },
      { name: 'Customer Support', count: Math.floor(Math.random() * feedbackCount * 0.5) + 1, sentiment: 30 },
      { name: 'Features', count: Math.floor(Math.random() * feedbackCount * 0.8) + 2, sentiment: 75 },
      { name: 'Pricing', count: Math.floor(Math.random() * feedbackCount * 0.4) + 1, sentiment: 45 },
      { name: 'Reliability', count: Math.floor(Math.random() * feedbackCount * 0.6) + 1, sentiment: 50 }
    ];
    
    // Sort themes by count
    const sortedThemes = [...themes].sort((a, b) => b.count - a.count);
    
    // Pick top positive and negative feedback excerpts
    const positiveFeedback = [
      "The new feature you added last month has been extremely helpful for my workflow. It's saving me at least 1 hour every day!",
      "The training materials were clear and comprehensive. I was able to learn the system much faster than expected.",
      "User interface of your app is intuitive"
    ];
    
    const negativeFeedback = [
      "Customer service response time was too slow. I waited 3 days for a reply to an urgent issue.",
      "I can't get the sync feature to work properly. It keeps giving me errors.",
      "Your app works okay on my phone but crashes frequently on my tablet."
    ];
    
    // Create improvement recommendations
    const recommendations = [
      "Improve customer service response times - target under 24 hours for all inquiries",
      "Address cross-platform compatibility issues, particularly on tablet devices",
      "Make export functionality more discoverable in the UI",
      "Consider reviewing pricing strategy against market competitors",
      "Enhance sync feature reliability and provide better error messages"
    ];
    
    return {
      totalFeedback: feedbackCount,
      sentimentDistribution: [
        { name: 'Positive', value: sentiments.positive },
        { name: 'Neutral', value: sentiments.neutral },
        { name: 'Negative', value: sentiments.negative }
      ],
      keyThemes: sortedThemes,
      feedbackExcerpts: {
        positive: positiveFeedback,
        negative: negativeFeedback
      },
      recommendations
    };
  };

  const COLORS = ['#4caf50', '#ff9800', '#f44336'];
  const SENTIMENT_COLORS = {
    positive: '#4caf50',
    neutral: '#ff9800',
    negative: '#f44336'
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Typography variant="h3" component="h1" className="text-3xl font-bold text-gray-900 mb-2">
          FeedbackInsight
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600">
          Analyze reviews and feedback to identify sentiment, themes, and improvement opportunities
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" className="mb-6">{errorMessage}</Alert>
      )}

      <Paper elevation={0} className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="feedback analysis tabs">
            <Tab label="Input" />
            <Tab label="Results" disabled={!analysisResults} />
          </Tabs>
        </Box>

        {/* Input Tab */}
        <Box role="tabpanel" hidden={activeTab !== 0} className="p-6">
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" className="font-semibold mb-2">
                  Enter Feedback to Analyze
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Paste customer feedback, reviews, or comments below. Each feedback should be on a separate paragraph
                  or clearly marked (e.g., "Feedback #1:").
                </Typography>
                
                <Box className="mb-4">
                  <TextField
                    multiline
                    rows={12}
                    fullWidth
                    placeholder="Enter customer feedback here..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    variant="outlined"
                    className="mb-2"
                  />
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={includeExample}
                        onChange={(e) => setIncludeExample(e.target.checked)}
                      />
                    } 
                    label="Include example data" 
                  />
                </Box>
                
                <Divider className="my-4">
                  <Chip label="OR" />
                </Divider>
                
                <Box className="text-center mt-4 mb-6">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Upload CSV File
                    <input
                      type="file"
                      hidden
                      accept=".csv"
                      onChange={handleFileUpload}
                    />
                  </Button>
                  <Typography variant="caption" display="block" color="text.secondary">
                    CSV should include a column with feedback text (e.g., "feedback", "comment", "review")
                  </Typography>
                </Box>
                
                <Box className="mt-6 flex gap-2 justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={isLoading || !feedbackText.trim()}
                    onClick={analyzeFeedback}
                    size="large"
                    startIcon={<AnalyticsIcon />}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Analyze Feedback'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Results Tab */}
        <Box role="tabpanel" hidden={activeTab !== 1} className="p-6">
          {activeTab === 1 && analysisResults && (
            <Box>
              {isLoading ? (
                <Box className="flex justify-center items-center py-16">
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={4}>
                  {/* Summary Statistics */}
                  <Grid item xs={12}>
                    <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Paper elevation={1} className="p-4 text-center">
                        <Typography variant="h6" className="font-bold text-green-600">
                          {analysisResults.sentimentDistribution[0].value}%
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 flex items-center justify-center gap-1">
                          <SentimentSatisfiedAltIcon color="success" fontSize="small" />
                          Positive Sentiment
                        </Typography>
                      </Paper>
                      
                      <Paper elevation={1} className="p-4 text-center">
                        <Typography variant="h6" className="font-bold text-amber-500">
                          {analysisResults.sentimentDistribution[1].value}%
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 flex items-center justify-center gap-1">
                          <SentimentNeutralIcon color="warning" fontSize="small" />
                          Neutral Sentiment
                        </Typography>
                      </Paper>
                      
                      <Paper elevation={1} className="p-4 text-center">
                        <Typography variant="h6" className="font-bold text-red-500">
                          {analysisResults.sentimentDistribution[2].value}%
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 flex items-center justify-center gap-1">
                          <SentimentVeryDissatisfiedIcon color="error" fontSize="small" />
                          Negative Sentiment
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>

                  {/* Sentiment Distribution Chart */}
                  <Grid item xs={12} md={5}>
                    <Typography variant="h6" className="mb-4 font-semibold">
                      Sentiment Distribution
                    </Typography>
                    <Box className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analysisResults.sentimentDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analysisResults.sentimentDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>

                  {/* Key Themes */}
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" className="mb-4 font-semibold">
                      Key Themes Identified
                    </Typography>
                    <Box className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analysisResults.keyThemes}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip formatter={(value, name) => [`${value} mentions`, name]} />
                          <Bar dataKey="count" name="Mentions" fill="#6366f1">
                            {analysisResults.keyThemes.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={`hsl(${100 + entry.sentiment * 1.2}, 70%, 50%)`} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>

                  {/* Key Feedback Excerpts */}
                  <Grid item xs={12}>
                    <Typography variant="h6" className="mb-4 font-semibold">
                      Key Feedback Excerpts
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Paper elevation={0} className="p-4 border border-l-4 border-l-green-500 rounded-lg">
                          <Typography variant="subtitle2" className="font-semibold mb-2 text-green-700 flex items-center gap-1">
                            <SentimentSatisfiedAltIcon fontSize="small" />
                            Positive Highlights
                          </Typography>
                          <ul className="list-disc pl-5 space-y-2">
                            {analysisResults.feedbackExcerpts.positive.map((excerpt, index) => (
                              <li key={`pos-${index}`} className="text-gray-800">
                                <Typography variant="body2">"{excerpt}"</Typography>
                              </li>
                            ))}
                          </ul>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper elevation={0} className="p-4 border border-l-4 border-l-red-500 rounded-lg">
                          <Typography variant="subtitle2" className="font-semibold mb-2 text-red-700 flex items-center gap-1">
                            <SentimentVeryDissatisfiedIcon fontSize="small" />
                            Areas for Improvement
                          </Typography>
                          <ul className="list-disc pl-5 space-y-2">
                            {analysisResults.feedbackExcerpts.negative.map((excerpt, index) => (
                              <li key={`neg-${index}`} className="text-gray-800">
                                <Typography variant="body2">"{excerpt}"</Typography>
                              </li>
                            ))}
                          </ul>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Recommendations */}
                  <Grid item xs={12}>
                    <Paper elevation={0} className="p-6 border border-gray-200 rounded-lg bg-blue-50">
                      <Typography variant="h6" className="mb-4 font-semibold flex items-center gap-2">
                        <TipsAndUpdatesIcon className="text-blue-600" />
                        Recommended Actions
                      </Typography>
                      <Box className="pl-8">
                        <ol className="list-decimal space-y-2">
                          {analysisResults.recommendations.map((rec, index) => (
                            <li key={`rec-${index}`} className="text-gray-800">
                              <Typography variant="body1">{rec}</Typography>
                            </li>
                          ))}
                        </ol>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl">
        <Typography variant="h6" className="font-semibold mb-4">
          How FeedbackInsight Works
        </Typography>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Box className="text-center">
            <Box className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
              <CloudUploadIcon className="text-green-600" />
            </Box>
            <Typography variant="subtitle2" className="font-semibold mb-2">1. Input Your Feedback</Typography>
            <Typography variant="body2" className="text-gray-600">
              Paste your customer feedback directly or upload a CSV file containing reviews and comments.
            </Typography>
          </Box>
          <Box className="text-center">
            <Box className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
              <AnalyticsIcon className="text-green-600" />
            </Box>
            <Typography variant="subtitle2" className="font-semibold mb-2">2. AI Analysis</Typography>
            <Typography variant="body2" className="text-gray-600">
              Our AI analyzes sentiment, identifies common themes, and extracts key insights from your feedback data.
            </Typography>
          </Box>
          <Box className="text-center">
            <Box className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
              <TipsAndUpdatesIcon className="text-green-600" />
            </Box>
            <Typography variant="subtitle2" className="font-semibold mb-2">3. Actionable Insights</Typography>
            <Typography variant="body2" className="text-gray-600">
              Review clear visualizations and receive specific recommendations to improve your product or service.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default FeedbackInsight;
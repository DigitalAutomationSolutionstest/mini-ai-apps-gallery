import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Button, TextField, 
  CircularProgress, Alert, Grid, Card, CardContent, 
  Tab, Tabs, MenuItem, Select, FormControl, InputLabel,
  Chip, Divider, IconButton, Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useAppContext } from '../../context/AppContext';

const ContentMaster = () => {
  const { user } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    contentType: 'social',
    industry: 'technology',
    targetAudience: 'professionals',
    toneStyle: 'professional',
    keyPoints: '',
    additionalInfo: ''
  });
  
  const [generatedContent, setGeneratedContent] = useState({
    concept1: {
      title: '',
      content: '',
      notes: ''
    },
    concept2: {
      title: '',
      content: '',
      notes: ''
    },
    concept3: {
      title: '',
      content: '',
      notes: ''
    }
  });

  const [editingContent, setEditingContent] = useState({
    isEditing: false,
    conceptKey: '',
    content: ''
  });
  
  const contentTypes = [
    { value: 'social', label: 'Social Media Post' },
    { value: 'blog', label: 'Blog Article' },
    { value: 'email', label: 'Email Campaign' },
    { value: 'video', label: 'Video Script' },
    { value: 'presentation', label: 'Presentation' }
  ];
  
  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'other', label: 'Other' }
  ];
  
  const audiences = [
    { value: 'professionals', label: 'Business Professionals' },
    { value: 'consumers', label: 'General Consumers' },
    { value: 'technical', label: 'Technical Audience' },
    { value: 'executives', label: 'Executives/Decision Makers' },
    { value: 'students', label: 'Students/Educational' },
    { value: 'seniors', label: 'Senior Citizens' }
  ];
  
  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual & Friendly' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'formal', label: 'Formal' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'technical', label: 'Technical' }
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleStartEditing = (conceptKey) => {
    setEditingContent({
      isEditing: true,
      conceptKey,
      content: generatedContent[conceptKey].content
    });
  };

  const handleSaveEditing = () => {
    setGeneratedContent({
      ...generatedContent,
      [editingContent.conceptKey]: {
        ...generatedContent[editingContent.conceptKey],
        content: editingContent.content
      }
    });
    setEditingContent({
      isEditing: false,
      conceptKey: '',
      content: ''
    });
  };

  const handleEditingChange = (e) => {
    setEditingContent({
      ...editingContent,
      content: e.target.value
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show a temporary success message (would implement with a snackbar in a full app)
    alert("Copied to clipboard!");
  };

  const handleGenerateContent = async () => {
    if (!formData.keyPoints.trim()) {
      setErrorMessage('Please provide key points for your content');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response with different content for each concept
      let mockResponse;
      
      if (formData.contentType === 'social') {
        mockResponse = {
          concept1: {
            title: "Engaging Question Approach",
            content: `Is your team struggling with ${formData.keyPoints.split(',')[0].trim()}? Our new solution helps ${formData.targetAudience} in the ${formData.industry} sector overcome this challenge.\n\nLearn how we increased efficiency by 40% for similar organizations: [Link] #Innovation #${formData.industry}`,
            notes: "Questions create curiosity and engagement. This approach directly addresses the pain point."
          },
          concept2: {
            title: "Statistics-First Approach",
            content: `Did you know? 78% of ${formData.targetAudience} face challenges with ${formData.keyPoints.split(',')[0].trim()}.\n\nOur solution changes that equation. See how we're revolutionizing ${formData.industry} approaches to this common problem.\n\n[CTA Link] #IndustryTrends #Solutions`,
            notes: "Leading with statistics establishes credibility and creates urgency around the problem."
          },
          concept3: {
            title: "Story-Based Approach",
            content: `"We were losing hours every week on ${formData.keyPoints.split(',')[0].trim()}" - a common story we hear from ${formData.targetAudience}.\n\nHere's how one organization transformed this challenge into an opportunity: [Link]\n\n#SuccessStory #${formData.industry}Solutions`,
            notes: "Storytelling creates emotional connection and makes benefits relatable to the audience."
          }
        };
      } else if (formData.contentType === 'blog') {
        mockResponse = {
          concept1: {
            title: `5 Ways ${formData.targetAudience} Are Revolutionizing ${formData.keyPoints.split(',')[0].trim()} in ${formData.industry}`,
            content: "Introduction paragraph discussing the importance of innovation in this area...\n\n1. Embracing New Technologies\n- Key point about technology adoption\n- Example of successful implementation\n- Statistics showing impact\n\n2. Rethinking Traditional Approaches\n...\n\n[Additional sections would follow with proper formatting]",
            notes: "List-based article format is highly shareable and provides clear structure for readers."
          },
          concept2: {
            title: `The Future of ${formData.keyPoints.split(',')[0].trim()}: What Every ${formData.industry} Professional Needs to Know`,
            content: "The landscape of [industry] is changing rapidly, with [key point] at the forefront of this transformation...\n\nSection 1: Current State Analysis\nThe traditional approach to [topic] has remained relatively unchanged for decades. However, recent developments in...\n\nSection 2: Emerging Trends\n...",
            notes: "Future-focused content positions your brand as forward-thinking and helps readers prepare for coming changes."
          },
          concept3: {
            title: `Case Study: How Company X Solved Their ${formData.keyPoints.split(',')[0].trim()} Challenges`,
            content: "Company X, a mid-sized player in the ${formData.industry} sector, faced significant challenges with ${formData.keyPoints.split(',')[0].trim()}...\n\nThe Challenge:\nFacing increasing competition and customer demands, Company X needed to address several key issues:\n- Problem point 1\n- Problem point 2\n- Problem point 3\n\nThe Solution:\n...",
            notes: "Case studies provide social proof and concrete examples of how your solution works in real-world scenarios."
          }
        };
      } else {
        // Generic template for other content types
        mockResponse = {
          concept1: {
            title: `${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)} Concept 1: Direct Approach`,
            content: `Main content focused on ${formData.keyPoints.split(',')[0].trim()} for ${formData.targetAudience} in the ${formData.industry} industry.\n\nThis would be fully fleshed out with appropriate formatting and structure for a ${formData.contentType}.`,
            notes: "This concept takes a direct, problem-solution approach suitable for busy audiences."
          },
          concept2: {
            title: `${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)} Concept 2: Educational Approach`,
            content: `Educational content explaining the fundamentals of ${formData.keyPoints.split(',')[0].trim()} and why it matters to ${formData.targetAudience}.\n\nThis would include relevant statistics, examples, and actionable insights.`,
            notes: "Educational approach helps establish expertise and provides value beyond just selling."
          },
          concept3: {
            title: `${formData.contentType.charAt(0).toUpperCase() + formData.contentType.slice(1)} Concept 3: Emotional Appeal`,
            content: `Content that connects emotionally by addressing the challenges ${formData.targetAudience} face with ${formData.keyPoints.split(',')[0].trim()}.\n\nIncludes relatable scenarios and testimonials.`,
            notes: "Emotional appeals can drive higher engagement when properly aligned with audience pain points."
          }
        };
      }
      
      setGeneratedContent(mockResponse);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating content:', error);
      setErrorMessage('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      contentType: 'social',
      industry: 'technology',
      targetAudience: 'professionals',
      toneStyle: 'professional',
      keyPoints: '',
      additionalInfo: ''
    });
    setGenerated(false);
    setGeneratedContent({
      concept1: { title: '', content: '', notes: '' },
      concept2: { title: '', content: '', notes: '' },
      concept3: { title: '', content: '', notes: '' }
    });
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Typography variant="h3" component="h1" className="text-3xl font-bold text-gray-900 mb-2">
          ContentMaster
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600">
          Quickly create creative concepts for marketing content, social media, and more
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" className="mb-6">{errorMessage}</Alert>
      )}

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Input Form */}
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl lg:col-span-1">
          <Typography variant="h6" className="font-semibold mb-4">
            Define Your Content Needs
          </Typography>
          
          <Box component="form" className="space-y-4">
            <FormControl fullWidth>
              <InputLabel id="content-type-label">Content Type</InputLabel>
              <Select
                labelId="content-type-label"
                id="content-type"
                name="contentType"
                value={formData.contentType}
                label="Content Type"
                onChange={handleFormChange}
              >
                {contentTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="industry-label">Industry</InputLabel>
              <Select
                labelId="industry-label"
                id="industry"
                name="industry"
                value={formData.industry}
                label="Industry"
                onChange={handleFormChange}
              >
                {industries.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="target-audience-label">Target Audience</InputLabel>
              <Select
                labelId="target-audience-label"
                id="target-audience"
                name="targetAudience"
                value={formData.targetAudience}
                label="Target Audience"
                onChange={handleFormChange}
              >
                {audiences.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="tone-style-label">Tone & Style</InputLabel>
              <Select
                labelId="tone-style-label"
                id="tone-style"
                name="toneStyle"
                value={formData.toneStyle}
                label="Tone & Style"
                onChange={handleFormChange}
              >
                {tones.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              required
              id="key-points"
              name="keyPoints"
              label="Key Points to Include"
              placeholder="Enter main points, features or benefits (comma separated)"
              multiline
              rows={3}
              value={formData.keyPoints}
              onChange={handleFormChange}
              fullWidth
            />
            
            <TextField
              id="additional-info"
              name="additionalInfo"
              label="Additional Context (optional)"
              placeholder="Any other information that might help create better content"
              multiline
              rows={3}
              value={formData.additionalInfo}
              onChange={handleFormChange}
              fullWidth
            />
            
            <Box className="flex gap-3 pt-2">
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={isLoading}
                fullWidth
                onClick={handleGenerateContent}
                startIcon={<AutoAwesomeIcon />}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Content'}
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearForm}
              >
                Clear
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Right Panel - Generated Content */}
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl lg:col-span-2">
          <Typography variant="h6" className="font-semibold mb-4">
            Generated Content Concepts
          </Typography>

          {!generated && !isLoading && (
            <Box className="h-full flex items-center justify-center py-16">
              <Box className="text-center text-gray-500">
                <LightbulbIcon fontSize="large" className="mb-2" />
                <Typography variant="body1">
                  Fill out the form and generate content to see results here
                </Typography>
              </Box>
            </Box>
          )}

          {isLoading && (
            <Box className="h-full flex items-center justify-center py-16">
              <Box className="text-center">
                <CircularProgress size={40} className="mb-4" />
                <Typography variant="body1">
                  Crafting creative concepts...
                </Typography>
              </Box>
            </Box>
          )}

          {generated && !isLoading && (
            <Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="content concepts">
                  <Tab label="Concept 1" />
                  <Tab label="Concept 2" />
                  <Tab label="Concept 3" />
                </Tabs>
              </Box>
              
              <Box className="pt-4">
                {tabIndex === 0 && renderConceptTab('concept1')}
                {tabIndex === 1 && renderConceptTab('concept2')}
                {tabIndex === 2 && renderConceptTab('concept3')}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      <Box className="mt-8">
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl">
          <Typography variant="h6" className="font-semibold mb-4">
            How ContentMaster Works
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Box className="text-center">
              <Box className="bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <EditIcon className="text-purple-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">1. Define Requirements</Typography>
              <Typography variant="body2" className="text-gray-600">
                Specify your content type, industry focus, target audience, and key points to include.
              </Typography>
            </Box>
            <Box className="text-center">
              <Box className="bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <AutoAwesomeIcon className="text-purple-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">2. Generate Concepts</Typography>
              <Typography variant="body2" className="text-gray-600">
                Our AI analyzes your requirements and creates multiple creative approaches that match your needs.
              </Typography>
            </Box>
            <Box className="text-center">
              <Box className="bg-purple-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <ContentCopyIcon className="text-purple-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">3. Edit & Export</Typography>
              <Typography variant="body2" className="text-gray-600">
                Review the generated concepts, make any edits, and export the content for your campaigns.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );

  function renderConceptTab(conceptKey) {
    const concept = generatedContent[conceptKey];
    
    return (
      <Box>
        <Box className="mb-4">
          <Typography variant="h5" className="font-bold text-gray-800">
            {concept.title}
          </Typography>
          <Chip 
            label={
              conceptKey === 'concept1' ? 'Approach 1' : 
              conceptKey === 'concept2' ? 'Approach 2' : 'Approach 3'
            }
            size="small"
            color="primary"
            className="mt-1"
          />
        </Box>
        
        <Paper elevation={0} className="p-4 bg-gray-50 rounded-lg mb-4 relative">
          {editingContent.isEditing && editingContent.conceptKey === conceptKey ? (
            <Box className="mb-4">
              <TextField
                multiline
                rows={8}
                fullWidth
                variant="outlined"
                value={editingContent.content}
                onChange={handleEditingChange}
              />
              <Box className="flex justify-end mt-2">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveEditing}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {concept.content}
              </Typography>
              <Box className="absolute top-2 right-2 flex gap-2">
                <Tooltip title="Edit content">
                  <IconButton 
                    size="small" 
                    onClick={() => handleStartEditing(conceptKey)}
                    className="bg-white"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copy to clipboard">
                  <IconButton 
                    size="small" 
                    onClick={() => copyToClipboard(concept.content)}
                    className="bg-white"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Paper>
        
        <Box className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <Typography variant="subtitle2" className="font-semibold mb-1 flex items-center">
            <LightbulbIcon fontSize="small" className="text-yellow-600 mr-1" />
            Strategy Notes
          </Typography>
          <Typography variant="body2">
            {concept.notes}
          </Typography>
        </Box>
      </Box>
    );
  }
};

export default ContentMaster;
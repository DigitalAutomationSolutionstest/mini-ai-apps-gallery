import React, { useState } from 'react';
import { 
  Container, Typography, Box, Paper, Button, 
  TextField, CircularProgress, Alert, Divider,
  List, ListItem, ListItemIcon, ListItemText, Chip
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RecommendIcon from '@mui/icons-material/Recommend';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { useAppContext } from '../../context/AppContext';

const TalentScanner = () => {
  const { user } = useAppContext();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('upload'); // upload, analysis, match
  const [analysis, setAnalysis] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
      setErrorMessage('');
    } else {
      setFile(null);
      setErrorMessage('Please upload a PDF or DOCX file.');
    }
  };

  const handleAnalyzeCV = async () => {
    if (!file) {
      setErrorMessage('Please upload a file first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call for document analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock response
      const mockAnalysis = {
        keySkills: ['JavaScript', 'React', 'Node.js', 'Project Management', 'UI/UX Design'],
        experience: [
          { title: 'Senior Frontend Developer', company: 'TechCorp', duration: '2020-Present' },
          { title: 'Frontend Developer', company: 'WebSolutions', duration: '2017-2020' }
        ],
        education: [
          { degree: 'Master in Computer Science', institution: 'Tech University', year: '2017' },
          { degree: 'Bachelor in Software Engineering', institution: 'State University', year: '2015' }
        ],
        strengths: ['Strong technical background', 'Team leadership', 'Problem-solving abilities'],
        weaknesses: ['Limited backend experience', 'No experience with AI/ML'],
        overallAssessment: 'Strong candidate with excellent frontend development skills and project management experience. Could benefit from additional backend or cloud training.'
      };
      
      setAnalysis(mockAnalysis);
      setCurrentStep('analysis');
    } catch (error) {
      console.error('Error analyzing CV:', error);
      setErrorMessage('Failed to analyze the document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchPosition = async () => {
    if (!jobDescription.trim()) {
      setErrorMessage('Please enter a job description.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulate API call for job matching
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockMatchResult = {
        total: 78,
        skillsMatch: 85,
        experienceMatch: 90,
        educationMatch: 100,
        missingSkills: ['GraphQL', 'AWS', 'DevOps experience'],
        recommendations: [
          'Add more details about any GraphQL experience',
          'Highlight any cloud technology exposure',
          'Emphasize team leadership achievements'
        ]
      };
      
      setMatchResult(mockMatchResult);
      setCurrentStep('match');
    } catch (error) {
      console.error('Error matching position:', error);
      setErrorMessage('Failed to match with job description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderMatchingScore = (score) => {
    let color = 'error';
    if (score >= 80) color = 'success';
    else if (score >= 60) color = 'warning';
    
    return (
      <Box display="flex" alignItems="center" mb={1}>
        <Box width="100%" mr={1}>
          <Box sx={{ position: 'relative', height: 10, borderRadius: 5, bgcolor: 'grey.200' }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${score}%`,
                borderRadius: 5,
                bgcolor: `${color}.main`,
              }}
            />
          </Box>
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${score}%`}</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Typography variant="h3" component="h1" className="text-3xl font-bold text-gray-900 mb-2">
          TalentScanner
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600">
          Analyze CVs and job compatibility using AI to streamline your recruitment process
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" className="mb-6">{errorMessage}</Alert>
      )}

      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl">
          {currentStep === 'upload' && (
            <Box>
              <Typography variant="h6" className="font-semibold mb-4">
                Upload CV or Resume
              </Typography>
              
              <Box 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => document.getElementById('cv-upload').click()}
              >
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FileUploadIcon fontSize="large" className="text-gray-400 mb-2" />
                <Typography variant="subtitle1" className="text-gray-800 mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  PDF or DOCX (Max 5MB)
                </Typography>
              </Box>

              {file && (
                <Box className="mt-4 flex items-center">
                  <ArticleIcon className="text-indigo-500 mr-2" />
                  <Typography variant="body2" className="text-gray-700">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                </Box>
              )}

              <Box className="mt-6">
                <Button 
                  variant="contained" 
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={!file || isLoading}
                  onClick={handleAnalyzeCV}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Analyze CV'
                  )}
                </Button>
              </Box>
            </Box>
          )}

          {currentStep === 'analysis' && (
            <Box>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Job Description
                </Typography>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => setCurrentStep('upload')}
                >
                  Back to Upload
                </Button>
              </Box>
              
              <TextField
                label="Paste job description here"
                multiline
                rows={12}
                placeholder="Enter the job description to match with the CV..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                fullWidth
                variant="outlined"
                className="mb-4"
              />

              <Button 
                variant="contained" 
                color="primary"
                size="large"
                fullWidth
                disabled={!jobDescription.trim() || isLoading}
                onClick={handleMatchPosition}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Check Compatibility'
                )}
              </Button>
            </Box>
          )}

          {currentStep === 'match' && (
            <Box>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="font-semibold">
                  Match Results
                </Typography>
                <Button 
                  size="small" 
                  color="primary" 
                  onClick={() => setCurrentStep('analysis')}
                >
                  Edit Job Description
                </Button>
              </Box>

              <Box className="bg-gray-50 p-4 rounded-lg mb-6">
                <Typography variant="h4" align="center" className="font-bold text-4xl mb-2" color={matchResult.total >= 70 ? 'primary' : 'error'}>
                  {matchResult.total}%
                </Typography>
                <Typography variant="subtitle1" align="center" className="text-gray-600">
                  Overall Compatibility Score
                </Typography>
              </Box>

              <Typography variant="subtitle2" className="font-semibold mb-2">
                Match Breakdown
              </Typography>

              <Box className="mb-4">
                <Typography variant="body2">Skills Match</Typography>
                {renderMatchingScore(matchResult.skillsMatch)}
                
                <Typography variant="body2">Experience Match</Typography>
                {renderMatchingScore(matchResult.experienceMatch)}
                
                <Typography variant="body2">Education Match</Typography>
                {renderMatchingScore(matchResult.educationMatch)}
              </Box>

              <Typography variant="subtitle2" className="font-semibold mb-2">
                Missing Skills
              </Typography>
              <Box className="mb-6 flex flex-wrap gap-2">
                {matchResult.missingSkills.map((skill, index) => (
                  <Chip 
                    key={index} 
                    label={skill} 
                    size="small"
                    color="default"
                    variant="outlined" 
                  />
                ))}
              </Box>

              <Divider className="mb-4" />

              <Typography variant="subtitle2" className="font-semibold mb-2">
                Recommendations
              </Typography>
              <List dense>
                {matchResult.recommendations.map((rec, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <RecommendIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={rec} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>

        {/* Right Panel - Analysis Results */}
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl">
          <Typography variant="h6" className="font-semibold mb-4">
            CV Analysis
          </Typography>
          
          {!analysis && !isLoading && (
            <Box className="h-full flex items-center justify-center py-16">
              <Box className="text-center text-gray-500">
                <ArticleIcon fontSize="large" className="mb-2" />
                <Typography variant="body1">
                  Upload and analyze a CV to see results here
                </Typography>
              </Box>
            </Box>
          )}
          
          {isLoading && (
            <Box className="h-full flex items-center justify-center py-16">
              <Box className="text-center">
                <CircularProgress size={40} className="mb-4" />
                <Typography variant="body1">
                  Analyzing document...
                </Typography>
              </Box>
            </Box>
          )}

          {analysis && !isLoading && (
            <Box className="space-y-6">
              <Box>
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                  Key Skills
                </Typography>
                <Box className="flex flex-wrap gap-2">
                  {analysis.keySkills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                  Experience
                </Typography>
                <List dense>
                  {analysis.experience.map((exp, index) => (
                    <ListItem key={index} className="pl-0">
                      <ListItemIcon>
                        <WorkIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={exp.title} 
                        secondary={`${exp.company} | ${exp.duration}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                  Education
                </Typography>
                <List dense>
                  {analysis.education.map((edu, index) => (
                    <ListItem key={index} className="pl-0">
                      <ListItemIcon>
                        <SchoolIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={edu.degree} 
                        secondary={`${edu.institution} | ${edu.year}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-2">
                  Strengths & Weaknesses
                </Typography>
                <Box className="grid grid-cols-2 gap-4">
                  <List dense>
                    {analysis.strengths.map((strength, index) => (
                      <ListItem key={index} className="pl-0">
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={strength} />
                      </ListItem>
                    ))}
                  </List>
                  <List dense>
                    {analysis.weaknesses.map((weakness, index) => (
                      <ListItem key={index} className="pl-0">
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <ErrorIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary={weakness} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>

              <Box className="bg-gray-50 p-4 rounded-lg">
                <Typography variant="subtitle2" className="font-semibold text-gray-700 mb-1">
                  Overall Assessment
                </Typography>
                <Typography variant="body2">
                  {analysis.overallAssessment}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>

      <Box className="mt-8">
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl">
          <Typography variant="h6" className="font-semibold mb-4">
            How It Works
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Box className="text-center">
              <Box className="bg-indigo-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <FileUploadIcon className="text-indigo-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">1. Upload Document</Typography>
              <Typography variant="body2" className="text-gray-600">
                Upload a CV or resume in PDF or DOCX format. Our AI processes the document securely.
              </Typography>
            </Box>
            <Box className="text-center">
              <Box className="bg-indigo-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <ArticleIcon className="text-indigo-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">2. AI Analysis</Typography>
              <Typography variant="body2" className="text-gray-600">
                Our AI extracts key information, skills, experience, and potential strengths/weaknesses.
              </Typography>
            </Box>
            <Box className="text-center">
              <Box className="bg-indigo-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <RecommendIcon className="text-indigo-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">3. Match & Recommend</Typography>
              <Typography variant="body2" className="text-gray-600">
                Enter a job description to get compatibility scores and personalized recommendations.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TalentScanner;
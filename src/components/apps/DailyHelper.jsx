import React, { useState, useRef, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, TextField, Button,
  CircularProgress, Avatar, Chip, IconButton, Divider,
  FormControl, InputLabel, Select, MenuItem, Alert,
  Card, CardContent, Grid, Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EventIcon from '@mui/icons-material/Event';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MarkdownIt from 'markdown-it';
import { useAppContext } from '../../context/AppContext';

const md = new MarkdownIt({
  linkify: true,
  typographer: true,
  breaks: true,
  html: false
});

const MAX_TOKEN_COUNT = 10;

const DailyHelper = () => {
  const { user, tokenCount, useToken } = useAppContext();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hello! I'm your DailyHelper assistant. I can help you organize your day, answer questions, or assist with decision making. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const messagesEndRef = useRef(null);

  const templates = [
    { value: '', label: 'Select a template...' },
    { value: 'plan_day', label: 'Help me plan my day' },
    { value: 'summarize', label: 'Summarize this text' },
    { value: 'decide', label: 'Help me decide between options' },
    { value: 'create_list', label: 'Create a list for me' },
    { value: 'explain', label: 'Explain a concept' }
  ];

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (template === 'plan_day') {
      setInput("I need to plan my day. I have the following tasks: 1) Complete project report 2) Call with client at 2pm 3) Gym workout 4) Prepare presentation for tomorrow. How should I organize my day?");
    } else if (template === 'summarize') {
      setInput("Can you summarize the following text for me? [Paste your text here]");
    } else if (template === 'decide') {
      setInput("I'm trying to decide between [Option 1] and [Option 2]. These are the pros and cons for each: [list pros and cons]. Which would you recommend and why?");
    } else if (template === 'create_list') {
      setInput("Can you create a [type of list] for me? I need it to [describe purpose or requirements].");
    } else if (template === 'explain') {
      setInput("Could you explain the concept of [topic] in simple terms?");
    }
  }, [template]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    if (tokenCount <= 0) {
      setErrorMessage("You've used all your tokens. Please upgrade your plan to continue using DailyHelper.");
      return;
    }

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setTemplate('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Decrement token count using the context method without direct hook call
      if (tokenCount > 0) {
        // We'll use the context's method directly instead of the hook
        // This is just to simulate the token usage
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate AI response based on user input
      const aiResponse = await generateAIResponse(input);

      setMessages(prevMessages => [
        ...prevMessages,
        {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setErrorMessage('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput) => {
    // This is a mock function - in a real app, this would call the Claude API
    const input = userInput.toLowerCase();
    
    // Different response patterns based on input type
    if (input.includes('plan') && (input.includes('day') || input.includes('schedule'))) {
      return `
## Daily Plan Suggestion

Based on your tasks, here's an organized schedule:

**Morning**
- 8:00 AM - 10:30 AM: Work on project report (high concentration task)
- 10:30 AM - 11:00 AM: Short break
- 11:00 AM - 12:30 PM: Continue project report

**Afternoon**
- 12:30 PM - 1:15 PM: Lunch
- 1:15 PM - 1:45 PM: Prepare for client call
- 2:00 PM - 3:00 PM: Client call
- 3:15 PM - 5:00 PM: Prepare presentation for tomorrow

**Evening**
- 5:30 PM - 6:30 PM: Gym workout
- 7:00 PM onwards: Dinner and relaxation

**Notes:**
- I've scheduled the project report first when your energy is likely highest
- Built in buffer time before your client call
- Placed the gym workout after work to help you decompress

Would you like me to adjust anything in this schedule?
      `;
    } else if (input.includes('summarize')) {
      return `
I'd be happy to summarize your text. Please replace "[Paste your text here]" with the actual content you want summarized, and I'll provide a concise summary highlighting the key points.

For best results:
- Include the complete text you want summarized
- Let me know if you need a specific length for the summary
- Mention if you want focus on specific aspects of the text
      `;
    } else if (input.includes('decide') || input.includes('decision')) {
      return `
## Decision Analysis

I need a bit more information about your specific options to provide a detailed analysis. When you replace the placeholders with your actual options and their pros/cons, I'll help you by:

1. Analyzing the strengths and weaknesses of each option
2. Considering both short-term benefits and long-term implications
3. Suggesting which option might better align with your priorities
4. Proposing possible compromises or alternative solutions

Remember that while I can provide an objective analysis, the final decision should reflect your personal values and circumstances.
      `;
    } else if (input.includes('list')) {
      return `
I'll create a detailed list based on your requirements. Please provide:

1. The specific type of list you need (shopping list, task list, reading list, etc.)
2. Any particular categories or sections needed
3. The purpose of the list and key requirements

Once you provide these details, I'll craft a well-organized list tailored to your needs.
      `;
    } else if (input.includes('explain')) {
      return `
I'd be happy to explain the concept you're interested in. Please replace "[topic]" with the specific concept you'd like me to explain.

I'll provide:
- A simple, jargon-free explanation
- Key principles or components
- Real-world examples or analogies
- Common misconceptions (if applicable)

Let me know the specific topic, and if you have any particular aspects you'd like me to focus on!
      `;
    } else {
      // Generic response for other queries
      return `
Thank you for your message. I'd be happy to help with that!

${input.length < 20 ? "Could you provide a bit more detail about what you need assistance with? This will help me give you the most relevant and helpful response." : "I've analyzed your request and can assist you with this. Would you like me to provide more specific information or suggestions related to this topic? Feel free to ask follow-up questions or provide additional context if needed."}

Remember, I'm here to help with organizing tasks, answering questions, creating summaries, or assisting with decisions. Just let me know what you need!
      `;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        role: 'assistant',
        content: "👋 Hello! I'm your DailyHelper assistant. I can help you organize your day, answer questions, or assist with decision making. How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Would typically show a toast notification here
  };

  const renderMessageContent = (content) => {
    return <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Typography variant="h3" component="h1" className="text-3xl font-bold text-gray-900 mb-2">
          DailyHelper
        </Typography>
        <Typography variant="subtitle1" className="text-gray-600">
          Conversational AI assistant for daily organization and support
        </Typography>
      </Box>

      {errorMessage && (
        <Alert severity="error" className="mb-6">{errorMessage}</Alert>
      )}

      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Tools */}
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl hidden lg:block">
          <Typography variant="h6" className="font-semibold mb-4">
            Quick Tools
          </Typography>
          
          <Box className="space-y-3">
            <Card variant="outlined" className="cursor-pointer hover:bg-amber-50 transition-colors">
              <CardContent className="flex items-center p-3">
                <EventIcon className="text-amber-600 mr-3" />
                <Box>
                  <Typography variant="subtitle2">Day Planner</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Organize your schedule
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="cursor-pointer hover:bg-amber-50 transition-colors">
              <CardContent className="flex items-center p-3">
                <ListAltIcon className="text-amber-600 mr-3" />
                <Box>
                  <Typography variant="subtitle2">Create Lists</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Tasks, shopping, ideas
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="cursor-pointer hover:bg-amber-50 transition-colors">
              <CardContent className="flex items-center p-3">
                <SummarizeIcon className="text-amber-600 mr-3" />
                <Box>
                  <Typography variant="subtitle2">Summarizer</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Condense long text
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined" className="cursor-pointer hover:bg-amber-50 transition-colors">
              <CardContent className="flex items-center p-3">
                <HelpOutlineIcon className="text-amber-600 mr-3" />
                <Box>
                  <Typography variant="subtitle2">Decision Helper</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Compare options
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          
          <Divider className="my-4" />
          
          <Typography variant="subtitle2" className="font-semibold mt-4 mb-2">
            Tokens Remaining
          </Typography>
          <Box className="bg-gray-100 p-3 rounded-lg text-center">
            <Typography variant="h5" className="font-bold text-amber-600">
              {tokenCount}/{MAX_TOKEN_COUNT}
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Free plan limit
            </Typography>
          </Box>
          
          <Button 
            variant="outlined" 
            fullWidth 
            className="mt-4"
            href="/pricing"
          >
            Upgrade Plan
          </Button>
        </Paper>

        {/* Chat Interface */}
        <Paper elevation={0} className="border border-gray-200 rounded-xl lg:col-span-2 flex flex-col" sx={{ height: 'calc(100vh - 240px)', minHeight: '600px' }}>
          {/* Message Area */}
          <Box className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <Box 
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Box 
                  className={`max-w-3/4 rounded-2xl p-4 ${
                    message.role === 'user' 
                      ? 'bg-amber-500 text-white ml-12' 
                      : 'bg-gray-100 text-gray-800 mr-12'
                  }`}
                >
                  <Box className="flex items-center mb-2">
                    <Avatar
                      sx={{ 
                        width: 28, 
                        height: 28,
                        bgcolor: message.role === 'user' ? 'white' : 'amber.500',
                        color: message.role === 'user' ? 'amber.500' : 'white'
                      }}
                      className="mr-2"
                    >
                      {message.role === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                    </Avatar>
                    <Typography variant="caption" className={message.role === 'user' ? 'text-amber-100' : 'text-gray-500'}>
                      {message.role === 'user' ? 'You' : 'DailyHelper'} • {formatTime(message.timestamp)}
                    </Typography>
                    
                    {message.content && (
                      <Tooltip title="Copy to clipboard">
                        <IconButton 
                          size="small" 
                          onClick={() => copyToClipboard(message.content)}
                          sx={{ ml: 'auto' }}
                          className={message.role === 'user' ? 'text-amber-100' : 'text-gray-400'}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Box className={`prose ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {renderMessageContent(message.content)}
                  </Box>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <Box className="flex justify-center my-4">
                <CircularProgress size={30} />
              </Box>
            )}
          </Box>
          
          {/* Input Area */}
          <Box className="p-4 border-t border-gray-200">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small" variant="outlined">
                  <InputLabel id="template-select-label">Quick templates</InputLabel>
                  <Select
                    labelId="template-select-label"
                    id="template-select"
                    value={template}
                    onChange={handleTemplateChange}
                    label="Quick templates"
                  >
                    {templates.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box className="flex gap-2">
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Type your message here..."
                    variant="outlined"
                    value={input}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                  />
                  <Box className="flex flex-col gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading || tokenCount <= 0}
                      sx={{ height: '50%' }}
                    >
                      <SendIcon />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={clearConversation}
                      sx={{ height: '50%' }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                </Box>
                <Box className="flex justify-between items-center mt-2">
                  <Typography variant="caption" color="textSecondary">
                    {tokenCount > 0 ? `${tokenCount} tokens remaining` : "No tokens remaining - please upgrade"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Shift+Enter for new line • Enter to send
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Box className="mt-8">
        <Paper elevation={0} className="p-6 border border-gray-200 rounded-xl">
          <Typography variant="h6" className="font-semibold mb-4">
            How DailyHelper Works
          </Typography>
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Box className="text-center">
              <Box className="bg-amber-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <FormatQuoteIcon className="text-amber-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">1. Ask Anything</Typography>
              <Typography variant="body2" className="text-gray-600">
                Ask questions, request organization help, or get suggestions for daily tasks and decisions.
              </Typography>
            </Box>
            <Box className="text-center">
              <Box className="bg-amber-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <SmartToyIcon className="text-amber-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">2. AI Processing</Typography>
              <Typography variant="body2" className="text-gray-600">
                Our AI understands your request and provides personalized, helpful responses with contextual memory.
              </Typography>
            </Box>
            <Box className="text-center">
              <Box className="bg-amber-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
                <EventIcon className="text-amber-600" />
              </Box>
              <Typography variant="subtitle2" className="font-semibold mb-2">3. Take Action</Typography>
              <Typography variant="body2" className="text-gray-600">
                Apply the assistant's suggestions to organize your day, make decisions, or solve problems more efficiently.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DailyHelper;
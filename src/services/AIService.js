import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for storage
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required Supabase configuration in environment variables');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API keys for AI services - must be provided through environment variables
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

if (!ANTHROPIC_API_KEY || !HUGGINGFACE_API_KEY) {
  console.error('Missing required API keys in environment variables');
}

class AIService {
  /**
   * Process a CV or resume and extract relevant information
   * @param {File} documentFile - The document file (PDF or DOCX)
   * @returns {Promise<object>} - Extracted data and analysis
   */
  async analyzeDocument(documentFile) {
    try {
      // Upload document to Supabase storage
      const fileName = `${Date.now()}_${documentFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, documentFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      const documentUrl = urlData.publicUrl;
      
      // Call Anthropic Claude API to analyze the document
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `Please analyze this CV/resume document available at ${documentUrl}. 
              Extract and structure the following information:
              1. Personal details (name, contact info, etc.)
              2. Key skills and competencies
              3. Work experience (company names, positions, dates, descriptions)
              4. Education background
              5. Certifications or additional qualifications
              6. Languages and proficiency levels
              7. Any notable achievements or projects
              
              Also, provide an overall assessment of the candidate's strengths and potential areas for improvement.
              Format the response as a JSON object that can be directly parsed.`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return JSON.parse(data.content[0].text);
    } catch (error) {
      console.error('Error in analyzeDocument:', error);
      throw new Error(`Failed to analyze document: ${error.message}`);
    }
  }

  /**
   * Match a CV against a job description
   * @param {object} cvAnalysis - The analyzed CV data
   * @param {string} jobDescription - The job description text
   * @returns {Promise<object>} - Compatibility analysis
   */
  async matchWithPosition(cvAnalysis, jobDescription) {
    try {
      // Call Anthropic Claude API for job matching
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `I have a CV with the following information:
              ${JSON.stringify(cvAnalysis, null, 2)}
              
              And a job description as follows:
              "${jobDescription}"
              
              Please analyze the compatibility between this CV and job description. Provide:
              1. An overall compatibility percentage score (0-100)
              2. Skills match percentage
              3. Experience match percentage
              4. Education match percentage
              5. List of missing skills or requirements from the job description
              6. Specific recommendations to improve the CV for this position
              
              Format the response as a JSON object that can be directly parsed.`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return JSON.parse(data.content[0].text);
    } catch (error) {
      console.error('Error in matchWithPosition:', error);
      throw new Error(`Failed to match with position: ${error.message}`);
    }
  }

  /**
   * Generate content based on provided parameters
   * @param {object} contentParams - Parameters for content generation
   * @returns {Promise<object>} - Generated content concepts
   */
  async generateContent(contentParams) {
    try {
      // Call Hugging Face Inference API for content generation
      const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: `Generate three different creative concepts for ${contentParams.contentType} content in the ${contentParams.industry} industry targeted at ${contentParams.targetAudience} with a ${contentParams.toneStyle} tone. The content should include these key points: ${contentParams.keyPoints}. Additional context: ${contentParams.additionalInfo || 'None provided'}. 
          
          For each concept, provide:
          1. A unique title/approach
          2. The full content
          3. Strategic notes explaining why this approach would be effective
          
          Format the response as a JSON object with concept1, concept2, and concept3 objects, each containing title, content, and notes fields.`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      // Parse the generated text as JSON
      // Note: Some models might not return perfect JSON, so we'd need to handle that
      try {
        const contentMatch = data.generated_text.match(/\{[\s\S]*\}/);
        if (contentMatch) {
          return JSON.parse(contentMatch[0]);
        } else {
          throw new Error('Could not parse JSON from response');
        }
      } catch (parseError) {
        console.error('Error parsing content JSON:', parseError);
        
        // Fallback: Return structured mock data
        return {
          concept1: {
            title: "Concept 1",
            content: data.generated_text.slice(0, 200) + "...",
            notes: "This concept takes a direct approach to address the target audience's needs."
          },
          concept2: {
            title: "Concept 2",
            content: data.generated_text.slice(200, 400) + "...",
            notes: "This concept uses storytelling to create emotional engagement."
          },
          concept3: {
            title: "Concept 3",
            content: data.generated_text.slice(400, 600) + "...",
            notes: "This concept leverages statistics and data to build credibility."
          }
        };
      }
    } catch (error) {
      console.error('Error in generateContent:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  /**
   * Analyze feedback or review text
   * @param {string} feedbackText - The feedback text to analyze
   * @returns {Promise<object>} - Sentiment analysis and insights
   */
  async analyzeFeedback(feedbackText) {
    try {
      // Call Hugging Face Inference API for sentiment analysis
      const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`
        },
        body: JSON.stringify({
          inputs: feedbackText
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error || 'Unknown error'}`);
      }

      const sentimentData = await response.json();
      
      // Call Anthropic Claude API for more detailed analysis
      const detailedResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `Analyze the following customer feedback:
              ${feedbackText}
              
              Please provide:
              1. Total number of feedback items identified
              2. Sentiment distribution (percentage of positive, neutral, and negative feedback)
              3. Key themes mentioned and their frequency
              4. Notable positive feedback excerpts
              5. Notable negative feedback excerpts
              6. Recommendations for improvements based on the feedback
              
              Format the response as a JSON object that can be directly parsed.`
            }
          ]
        })
      });

      if (!detailedResponse.ok) {
        const errorData = await detailedResponse.json();
        throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const detailedData = await detailedResponse.json();
      
      try {
        return JSON.parse(detailedData.content[0].text);
      } catch (parseError) {
        console.error('Error parsing feedback analysis JSON:', parseError);
        throw new Error('Could not parse analysis results');
      }
    } catch (error) {
      console.error('Error in analyzeFeedback:', error);
      throw new Error(`Failed to analyze feedback: ${error.message}`);
    }
  }

  /**
   * Get a response from the conversational assistant
   * @param {string} userMessage - The user's message
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise<string>} - Assistant's response
   */
  async getChatResponse(userMessage, conversationHistory = []) {
    try {
      // Format conversation history for Claude API
      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      // Call Anthropic Claude API for chat
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          messages: messages
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API request failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Error in getChatResponse:', error);
      throw new Error(`Failed to get chat response: ${error.message}`);
    }
  }
}

export default new AIService();
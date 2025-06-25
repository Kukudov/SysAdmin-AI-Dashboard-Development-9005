import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const openRouterAPI = {
  async chat({ apiKey, message, context = '', history = [] }) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an expert system administrator assistant. You help with server management, security, troubleshooting, and automation. 
          
          Context: ${context}
          
          Provide clear, actionable advice. When suggesting commands or scripts, explain what they do and any risks involved.`
        },
        ...history.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await axios.post(OPENROUTER_API_URL, {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SysAdmin AI Ops Dashboard',
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      if (error.response?.status === 401) {
        throw new Error('Invalid API key. Please check your OpenRouter API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else {
        throw new Error('Failed to communicate with AI service. Please try again.');
      }
    }
  },

  async analyzeSystemLog(apiKey, logContent) {
    const prompt = `Analyze this system log and provide insights:

${logContent}

Please provide:
1. Summary of key events
2. Any errors or warnings found
3. Potential causes
4. Recommended actions
5. Risk assessment (Low/Medium/High)`;

    return await this.chat({ apiKey, message: prompt, context: 'log_analysis' });
  },

  async generateScript(apiKey, description, scriptType = 'bash') {
    const prompt = `Generate a ${scriptType} script for: ${description}

Please provide:
1. Complete working script with comments
2. Prerequisites and dependencies
3. Usage instructions
4. Safety considerations and warnings
5. Error handling`;

    return await this.chat({ apiKey, message: prompt, context: 'script_generation' });
  },

  async explainCVE(apiKey, cveId, description = '') {
    const prompt = `Explain CVE ${cveId} in detail${description ? `: ${description}` : ''}

Please provide:
1. Clear explanation of the vulnerability
2. Affected systems and software
3. Risk level and potential impact
4. Detailed remediation steps
5. Prevention strategies`;

    return await this.chat({ apiKey, message: prompt, context: 'vulnerability_analysis' });
  }
};
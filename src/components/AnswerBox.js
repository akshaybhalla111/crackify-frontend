import React, { useState } from 'react';
import { Box, Typography, Button, Snackbar, Paper } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';

function AnswerBox({ answer }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setSnackbarOpen(true);
    } catch (err) {
      console.error('❌ Failed to copy: ', err);
    }
  };

  // Extract summarized question
  const [summaryPart, ...answerParts] = answer.split('⭐ Answer:');
  const summarizedQuestion = summaryPart.replace('Summarized Question:', '').trim();
  const answerContent = answerParts.join('⭐ Answer:').trim();

  const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(answerContent)) !== null) {
    const [fullMatch, language, code] = match;
    const startIndex = match.index;

    if (startIndex > lastIndex) {
      parts.push({ type: 'markdown', content: answerContent.slice(lastIndex, startIndex) });
    }

    parts.push({
      type: 'code',
      language: language || 'text',
      content: code,
      index: startIndex
    });

    lastIndex = startIndex + fullMatch.length;
  }

  if (lastIndex < answerContent.length) {
    parts.push({ type: 'markdown', content: answerContent.slice(lastIndex) });
  }

  return (
    <Box>
      {summarizedQuestion && (
        <Paper elevation={3} sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">💬 Summarized Question:</Typography>
          <Typography variant="body1">{summarizedQuestion}</Typography>
        </Paper>
      )}

      <Typography variant="subtitle1" gutterBottom fontWeight="bold">⭐ Answer:</Typography>

      {parts.map((part, index) => {
        if (part.type === 'markdown') {
          return (
            <ReactMarkdown key={index}>
              {part.content}
            </ReactMarkdown>
          );
        } else if (part.type === 'code') {
          return (
            <Box key={index} my={2}>
              <Button
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
                onClick={() => handleCopy(part.content)}
              >
                Copy Code
              </Button>
              <SyntaxHighlighter language={part.language} style={github}>
                {part.content}
              </SyntaxHighlighter>
            </Box>
          );
        }
        return null;
      })}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="✅ Code copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export default AnswerBox;

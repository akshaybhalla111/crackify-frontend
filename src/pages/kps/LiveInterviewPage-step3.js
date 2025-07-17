// LiveInterviewPage.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import AnswerBox from '../components/AnswerBox';
import InterviewSetupModal from '../components/InterviewSetupModal';

const buttonClickSound = new Audio('/click.mp3');

function LiveInterviewPage() {
  const { auth } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [liveTranscriptBuffer, setLiveTranscriptBuffer] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [streamingIndicator, setStreamingIndicator] = useState(''); // New State

  const videoRef = useRef(null);
  const scrollBottomRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const workletNodeRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const readerRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setStreamingIndicator(prev => {
          if (prev === '...') return '.';
          return prev + '.';
        });
      }, 500);
    } else {
      setStreamingIndicator('');
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const playClickSound = () => {
    buttonClickSound.currentTime = 0;
    buttonClickSound.play();
  };

  const handleClearTranscript = useCallback(() => {
    playClickSound();
    setQuestions([]);
    setCurrentTranscript('');
    setLiveTranscriptBuffer('');
    setCurrentAnswer('');
  }, []);

  const handleExitInterview = useCallback(async () => {
    await cleanup();

    const formattedQuestions = questions.map(q => ({ question: q.text, answer: q.answer || currentAnswer }));

    await fetch('http://localhost:8000/save_session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
      body: JSON.stringify({ questions: formattedQuestions })
    });

    setQuestions([]);
    setCurrentTranscript('');
    setLiveTranscriptBuffer('');
    setCurrentAnswer('');
    setIsInterviewActive(false);
    window.location.reload();
  }, [questions, currentAnswer, auth]);

  const handleGenerateAnswer = useCallback(async () => {
    playClickSound();

    const questionText = liveTranscriptBuffer.trim() || questions[questions.length - 1]?.text || '';
    if (!questionText || !setupData?.session_id) return;

    const contextPrompt = setupData
      ? `You are applying for the role of ${setupData.role} at ${setupData.company}. Answer in the first person as if you are the candidate.\n\nCandidate Resume:\n${setupData.resume_text}\n\nJob Description:\n${setupData.jd_text}\n\n`
      : '';

    const prompt = `${contextPrompt}Please answer the following interview question:\n\nQuestion: ${questionText}`;

    setCurrentAnswer('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/generate_answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ question: prompt, session_id: setupData.session_id })
      });

      if (!response.body) {
        setCurrentAnswer('❌ Streaming not supported.');
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      readerRef.current = reader;

      const decoder = new TextDecoder();
      let done = false;
      let accumulatedAnswer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulatedAnswer += chunk;
          setCurrentAnswer(prev => prev + chunk);
        }
      }

      await fetch('http://localhost:8000/save_session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ questions: [{ question: questionText, answer: accumulatedAnswer }] })
      });

    } catch (error) {
      console.error('❌ Error during streaming:', error);
      setCurrentAnswer('❌ Error during streaming.');
    } finally {
      readerRef.current = null;

      setQuestions(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].answer = currentAnswer;
        }
        return updated;
      });

      setIsLoading(false);
    }
  }, [liveTranscriptBuffer, questions, auth, currentAnswer, setupData]);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (setupModalOpen) return;

      if (e.key === ' ' || e.key === 'Spacebar') {
        if (isInterviewActive) {
          await handleGenerateAnswer();
        }
      }
      if (e.key === 'c' || e.key === 'C') {
        if (isInterviewActive) {
          handleClearTranscript();
        }
      }
      if (e.key === 's' || e.key === 'S') {
        if (isInterviewActive) {
          await handleExitInterview();
        }
      }
      if (e.key === 'Escape') {
        if (isInterviewActive && readerRef.current) {
          readerRef.current.cancel();
          console.warn('⛔ Streaming manually stopped.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInterviewActive, handleGenerateAnswer, handleClearTranscript, handleExitInterview, setupModalOpen]);

  const cleanup = async () => {
    try {
      if (workletNodeRef.current) {
        workletNodeRef.current.port.close();
        workletNodeRef.current.disconnect();
        workletNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        await audioCtxRef.current.suspend();
        await audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      if (socketRef.current) {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }
        socketRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      reconnectAttemptsRef.current = 0;
    } catch (err) {
      console.error('❌ Cleanup error:', err);
    }
  };

  const startInterviewWithAudio = async () => {
    await cleanup();

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const audioCtx = new AudioContext({ sampleRate: 48000 });
      audioCtxRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule('processor.js');
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const worklet = new AudioWorkletNode(audioCtx, 'pcm-processor');
      workletNodeRef.current = worklet;

      source.connect(worklet).connect(audioCtx.destination);

      const socket = new WebSocket('ws://localhost:8000/audio_stream');
      socket.binaryType = 'arraybuffer';
      socketRef.current = socket;

      socket.onmessage = event => {
        const data = JSON.parse(event.data);
        if (data.type === 'partial_transcript') {
          setCurrentTranscript(data.text);
          setLiveTranscriptBuffer(prev => prev + ' ' + data.text);
        }
        if (data.type === 'final_transcript') {
          setQuestions(prev => [...prev, { text: data.text }]);
          setCurrentTranscript('');
          setLiveTranscriptBuffer('');
        }
      };

      socket.onclose = () => {
        if (reconnectAttemptsRef.current < 5) {
          reconnectAttemptsRef.current += 1;
          setTimeout(startInterviewWithAudio, 2000);
        } else {
          cleanup();
        }
      };

      worklet.port.onmessage = e => {
        if (socket.readyState === WebSocket.OPEN) socket.send(e.data);
      };

      setIsInterviewActive(true);

    } catch (err) {
      console.error('❌ Start error:', err);
    }
  };

  const handleStartStopToggle = useCallback(() => {
    playClickSound();
    if (!isInterviewActive) {
      setSetupModalOpen(true);
    } else {
      handleExitInterview();
    }
  }, [isInterviewActive, handleExitInterview]);

  return (
    <Box display="flex" p={3} sx={{ gap: 3, minHeight: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
      <InterviewSetupModal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSetupComplete={(data) => { setSetupData(data); startInterviewWithAudio(); setSetupModalOpen(false); }}
        auth={auth}
      />

      <Box flex="1" display="flex" flexDirection="column" sx={{ borderRight: { md: '1px solid #ddd' }, paddingRight: { md: 2 }, mb: { xs: 2, md: 0 } }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Shared Screen Video</Typography>
        <Box sx={{ height: '200px', backgroundColor: '#ddd', mb: 2 }}>
          <video ref={videoRef} autoPlay muted width="100%" height="100%" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Live Transcription</Typography>
          <FormControlLabel
            control={<Switch checked={autoScroll} onChange={() => setAutoScroll(!autoScroll)} />}
            label="Auto-Scroll"
          />
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', p: 2 }}>
          {questions.map((q, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <Typography sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {`Q${index + 1}: ${q.text}`}
                </Typography>
              </Box>
            </motion.div>
          ))}

          {currentTranscript && (
            <motion.div initial={{ backgroundColor: '#fff8c5' }} animate={{ backgroundColor: '#fff8c5' }} transition={{ duration: 0.5 }}>
              <Typography sx={{ mt: 2, fontSize: '1.3rem', fontWeight: 'bold', padding: '10px', borderRadius: '5px', backgroundColor: '#fff8c5', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                {currentTranscript}
              </Typography>
            </motion.div>
          )}

          <div ref={scrollBottomRef}></div>
        </Box>
      </Box>

      <Box flex="1" display="flex" flexDirection="column">
        <Typography variant="h6" sx={{ mb: 1 }}>AI Answer</Typography>
        <Box sx={{ flex: 1, p: 2 }}>
          <AnswerBox answer={currentAnswer} />
          {isLoading && (
            <Typography sx={{ mt: 2, fontStyle: 'italic', color: 'gray' }}>
              Generating{streamingIndicator}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 20, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 2, backgroundColor: '#fff', padding: '10px 0', borderTop: '1px solid #ddd' }}>
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
          <Button variant="contained" color="primary" onClick={handleStartStopToggle} disabled={isLoading} sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            {isInterviewActive ? 'Exit Interview' : 'Start Interview'}
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
          <Button variant="contained" color="error" onClick={handleClearTranscript} disabled={!isInterviewActive || isLoading} sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            Clear Transcript
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
          <Button variant="contained" color="success" onClick={handleGenerateAnswer} disabled={!isInterviewActive || isLoading} sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}>
            {isLoading ? (<><CircularProgress size={20} sx={{ color: 'white', mr: 1 }} /> Generating...</>) : ('Generate Answer')}
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}

export default LiveInterviewPage;

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Switch, FormControlLabel, CircularProgress, Modal } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useUI } from '../UIContext';
import AnswerBox from '../components/AnswerBox';
import InterviewSetupModal from '../components/InterviewSetupModal';
import LiveInterviewPreparationModal from '../components/LiveInterviewPreparationModal';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config";
import { API_BASE } from "../config";

const buttonClickSound = new Audio('/click.mp3');

function LiveInterviewPage() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { subscriptionStatus, liveSessionsRemaining, fetchSubscriptionStatus } = useUI();

  const [questions, setQuestions] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [liveTranscriptBuffer, setLiveTranscriptBuffer] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [shortcutOverlayOpen, setShortcutOverlayOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


  const videoRef = useRef(null);
  const scrollBottomRef = useRef(null);
  const answerBoxRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const workletNodeRef = useRef(null);
  const socketRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const readerRef = useRef(null);
  const sessionEndedRef = useRef(false);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    const savedSetup = localStorage.getItem('live_setup_data');
    if (savedSetup) setSetupData(JSON.parse(savedSetup));
  }, []);

  useEffect(() => {
    if (setupData && !isInterviewActive && !hasEndedRef.current) {
      setPrepModalOpen(true);
    }
  }, [setupData, isInterviewActive]);

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
    sessionEndedRef.current = true;
    hasEndedRef.current = true;
    setIsInterviewActive(false);

    await cleanup();

    const formattedQuestions = questions.map(q => ({
      question: q.text,
      answer: q.answer || currentAnswer,
    }));

    if (setupData?.session_id) {
      await fetch(`${API_BASE_URL}/save_session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ session_id: setupData.session_id, questions: formattedQuestions }),
      });
    }

    setQuestions([]);
    setCurrentTranscript('');
    setLiveTranscriptBuffer('');
    setCurrentAnswer('');
    navigate('/sessions');
    await fetchSubscriptionStatus();
  }, [questions, currentAnswer, auth, setupData, navigate]);

  const handleGenerateAnswer = useCallback(async () => {
    playClickSound();

    const questionText = liveTranscriptBuffer.trim() || questions[questions.length - 1]?.text || '';
    if (!questionText || !setupData?.session_id) return;

    // Classify the question
    let questionType = 'Scenario';

    try {
      const classifyResponse = await fetch(`${API_BASE_URL}/classify_question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ question: questionText })
      });

      const classifyData = await classifyResponse.json();
      questionType = classifyData.type;
    } catch (error) {
      console.error('❌ Classification error:', error);
    }

    let prompt = '';

    if (questionType === 'Coding') {
      prompt = `${setupData ? `You are applying for the role of ${setupData.role} at ${setupData.company}.\n\n` : ''}
  Please do the following:
  1. Summarize the interview question in one clear sentence.
  2. Write a complete ${setupData.language || 'Java'} code example inside a proper code block.
  3. Explain the code step-by-step after the code block.

  Return the response in the following format:
  Summarized Question: <summary here>

  ⭐ Answer:
  <code block and explanation>

  Question: ${questionText}
  Answer:\n`;
    } else if (questionType === 'Conceptual') {
      prompt = `${setupData ? `You are applying for the role of ${setupData.role} at ${setupData.company}.\n\n` : ''}
  Please answer the following **concept-based** question in a clear, structured, step-by-step format:
  - Use short easy-to-understand bullet points step wise
  - Each bullet should have only one idea per line, like you would say in an interview
  - Avoid code unless it’s explicitly asked in the question
  - Explain terms and differences precisely also very avoid long explanations like you would in a live job interview

  Return the response in the following format:
  Summarized Question: <summary here>

  ⭐ Answer:
  <bullet-point answer>

  Question: ${questionText}
  Answer:\n-`;
    } else if (questionType === 'Introduction' || questionType === 'HR') {
      prompt = `${setupData ? `You are applying for the role of ${setupData.role} at ${setupData.company}.\n\nCandidate Resume:\n${setupData.resume_text}\n\nJob Description:\n${setupData.jd_text}\n\n` : ''}
  Please do the following:
  1. Summarize the interview question in one clear sentence.
  2. You are in a live job interview. Please answer the following question in the first person, conversationally and confidently, like you are talking to the interviewer. Avoid bullet points.

  Return the response in the following format:
  Summarized Question: <summary here>

  ⭐ Answer:
  <direct conversational answer>

  Question: ${questionText}
  Answer:\n`;
    } else {
      // Scenario-based (default)
      const contextPrompt = setupData
        ? `You are applying for the role of ${setupData.role} at ${setupData.company}. You are in a live job interview. Answer questions like a confident, professional candidate. Your answers should be:
  - In the first person (like "I would...")
  - Clear and step-wise
  - Use simple bullet points
  - Each bullet should have only one idea per line, like you would say in an interview
  Avoid very long explanations. Speak directly like you are answering verbally.

  Candidate Resume:
  ${setupData.resume_text}

  Job Description:
  ${setupData.jd_text}

  `
        : '';

      prompt = `${contextPrompt}
  Please do the following:
  1. Summarize the interview question in one clear sentence.
  2. Provide a step-wise, bullet-point answer like a confident interviewee.

  Return the response in the following format:
  Summarized Question: <summary here>

  ⭐ Answer:
  <bullet-point answer>

  Question: ${questionText}
  Answer:\n-`;
    }

    setCurrentAnswer('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/generate_answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ session_id: setupData.session_id, question: prompt })
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

      await fetch(`${API_BASE_URL}/save_session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth}` },
        body: JSON.stringify({ session_id: setupData.session_id, questions: [{ question: questionText, answer: accumulatedAnswer }] })
      });

      setQuestions(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].answer = accumulatedAnswer;
        }
        return updated;
      });

      setTimeout(() => {
        answerBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('❌ Error during streaming:', error);
      setCurrentAnswer('❌ Error during streaming.');
    } finally {
      readerRef.current = null;
      setIsLoading(false);
    }
  }, [liveTranscriptBuffer, questions, auth, setupData]);

  useEffect(() => {
    if (autoScroll && scrollBottomRef.current) {
      scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [questions, currentTranscript, autoScroll]);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (setupModalOpen) return;

      if (e.key === ' ') {
        e.preventDefault();
        if (isInterviewActive) await handleGenerateAnswer();
      } else if (e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (isInterviewActive) handleClearTranscript();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (isInterviewActive) {
          setConfirmDialogOpen(true);
        }
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShortcutOverlayOpen(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isInterviewActive && readerRef.current) {
          readerRef.current.cancel();
        }
        setShortcutOverlayOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInterviewActive, handleGenerateAnswer, handleClearTranscript, handleExitInterview, setupModalOpen]);

  const startInterviewWithAudio = async () => {
    await cleanup();
    sessionEndedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      window.focus();

      const audioCtx = new AudioContext({ sampleRate: 48000 });
      audioCtxRef.current = audioCtx;
      await audioCtx.audioWorklet.addModule('processor.js');

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;

      const worklet = new AudioWorkletNode(audioCtx, 'pcm-processor');
      workletNodeRef.current = worklet;

      source.connect(worklet).connect(audioCtx.destination);

      const socket = new WebSocket(`${WS_BASE_URL}/audio_stream`);
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
        if (!sessionEndedRef.current && reconnectAttemptsRef.current < 5) {
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
      if (setupData) {
        startInterviewWithAudio();
      } else {
        setSetupModalOpen(true);
      }
    } else {
      handleExitInterview();
    }
  }, [isInterviewActive, setupData, handleExitInterview]);

  return (
    <Box display="flex" p={2} flexDirection={{ xs: 'column', md: 'row' }} sx={{ gap: 2, minHeight: '100vh', bgcolor: '#f5f6fa' }}>
      {/* Setup Modal */}
      <InterviewSetupModal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSetupComplete={(data) => {
          setSetupData(data);
          localStorage.setItem('live_setup_data', JSON.stringify(data));
          setSetupModalOpen(false);
          setPrepModalOpen(true);
        }}
        auth={auth}
      />

      {/* Preparation Modal */}
      <LiveInterviewPreparationModal
        open={prepModalOpen}
        onClose={() => setPrepModalOpen(false)}
        onStart={() => {
          setPrepModalOpen(false);
          startInterviewWithAudio();
        }}
      />

      {/* Shortcut Modal */}
      <Modal open={shortcutOverlayOpen} onClose={() => setShortcutOverlayOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24
        }}>
          <Typography variant="h6" gutterBottom>Keyboard Shortcuts</Typography>
          <Typography gutterBottom><strong>Spacebar:</strong> Generate Answer</Typography>
          <Typography gutterBottom><strong>C:</strong> Clear Transcript</Typography>
          <Typography gutterBottom><strong>S:</strong> Exit Interview</Typography>
          <Typography gutterBottom><strong>H:</strong> Show/Hide Shortcut Overlay</Typography>
          <Typography gutterBottom><strong>Esc:</strong> Cancel Streaming / Close Overlay</Typography>
        </Box>
      </Modal>

      {/* LEFT PANEL */}
      <Box flex="0.85" display="flex" flexDirection="column" sx={{ borderRight: '1px solid #ddd', pr: 2 }}>
        <Box sx={{ height: '260px', backgroundColor: '#ddd', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
          <video ref={videoRef} autoPlay muted width="100%" height="100%" />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#333', letterSpacing: '0.3px' }}>
            Transcription
          </Typography>
          <FormControlLabel
            control={<Switch checked={autoScroll} onChange={() => setAutoScroll(!autoScroll)} />}
            label="AutoScroll"
          />
        </Box>

        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: 2,
          p: 2,
          bgcolor: '#ffffff',
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.05)'
        }}>
          {questions.map((q, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#eef4ff' }}>
                <Typography sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {`Q${index + 1}: ${q.text}`}
                </Typography>
              </Box>
            </motion.div>
          ))}

          {currentTranscript && (
            <motion.div initial={{ backgroundColor: '#fff8c5' }} animate={{ backgroundColor: '#fff8c5' }} transition={{ duration: 0.5 }}>
              <Typography sx={{
                mt: 1,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: '#fff8c5',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)'
              }}>
                {currentTranscript}
              </Typography>
            </motion.div>
          )}
          <div ref={scrollBottomRef}></div>
        </Box>
      </Box>

      {/* RIGHT PANEL */}
      <Box flex="1.15" display="flex" flexDirection="column" ref={answerBoxRef} sx={{ minWidth: 0, maxWidth: '100%', overflow: 'hidden' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2, borderBottom: '1px solid #ddd', pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <img src="/logo.png" alt="Crackify AI" style={{ height: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Crackify AI</Typography>
          </Box>
        </Box>

        <Box sx={{
          flex: 1,
          p: 2,
          bgcolor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.05)',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 160px)'
        }}>
          <AnswerBox answer={currentAnswer} />
        </Box>
      </Box>

      {/* BOTTOM CONTROLS */}
      <Box sx={{
        position: 'fixed',
        bottom: 20,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        backgroundColor: '#fff',
        padding: '10px 0',
        borderTop: '1px solid #ddd',
        zIndex: 1000
      }}>
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (isInterviewActive) {
                setConfirmDialogOpen(true); // ⬅️ Open confirmation dialog
              } else {
                handleStartStopToggle();    // ⬅️ Start the interview directly
              }
            }}
            disabled={isLoading}
            sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 } }}
          >
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
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>End Interview</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end this interview? Your current session will be saved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            setConfirmDialogOpen(false);
            await handleExitInterview();
          }} color="error" variant="contained">
            End Interview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LiveInterviewPage;

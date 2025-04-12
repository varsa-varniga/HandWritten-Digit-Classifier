import React, { useState } from 'react';
import { 
  Container, Typography, Button, Box, CircularProgress, 
  Paper, Card, CardContent, styled, useTheme, Fade, Slide
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CreateIcon from '@mui/icons-material/Create';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import axios from 'axios';
import BG_IMAGE from './assets/bg.png'; 

// Enhanced styled components with more modern aesthetics
const UploadBox = styled(Paper)(({ theme }) => ({
  padding: '40px',
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: '24px',
  border: '3px dashed #7209b7',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '30px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  boxShadow: '0 10px 30px rgba(114, 9, 183, 0.15)',
  '&:hover': {
    background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 35px rgba(114, 9, 183, 0.25)',
    borderColor: '#3a0ca3'
  }
}));

const VisualFileInput = styled('input')({
  display: 'none',
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #7209b7 0%, #4361ee 100%)',
  borderRadius: '30px',
  padding: '14px 32px',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  textTransform: 'none',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 15px rgba(114, 9, 183, 0.4)',
  transition: 'all 0.4s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #560bad 0%, #3a0ca3 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(114, 9, 183, 0.6)',
  },
  '&:disabled': {
    background: '#b0b0b0',
    transform: 'none',
    boxShadow: 'none'
  }
}));

const UploadButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f72585 0%, #b5179e 100%)',
  borderRadius: '30px',
  padding: '12px 28px',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '1rem',
  textTransform: 'none',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 15px rgba(247, 37, 133, 0.4)',
  transition: 'all 0.4s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #d61f69 0%, #9c147d 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(247, 37, 133, 0.6)',
  }
}));

const ResultCard = styled(Card)(({ confidence, theme }) => ({
  marginTop: '40px',
  padding: '24px',
  borderRadius: '24px',
  background: `linear-gradient(135deg, ${confidence > 0.8 ? '#e0f7fa' : '#fff8e1'} 0%, ${confidence > 0.8 ? '#b2ebf2' : '#ffecb3'} 100%)`,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease',
  transform: 'translateY(0)',
  border: `2px solid ${confidence > 0.8 ? '#4cc9f0' : '#ffd166'}`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
  }
}));

const FilePreview = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  padding: '8px',
  border: '2px solid #7209b7',
  borderRadius: '16px',
  maxWidth: '220px',
  maxHeight: '220px',
  overflow: 'hidden',
  background: 'white',
  boxShadow: '0 5px 15px rgba(114, 9, 183, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 25px rgba(114, 9, 183, 0.3)',
  }
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  padding: '40px',
  borderRadius: '30px',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 20px 60px rgba(114, 9, 183, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(114, 9, 183, 0.05) 0%, rgba(67, 97, 238, 0.05) 100%)',
    zIndex: -1,
  }
}));

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const theme = useTheme();

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPrediction(null);
      setErrorMsg('');
      
      // Create preview for the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMsg("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(res.data);
      setLoading(false);
    } catch (err) {
      setErrorMsg("Failed to process image. Please try again or check the server connection.");
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="100" sx={{ 
      py: 8,
      backgroundImage: `url(${BG_IMAGE})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <GlassCard elevation={0}>
        <HeaderBox>
          <CreateIcon 
            sx={{ 
              fontSize: '2.5rem', 
              mr: 2,
              color: '#7209b7',
              filter: 'drop-shadow(0 2px 4px rgba(114, 9, 183, 0.4))'
            }} 
          />
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: '800',
              background: 'linear-gradient(45deg, #7209b7 30%, #4361ee 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(114, 9, 183, 0.1)'
            }}
          >
            AI Digit Recognizer
          </Typography>
        </HeaderBox>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          mb: 4,
          gap: 1
        }}>
          <PsychologyIcon sx={{ color: '#560bad' }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#555',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}
          >
            Upload a handwritten digit image and let our AI predict the number
          </Typography>
        </Box>

        <UploadBox>
          <AutoFixHighIcon sx={{ 
            fontSize: '3rem', 
            color: '#7209b7', 
            mb: 2,
            filter: 'drop-shadow(0 2px 4px rgba(114, 9, 183, 0.4))'
          }} />
          
          <label htmlFor="contained-button-file">
            <VisualFileInput
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <UploadButton
              component="span"
              startIcon={<CloudUploadIcon sx={{ fontSize: '1.5rem' }} />}
              variant="contained"
            >
              Choose Image
            </UploadButton>
          </label>
          
          <Fade in={!!previewUrl} timeout={500}>
            <div>
              {previewUrl && (
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FilePreview>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ 
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: '12px'
                      }} 
                    />
                  </FilePreview>
                  <Typography variant="body1" sx={{ mt: 2, color: '#555', fontWeight: '500' }}>
                    {selectedFile ? selectedFile.name : ''}
                  </Typography>
                </Box>
              )}
            </div>
          </Fade>
          
          {!previewUrl && (
            <Typography variant="body1" sx={{ mt: 2, color: '#555', fontWeight: '500' }}>
              No file selected yet
            </Typography>
          )}
        </UploadBox>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GradientButton
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <LightbulbIcon />}
            size="large"
          >
            {loading ? 'Analyzing...' : 'Predict Digit'}
          </GradientButton>
        </Box>

        <Slide direction="up" in={!!errorMsg} mountOnEnter unmountOnExit>
          <Box 
            sx={{ 
              mt: 3, 
              p: 3, 
              backgroundColor: 'rgba(255, 235, 238, 0.9)', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderLeft: '4px solid #f44336',
              boxShadow: '0 4px 15px rgba(244, 67, 54, 0.2)'
            }}
          >
            <ErrorIcon color="error" sx={{ fontSize: '28px' }} />
            <Typography color="error" sx={{ fontWeight: '500' }}>
              {errorMsg}
            </Typography>
          </Box>
        </Slide>

        <Fade in={!!prediction} timeout={800}>
          <div>
            {prediction && (
              <ResultCard confidence={prediction.confidence}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <CheckCircleIcon 
                      color="success" 
                      sx={{ 
                        fontSize: '32px', 
                        mr: 2,
                        filter: 'drop-shadow(0 2px 4px rgba(0, 200, 83, 0.4))'
                      }} 
                    />
                    <Typography variant="h4" fontWeight="800" sx={{ 
                      background: 'linear-gradient(45deg, #7209b7 30%, #4361ee 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Prediction Results
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                      bgcolor: 'white',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 8px 25px rgba(114, 9, 183, 0.25)',
                      border: '4px solid #7209b7'
                    }}>
                      <Typography variant="h1" sx={{ 
                        color: '#7209b7', 
                        fontWeight: '800',
                        fontSize: '5rem',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        {prediction.digit}
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: '16px', 
                        backgroundColor: 'rgba(224, 224, 224, 0.6)', 
                        borderRadius: '8px',
                        mb: 2,
                        overflow: 'hidden',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: `${prediction.confidence * 100}%`, 
                          height: '100%',
                          background: `linear-gradient(90deg, ${prediction.confidence > 0.8 ? '#4cc9f0' : '#ffd166'} 0%, ${prediction.confidence > 0.8 ? '#4361ee' : '#ff9500'} 100%)`,
                          transition: 'width 1.2s cubic-bezier(0.22, 0.61, 0.36, 1)',
                          borderRadius: '8px'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="h6" fontWeight="700" sx={{ color: '#333' }}>
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#666', textAlign: 'center' }}>
                      {prediction.confidence > 0.8 
                        ? "High confidence prediction!" 
                        : prediction.confidence > 0.6 
                          ? "Moderate confidence prediction." 
                          : "Low confidence. Try a clearer image."}
                    </Typography>
                  </Box>
                </CardContent>
              </ResultCard>
            )}
          </div>
        </Fade>
      </GlassCard>
    </Container>
  );
}

export default App;
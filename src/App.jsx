import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Container,
  CircularProgress,
  LinearProgress,
  IconButton,
  Alert
} from '@mui/material';
import { 
  CloudUpload, 
  Delete
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled component for file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Styled upload zone
const UploadZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(255,255,255,0.1)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.2)',
  }
}));

const App = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Check if file is an image
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    setProgress(0);

    // Update progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 200);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      if (!response.ok) {
        throw new Error('Server error occurred');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={4} sx={{ 
        p: 4, 
        textAlign: 'center',
        borderRadius: 2,
        background: 'linear-gradient(to bottom, #283593, #1a237e)',
        color: 'white'
      }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Digit Recognition
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
          Upload an image of a handwritten digit to recognize it
        </Typography>
        
        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          {!file ? (
            <UploadZone
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input').click()}
            >
              <CloudUpload sx={{ fontSize: 48, color: 'white', opacity: 0.8, mb: 2 }} />
              <Typography variant="body1">
                Drag and drop or{' '}
                <Typography component="span" color="primary.light" sx={{ textDecoration: 'underline' }}>
                  browse
                </Typography>
              </Typography>
              <VisuallyHiddenInput
                id="file-input"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </UploadZone>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    position: 'relative'
                  }}
                >
                  <IconButton 
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                    onClick={removeFile}
                  >
                    <Delete />
                  </IconButton>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    p: 2 
                  }}>
                    <Box 
                      component="img" 
                      src={previewUrl} 
                      alt="Digit preview" 
                      sx={{ 
                        maxHeight: 200, 
                        maxWidth: '100%', 
                        objectFit: 'contain',
                        borderRadius: 1,
                        backgroundColor: 'white'
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {file.name} ({Math.round(file.size / 1024)} KB)
                  </Typography>
                  
                  {uploading && (
                    <LinearProgress 
                      variant="determinate" 
                      value={progress} 
                      sx={{ mt: 2, mb: 1, height: 6, borderRadius: 3 }} 
                    />
                  )}
                </Paper>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={uploadFile}
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                sx={{ px: 4 }}
              >
                {uploading ? 'Processing...' : 'Recognize Digit'}
              </Button>
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Paper 
              elevation={3} 
              sx={{ 
                mt: 4, 
                p: 3,
                background: 'rgba(255,255,255,0.9)',
                color: '#1a237e',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom color="primary.dark">
                Recognition Result
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                flexDirection: 'column',
                mt: 2 
              }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: 100, 
                    fontWeight: "bold",
                    mb: 2,
                    color: '#283593'
                  }}
                >
                  {result.digit}
                </Typography>
                
                {/* Enhanced confidence display */}
                <Paper 
                  elevation={2}
                  sx={{
                    py: 1.5,
                    px: 3,
                    backgroundColor: '#3949ab',
                    borderRadius: 4,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      letterSpacing: 0.5
                    }}
                  >
                    Confidence: {(result.confidence * 100).toFixed(2)}%
                  </Typography>
                </Paper>
              </Box>
            </Paper>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
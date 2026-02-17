Summo - AI-Powered Text Summarizer

An intelligent web application that transforms long-form text into concise, accurate summaries using advanced LLM technology.

![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)

## Overview

Summo is a text summarization tool built with FastAPI and powered by Groq's LLama 3.3 70B model. It intelligently handles documents of any length with multiple modes to get multiple summary format ensuring coherent summaries even for lengthy content.

### Key Features
- **Fast and rapid**: Get rapid summary in seconds.
- **Multiple Summary Styles**: Choose from three output formats:
  - **Concise**: Brief, bullet-point style summary
  - **Professional**: Detailed, formal summary suitable for business contexts  
  - **One-liner**: Ultra-compact single-sentence summary
- **Input Validation**: Prevents empty, too-short, or malformed inputs with clear error messages
- **Real-time Processing**: Live feedback with loading states and progress indicators
- **Responsive Design**: Clean, modern UI with glassmorphism effects and smooth animations


## Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- Groq API - LLM inference (LLama 3.3 70B Versatile)
- Pydantic - Data validation
- Python-dotenv - Environment management

**Frontend:**
- HTML5/CSS3 - Semantic markup and styling
- Vanilla JavaScript - No framework dependencies
- Responsive design - Mobile-first approach

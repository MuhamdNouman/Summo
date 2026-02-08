from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from src.summarizer import summarize_text

app = FastAPI()

# Mount static files (CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

class SummarizeRequest(BaseModel):
    text: str

class SummarizeResponse(BaseModel):
    success: bool
    summary: str = None
    error: str = None


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

    
@app.post("/summarize", response_model=SummarizeResponse)
def summarize(request: SummarizeRequest) -> SummarizeResponse:
    result = summarize_text(request.text)

    if not result.get('success'):
        return SummarizeResponse(
            success=False,
            error=result.get('error')
        ) 
    
    return SummarizeResponse(
        success=True,
        summary=result.get('summary')
    )
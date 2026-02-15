import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def count_words(text):
    return len(text.split())

def validate_text(text):
    if not text or not isinstance(text, str):
        return {"success": False, "error": "Input must be a non-empty string."} 
    
    word_count = count_words(text)
    if word_count < 10:
        return {"success": False, "error": "Input must be at least 10 words."}
    
    if len(text) > 10000:
        return {"success": False, "error": "Input text must be less than 10,000 characters long."}
    
    return {"success": True, "error": None}
    

def summarize_text(text, mode="default: general summary"):

    is_valid = validate_text(text)
    if not is_valid["success"]:
        return is_valid
    
    
    try:
        if not os.getenv("GROQ_API_KEY"):
            return {"success": False, "error": "API key not configured"}
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        if mode =="concise":
            mode_instruction = f"""You are an expert summarizer. Your task is to generate a concise, accurate summary of the input text. 
                Requirements:
                1. Capture the main ideas and important points only; ignore trivial details.
                2. Use clear, simple, professional language.
                3. Preserve factual accuracy; do not invent information.
                4. If the text is unclear or incoherent, indicate that in a single line."""
            
        elif mode =="pro":
            mode_instruction = (
                "You are a high-level executive assistant summarizing a report for a busy CEO. "
                "Focus strictly on actionable insights, key data points, and business impact. "
                "Use a professional, formal tone. Be concise and cut out all fluff."
            )
        elif mode =="one-liner":
            mode_instruction =(
            "You are an expert at distilling complex information into a single, high-impact sentence. "
            "Your goal is to provide the absolute core essence of the text. "
            "STRICT CONSTRAINTS:\n"
            "1. Output MUST be exactly ONE sentence.\n"
            "2. Do NOT use introductory phrases like 'The text discusses...' or 'In summary...'.\n"
            "3. Start directly with the main subject or action.\n"
            "4. Keep it under 40 words."
            )
        else:
            mode_instruction = f"""You are an expert summarizer. Your task is to generate a concise, accurate summary of the input text. 
                Requirements:
                1. Capture the main ideas and important points only; ignore trivial details.
                2. Use clear, simple, professional language.
                3. Preserve factual accuracy; do not invent information.
                4. If the text is unclear or incoherent, indicate that in a single line."""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
               {
                "role": "user",
                "content": f"{mode_instruction}\n\n{text}"
                }
            ]
        )

        summary = response.choices[0].message.content.strip()
    
        return {
            "success": True,
            "summary": summary,
        }
        
    except Exception as e:
        return {"success": False, "error": f"Summarization failed: {str(e)}"}



if __name__ == "__main__":
    sample_text = """Configure your API key as an environment variable.
    This approach streamlines your API usage by eliminating the need to include your API key in each request.Moreover, 
    it enhances security by minimizing the risk of inadvertently including your API key in your codebase"""
    
    summary = summarize_text(sample_text, mode="bullets")
    print("Summary:", summary)


    
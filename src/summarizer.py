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
    

def summarize_text(text):

    is_valid = validate_text(text)
    if not is_valid["success"]:
        return is_valid
    
    
    try:
        if not os.getenv("GROQ_API_KEY"):
            return {"success": False, "error": "API key not configured"}
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
               {
                "role": "user",
                "content": f"""You are an expert summarizer. Your task is to generate a concise, accurate summary of the input text. 
                Requirements:
                1. Capture the main ideas and important points only; ignore trivial details.
                2. Use clear, simple, professional language.
                3. Preserve factual accuracy; do not invent information.
                4. If the text is unclear or incoherent, indicate that in a single line.
                {text}"""
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
    
    summary = summarize_text(sample_text)
    print("Summary:", summary)


    
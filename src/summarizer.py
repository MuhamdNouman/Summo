import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

def validate_text(text):
    if not text or not isinstance(text, str):
        raise ValueError("Input text must be a non-empty string.")
    if len(text) < 20:
        raise ValueError("Input text must be at least 20 characters long.")
    if len(text) > 10000:
        raise ValueError("Input text must be less than 10,000 characters long.")
    

def summarize_text(text):

    validate_text(text)
    
    client = Groq(api_key=os.getenv("Groq_API_KEY"))

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
           {
            "role": "user",
            "content": f"""You are an expert summarizer. Your task is to generate a concise, accurate summary of the input text. 
            Requirements:
            1. Keep the summary under [TARGET_LENGTH] words or sentences.
            2. Capture the main ideas and important points only; ignore trivial details.
            3. Use clear, simple, professional language.
            4. Preserve factual accuracy; do not invent information.
            5. If the text is unclear or incoherent, indicate that in a single line.
            {text}"""
                }
            ]
        )
    
    return response.choices[0].message.content.strip()

if __name__ == "__main__":
    sample_text = """In the heart of the bustling city, there was a small, hidden café that only a few people
      knew about. It was called "The Secret Brew" and it was famous for its unique blends of 
      coffee and cozy atmosphere. The café was run by"""
    
    summary = summarize_text(sample_text)
    print("Summary:", summary)


    
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client =Groq(
    api_key=os.getenv("GROQ_API_KEY"))

def test_groq():
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": "what is the meaning of Nouman, give the concise answer."
            }
        ]
    )

    print(response.choices[0].message.content)

test_groq()
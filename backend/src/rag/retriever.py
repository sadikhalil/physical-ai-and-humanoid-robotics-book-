import os
from dotenv import load_dotenv
import cohere
from qdrant_client import QdrantClient

# Load environment variables
load_dotenv()

# =========================
# CONFIG
# =========================
COLLECTION_NAME = "humanoid ai book"

QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

EMBED_MODEL = "embed-english-v1"

# =========================
# CLIENTS (initialize once)
# =========================
co = cohere.Client(COHERE_API_KEY)

qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY
)

# =========================
# RETRIEVER
# =========================
def retrieve_context(question: str, top_k: int = 5) -> list[str]:
    """
    Embed the user question using Cohere and retrieve top-k
    relevant chunks from Qdrant.
    """
    try:
        # 1️⃣ Embed the query (MUST match indexing input_type)
        embedding_response = co.embed(
            texts=[question],
            model=EMBED_MODEL,
            input_type="search_query"
        )

        query_vector = embedding_response.embeddings[0]

        # 2️⃣ Search Qdrant (CORRECT API)
        search_results = qdrant.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=top_k,
            with_payload=True
        )

        # 3️⃣ Extract text payload
        context_chunks = [
            hit.payload.get("text", "")
            for hit in search_results
            if hit.payload and "text" in hit.payload
        ]

        return context_chunks

    except Exception as e:
        print(f"⚠ Error retrieving context: {e}")
        return []

# =========================
# PROMPT BUILDER
# =========================
def build_prompt(question: str, context_chunks: list[str]) -> str:
    """
    Build prompt using retrieved book chunks.
    """
    if not context_chunks:
        return f"""
The book does not contain information to answer this question.

Question: {question}
Answer:
"""

    context_text = "\n\n".join(context_chunks)

    return f"""
You are a book-based assistant.
Answer ONLY using the content below.
If the answer is not present, say: "Information not found in the book."

BOOK CONTENT:
{context_text}

QUESTION:
{question}

ANSWER:
"""

# =========================
# LOCAL TEST
# =========================
if __name__ == "__main__":
    user_question = input("Ask a question: ")
    chunks = retrieve_context(user_question)

    if not chunks:
        print("⚠ No relevant content found.")
    else:
        prompt = build_prompt(user_question, chunks)
        print("\n--- PROMPT TO SEND TO GEMINI ---\n")
        print(prompt)


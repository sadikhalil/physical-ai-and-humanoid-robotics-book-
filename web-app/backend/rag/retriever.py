import os
from dotenv import load_dotenv
import cohere
from qdrant_client import QdrantClient
from qdrant_client.models import Query
# Load environment variables
load_dotenv()

# Qdrant & Cohere setup
COLLECTION_NAME = "humanoid ai book" 

# Cohere Client for embedding
co = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
EMBED_MODEL = "embed-english-v3.0"

# Qdrant Client for vector search
qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

def retrieve_context(question: str, top_k: int = 5):
    """
    Retrieve top-k relevant chunks from Qdrant for a given question.
    """
    try:
        # Embed the user query with the same input_type as used during indexing
        q_embedding = co.embed(
            texts=[question],
            model=EMBED_MODEL,
            input_type="search_query"  # Use search_query for queries
        ).embeddings[0]

        # Search Qdrant collection using the query method
        results = qdrant.query(
            collection_name=COLLECTION_NAME,
            query=Query(
                query_vector=q_embedding,
            ),
            limit=top_k,
            with_payload=True
        )

        # Extract text from payload
        context_chunks = [hit.payload["text"] for hit in results]
        return context_chunks

    except Exception as e:
        print(f"⚠ Error retrieving context: {e}")
        return []

def build_prompt(question: str, context_chunks: list):
    """
    Combine retrieved chunks into a single prompt for the chatbot.
    """
    context_text = "\n\n".join(context_chunks)
    prompt = f"""
Use the following book content to answer the question accurately:

{context_text}

Question: {question}
Answer:
"""
    return prompt

# Quick test
if __name__ == "__main__":
    user_question = input("Ask a question: ")
    chunks = retrieve_context(user_question, top_k=5)
    if not chunks:
        print("⚠ No relevant content found.")
    else:
        prompt = build_prompt(user_question, chunks)
        print("\n--- Prompt to send to chatbot ---\n")
        print(prompt)

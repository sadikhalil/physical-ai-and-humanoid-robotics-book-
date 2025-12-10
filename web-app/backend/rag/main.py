import requests
import xml.etree.ElementTree as ET
import os
from dotenv import load_dotenv
import trafilatura

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere

# Load environment variables from .env file
load_dotenv()

SITEMAP_URL = "https://physical-ai-and-humanoid-robotics-b-ashy.vercel.app/sitemap.xml"
COLLECTION_NAME = "humanoid ai book"

# Initialize Cohere client
cohere_client = cohere.Client(api_key=os.getenv("COHERE_API_KEY"))
EMBEDDED_MODEL = "embed-english-v3.0"

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"), 
    api_key=os.getenv("QDRANT_API_KEY"),
)

def extract_urls_from_sitemap(sitemap_url: str) -> list[str]:
    """
    Extracts all URLs from a given sitemap URL, handling XML namespaces dynamically.
    """
    urls = []
    try:
        response = requests.get(sitemap_url)
        response.raise_for_status()
        root = ET.fromstring(response.content)

        # Dynamically get the namespace from root element
        ns = {'ns': root.tag.split('}')[0].strip('{')}
        urls = [loc.text for loc in root.findall('.//ns:loc', namespaces=ns) if loc.text]

    except requests.exceptions.RequestException as e:
        print(f"Error fetching sitemap: {e}")
    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
    return urls

def extract_text_from_urls(urls: list[str]) -> list[dict]:
    """
    Extracts the main text content from a list of URLs.
    Returns a list of dictionaries with 'url' and 'text'.
    """
    url_texts = []
    for url in urls:
        print(f"Extracting text from: {url}")
        try:
            downloaded = trafilatura.fetch_url(url)
            print(f"  - Downloaded content (first 200 chars): {downloaded[:200] if downloaded else 'None'}")
            text = trafilatura.extract(downloaded)
            print(f"  - Extracted text (first 200 chars): {text[:200] if text else 'None'}")
            if text:
                url_texts.append({'url': url, 'text': text})
            else:
                print(f"  - No text extracted from {url}")
        except Exception as e:
            print(f"  - Error processing {url}: {e}")
    return url_texts

def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 100) -> list[str]:
    """
    Splits a given text into smaller chunks using a sliding window.
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk.strip())
        start += chunk_size - chunk_overlap
    return [chunk for chunk in chunks if chunk]

def embed_and_prepare_for_qdrant(chunks: list[dict]) -> list[PointStruct]:
    """
    Embeds text chunks using Cohere and prepares them as Qdrant PointStruct objects.
    """
    points = []
    if not chunks:
        return points

    texts_to_embed = [chunk['text'] for chunk in chunks]
    
    try:
        response = cohere_client.embed(
            texts=texts_to_embed,
            model=EMBEDDED_MODEL,
            input_type='search_document'
        )
        embeddings = response.embeddings
        
        for i, chunk in enumerate(chunks):
            points.append(PointStruct(id=f"{chunk['url']}-{i}", vector=embeddings[i], payload=chunk))
    except Exception as e:
        print(f"Error embedding chunks with Cohere: {e}")
    
    return points

def ensure_collection_exists():
    """
    Checks if the Qdrant collection exists and creates it if it doesn't.
    """
    try:
        qdrant_client.get_collection(collection_name=COLLECTION_NAME)
        print(f"Collection '{COLLECTION_NAME}' already exists.")
    except Exception:
        print(f"Collection '{COLLECTION_NAME}' does not exist. Creating...")
        qdrant_client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")

def upsert_data_to_qdrant(points: list[PointStruct]):
    """
    Upserts a list of points into the Qdrant collection.
    """
    if not points:
        print("No points to upsert.")
        return

    print(f"Upserting {len(points)} points to Qdrant...")
    try:
        qdrant_client.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
            wait=True
        )
        print("Data has been successfully upserted to Qdrant.")
    except Exception as e:
        print(f"Error upserting data to Qdrant: {e}")

def main():
    print("Starting RAG data ingestion pipeline...")
    
    # 1. Extract URLs from sitemap
    print(f"Extracting URLs from: {SITEMAP_URL}")
    all_urls = extract_urls_from_sitemap(SITEMAP_URL)
    print(f"Found {len(all_urls)} URLs.")
    
    if not all_urls:
        print("No URLs found in sitemap. Exiting pipeline.")
        return

    # 2. Extract text content from URLs
    print("\nExtracting text from URLs...")
    extracted_data = extract_text_from_urls(all_urls)
    print(f"Extracted text from {len(extracted_data)} URLs.")
    
    if not extracted_data:
        print("No text extracted from URLs. Exiting pipeline.")
        return

    # 3. Chunk the extracted text
    all_chunks = []
    for item in extracted_data:
        chunks = chunk_text(item['text'])
        for i, chunk_text_content in enumerate(chunks):
            all_chunks.append({
                'id': f"{item['url']}-{i}",
                'text': chunk_text_content,
                'url': item['url']
            })
    print(f"Total chunks created: {len(all_chunks)}")

    if not all_chunks:
        print("No chunks created. Exiting pipeline.")
        return

    # 4. Embed chunks and prepare for Qdrant
    print("\nEmbedding chunks and preparing for Qdrant...")
    points_to_upsert = embed_and_prepare_for_qdrant(all_chunks)
    print(f"Prepared {len(points_to_upsert)} points for Qdrant.")

    if not points_to_upsert:
        print("No points prepared for Qdrant. Exiting pipeline.")
        return

    # 5. Ensure collection exists and upsert data
    print("\nEnsuring Qdrant collection exists and upserting data...")
    ensure_collection_exists()
    upsert_data_to_qdrant(points_to_upsert)
    
    print("\nRAG data ingestion pipeline completed.")

if __name__ == '__main__':
    main()
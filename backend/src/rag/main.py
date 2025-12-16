import requests
import os
from dotenv import load_dotenv
import trafilatura
from bs4 import BeautifulSoup

from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import cohere

load_dotenv()

# ========= DOC URL ==========
BASE_DOC_URL = "https://physical-ai-and-humanoid-robotics-b-ashy.vercel.app/docs"
TOC_URL = f"{BASE_DOC_URL}/Part%201%20-%20Foundations/introduction"

COLLECTION_NAME = "humanoid ai book"
EMBED_MODEL = "embed-english-v1" # Changed from embed-english-v2.0
co = cohere.Client(os.getenv("COHERE_API_KEY"))

qdrant = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

# ========= BeautifulSoup fallback ==========
def extract_text_bs4(html):
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.extract()
    return soup.get_text("\n", strip=True)

# ========= Crawl all chapter links from TOC ==========
def crawl_chapters():
    print("📌 Crawling index page for chapters...")
    response = requests.get(TOC_URL)
    soup = BeautifulSoup(response.text, "lxml")

    chapter_urls = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        # Only keep /docs/ links
        if "/docs/" in href:
            if href.startswith("http"):
                chapter_urls.append(href)
            else:
                chapter_urls.append("https://physical-ai-and-humanoid-robotics-b-ashy.vercel.app" + href)

    # Remove duplicates while preserving order
    chapter_urls = list(dict.fromkeys(chapter_urls))
    print(f"✔ Found {len(chapter_urls)} chapter URLs")
    return chapter_urls

# ========= Extract text with fallback ==========
def extract_text(url):
    print(f"Extracting → {url}")
    html = requests.get(url).text

    # Try trafilatura first
    text = trafilatura.extract(html)
    if text:
        return text

    # Fallback to BeautifulSoup
    print("⚠ Trafilatura failed → using BeautifulSoup fallback")
    text = extract_text_bs4(html)
    return text

# ========= Chunking ==========
def chunk(text, size=1024, overlap=100): # Changed size to 1024
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end])
        start += size - overlap
    return chunks

# ========= Create collection if needed ==========
def ensure_collection():
    try:
        qdrant.get_collection(COLLECTION_NAME)
        print("✔ Collection exists")
    except:
        print("Creating Qdrant collection...")
        qdrant.create_collection(
            COLLECTION_NAME,
            vectors_config=VectorParams(size=1024, distance=Distance.COSINE), # Changed size to 1024
        )
        print("✔ Created")

# ========= Embed + Upsert using integer IDs ==========
def process_and_upsert(chunks):
    texts = [c["text"] for c in chunks]
    embed = co.embed(texts=texts, model=EMBED_MODEL, input_type="search_document")
    vectors = embed.embeddings

    points = []
    for i, ch in enumerate(chunks):
        points.append(
            PointStruct(
                id=i,          # integer ID
                vector=vectors[i],
                payload=ch     # store original URL here
            )
        )

    qdrant.upsert(COLLECTION_NAME, points, wait=True)
    print("✔ Upserted to Qdrant")

# ========= MAIN ==========
def main():
    print("\n🚀 Starting ingestion")
    
    # 1. Crawl all chapters
    urls = crawl_chapters()
    if not urls:
        print("❌ No pages found. Stopping.")
        return

    # 2. Extract text
    all_chunks = []
    for url in urls:
        text = extract_text(url)
        if not text:
            print("⚠ No text extracted, skipping")
            continue

        pieces = chunk(text)
        for p in pieces:
            all_chunks.append({"url": url, "text": p})

    print(f"📌 Total chunks: {len(all_chunks)}")

    if not all_chunks:
        print("❌ No chunks created. Stop.")
        return

    # 3. Ensure collection exists and upsert
    ensure_collection()
    process_and_upsert(all_chunks)

    print("\n🎉 Completed successfully — data indexed.")

if __name__ == "__main__":
    main()



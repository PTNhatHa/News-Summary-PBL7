import uuid
import requests
from sentence_transformers import SentenceTransformer
import torch
from transformers import AutoTokenizer, AutoModel
from tqdm import tqdm
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

QDRANT_URL = ""
QDRANT_API_KEY = ""
COLLECTION_NAME = ""

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = SentenceTransformer("AITeamVN/Vietnamese_Embedding")
tokenizer = AutoTokenizer.from_pretrained('AITeamVN/Vietnamese_Embedding')
model.max_seq_length = 1024

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

def get_embedding(text: str) -> list:
    return model.encode(text).tolist()

def upload_to_qdrant(embedding: list, payload: dict):
    point_id = str(uuid.uuid4())
    point = PointStruct(
        id=point_id,
        vector=embedding,
        payload=payload
    )
    client.upload_points(collection_name=COLLECTION_NAME, points=[point])
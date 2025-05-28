# utils/chunking.py

import re

def chunk_text(text):
    """
    Chunk a given article's content by paragraphs (non-empty lines).
    """
    return [chunk.strip() for chunk in re.split(r'\n+', text) if chunk.strip()]

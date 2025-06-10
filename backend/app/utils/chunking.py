# utils/chunking.py

# import re

# def chunk_text(text):
#     """
#     Chunk a given article's content by paragraphs (non-empty lines).
#     """
#     return [chunk.strip() for chunk in re.split(r'\n+', text) if chunk.strip()]

import re

def chunk_text(text):
    """
    Chunk a given article's content into exactly 10 parts based on character length,
    splitting at the nearest whitespace to avoid cutting off words.
    """
    if not text.strip():
        return []

    # Calculate the approximate length of each chunk
    total_length = len(text)
    chunk_size = total_length // 10
    chunks = []
    start = 0

    for i in range(9):  # We need 9 split points to get 10 chunks
        # Target split point
        target = start + chunk_size
        if target >= total_length:
            break

        # Find the nearest whitespace to avoid splitting words
        while target < total_length and not text[target].isspace():
            target += 1

        # If we can't find a space, move backwards to find one
        if target == total_length:
            target = start + chunk_size
            while target > start and not text[target].isspace():
                target -= 1

        # If still no space found, use the original target
        if target == start:
            target = start + chunk_size

        # Add the chunk and update the start position
        chunks.append(text[start:target].strip())
        start = target

    # Add the final chunk
    chunks.append(text[start:].strip())

    # Ensure we have exactly 10 chunks, adjusting if necessary
    while len(chunks) < 10 and chunks:
        # Split the largest chunk into two
        largest_chunk = max(chunks, key=len)
        idx = chunks.index(largest_chunk)
        mid = len(largest_chunk) // 2
        # Find nearest whitespace to the middle
        while mid < len(largest_chunk) and not largest_chunk[mid].isspace():
            mid += 1
        if mid == len(largest_chunk):
            mid = len(largest_chunk) // 2
        chunks[idx:idx+1] = [largest_chunk[:mid].strip(), largest_chunk[mid:].strip()]

    # If text is too short and we still don't have 10 chunks, pad with empty strings
    while len(chunks) < 10:
        chunks.append("")

    return chunks[:10]  # Ensure exactly 10 chunks
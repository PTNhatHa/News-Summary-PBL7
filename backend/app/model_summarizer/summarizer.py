import torch
import os
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import gdown

def download_model_from_drive():
    model_dir = Path("./app/model_summarizer/vit5-summarization-v2")
    if model_dir.exists():
        print("Model already exists.")
        return

    # https://drive.google.com/drive/folders/1FaYCm0pPmM4pgJ9RJbKfPLNnePcugmpN?usp=sharing
    folder_id = "1FaYCm0pPmM4pgJ9RJbKfPLNnePcugmpN"

    print("Downloading model from Google Drive...")

    # gdown supports folder download with --folder
    os.makedirs(model_dir, exist_ok=True)
    os.system(f"gdown --folder https://drive.google.com/drive/folders/{folder_id} -O {model_dir}")

class Summarizer:
    def __init__(self):
        download_model_from_drive()
        model_path = Path("./app/model_summarizer/vit5-summarization-v2").resolve().as_posix()

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(str(model_path), local_files_only=True)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(str(model_path), local_files_only=True).to(self.device)

    def summarize(self, content_text: str, category: str) -> str:
        import re

        prefix = (
            "Dựa trên đoạn văn bản sau đây, hãy tạo một bản tóm tắt ngắn gọn và chính xác. "
            "Bản tóm tắt phải giữ nguyên tên bệnh dịch, tên người, địa danh, cơ quan tổ chức và các số liệu quan trọng. "
            "Không được bịa ra thông tin không có trong văn bản gốc. "
            "Tóm tắt nên dài khoảng 50 đến 75 từ và không vượt quá 75 từ. "
            "Không liệt kê ngày giờ, địa điểm nhỏ. Chỉ cung cấp bản tóm tắt, không thêm nhận xét.\n\n"
        )
        input_text = prefix + 'Đoạn tin tức (' + category + '): ' + content_text
        input_ids = self.tokenizer(input_text, return_tensors="pt", truncation=True, max_length=512).input_ids.to(self.device)

        output_ids = self.model.generate(
            input_ids,
            max_length=64,
            num_beams=6,
            no_repeat_ngram_size=3,
            repetition_penalty=3.0,
            length_penalty=3,
            early_stopping=True
        )

        summary = self.tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()

        summary = summary.replace('ĐNO - ', ' ')                           # Bỏ dấu gạch dưới
        summary = re.sub(r'\s+', ' ', summary).strip()               # Chuẩn hóa khoảng trắng

        sentences = re.split(r'(?<=[.!?])\s+', summary)
        if len(sentences) > 1:
            summary = sentences[0]

        return summary

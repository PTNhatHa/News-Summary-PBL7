import torch
import os
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, MBartForConditionalGeneration, MBart50TokenizerFast, GenerationConfig
import gdown
import re

def download_model_from_drive():
    # model_dir = Path("./app/model_summarizer/vit5-summarization-v2")
    model_dir = Path("./app/model_summarizer/mbart-summarization")
    if model_dir.exists():
        print("Model already exists.")
        return

    # https://drive.google.com/drive/folders/1FaYCm0pPmM4pgJ9RJbKfPLNnePcugmpN?usp=sharing
    # https://drive.google.com/drive/folders/1RwVH2vDkG4eL9W4yZLLhmVxsBclKTG2v
    # https://drive.google.com/drive/folders/1siubDROu03D2D_goG48NZkKH_XpijuFu?usp=sharing  ----mbart-----
    # https://drive.google.com/drive/folders/1lU2S8basrTYLV5QQLSZIs2k2RSv_pyzm?usp=sharing
    folder_id = "1lU2S8basrTYLV5QQLSZIs2k2RSv_pyzm"

    print("Downloading model from Google Drive...")

    # gdown supports folder download with --folder
    os.makedirs(model_dir, exist_ok=True)
    os.system(f"gdown --folder https://drive.google.com/drive/folders/{folder_id} -O {model_dir}")

class Summarizer:
    def __init__(self):
        download_model_from_drive()
        model_path = Path("./app/model_summarizer/mbart-summarization").resolve().as_posix()

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f'Đang sử dụng thiết bị: {self.device}')
        self.tokenizer = MBart50TokenizerFast.from_pretrained(str(model_path), local_files_only=True)
        self.model = MBartForConditionalGeneration.from_pretrained(str(model_path), local_files_only=True)
        self.tokenizer.src_lang = "vi_VN"
        self.model.to(self.device)

    @staticmethod
    def clean_text(text):
            text = re.sub(r'<.*?>', '', text)  # bỏ HTML
            text = text.replace('\n', ' ').replace('\t', ' ').strip()
            text = re.sub(r'\s+', ' ', text)  # bỏ khoảng trắng thừa
            return text
    
    def summarize(self, content_text: str) -> str:     
        cleaned_text = self.clean_text(content_text)
        prefix = (
            "Dựa trên đoạn văn bản sau đây, hãy đưa ra một bản tóm tắt cho nội dung đã được cung cấp. "
            "Bản tóm tắt nên có độ dài khoảng 50 từ đến 75 từ. Không vượt quá 75 từ. "
            "Bản tóm tắt cần rõ ràng và tóm tắt được những ý chính của nội dung đã được cung cấp. "
            "Chỉ cung cấp bản tóm tắt, không thêm các thông tin gì khác.\n\n"
        )
        input_text = prefix + 'Đoạn tin tức cần tóm tắt: ' + cleaned_text
        inputs = self.tokenizer(input_text, return_tensors="pt", truncation=True, max_length=1024).to(self.device)

        summary_ids = self.model.generate(
            **inputs,
            max_length=128,
            num_beams=6,
            length_penalty=3.0,
            repetition_penalty=3.0,
            early_stopping=True,
            forced_bos_token_id=self.tokenizer.lang_code_to_id["vi_VN"]  # đảm bảo sinh ra văn bản tiếng Việt
        )

        summary = self.tokenizer.decode(summary_ids[0], skip_special_tokens=True).strip()
        summary = summary.replace('ĐNO - ', ' ')                           
        summary = re.sub(r'\s+', ' ', summary).strip()               # Chuẩn hóa khoảng trắng

        return summary

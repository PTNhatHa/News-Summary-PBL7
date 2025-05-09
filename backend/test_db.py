import pymysql

connection = pymysql.connect(
    host="127.0.0.1",
    user="root",
    password="",  # nếu có mật khẩu, điền vào đây
    database="news_summarizer",
    port=3306
)

print("Kết nối thành công!")
connection.close()

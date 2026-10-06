# Máy tính đơn giản (web tĩnh)

Cộng, trừ, nhân, chia. Chỉ gồm HTML, CSS và JavaScript, không cần cài thêm gì.
Hỗ trợ bàn phím: số, `+ - * /`, `Enter`, `Backspace`, `Esc`.

## 1. Chạy thử trên máy

Mở file `index.html` bằng trình duyệt.

## 2. Đưa lên GitHub

Các file `index.html`, `style.css`, `script.js` phải nằm ở **thư mục gốc** của repo.
Repo phải là **Public** để container tải về được.

**Cách dễ nhất (không cần cài git):** trên github.com, tạo repo mới, chọn
*Add file → Upload files*, kéo thả 3 file vào, rồi chọn *Commit changes*.

**Cách dùng dòng lệnh:**

```bash
git init
git add index.html style.css script.js
git commit -m "May tinh don gian"
git branch -M main
git remote add origin https://github.com/TEN_CUA_BAN/TEN_REPO.git
git push -u origin main
```

## 3. Triển khai lên OpenStack (Zun)

Trong Horizon: **Project → Container → Containers → Create Container**.

- **Image**: `nginx:alpine`
- **Command** (thay `TEN_CUA_BAN` và `TEN_REPO`):

```
sh -c "apk add --no-cache git && rm -rf /usr/share/nginx/html/* && git clone --depth 1 https://github.com/TEN_CUA_BAN/TEN_REPO /tmp/site && cp /tmp/site/index.html /tmp/site/style.css /tmp/site/script.js /usr/share/nginx/html/ && nginx -g 'daemon off;'"
```

Lệnh này cài git, tải mã nguồn từ GitHub, chép 3 file vào thư mục web của nginx
rồi chạy nginx.

Sau đó:

1. Mở cổng 80 cho container bằng security group (Ingress, TCP, cổng 80).
2. Gắn floating IP cho container.
3. Mở `http://<FLOATING_IP>` trên trình duyệt.

## 4. Cập nhật trang web

Sửa file, đẩy lên GitHub, rồi xóa container và tạo lại với cùng Command.
Mỗi lần container khởi động sẽ tải bản mới nhất từ GitHub.

## Nếu trang không mở được

- Tab **Logs** của container có báo lỗi `git clone` không? Kiểm tra lại đường dẫn repo và repo có để Public chưa.
- Container cần ra được internet để tải git và mã nguồn.
- Kiểm tra security group đã mở cổng 80 và floating IP đã gắn vào container.

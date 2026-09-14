# Use case UC-01: Caregiver kiểm tra và xử lý cảnh báo té ngã

## Bối cảnh

Bà An ở nhà, Minh Anh là người thân được giao theo dõi cảnh báo. Camera phòng khách ghi nhận chuyển động bất thường. Trong bản demo này toàn bộ tình huống được mô phỏng bằng dữ liệu mẫu.

## Tác nhân và điều kiện

- Tác nhân chính: Minh Anh, caregiver.
- Hệ thống dự kiến: camera, AI, backend, Telegram và dashboard.
- Điều kiện demo: ít nhất một camera bật giám sát và có trạng thái kết nối mô phỏng.
- Để minh họa có người nhận cảnh báo: ít nhất một caregiver đang bật thông báo.
- Kích hoạt: bấm **Mô phỏng té ngã**.

## Luồng chính

1. Camera mô phỏng ghi nhận bà An đang đứng, mất thăng bằng rồi nằm ngang.
2. AI mô phỏng kiểm tra tư thế nằm yên trong 3 giây.
3. Hệ thống tạo sự kiện Detected, có thời gian, camera, vị trí và điểm AI 94% minh họa.
4. Giao diện mở chi tiết: ảnh keypoints, diễn biến 10 giây, lịch sử và mẫu tin nhắn Telegram.
5. Minh Anh xem bằng chứng và bấm **Xác nhận té ngã**; sự kiện chuyển sang Confirmed.
6. Sau khi minh họa việc kiểm tra và hỗ trợ bà An, Minh Anh bấm **Đã hỗ trợ / Đã xử lý**; sự kiện chuyển sang Resolved.
7. Số cảnh báo chờ xác nhận giảm; lịch sử và thống kê cập nhật.

## Luồng thay thế

- Nếu đây là hành động nằm xuống có chủ ý: chọn **Đánh dấu báo động giả**. Hệ thống lưu trạng thái False Alarm và cập nhật thống kê.
- Nếu tất cả camera đều tạm dừng hoặc ngoại tuyến: bấm mô phỏng sẽ hiện lý do và không tạo sự kiện.
- Nếu tất cả caregiver tắt thông báo: vẫn tạo sự kiện nhưng lịch sử ghi rõ không có người nhận được bật.

## Kịch bản nói và thao tác trong 3–5 phút

1. **Tổng quan (30 giây):** “Đây là dashboard dành cho người thân hoặc caregiver. Mục đích là nhìn thấy cảnh báo nào cần xử lý và camera nào đang hoạt động.”
2. **Tạo cảnh báo (30 giây):** “Em mô phỏng một sự kiện té ngã ở phòng khách. Khi tích hợp thật, dữ liệu này sẽ do AI gửi qua backend.”
3. **Xem bằng chứng (60 giây):** Chọn “Diễn biến 10 giây”, bấm phát. “Sơ đồ này minh họa việc kiểm tra nhiều thời điểm thay vì chỉ nhìn một frame. Hiện chưa chạy mô hình AI.”
4. **Caregiver xử lý (45 giây):** Bấm xác nhận, chỉ lịch sử mới; bấm đã xử lý. “AI đưa ra cảnh báo, còn người chăm sóc kiểm tra và quyết định.”
5. **Luồng báo động giả (30 giây):** Tạo sự kiện khác, đánh dấu báo động giả.
6. **Thống kê và quản lý (45 giây):** Mở thống kê rồi camera/caregiver để cho thấy dữ liệu và cấu hình thay đổi được.

## Phân chia nhóm

| Thành viên | Phần tích hợp tiếp theo |
|---|---|
| 1–2 | Camera input, YOLO/Pose, logic theo thời gian, xác nhận sự kiện và bằng chứng |
| 3 | FastAPI, PostgreSQL, lưu evidence, Telegram và API cập nhật trạng thái |
| 4 | Dashboard, gọi API, hiển thị evidence thật và quy trình caregiver |

Backend cần là nguồn dữ liệu và nơi kiểm tra trạng thái hợp lệ khi tích hợp thật. Bản demo hiện kiểm tra trạng thái trong frontend để trình bày luồng.

## Câu kết khi báo cáo tiến độ

“Nhóm đã hoàn thành prototype frontend thể hiện các chức năng và luồng xử lý. Bước tiếp theo là thống nhất cấu trúc fall event, xây API và kết nối AI, bằng chứng thực tế cùng thông báo Telegram.”

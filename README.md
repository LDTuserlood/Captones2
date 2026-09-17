# FallGuard — Demo đồ án phát hiện và cảnh báo té ngã

Toàn bộ mã nguồn nằm trong thư mục này. Đây là bản frontend để trình bày với giảng viên, sử dụng Next.js, React và TypeScript.

## Mở nhanh cho buổi họp

1. Bấm đúp `MO-DEMO.cmd` trong thư mục dự án.
2. Giữ cửa sổ chạy web đang mở.
3. Mở http://127.0.0.1:3000 trong Chrome hoặc Edge.
4. Nếu web đã chạy, chỉ cần mở địa chỉ trên. Dừng bằng Ctrl+C trong cửa sổ chạy web.

Script ưu tiên Node.js trên máy. Nếu chưa có, nó thử môi trường Node.js đi kèm Codex đã được dùng để chuẩn bị demo trên máy này. Khi chuyển dự án sang máy khác, cần cài Node.js 24 LTS và cài dependencies.

## Chạy khi phát triển tiếp

- Cài dependencies theo lockfile: `npx pnpm@11.19.0 install --frozen-lockfile`
- Chạy chế độ phát triển: `npm run dev`
- Kiểm tra TypeScript: `npm run typecheck`
- Tạo bản chạy trình bày: `npm run build`
- Chạy bản đã build: `npm start`

`npm` có sẵn cùng bộ cài Node.js thông thường. Dự án lưu `pnpm-lock.yaml` để các thành viên dùng cùng phiên bản thư viện. Không cần Python hoặc database để chạy demo này.

## Chức năng đã làm

- Tổng quan: số liệu, cảnh báo chờ xác nhận, trạng thái camera.
- Sự kiện: tìm theo mã/vị trí, lọc trạng thái, xem chi tiết.
- Chi tiết: sơ đồ keypoints, diễn biến mô phỏng 10 giây có phát/tạm dừng và tua, mẫu cảnh báo Telegram, lịch sử xử lý.
- Quy trình: Detected → Confirmed → Resolved; Detected hoặc Confirmed → False Alarm.
- Camera: thêm, sửa tên/vị trí, bật/tắt giám sát, thử trạng thái kết nối.
- Caregiver: thêm, sửa, bật/tắt nhận cảnh báo.
- Thống kê: hôm nay/7 ngày/30 ngày; số sự kiện, camera nhiều cảnh báo, tỷ lệ báo động giả và phản hồi trung bình.
- Mô phỏng té ngã: tạo sự kiện ở camera đầu tiên đang kết nối và bật giám sát. Nếu không có camera phù hợp, giao diện thông báo lý do.
- Dữ liệu demo lưu bằng localStorage trên trình duyệt hiện tại. Trong phần hướng dẫn có nút đặt lại dữ liệu.
- Hỗ trợ màn hình nhỏ, thao tác bàn phím và đóng hộp thoại bằng Escape.

## Kịch bản trình bày

Xem `docs/KICH-BAN-DEMO.md` hoặc bấm **Xem kịch bản demo** trong web.

## Giới hạn cần nói rõ với thầy

Đây là demo giao diện và quy trình, chưa có backend, AI inference, RTSP, PostgreSQL hoặc Telegram thật. Các tên, sự kiện và điểm AI đều là dữ liệu mẫu. Bằng chứng là sơ đồ keypoints và hoạt ảnh minh họa, không phải ảnh/video camera thật. Camera mới là thông tin mô phỏng, không thực hiện kiểm tra kết nối.

Không có đăng nhập thật. Tài khoản Minh Anh là vai trò minh họa. Dữ liệu chỉ nằm trên trình duyệt này, không đồng bộ giữa các máy. Điểm AI không phải xác suất té ngã đã được hiệu chuẩn. Tỷ lệ báo động giả tính trên những sự kiện đã được caregiver kiểm tra, không phải precision/recall của mô hình.

## Cấu trúc để nhóm phát triển tiếp

Kế hoạch riêng cho module hồ sơ và theo dõi sức khỏe người cao tuổi (01/09–20/12/2026): [kế hoạch triển khai](docs/KE-HOACH-MODULE-SUC-KHOE-NGUOI-CAO-TUOI.md) và [bảng theo dõi công việc](docs/THEO-DOI-MODULE-SUC-KHOE.md).

- `app/`: trang Next.js, metadata và giao diện chung.
- `components/dashboard.tsx`: điều hướng, trạng thái chung, sự kiện và mô phỏng.
- `components/evidence.tsx`: bằng chứng và quy trình xác nhận.
- `components/management.tsx`: camera và caregiver.
- `components/statistics.tsx`: thống kê dựa trên dữ liệu sự kiện.
- `components/modal.tsx`: hộp thoại có điều khiển bàn phím.
- `lib/demo-data.ts`: kiểu dữ liệu, dữ liệu mẫu và kiểm tra dữ liệu lưu.
- `public/`: favicon và tài nguyên công khai.

Các mục dùng URL hash (`#overview`, `#events`, `#cameras`, `#caregivers`, `#statistics`) trong một ứng dụng frontend. Chi tiết sự kiện mở dạng hộp thoại. Khi backend sẵn sàng, thay phần đọc/ghi localStorage bằng API; giữ các thành phần giao diện và kiểu dữ liệu.

Ứng dụng có đăng ký WebMCP đọc sự kiện mô phỏng nếu trình duyệt hỗ trợ API thử nghiệm; trình duyệt thông thường bỏ qua mà không ảnh hưởng demo.

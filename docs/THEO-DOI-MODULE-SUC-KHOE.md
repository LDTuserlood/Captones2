# Bảng theo dõi module sức khỏe người cao tuổi

> **Bảng tiến độ chính:** [GitHub Project — Module sức khỏe người cao tuổi](https://github.com/users/LDTuserlood/projects/3/views/3). Các thẻ EH-01 đến EH-20 là GitHub Issues có hạn, người phụ trách và tiêu chí hoàn thành. Cập nhật trạng thái tại GitHub Project; bảng Markdown dưới đây là bản kế hoạch gốc và có thể không phản ánh trạng thái mới nhất.

**Tài liệu gốc:** [Kế hoạch và tiêu chí nghiệm thu](KE-HOACH-MODULE-SUC-KHOE-NGUOI-CAO-TUOI.md)

**Ngày bắt đầu dự án:** 01/09/2026 · **Hạn hoàn thành:** 20/12/2026 · **Người phụ trách:** chủ module hồ sơ sức khỏe
**Cập nhật cuối:** 2026-09-17 · **Trạng thái tổng thể của module:** Chưa bắt đầu; web nền của dự án đã có

## Cách dùng như một bảng Trello trong Git

Mỗi `EH-xx` là một GitHub Issue. Trên [bảng Kanban](https://github.com/users/LDTuserlood/projects/3/views/3), chuyển thẻ từ `Todo` sang `In Progress` khi bắt đầu và sang `Done` khi đạt tiêu chí; ghi link commit/PR hoặc kết quả kiểm tra trong Issue tương ứng. Cột **Trạng thái** dưới đây ghi lại trạng thái lúc lập kế hoạch, không phải dữ liệu tự đồng bộ từ GitHub.

| Mã | Hạn dự kiến | Thẻ công việc | Trạng thái | Minh chứng / ghi chú |
|---|---|---|---|---|
| EH-01 | 21/09 | Khảo sát web và chốt phạm vi | Todo | — |
| EH-02 | 25/09 | Luồng người dùng và bản phác giao diện | Todo | — |
| EH-03 | 29/09 | ERD và quy tắc dữ liệu | Todo | — |
| EH-04 | 03/10 | Hợp đồng API và phân quyền | Todo | — |
| EH-05 | 07/10 | Môi trường backend và PostgreSQL | Todo | — |
| EH-06 | 11/10 | Schema và migration | Todo | — |
| EH-07 | 16/10 | Đăng nhập và quyền sở hữu | Todo | — |
| EH-08 | 21/10 | API hồ sơ/người chăm sóc | Todo | — |
| EH-09 | 26/10 | API bệnh, thuốc, nhật ký | Todo | — |
| EH-10 | 30/10 | Kiểm thử backend | Todo | — |
| EH-11 | 04/11 | Giao diện hồ sơ | Todo | — |
| EH-12 | 09/11 | Giao diện nhật ký | Todo | — |
| EH-13 | 13/11 | Biểu đồ và thống kê | Todo | — |
| EH-14 | 18/11 | Xu hướng và trạng thái chưa đủ dữ liệu | Todo | — |
| EH-15 | 24/11 | Mô hình phát hiện bất thường | Todo | — |
| EH-16 | 29/11 | Giao diện insight và lịch sử | Todo | — |
| EH-17 | 04/12 | Tập demo và đánh giá | Todo | — |
| EH-18 | 10/12 | Kiểm thử toàn luồng và sửa lỗi | Todo | — |
| EH-19 | 14/12 | Đóng gói và hướng dẫn chạy | Todo | — |
| EH-20 | 18/12 | Tài liệu và tập bảo vệ | Todo | — |

## Việc đang làm tuần này

- [ ] EH-01 — Khảo sát web và chốt phạm vi.
- [ ] EH-02 — Luồng người dùng và bản phác giao diện.
- [ ] EH-03 — ERD và quy tắc dữ liệu.
- [ ] EH-04 — Hợp đồng API và phân quyền.

## Quyết định còn mở

| Vấn đề | Giá trị tạm dùng | Người chốt / hạn |
|---|---|---|
| Lịch review với nhóm | 03/10, 30/10, 29/11, 18/12 | Nhóm xác nhận |
| Số người cao tuổi trên một tài khoản | Nhiều người | Chủ module |
| Backend chung của nhóm | Module FastAPI độc lập, ghép bằng API | Nhóm |
| Dữ liệu thử | Hồ sơ và nhật ký giả lập, ghi rõ nguồn | Chủ module |

## Nhật ký tiến độ

Thêm một dòng khi kết thúc ngày làm việc. Ghi vấn đề thật và bước tiếp theo, không chỉ ghi “đã làm”.

| Ngày thực tế | Thẻ | Đã hoàn thành | Kiểm tra / kết quả | Vướng mắc và bước tiếp theo |
|---|---|---|---|---|
| 17/09/2026 | — | Xác nhận web nền hiện có và tạo bảng kế hoạch module | Kiểm tra repo; chưa có backend/database cho module | Bắt đầu EH-01 từ 18/09 |

## Mốc kiểm tra

- [ ] **03/10 — sau EH-04:** phạm vi, giao diện, ERD, API và phân quyền được duyệt.
- [ ] **30/10 — sau EH-10:** backend lưu và đọc dữ liệu thật, có kiểm thử quyền.
- [ ] **29/11 — sau EH-16:** người dùng thao tác trọn luồng trên web và xem insight.
- [ ] **18/12 — sau EH-20:** demo, tài liệu, đánh giá và hướng dẫn chạy hoàn chỉnh; 19–20/12 là dự phòng.

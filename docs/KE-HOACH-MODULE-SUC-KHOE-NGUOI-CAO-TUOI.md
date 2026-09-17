# Kế hoạch module hồ sơ và theo dõi sức khỏe người cao tuổi

> Phạm vi: chỉ phần của người phụ trách module hồ sơ sức khỏe. Dự án bắt đầu **01/09/2026** và hạn hoàn thành là **20/12/2026**. Kế hoạch có 20 thẻ công việc với khoảng ngày và hạn riêng; ngày 19–20/12 là thời gian dự phòng trước hạn.

**Hiện trạng tại 17/09/2026:** web nền Next.js đã có trong repo. Module hồ sơ sức khỏe chưa được triển khai, nên không tự đánh dấu các thẻ của module là hoàn thành. Khoảng 01–17/09 được ghi nhận là giai đoạn chuẩn bị web nền của dự án, không tính là kết quả đã hoàn thành của module này.

## 1. Mục tiêu và ranh giới

Người chăm sóc có thể đăng nhập, quản lý hồ sơ của một hoặc nhiều người cao tuổi, ghi nhật ký sinh hoạt, xem biểu đồ theo thời gian và xem nhận xét khi dữ liệu thay đổi đáng chú ý. Mỗi nhận xét phải nêu dữ liệu dẫn tới kết quả và trạng thái đủ/chưa đủ lịch sử.

Module này **không** xử lý camera, nhận diện té ngã, Telegram, chẩn đoán bệnh hoặc đưa ra quyết định y tế. Khi nhóm tích hợp, module cung cấp `elder_id` và API đọc hồ sơ có phân quyền để liên kết với sự kiện té ngã. Không sửa logic AI té ngã của thành viên khác.

### Kết quả phải trình bày được khi bảo vệ

1. Kiến trúc frontend → backend → database → phân tích AI.
2. Sơ đồ dữ liệu và luồng nhập, lưu, phân tích, hiển thị.
3. Tài khoản A không xem/sửa được hồ sơ của tài khoản B.
4. Tình huống dữ liệu bình thường, thay đổi rõ rệt, thiếu dữ liệu và chưa đủ lịch sử.
5. Cách đánh giá kết quả phát hiện thay đổi; giới hạn của dữ liệu demo.
6. Demo chạy lại được từ một hướng dẫn duy nhất.

## 2. Công nghệ đã chốt và trách nhiệm

| Lớp | Công nghệ | Trách nhiệm | Trạng thái trên máy hiện tại |
|---|---|---|---|
| Frontend | Next.js 16, React 19, TypeScript, CSS hiện có | Form, điều hướng, biểu đồ, hiển thị insight | Dự án đã có |
| Backend | Python, FastAPI, Pydantic | API, kiểm tra dữ liệu, phân quyền, gọi bộ phân tích | Cần tạo mới; Python đã có |
| Database | PostgreSQL | Lưu hồ sơ, người chăm sóc, nhật ký, insight | Chưa thấy công cụ dòng lệnh; cần kiểm tra/cài |
| Truy cập dữ liệu | SQLAlchemy, Alembic | Ánh xạ bảng và quản lý thay đổi schema | Cài cùng backend |
| Phân tích | scikit-learn và thống kê xu hướng bằng Python | Phát hiện dữ liệu khác thường, giải thích bằng giá trị quan sát | Cài cùng backend |
| Kiểm thử | pytest; kiểm tra TypeScript/build hiện có | Kiểm tra API, quyền, dữ liệu và giao diện | Thiết lập khi triển khai |
| Đóng gói | Docker Compose | Chạy frontend, backend, database nhất quán | Để giai đoạn cuối |
| Quản lý công việc | Git + tài liệu theo dõi trong repo | Lưu lịch sử thay đổi, giao việc, review | Repo GitHub đã có |

**Cài đặt trên Windows:** Bắt đầu với PostgreSQL và pgAdmin từ bộ cài Windows chính thức. Node.js và Python đã có trên máy dự án. Docker Desktop chỉ cần trước giai đoạn đóng gói. Không cần mua API AI. Không đưa mật khẩu, dữ liệu bệnh án thật hoặc khóa truy cập vào Git.

## 3. Thiết kế chức năng

### Dữ liệu nhập một lần và cập nhật khi thay đổi

- Hồ sơ: tên, ngày sinh, chiều cao, cân nặng ban đầu, khả năng đi lại, thông tin liên hệ.
- Bệnh/tình trạng **đã được ghi nhận** và thuốc đang dùng: thông tin do người chăm sóc nhập; hệ thống không tự chẩn đoán hoặc kê đơn.
- Quan hệ người chăm sóc ↔ người cao tuổi: một người chăm sóc có thể quản lý nhiều hồ sơ; một hồ sơ có thể chia sẻ cho nhiều người được cấp quyền.

### Nhật ký theo ngày

- Ngày ghi nhận, số giờ ngủ, mức ăn uống 1–5, mức vận động 1–5, mức mệt 1–5, mức đau 1–5, ghi chú.
- Cân nặng có thể cập nhật theo tuần. Trường không được nhập phải được đánh dấu là **thiếu dữ liệu**, không tự thay bằng số 0.
- Một hồ sơ chỉ có một bản ghi chính cho mỗi ngày; người có quyền có thể sửa và hệ thống lưu thời gian sửa.

### Phân tích và cách diễn giải

- Luôn có thống kê xu hướng 7/14/30 ngày và so sánh với lịch sử riêng của người đó.
- Khi chưa có đủ lịch sử, chỉ hiện xu hướng và trạng thái `Chưa đủ dữ liệu cho mô hình cá nhân hóa`.
- Khi đủ dữ liệu hợp lệ, thử mô hình Isolation Forest để đánh dấu **ngày có mẫu sinh hoạt khác thường**. Ngưỡng dùng mô hình sẽ được chốt qua thử nghiệm; không hứa một số ngày cố định trước khi đánh giá dữ liệu thực tế.
- Giải thích dựa trên các chỉ số thay đổi có thể kiểm chứng: ví dụ số giờ ngủ và mức vận động so với khoảng trước đó. Không gọi điểm bất thường là “xác suất mắc bệnh” hoặc “nguy cơ té ngã”.
- Một insight lưu: người cao tuổi, khoảng ngày, chỉ số liên quan, dữ liệu đối chiếu, phiên bản quy tắc/mô hình, thời gian tạo và trạng thái đã xem.

### Bảng dữ liệu dự kiến

`users`, `elders`, `elder_caregivers`, `health_conditions`, `medications`, `daily_logs`, `insights`. Sơ đồ quan hệ chi tiết và ràng buộc dữ liệu là đầu ra của ngày 3.

### API dự kiến

`/auth`, `/elders`, `/elders/{id}/conditions`, `/elders/{id}/medications`, `/elders/{id}/logs`, `/elders/{id}/insights`. Danh sách method, dữ liệu vào/ra, lỗi và quyền cụ thể là đầu ra của ngày 4. Đường dẫn là hợp đồng của module, không phụ thuộc phần té ngã.

## 4. Lịch triển khai từ 01/09 đến 20/12/2026

Mỗi dòng là một thẻ công việc và một khoảng thời gian dự kiến. Cập nhật trạng thái thực tế tại [bảng theo dõi](THEO-DOI-MODULE-SUC-KHOE.md) thay vì đánh dấu hoàn thành chỉ vì đã qua hạn.

| Thời gian dự kiến | Mã | Việc chính | Đầu ra có thể kiểm tra |
|---|---|---|---|
| 01–17/09 | Hiện trạng | Web nền của dự án đã có; khảo sát repo | Chỉ ghi nhận hiện trạng, không tính hoàn thành module sức khỏe |
| 18–21/09 | EH-01 | Khảo sát web hiện tại, xác nhận phạm vi và luồng người dùng | Danh sách màn hình, dữ liệu, ngoài phạm vi và rủi ro tích hợp |
| 22–25/09 | EH-02 | Vẽ luồng nhập hồ sơ, nhật ký, nhận xét; phác giao diện | Sơ đồ luồng và bản phác các màn hình |
| 26–29/09 | EH-03 | Thiết kế PostgreSQL và quan hệ dữ liệu | ERD, trường dữ liệu, khóa, ràng buộc, quy tắc dữ liệu thiếu |
| 30/09–03/10 | EH-04 | Chốt hợp đồng API và quyền truy cập | Bảng endpoint, request/response, mã lỗi, quyền từng vai trò |
| 04–07/10 | EH-05 | Chuẩn bị PostgreSQL, môi trường backend, cấu hình bí mật mẫu | Backend khởi động và kết nối database; không commit mật khẩu |
| 08–11/10 | EH-06 | Tạo schema và migration | Có thể tạo database trống và nâng schema lại từ đầu |
| 12–16/10 | EH-07 | Xây đăng nhập và kiểm tra quyền sở hữu hồ sơ | Người không được cấp quyền bị từ chối ở backend |
| 17–21/10 | EH-08 | API tạo, xem, sửa hồ sơ và người chăm sóc | Có thể quản lý nhiều người cao tuổi bằng API |
| 22–26/10 | EH-09 | API bệnh đã ghi nhận, thuốc và nhật ký theo ngày | Tạo/sửa/đọc dữ liệu, chặn giá trị ngoài phạm vi và ngày trùng |
| 27–30/10 | EH-10 | Kiểm tra backend, migration và phân quyền | Bộ kiểm thử chạy được; sửa các lỗi cản luồng chính |
| 31/10–04/11 | EH-11 | Thêm khu vực Hồ sơ người cao tuổi vào web | Danh sách, thêm/sửa/xem hồ sơ bằng API thật |
| 05–09/11 | EH-12 | Giao diện nhập nhật ký | Nhập, sửa, xem lịch sử; báo lỗi rõ ràng khi dữ liệu sai |
| 10–13/11 | EH-13 | Biểu đồ và thống kê 7/14/30 ngày | Xem được các giá trị và ngày thiếu dữ liệu |
| 14–18/11 | EH-14 | Bộ phân tích xu hướng và trường hợp chưa đủ dữ liệu | Kết quả có giá trị đối chiếu; không gán nhãn AI khi chưa đủ lịch sử |
| 19–24/11 | EH-15 | Thử mô hình phát hiện bất thường | Lưu mô hình/phiên bản, đầu vào, đầu ra và lý do gắn cờ |
| 25–29/11 | EH-16 | Tích hợp insight vào web và lịch sử | Người dùng xem ngày bị gắn cờ, chỉ số liên quan, đánh dấu đã xem |
| 30/11–04/12 | EH-17 | Chuẩn bị tập demo có nhãn và đánh giá | Báo cáo precision/recall trên tình huống thử; nêu rõ dữ liệu giả lập |
| 05–10/12 | EH-18 | Kiểm thử toàn luồng, bảo mật cơ bản, sửa lỗi | Kịch bản từ đăng nhập đến insight chạy trọn vẹn |
| 11–14/12 | EH-19 | Đóng gói và viết tài liệu chạy, sao lưu, cấu hình | Máy khác có thể dựng hệ thống theo hướng dẫn |
| 15–18/12 | EH-20 | Tập demo và hoàn thiện tài liệu bảo vệ | Sơ đồ kiến trúc, ERD, API, cách AI hoạt động, giới hạn, video/kịch bản demo |
| 19–20/12 | Dự phòng | Sửa lỗi phát hiện khi diễn tập và bàn giao | Không thêm tính năng mới; hoàn thành trước hạn 20/12 |

**Mốc review:** 03/10 (thiết kế), 30/10 (backend), 29/11 (chức năng hoàn chỉnh), 18/12 (bảo vệ). Nếu trễ, ưu tiên bảo đảm luồng hồ sơ → nhật ký → phân tích → hiển thị hoạt động trước khi thêm tiện ích.

**Nhịp theo dõi mỗi ngày làm việc:** đầu ngày chọn thẻ và đầu ra cần đạt; cuối ngày cập nhật trạng thái, minh chứng, kiểm tra đã chạy và vướng mắc trong [nhật ký tiến độ](THEO-DOI-MODULE-SUC-KHOE.md). Mỗi cuối tuần xem hạn của tuần tới và điều chỉnh khoảng ngày nếu cần. Khoảng ngày là kế hoạch, không phải xác nhận đã làm.

## 5. Tiêu chí hoàn thành chung cho từng thẻ

Một thẻ chỉ chuyển sang `Done` khi:

1. Đầu ra trong lịch đã tồn tại và có thể mở/chạy để kiểm tra.
2. Thay đổi được lưu bằng commit có mã `EH-xx`; không chứa mật khẩu hoặc dữ liệu cá nhân thật.
3. Có bước kiểm tra tương ứng và ghi kết quả vào bảng theo dõi.
4. Nếu thay đổi API hoặc dữ liệu, tài liệu liên quan được cập nhật.
5. Phần giao diện được kiểm tra ít nhất ở màn hình máy tính và điện thoại.

## 6. Quy tắc Git để theo dõi tiến độ

- Nhánh tích hợp của module: `codex/elder-health-profile`. Không trộn thay đổi AI té ngã vào nhánh này.
- Mỗi thẻ dùng nhánh ngắn nếu có nhiều người cùng sửa, ví dụ `codex/eh-09-daily-logs`; nếu một người làm tuần tự, có thể commit từng thẻ trên nhánh module.
- Commit gắn mã thẻ, ví dụ `feat(elder): EH-09 add daily log API`, `test(elder): EH-10 cover access rules`, `docs(elder): EH-20 add defense guide`.
- Cuối mỗi mốc review: xem diff, chạy kiểm tra, cập nhật bảng tiến độ, rồi mới gộp vào nhánh tích hợp của nhóm.
- Mật khẩu, chuỗi kết nối và khóa API nằm trong biến môi trường; chỉ đưa file mẫu không có bí mật vào Git.

## 7. Cách đánh giá và giới hạn phải nói rõ

- Dùng kịch bản có nhãn: ngày bình thường, ngày ngủ/vận động thay đổi, dữ liệu thiếu, bản ghi nhập sai. Ghi số đúng/sai và số cảnh báo giả.
- Nếu dữ liệu demo là dữ liệu mô phỏng, chỉ kết luận hệ thống **hoạt động đúng trên kịch bản thử**. Không kết luận đã được kiểm chứng lâm sàng hoặc có thể dự đoán bệnh.
- So sánh với cách chỉ dùng ngưỡng cố định để giải thích vì sao dùng lịch sử từng người và mô hình phát hiện bất thường.
- Kiểm tra khả năng người chăm sóc hiểu được mỗi insight, không chỉ hiển thị một điểm số bí ẩn.

## 8. Việc cần chốt với nhóm

1. Ngày bắt đầu và hạn đã chốt; nhóm xác nhận lịch review thực tế có phù hợp không.
2. Chủ sở hữu backend/database chung và cách ghép module FastAPI này vào hệ thống nhóm.
3. Quy ước `elder_id` để phần té ngã liên kết hồ sơ mà không phụ thuộc vào cấu trúc bên trong module.
4. Người nào có quyền xem hồ sơ và dữ liệu nào được phép xuất hiện trong thông báo té ngã.

Các quyết định này được ghi trong bảng theo dõi khi có câu trả lời; lịch theo thẻ vẫn dùng được trong lúc chờ.

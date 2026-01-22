# Yêu cầu hệ thống quản lý đại học

## I. Yêu cầu hệ thống

Dưới đây là danh sách yêu cầu được cập nhật và mở rộng cho hệ thống quản lý đại học, bao gồm các chức năng từ yêu cầu
ban đầu và các đề xuất bổ sung để đảm bảo bao quát toàn diện các nhu cầu của một trường đại học. Các chức năng được tổ
chức theo các module chính, với các cải tiến về tích hợp, trải nghiệm người dùng, bảo mật và khả năng mở rộng.

---

## 1. Quản lý sinh viên

### 1.1. Quản lý thông tin cá nhân và hồ sơ sinh viên

**Lưu trữ thông tin cá nhân:**

- Họ tên, mã số sinh viên, ngày sinh, giới tính
- Thông tin liên lạc: số CCCD, số điện thoại (bản thân và gia đình), email, địa chỉ (thường trú, hiện tại)

**Thông tin học tập:**

- Khoa, ngành, lớp, khóa học
- Tình trạng học tập: Đang học, bảo lưu, đã tốt nghiệp

**Cập nhật thông tin:**

- Cho phép sinh viên tự cập nhật thông tin liên lạc qua cổng tự phục vụ
- Quản trị viên phê duyệt các thay đổi nhạy cảm (ví dụ: CCCD)

### 1.2. Liên kết ngân hàng

**Tích hợp thanh toán:**

- Hiển thị số tài khoản ngân hàng, trạng thái liên kết (Đang hoạt động/Ngưng hoạt động)
- Hỗ trợ thanh toán học phí, ký túc xá, vé gửi xe qua cổng thanh toán trực tuyến

**Thông báo giao dịch:**

- Gửi thông báo qua email, SMS hoặc ứng dụng khi giao dịch thành công/thất bại

### 1.3. Quản lý đăng ký và theo dõi thời khóa biểu

**Theo dõi thời khóa biểu:**

- Hiển thị lịch học theo tuần, tháng, hoặc cả kỳ: môn học, thời gian, phòng học, giảng viên, thông tin liên hệ giảng
  viên
- Cập nhật tự động khi có thay đổi từ nhà trường

**Đăng ký học phần:**

- Hiển thị danh sách học phần mở theo kỳ, bao gồm thông tin: thời gian, phòng học, giảng viên, số lượng sinh viên đăng
  ký/tối đa
- Kiểm tra điều kiện tiên quyết và cảnh báo xung đột lịch học hoặc vượt quá số tín chỉ tối đa
- Cho phép hủy học phần trong thời gian quy định, tự động cập nhật thời khóa biểu

**Đồng bộ và nhắc nhở:**

- Gửi thông báo nhắc nhở lịch học trước (qua ứng dụng, email, SMS)
- Tích hợp với Google Calendar hoặc ứng dụng lịch bên thứ ba

### 1.4. Theo dõi tiến độ học tập

**Tín chỉ tích lũy:**

- Hiển thị tổng số tín chỉ đã hoàn thành, tín chỉ bắt buộc và tự chọn theo ngành

**Kết quả học tập:**

- Điểm trung bình học kỳ (GPA học kỳ), điểm trung bình tích lũy (GPA tích lũy)
- Chi tiết kết quả từng môn: điểm số, xếp loại (Xuất sắc, Giỏi, Khá, Trung bình, Yếu)

**Cảnh báo học vụ:**

- Cảnh báo khi GPA thấp hoặc không đủ tín chỉ theo quy định

**Tiến độ tốt nghiệp:**

- Hiển thị trạng thái đạt yêu cầu tốt nghiệp: tín chỉ, GPA, các yêu cầu khác (ví dụ: chứng chỉ ngoại ngữ)

### 1.5. Quản lý tài chính cá nhân

**Học phí:**

- Hiển thị học phí theo kỳ học, từng môn học
- Theo dõi trạng thái: Đã nộp, Đang nợ

**Theo dõi giao dịch:**

- Ghi nhận lịch sử giao dịch: học phí, ký túc xá, vé gửi xe, các khoản khác
- Hiển thị thông tin: mã giao dịch, ngày giờ, số tiền, trạng thái (Thành công, Đang xử lý, Thất bại)

**Thông báo tài chính:**

- Gửi thông báo nhắc nhở đóng học phí hoặc các khoản phí khác

### 1.6. Quản lý ký túc xá

**Đăng ký phòng:**

- Chọn phòng dựa trên danh sách phòng trống, số lượng giường
- Phân loại phòng: phòng thường, phòng cao cấp (VIP)
- Hiển thị chi tiết: giá thuê, phí điện, nước, vệ sinh, quy định phòng

**Quản lý thời hạn thuê:**

- Theo dõi thời gian thuê (theo học kỳ, năm)
- Tùy chọn tự động gia hạn
- Gửi thông báo nhắc nhở gia hạn hoặc trả phòng

**Thanh toán phí ký túc xá:**

- Hiển thị hóa đơn theo thời hạn
- Tích hợp thanh toán trực tuyến qua ngân hàng

### 1.7. Hỗ trợ yêu cầu hành chính

**Xin giấy tờ xác nhận:**

- Yêu cầu xác nhận điểm số, tín chỉ tích lũy
- Lựa chọn hình thức nhận: trực tiếp hoặc tải file PDF online

**Bảo lưu học tập:**

- Gửi yêu cầu bảo lưu (online hoặc tại văn phòng)
- Theo dõi trạng thái: Đang xử lý, Đã phê duyệt, Bị từ chối

**Hoãn nghĩa vụ quân sự:**

- Gửi đơn xin xác nhận, theo dõi tiến trình

**Phản hồi và thắc mắc:**

- Gửi yêu cầu hỗ trợ hoặc phản hồi, theo dõi trạng thái xử lý

### 1.8. Thông báo từ nhà trường

**Các loại thông báo:**

- Thay đổi lịch học, công văn, thông báo học vụ
- Gửi qua dashboard, email, SMS hoặc ứng dụng

**Tùy chỉnh thông báo:**

- Cho phép sinh viên chọn loại thông báo muốn nhận (học vụ, tài chính, ký túc xá)

---

## 2. Quản lý giảng viên

### 2.1. Hồ sơ giảng viên

**Thông tin cá nhân:**

- Họ tên, mã giảng viên, học hàm/học vị, chuyên môn, khoa, thông tin liên hệ

**Chức vụ và công tác:**

- Vai trò: giảng viên, trưởng bộ môn, cố vấn học tập
- Thâm niên, hợp đồng lao động, thời gian làm việc tại trường
- Bộ môn phụ trách, thành tích nổi bật

**Cập nhật thông tin:**

- Cho phép giảng viên tự cập nhật thông tin liên lạc, quản trị viên phê duyệt các thay đổi khác

### 2.2. Lịch dạy

**Đăng ký lịch dạy:**

- Chọn phòng thực hành (theo khoa/phòng máy), yêu cầu thiết bị hỗ trợ (máy chiếu, máy tính)

**Quản lý lịch giảng dạy:**

- Hiển thị thời khóa biểu cá nhân, danh sách lớp phụ trách
- Đồng bộ với thời khóa biểu của sinh viên

**Thông báo thay đổi:**

- Tự động cập nhật và thông báo khi lịch dạy thay đổi

### 2.3. Phân công coi thi và chấm thi

**Phân công coi thi:**

- Phân công dựa trên lịch dạy và lịch thi, đảm bảo đủ số lượng giảng viên
- Hiển thị thông tin: thời gian, phòng thi, danh sách sinh viên
- Công cụ báo cáo vi phạm hoặc vấn đề phát sinh sau khi coi thi

**Phân công chấm thi:**

- Tự động phân bổ bài thi cho giảng viên phụ trách
- Ghi nhận điểm số vào hệ thống, gửi lên phòng đào tạo

**Hiển thị điểm số:**

- Sinh viên xem điểm sau khi phòng đào tạo phê duyệt

### 2.4. Đánh giá và quản lý giảng dạy

**Đánh giá giảng dạy:**

- Ghi nhận đánh giá từ sinh viên và nhà trường (qua khảo sát)

**Thống kê giờ dạy:**

- Theo dõi số giờ dạy lý thuyết và thực hành

---

## 3. Quản lý học phần và chương trình đào tạo

### 3.1. Thông tin học phần

**Chi tiết học phần:**

- Mã môn, số tín chỉ (lý thuyết, thực hành), tên môn, khoa phụ trách
- Thời gian học: số giờ/tuần, tổng số buổi
- Điều kiện tiên quyết: môn học cần hoàn thành trước
- Loại môn: đại cương, chuyên ngành, tự chọn

**Tìm kiếm học phần:**

- Tìm kiếm theo mã môn, tên môn hoặc khoa

### 3.2. Đăng ký và điều chỉnh học phần

**Quy trình đăng ký:**

- Đăng nhập, xem danh sách học phần mở
- Hiển thị thông tin: thời gian, phòng học, giảng viên, số lượng sinh viên đăng ký/tối đa
- Kiểm tra điều kiện tiên quyết, cảnh báo xung đột lịch học hoặc vượt quá tín chỉ tối đa
- Xác nhận và lưu kết quả đăng ký, tự động cập nhật thời khóa biểu

**Hủy học phần:**

- Cho phép hủy trong thời gian quy định, cập nhật thời khóa biểu

### 3.3. Quản lý danh sách sinh viên

**Danh sách sinh viên:**

- Hiển thị thông tin: mã sinh viên, tên, lớp, trạng thái học phí (đã đóng/chưa đóng)
- Giới hạn số lượng sinh viên theo học phần
- Xuất danh sách ra file (Excel, PDF)

**Phân bổ học phần:**

- Lý thuyết tại phòng hành chính, thực hành tại phòng máy theo khoa

### 3.4. Theo dõi và ghi nhận kết quả học tập

**Ghi nhận điểm số:**

- Lưu điểm: thường xuyên (tx1, tx2), giữa kỳ, cuối kỳ
- Tính tổng điểm và xếp loại

**Cập nhật kết quả:**

- Giảng viên cập nhật điểm, sinh viên xem được sau khi phê duyệt

**Thống kê:**

- Sinh viên: xem điểm cá nhân
- Giảng viên: quản lý điểm số, gửi lên phòng đào tạo

### 3.5. Chương trình đào tạo

**Quản lý lộ trình học tập:**

- Lộ trình theo ngành, bao gồm môn bắt buộc, tự chọn, điều kiện tiên quyết

**Tùy chỉnh chương trình:**

- Cho phép khoa điều chỉnh chương trình theo nhu cầu

### 3.6. Tài nguyên giảng dạy

**Quản lý tài liệu:**

- Giáo trình điện tử, bài giảng, tài liệu tham khảo
- Cho phép giảng viên tải lên, sinh viên truy cập

---

## 4. Quản lý ký túc xá

### 4.1. Đăng ký và quản lý phòng

**Đăng ký chỗ ở:**

- Chọn phòng dựa trên trạng thái: trống, đầy, đang sửa chữa
- Phân loại phòng: thường, cao cấp
- Hiển thị chi tiết: giá thuê, phí dịch vụ, nội quy

**Quản lý thời hạn:**

- Theo dõi thời gian thuê, hỗ trợ gia hạn tự động
- Gửi thông báo nhắc nhở gia hạn hoặc trả phòng

### 4.2. Quản lý phí ký túc xá

**Thu phí:**

- Hóa đơn theo tháng/năm, tích hợp thanh toán trực tuyến

**Miễn giảm phí:**

- Hỗ trợ miễn giảm cho sinh viên theo chính sách

### 4.3. Theo dõi nội quy và sửa chữa

**Nội quy:**

- Ghi nhận vi phạm, xử lý theo quy định

**Yêu cầu sửa chữa:**

- Sinh viên/giảng viên gửi yêu cầu, theo dõi tiến độ xử lý

### 4.4. Báo cáo và thống kê

**Thống kê sử dụng:**

- Tỷ lệ sử dụng phòng, danh sách sinh viên vi phạm
- Xuất báo cáo ra file

---

## 5. Quản lý lịch học và phòng học

### 5.1. Thời khóa biểu

**Quản lý lịch học:**

- Phân bổ lịch học lý thuyết và thực hành
- Tích hợp với lịch cá nhân của sinh viên và giảng viên

**Phân bổ phòng học:**

- Lý thuyết: phòng hành chính
- Thực hành: phòng máy theo khoa

### 5.2. Lịch thi

**Quản lý lịch thi:**

- Phân bổ phòng thi, cán bộ coi thi
- Tự động thông báo lịch thi cho sinh viên và giảng viên

### 5.3. Quản lý phòng học

**Theo dõi sử dụng:**

- Trạng thái phòng: trống, đang sử dụng, bảo trì

**Lịch bảo trì:**

- Lên lịch bảo trì thiết bị, thông báo khi phòng không khả dụng

---

## 6. Quản lý cơ sở vật chất

### 6.1. Phòng học và phòng máy

**Danh sách phòng:**

- Thông tin phòng: số phòng, sức chứa, thiết bị (máy chiếu, máy tính)

**Trạng thái thiết bị:**

- Theo dõi tình trạng: hoạt động, hỏng, đang sửa chữa

### 6.2. Yêu cầu sửa chữa

**Ghi nhận yêu cầu:**

- Sinh viên/giảng viên gửi yêu cầu sửa chữa

**Theo dõi tiến độ:**

- Trạng thái: Đang xử lý, Hoàn thành, Bị từ chối

---

## 7. Quản lý tài chính

### 7.1. Học phí và dịch vụ

**Ghi nhận lịch sử giao dịch:**

- Thông tin giao dịch: mã giao dịch, ngày giờ, loại (học phí, ký túc xá, vé gửi xe, phí khác), số tiền, trạng thái (
  Thành công, Đang xử lý, Thất bại)

**Phân loại phí:**

- Học phí theo kỳ
- Phí ký túc xá (tháng/năm)
- Phí vé gửi xe (tháng/năm)
- Phí khác: làm lại thẻ sinh viên, tài liệu, thi lại

**Tích hợp ngân hàng:**

- Liên kết thẻ sinh viên với tài khoản ngân hàng
- Gửi thông báo giao dịch qua ứng dụng, email, SMS

**Chia nhỏ thanh toán:**

- Hỗ trợ sinh viên trả học phí theo đợt

### 7.2. Báo cáo tài chính

**Thống kê thu chi:**

- Báo cáo các khoản thu, chi, miễn giảm, hỗ trợ tài chính

**Xử lý lỗi giao dịch:**

- Hỗ trợ hoàn tiền hoặc điều chỉnh giao dịch bị lỗi

**Danh sách nợ:**

- Báo cáo sinh viên nợ học phí hoặc nộp muộn

---

## 8. Quản lý thư viện

### 8.1. Quản lý tài liệu

**Danh mục tài liệu:**

- Giáo trình, sách, luận văn, tài liệu tham khảo

**Tìm kiếm tài liệu:**

- Tìm theo tiêu đề, tác giả, mã tài liệu

### 8.2. Quản lý mượn/trả

**Hệ thống mượn/trả:**

- Sử dụng mã QR hoặc RFID để quản lý mượn/trả sách

**Phí trễ hạn:**

- Tự động tính phí trễ hạn, gửi thông báo nhắc nhở

### 8.3. Thống kê

**Báo cáo vi phạm:**

- Danh sách sinh viên vi phạm quy định thư viện

**Thống kê sử dụng:**

- Tỷ lệ mượn sách, tài liệu phổ biến

---

## 9. Quản lý thông tin tuyển sinh (Applicants)

### 9.1. Theo dõi hồ sơ ứng viên

**Quản lý hồ sơ:**

- Thông tin ứng viên: họ tên, điểm thi, ngành đăng ký

**Thông báo kết quả:**

- Gửi thông báo qua email, SMS, hoặc ứng dụng

### 9.2. Lập kế hoạch tuyển sinh

**Chỉ tiêu tuyển sinh:**

- Quản lý chỉ tiêu theo ngành, khóa học

**Báo cáo tuyển sinh:**

- Thống kê số lượng ứng viên, tỷ lệ nhập học

---

## 10. Quản lý cựu sinh viên (Alumni)

### 10.1. Hồ sơ cựu sinh viên

**Thông tin cá nhân:**

- Họ tên, mã sinh viên, ngành học, năm tốt nghiệp, thông tin liên lạc

**Theo dõi sự nghiệp:**

- Lưu trữ thông tin việc làm, thành tựu

### 10.2. Mạng lưới cựu sinh viên

**Kết nối:**

- Tạo nền tảng kết nối cựu sinh viên với sinh viên hiện tại (tư vấn, cố vấn)

**Sự kiện:**

- Quản lý sự kiện dành cho cựu sinh viên (hội thảo, họp lớp)

---

## 11. Quản lý nghiên cứu

### 11.1. Quản lý dự án nghiên cứu

**Thông tin dự án:**

- Tên dự án, giảng viên phụ trách, nguồn tài trợ, thời gian thực hiện

**Theo dõi tiến độ:**

- Ghi nhận các mốc hoàn thành, báo cáo kết quả

### 11.2. Quản lý công bố khoa học

**Lưu trữ công bố:**

- Bài báo, luận văn, công trình nghiên cứu

**Thống kê:**

- Số lượng công bố theo giảng viên, khoa

---

## 12. Quản lý quốc tế

### 12.1. Chương trình trao đổi

**Quản lý chương trình:**

- Thông tin chương trình trao đổi: trường đối tác, thời gian, yêu cầu

**Hỗ trợ sinh viên quốc tế:**

- Quản lý hồ sơ sinh viên quốc tế, visa, hỗ trợ học tập

### 12.2. Hợp tác quốc tế

**Hợp tác học thuật:**

- Quản lý các thỏa thuận hợp tác với trường quốc tế

**Sự kiện quốc tế:**

- Tổ chức hội thảo, chương trình trao đổi văn hóa

---

## 13. Hỗ trợ sinh viên

### 13.1. Tư vấn học tập

**Tư vấn trực tuyến:**

- Hỗ trợ sinh viên về chương trình học, lộ trình học tập

**Cố vấn học tập:**

- Phân công giảng viên cố vấn cho từng sinh viên

### 13.2. Hỗ trợ nghề nghiệp

**Dịch vụ việc làm:**

- Kết nối sinh viên với nhà tuyển dụng, tổ chức hội chợ việc làm

**Thực tập:**

- Quản lý chương trình thực tập, theo dõi tiến độ

### 13.3. Hỗ trợ sức khỏe và tâm lý

**Dịch vụ y tế:**

- Quản lý hồ sơ sức khỏe sinh viên, lịch khám sức khỏe

**Tư vấn tâm lý:**

- Hỗ trợ tư vấn tâm lý qua nền tảng trực tuyến hoặc tại chỗ

---

## 14. Quản lý sự kiện và câu lạc bộ

### 14.1. Quản lý sự kiện

**Tổ chức sự kiện:**

- Lên kế hoạch sự kiện: hội thảo, văn nghệ, thể thao
- Hiển thị lịch sự kiện, cho phép sinh viên đăng ký tham gia

### 14.2. Quản lý câu lạc bộ

**Danh sách câu lạc bộ:**

- Thông tin: tên, mục đích, thành viên

**Hoạt động:**

- Quản lý hoạt động, ngân sách của câu lạc bộ

---

## 15. Quản lý cơ sở hạ tầng và an ninh

### 15.1. Quản lý giao thông

**Vé gửi xe:**

- Quản lý vé gửi xe theo tháng/năm, tích hợp thanh toán trực tuyến

**Theo dõi phương tiện:**

- Ghi nhận thông tin xe của sinh viên, giảng viên

### 15.2. Quản lý an ninh

**Báo cáo sự cố:**

- Sinh viên/giảng viên báo cáo sự cố an ninh

**Hệ thống giám sát:**

- Quản lý camera, lịch sử truy cập khu vực

---

## 16. Quản lý phát triển bền vững

**Chương trình xanh:**

- Quản lý các sáng kiến môi trường: tái chế, tiết kiệm năng lượng

**Thống kê:**

- Báo cáo tác động của các chương trình xanh

---

## 17. Quản lý thể thao

**Đội thể thao:**

- Quản lý danh sách đội, lịch thi đấu, thành tích

**Cơ sở vật chất:**

- Theo dõi sân thể thao, thiết bị

---

## 18. Báo cáo và thống kê

**Báo cáo học tập:**

- Thống kê kết quả học tập theo sinh viên, lớp, khoa

**Báo cáo tài chính:**

- Thu chi, nợ học phí, miễn giảm

**Báo cáo dịch vụ:**

- Sử dụng ký túc xá, gửi xe, thư viện

**Xuất dữ liệu:**

- Xuất báo cáo ra Excel, PDF cho phân tích

---

## 19. Quản lý quyền người dùng

### 19.1. Phân quyền

**Tài khoản người dùng:**

- Quản lý tài khoản: sinh viên, giảng viên, quản trị viên
- Phân quyền truy cập theo vai trò (xem, chỉnh sửa, quản lý)

**Tùy chỉnh quyền:**

- Cho phép quản trị viên tùy chỉnh quyền theo khoa, phòng ban

### 19.2. Bảo mật

**Mã hóa dữ liệu:**

- Sử dụng mã hóa AES-256 cho dữ liệu nhạy cảm

**Xác thực hai yếu tố (2FA):**

- Áp dụng cho tài khoản quản trị viên và giảng viên

**Theo dõi truy cập:**

- Ghi lại lịch sử đăng nhập, phát hiện truy cập trái phép

**Tuân thủ pháp luật:**

- Đảm bảo tuân thủ GDPR hoặc các quy định bảo vệ dữ liệu địa phương

---

## 20. Mô hình tích hợp

**Tính đồng bộ:**

- Dữ liệu được chia sẻ giữa các module: ví dụ, thanh toán học phí tự động cập nhật trạng thái tài chính và thời khóa
  biểu

**Tính mở rộng:**

- Hỗ trợ thêm module mới (ví dụ: quản lý nghiên cứu, cựu sinh viên)

**Hiệu năng cao:**

- Thiết kế hệ thống chịu tải hàng triệu người dùng, sử dụng cơ sở dữ liệu MySQL và triển khai trên đám mây (AWS, Azure)

**Tích hợp bên ngoài:**

- Kết nối với hệ thống ngân hàng, cơ quan chính phủ (xác minh CCCD), Google Calendar

**Trải nghiệm người dùng:**

- Giao diện thân thiện, hỗ trợ đa nền tảng (web, mobile)
- Tuân thủ WCAG để đảm bảo khả năng tiếp cận cho người khuyết tật

---

## Công nghệ sử dụng

- **Backend:** Spring Boot (RESTful API, quản lý logic nghiệp vụ)
- **Frontend:** React (giao diện người dùng động, responsive)
- **Cơ sở dữ liệu:** MySQL (quản lý dữ liệu quan hệ, tối ưu hiệu năng)
- **Triển khai:** Đám mây (AWS, Azure) để đảm bảo khả năng mở rộng và bảo trì dễ dàng

---

## II. Phân quyền dự kiến

| Quyền                                          | Trách nhiệm chính                                              | Mức độ truy cập                                    | Mức độ ưu tiên |
|------------------------------------------------|----------------------------------------------------------------|----------------------------------------------------|----------------|
| **Quản trị viên (Admin)**                      | Cấu hình hệ thống, quản lý người dùng, báo cáo                 | Toàn quyền truy cập tất cả các phân hệ             | Cốt lõi        |
| **Giảng viên (Teacher)**                       | Lịch giảng dạy, chấm điểm, quản lý học phần                    | Học phần, chấm điểm, tài nguyên giảng dạy          | Cốt lõi        |
| **Sinh viên (Student)**                        | Đăng ký học phần, thanh toán học phí, theo dõi tiến độ học tập | Dữ liệu cá nhân, học phần, tài chính               | Cốt lõi        |
| **Nhân viên hành chính (Administrator Staff)** | Tuyển sinh, xử lý hồ sơ, liên lạc hành chính                   | Tuyển sinh, hồ sơ sinh viên, yêu cầu hành chính    | Cốt lõi        |
| **Nhân viên hỗ trợ kỹ thuật (IT Staff)**       | Bảo trì hệ thống, giám sát an ninh mạng                        | Nhật ký hệ thống, hạ tầng CNTT                     | Cốt lõi        |
| **Nhân viên ký túc xá (Dormitory Staff)**      | Quản lý ký túc xá, thu phí ký túc xá                           | Phân hệ ký túc xá, các dữ liệu tài chính liên quan | Thứ cấp        |
| **Nhân viên thư viện (Librarian)**             | Quản lý tài nguyên thư viện, mượn/trả sách, xử lý phạt         | Phân hệ thư viện, dữ liệu mượn sách                | Thứ cấp        |
| **Cựu sinh viên (Alumni)**                     | Kết nối mạng lưới, đăng ký sự kiện, cập nhật nghề nghiệp       | Phân hệ cựu sinh viên, sự kiện                     | Thứ cấp        |
| **Ứng viên (Applicant)**                       | Nộp hồ sơ, theo dõi trạng thái xét tuyển                       | Phân hệ tuyển sinh                                 | Thứ cấp        |
| **Nhân viên tài chính (Finance Staff)**        | Xử lý giao dịch, báo cáo tài chính                             | Phân hệ tài chính, dữ liệu giao dịch               | Thứ cấp        |
| **Nhân viên an ninh (Security Staff)**         | Báo cáo sự cố, giám sát an ninh                                | Phân hệ an ninh, nhật ký truy cập                  | Thứ cấp        |
| **Quản lý nghiên cứu (Research Manager)**      | Quản lý đề tài nghiên cứu, theo dõi công bố khoa học           | Phân hệ nghiên cứu, thống kê                       | Thứ cấp        |

---

## III. Đối tượng dự kiến cần quản lý

### 0. Nền tảng (BaseEntity)

**Thuộc tính:**

- `id` (Long, PK)
- `createdBy` (tạo bởi ai)
- `createdAt` (tạo vào khi nào)
- `lastModifiedAt` (chỉnh sửa lần cuối khi nào)
- `lastModifiedBy` (chỉnh sửa lần cuối bởi ai)

**Mục đích:** Entity nào cũng có 5 thuộc tính này → tách ra để thừa kế.

---

### 1. Quản lý Người dùng (Vai trò và Xác thực)

#### Vai trò (Role)

**Thuộc tính:**

- `roleId` (PK)
- `roleTitle` (enum RoleTitle)

**Mục đích:** Lưu trữ định nghĩa vai trò (ví dụ: ADMIN, TEACHER) kèm theo quyền, sử dụng `@Enumerated(EnumType.STRING)`
cho roleTitle.

#### Người dùng (User)

**Thuộc tính:**

- `userId` (PK)
- `username`
- `password` (đã băm, BCrypt)
- `email`
- `roleId` (FK đến Role)
- `isActive`
- `fullName`
- `phone`
- `cccd`
- `permanentAddress`
- `currentAddress`

**Mục đích:** Đại diện cho tất cả người dùng trong hệ thống (sinh viên, giảng viên, nhân viên) kèm thông tin xác thực.

#### Token "đen" (BlacklistedToken)

**Thuộc tính:**

- `id` (PK)
- `token` (đây là JWT)
- `tokenType` (xác định loại token là ACCESS hay REFRESH)
- `expiryDate` (thời gian hết hạn token)

**Mục đích:** Lưu lại những token người dùng đã đăng xuất nhưng vẫn còn hạn để tránh trường hợp bị lộ và bị sử dụng vào
mục đích bất chính. Cái này sẽ có một `@Scheduled` để xoá theo định kỳ.

---

### 2. Quản lý Sinh viên

#### Sinh viên (Student)

**Thuộc tính:**

- `studentId` (PK)
- `userId` (FK)
- `studentCode`
- `birthDate`
- `departmentId` (FK)
- `majorId` (FK)
- `courseYear`
- `status` (ACTIVE/SUSPENDED/GRADUATED)

**Mục đích:** Quản lý dữ liệu học thuật riêng của sinh viên.

#### Tài khoản ngân hàng (BankAccount)

**Thuộc tính:**

- `bankAccountId` (PK)
- `studentId` (FK)
- `accountNumber`
- `bankName`
- `status` (ACTIVE/INACTIVE)

**Mục đích:** Quản lý liên kết ngân hàng để thanh toán học phí, nhận học bổng.

#### Tiến trình học tập (AcademicProgress)

**Thuộc tính:**

- `progressId` (PK)
- `studentId` (FK)
- `semesterId` (FK)
- `gpaSemester`
- `gpaCumulative`
- `creditsCompleted`
- `graduationStatus`

**Mục đích:** Theo dõi tín chỉ, GPA và khả năng tốt nghiệp.

#### Cảnh báo học thuật (AcademicWarning)

**Thuộc tính:**

- `warningId` (PK)
- `studentId` (FK)
- `semesterId` (FK)
- `reason`
- `status` (PENDING/RESOLVED)

**Mục đích:** Ghi nhận cảnh báo học thuật do GPA thấp hoặc thiếu tín chỉ.

#### Yêu cầu hành chính (AdministrativeRequest)

**Thuộc tính:**

- `requestId` (PK)
- `studentId` (FK)
- `type` (CERTIFICATE/DEFERMENT/MILITARY_EXEMPTION)
- `status` (PENDING/APPROVED/REJECTED)
- `requestDate`
- `responseDate`

**Mục đích:** Quản lý yêu cầu cấp giấy tờ, hoãn học, miễn nghĩa vụ.

---

### 3. Quản lý Giảng viên

#### Giảng viên (Teacher)

**Thuộc tính:**

- `teacherId` (PK)
- `userId` (FK)
- `teacherCode`
- `academicRank`
- `degree`

**Mục đích:** Lưu dữ liệu liên quan đến trình độ, chức vụ của giảng viên.

#### Phân công giảng dạy (TeachingAssignment)

**Thuộc tính:**

- `assignmentId` (PK)
- `teacherId` (FK)
- `courseId` (FK)
- `semesterId` (FK)
- `role` (LECTURER/EXAM_SUPERVISOR)

**Mục đích:** Theo dõi nhiệm vụ giảng dạy, coi thi.

#### Đánh giá giảng dạy (TeachingEvaluation)

**Thuộc tính:**

- `evaluationId` (PK)
- `teacherId` (FK)
- `courseId` (FK)
- `semesterId` (FK)
- `studentId` (FK)
- `rating`
- `comments`

**Mục đích:** Lưu đánh giá từ sinh viên hoặc đơn vị đối với giảng viên.

---

### 4. Quản lý Chương trình và Môn học

#### Khoa (Department)

**Thuộc tính:**

- `departmentId` (PK)
- `name`

**Mục đích:** Đại diện cho các khoa học thuật.

#### Các giảng viên (người dạy/trưởng khoa) (DepartmentMember)

**Thuộc tính:**

- `memberId` (PK)
- `departmentId` (FK)
- `teacherId` (FK)
- `role`
- `startDate`
- `endDate`

**Mục đích:** Đáp ứng việc 1 khoa có nhiều giảng viên, và cũng có thể có nhiều trưởng khoa.

#### Ngành học (Major)

**Thuộc tính:**

- `majorId` (PK)
- `departmentId` (FK)
- `name`
- `totalCreditsRequired`

**Mục đích:** Xác định chương trình đào tạo trong mỗi khoa.

#### Môn học (Course)

**Thuộc tính:**

- `courseId` (PK)
- `courseCode`
- `name`
- `creditsTheory`
- `creditsPractical`
- `departmentId` (FK)
- `type` (GENERAL/SPECIALIZED/ELECTIVE)

**Mục đích:** Quản lý chi tiết môn học.

#### Môn học điều kiện (PrerequisiteCourse)

**Thuộc tính:**

- `coursePrerequisiteId` (PK)
- `courseId` (FK, requiring Course)
- `prerequisiteId` (FK, required Course)

**Mục đích:** Quản lý các môn học điều kiện cho một môn học cụ thể.

#### Lớp học phần (CourseOffering)

**Thuộc tính:**

- `offeringId` (PK)
- `courseId` (FK)
- `semesterId` (FK)
- `teacherId` (FK)
- `roomId` (FK)
- `maxStudents`
- `currentStudents`

**Mục đích:** Quản lý các lớp học phần theo kỳ.

#### Đăng ký học phần (CourseRegistration)

**Thuộc tính:**

- `registrationId` (PK)
- `studentId` (FK)
- `offeringId` (FK)
- `registrationDate`
- `status` (REGISTERED/CANCELLED)

**Mục đích:** Theo dõi việc đăng ký học phần của sinh viên.

#### Thời khoá biểu (Schedule)

**Thuộc tính:**

- `scheduleId` (PK)
- `offeringId` (FK to CourseOffering)
- `classroomId` (FK to Classroom)
- `sessionNumber`
- `startTime`
- `endTime`
- `sessionType` (e.g., LECTURE, LAB)

**Mục đích:** Xác định giờ học cụ thể (e.g., Monday 8:00–10:00 AM, Room A101).

#### Điểm danh (Attendance)

**Thuộc tính:**

- `attendanceId` (PK)
- `studentId` (FK to Student)
- `scheduleId` (FK to Schedule)
- `date`
- `status` (e.g., PRESENT, ABSENT)

**Mục đích:** Xác định tình trạng điểm danh của sinh viên trong một môn học nhất định.

#### Điểm số (Grade)

**Thuộc tính:**

- `gradeId` (PK)
- `courseRegistrationId` (FK)
- `scoreType` (PT1/PT2/…, midterm, final,…)
- `gradeType` (EXCELLENT/GOOD...)
- `scoreValue`

**Mục đích:** Ghi lại điểm của sinh viên theo từng lớp học phần.

#### Chương trình đào tạo (ProgramCurriculum)

**Thuộc tính:**

- `curriculumId` (PK)
- `majorId` (FK)
- `courseId` (FK)
- `isMandatory`
- `semesterRecommended`

**Mục đích:** Xác định các môn bắt buộc và tự chọn cho mỗi ngành.

#### Logic đăng ký học phần

Liên quan đến các bảng: Schedule, Attendance, CourseOffering, CourseRegistration, Student.

**Luồng truy vấn điểm danh:**

1. Giảng viên mở điểm danh
2. Truy vấn từ Schedule → lấy CourseOffering để truy vấn CourseRegistration → lấy ra được toàn bộ các studentId thuộc về
   Schedule đó
3. Có studentId, có scheduleId → insert bản ghi vào Attendance. Cần ép (studentId, scheduleId, date) → unique, tránh
   trùng lặp logic dữ liệu

**Luồng nhập điểm:**
Liên quan đến các bảng: Grade, CourseRegistration, CourseOffering, Course và Student.

1. Giảng viên chọn môn cần nhập điểm (dựa trên bảng CourseOffering → courseOffering.id → Course)
2. Dựa trên bảng CourseRegistration → tìm ra tất cả các sinh viên học một Course
3. Nhập liệu Grade

---

### 5. Quản lý Ký túc xá

#### Ký túc xá (Dormitory)

**Thuộc tính:**

- `dormitoryId` (PK)
- `name`
- `type` (REGULAR/PREMIUM)
- `capacity`

**Mục đích:** Đại diện các tòa nhà ký túc xá.

#### Phòng ký túc xá (DormRoom)

**Thuộc tính:**

- `roomId` (PK)
- `dormitoryId` (FK)
- `roomNumber`
- `capacity`
- `status` (AVAILABLE/OCCUPIED/MAINTENANCE)
- `price`
- `utilities` (điện, nước...)

**Mục đích:** Quản lý các phòng cụ thể.

#### Đăng ký ký túc xá (DormitoryRegistration)

**Thuộc tính:**

- `dormRegistrationId` (PK)
- `studentId` (FK)
- `roomId` (FK)
- `startDate`
- `endDate`
- `autoRenew`

**Mục đích:** Theo dõi sinh viên ở phòng nào, thời gian nào.

#### Vi phạm ký túc xá (DormitoryViolation)

**Thuộc tính:**

- `violationId` (PK)
- `studentId` (FK)
- `roomId` (FK)
- `description`
- `date`
- `status`

**Mục đích:** Ghi nhận các vi phạm nội quy KTX.

---

### 6. Quản lý Tài chính

#### Giao dịch (Transaction)

**Thuộc tính:**

- `transactionId` (PK)
- `studentId` (FK)
- `amount`
- `type` (TUITION/DORMITORY/PARKING/OTHER)
- `status` (SUCCESS/PENDING/FAILED)
- `transactionDate`
- `transactionCode`

**Mục đích:** Quản lý các giao dịch tài chính.

#### Hóa đơn (Invoice)

**Thuộc tính:**

- `invoiceId` (PK)
- `studentId` (FK)
- `semesterId` (FK)
- `amount`
- `dueDate`
- `status` (PAID/UNPAID)

**Mục đích:** Quản lý hóa đơn học phí và các khoản khác.

#### Cấu trúc phí (FeeStructure)

**Thuộc tính:**

- `feeId` (PK)
- `type` (TUITION/DORMITORY/PARKING)
- `amount`
- `semesterId` (FK)

**Mục đích:** Xác định biểu phí cho các dịch vụ.

---

### 7. Quản lý Thư viện

#### Tài nguyên thư viện (LibraryResource)

**Thuộc tính:**

- `resourceId` (PK)
- `title`
- `author`
- `type` (BOOK/THESIS/ELECTRONIC)
- `qrCode`
- `status` (AVAILABLE/BORROWED)

**Mục đích:** Quản lý tài liệu thư viện.

#### Lịch sử mượn (BorrowingRecord)

**Thuộc tính:**

- `borrowId` (PK)
- `studentId` (FK)
- `resourceId` (FK)
- `borrowDate`
- `returnDate`
- `fine`

**Mục đích:** Theo dõi việc mượn/trả và tiền phạt.

---

### 8. Lịch và Cơ sở vật chất

#### Lịch học/thi (Schedule)

**Thuộc tính:**

- `scheduleId` (PK)
- `offeringId` (FK)
- `roomId` (FK)
- `startTime`
- `endTime`
- `dayOfWeek`

**Mục đích:** Quản lý lịch học, lịch thi.

#### Phòng học (Classroom)

**Thuộc tính:**

- `classroomId` (PK)
- `roomNumber`
- `building`
- `capacity`
- `equipment` (e.g., JSON or string list)
- `type` (e.g., LECTURE_HALL, LAB)

**Mục đích:** Đại diện phòng học và phòng lab.

#### Yêu cầu bảo trì (MaintenanceRequest)

**Thuộc tính:**

- `maintenanceId` (PK)
- `roomId` (FK)
- `description`
- `status` (PENDING/IN_PROGRESS/RESOLVED)
- `requestDate`

**Mục đích:** Quản lý yêu cầu sửa chữa cơ sở vật chất.

---

### 9. Tuyển sinh

#### Đơn đăng ký (Application)

**Thuộc tính:**

- `applicationId` (PK)
- `applicantId` (FK đến User)
- `majorId` (FK)
- `submissionDate`
- `status` (PENDING/ACCEPTED/REJECTED)
- `scores`

**Mục đích:** Quản lý quá trình đăng ký xét tuyển.

---

### 10. Cựu sinh viên

#### Cựu sinh viên (Alumni)

**Thuộc tính:**

- `alumniId` (PK)
- `userId` (FK)
- `graduationYear`
- `majorId` (FK)
- `careerDetails`

**Mục đích:** Quản lý dữ liệu và kết nối cựu sinh viên.

---

### 11. Quản lý Nghiên cứu

#### Đề tài nghiên cứu (ResearchProject)

**Thuộc tính:**

- `projectId` (PK)
- `title`
- `teacherId` (FK)
- `fundingSource`
- `startDate`
- `endDate`
- `status`

**Mục đích:** Quản lý đề tài nghiên cứu.

#### Công bố khoa học (Publication)

**Thuộc tính:**

- `publicationId` (PK)
- `projectId` (FK)
- `title`
- `authors`
- `publicationDate`

**Mục đích:** Theo dõi sản phẩm nghiên cứu.

---

### 12. Các mô-đun khác

#### Chương trình quốc tế (InternationalProgram)

**Thuộc tính:**

- `programId` (PK)
- `name`
- `partnerInstitution`
- `startDate`
- `endDate`

**Mục đích:** Quản lý trao đổi, hợp tác quốc tế.

#### Sự kiện (Event)

**Thuộc tính:**

- `eventId` (PK)
- `name`
- `date`
- `location`
- `type` (SEMINAR/CULTURAL/SPORTS)

**Mục đích:** Quản lý sự kiện trong trường.

#### Câu lạc bộ (Club)

**Thuộc tính:**

- `clubId` (PK)
- `name`
- `description`
- `leaderId` (FK đến Student)

**Mục đích:** Quản lý hoạt động CLB sinh viên.

#### Sự cố an ninh (SecurityIncident)

**Thuộc tính:**

- `incidentId` (PK)
- `description`
- `date`
- `location`
- `status`

**Mục đích:** Theo dõi sự cố an ninh trong trường.

#### Sáng kiến bền vững (SustainabilityInitiative)

**Thuộc tính:**

- `initiativeId` (PK)
- `name`
- `description`
- `startDate`
- `impactMetrics`

**Mục đích:** Quản lý các hoạt động xanh - bền vững.

#### Đội thể thao (SportsTeam)

**Thuộc tính:**

- `teamId` (PK)
- `name`
- `coachId` (FK đến Teacher)
- `sportType`

**Mục đích:** Quản lý đội tuyển thể thao của trường.

---

### Tổng kết số lượng thực thể

**Thực thể chính (20):**
Role, User, Student, BankAccount, AcademicProgress, AcademicWarning, AdministrativeRequest, Teacher, TeachingAssignment,
TeachingEvaluation, Department, Major, Course, CourseOffering, CourseRegistration, Grade, ProgramCurriculum, Dormitory,
Room, DormitoryRegistration.

**Thực thể phụ (14):**
DormitoryViolation, Transaction, Invoice, FeeStructure, LibraryResource, BorrowingRecord, Schedule, MaintenanceRequest,
Application, Alumni, ResearchProject, Publication, InternationalProgram, Event, Club, SecurityIncident,
SustainabilityInitiative, SportsTeam.

**Tổng cộng:** 34 thực thể (có thể điều chỉnh tùy theo mức độ chuẩn hóa hoặc nhu cầu cụ thể).

---

## IV. Kế hoạch triển khai dự án

### 1. Xây dựng hệ thống phân quyền (User – Role)

- Xây dựng BaseEntity để tất cả các đối tượng khác kế thừa
- Cấu thành 3 bảng User, Role, BlacklistedToken
- Hoàn thiện đăng nhập, đổi mật khẩu, token refresh, token introspect
- Không có đăng ký vì đây là hệ thống nội bộ

### 2. Xây dựng hệ thống học thuật (Khoa, Ngành, Sinh viên)

**Thực thể:**

**Khoa (Department):** Xác định đơn vị học thuật (ví dụ: Công nghệ thông tin, Kỹ thuật). Cần thiết cho Ngành, Sinh viên
và Giảng viên.

- **Thuộc tính:** departmentId, name, facultyHeadId (khoá ngoại tới Giảng viên)

**Ngành (Major):** Đại diện cho các chương trình đào tạo (ví dụ: Kỹ thuật phần mềm). Liên kết với Sinh viên và Học phần.

- **Thuộc tính:** majorId, departmentId, name, totalCreditsRequired

**Sinh viên (Student):** Loại người dùng trung tâm trong các hoạt động học thuật. Liên kết với User để xác thực.

- **Thuộc tính:** studentId, userId, studentCode, birthDate, departmentId, majorId, classId, courseYear, status

**Lý do:**

- Các thực thể này thiết lập cấu trúc phân cấp học thuật (Khoa → Ngành → Sinh viên)
- Sinh viên là trung tâm, cho phép các tính năng như đăng ký học phần và theo dõi tiến độ học tập
- Đây là điều kiện tiên quyết cho các phân hệ như học phần, đăng ký học phần và các chức năng liên quan đến sinh viên

**Triển khai:**

- Tạo các thực thể JPA với các mối quan hệ (ví dụ: @ManyToOne từ Sinh viên đến Ngành)
- Xây dựng các API REST cho các thao tác CRUD (ví dụ: /api/departments, /api/students)
- Bảo vệ các endpoint bằng phân quyền theo vai trò (RBAC) (ví dụ: chỉ Quản trị viên được tạo Khoa, Sinh viên chỉ xem hồ
  sơ cá nhân)
- Phát triển các thành phần React để xem/chỉnh sửa hồ sơ sinh viên và danh sách Khoa/Ngành

### 3. Xây dựng hệ thống Quản lý Học phần (Course, CourseOffering)

**Thực thể:**

**Học phần (Course):** Định nghĩa các môn học học thuật (ví dụ: Nhập môn lập trình).

- **Thuộc tính:** courseId, courseCode, name, creditsTheory, creditsPractical, departmentId, type, prerequisites

**Học phần mở trong kỳ (CourseOffering):** Đại diện cho một phiên bản cụ thể của môn học trong một học kỳ.

- **Thuộc tính:** offeringId, courseId, semesterId, teacherId, roomId, schedule, maxStudents, currentStudents

**Lý do:**

- Học phần là xương sống của các hoạt động học thuật, cần thiết cho đăng ký học phần, chấm điểm và xếp lịch
- CourseOffering cho phép triển khai học phần theo từng học kỳ, là yếu tố quan trọng trong tương tác với sinh viên
- Liên kết với Giảng viên, Sinh viên, và sau này là Lịch học và Điểm số

**Triển khai:**

- Định nghĩa các thực thể với quan hệ (ví dụ: @ManyToOne từ CourseOffering đến Course)
- Tạo API cho việc tạo học phần và các phiên bản mở (ví dụ: /api/courses, /api/offerings)
- Thực hiện kiểm tra điều kiện tiên quyết trong tầng dịch vụ (ví dụ: xác minh điều kiện trước khi đăng ký)
- Xây dựng giao diện React cho danh mục học phần và chi tiết học phần mở

### 4. Xây dựng hệ thống Đăng ký học phần và Chấm điểm (CourseRegistration, Grade)

**Thực thể:**

**Đăng ký học phần (CourseRegistration):** Theo dõi việc sinh viên đăng ký các học phần mở.

- **Thuộc tính:** registrationId, studentId, offeringId, registrationDate, status

**Điểm số (Grade):** Lưu trữ kết quả học tập của sinh viên.

- **Thuộc tính:** gradeId, studentId, offeringId, midtermScore, finalScore, attendanceScore, totalScore, gradeType

**Lý do:**

- Đăng ký học phần là tương tác chính của sinh viên, cho phép kiểm tra dòng hoạt động học thuật cốt lõi
- Chấm điểm là thiết yếu cho việc theo dõi tiến độ học tập, liên kết với phân hệ Theo dõi học tập
- Các thực thể này liên kết Sinh viên và Học phần mở, tạo thành vòng học thuật hoàn chỉnh

**Triển khai:**

- Tạo thực thể với quan hệ (ví dụ: @ManyToOne từ CourseRegistration đến Sinh viên và CourseOffering)
- Phát triển các API cho đăng ký học phần và chấm điểm (ví dụ: /api/registrations, /api/grades)
- Triển khai logic nghiệp vụ cho việc đăng ký (ví dụ: kiểm tra trùng lịch, số tín chỉ tối đa) và chấm điểm (ví dụ: tính
  điểm tổng)
- Xây dựng các thành phần React cho đăng ký học phần (có cảnh báo trùng lịch) và xem điểm

### 5. Xây dựng các Thực thể hỗ trợ (Semester, Teacher)

**Thực thể:**

**Học kỳ (Semester):** Xác định các giai đoạn học tập dùng cho học phần mở và theo dõi học tập.

- **Thuộc tính:** semesterId, name (ví dụ: Học kỳ I 2025), startDate, endDate

**Giảng viên (Teacher):** Đại diện cho cán bộ giảng dạy, cần cho phân công học phần.

- **Thuộc tính:** teacherId, userId, teacherCode, academicRank, degree, departmentId, position

**Lý do:**

- Học kỳ là cần thiết cho phân hệ Học phần mở và Theo dõi học tập
- Giảng viên cần cho Học phần mở và Phân công giảng dạy

**Triển khai:**

- Tạo các thực thể và quan hệ
- Phát triển các API cho quản lý học kỳ và giảng viên (ví dụ: /api/semesters, /api/teachers)
- Xây dựng giao diện React cho hồ sơ giảng viên và lựa chọn học kỳ

---
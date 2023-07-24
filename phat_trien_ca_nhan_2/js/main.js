var currentDate = new Date();
var currentMonth = currentDate.toLocaleString('default', { month: 'short' });
var currentYear = currentDate.getFullYear();
var weeks = generateCalendarWeeks(currentDate.getMonth(), currentDate.getFullYear());

// Đặt tháng và năm hiện tại
document.getElementById('currentMonth').textContent = currentMonth;
document.getElementById('currentYear').textContent = currentYear;

// Tạo tuần theo lịchs
function generateCalendarWeeks(month, year) {
  var weeks = [];
  var startDate = new Date(year, month, 1);
  var endDate = new Date(year, month + 1, 0);
  var currentDate = new Date(startDate);
  var currentWeek = [];

  // Tìm ngày bắt đầu của tuần hiện tại
  var startingDay = startDate.getDay();
  if (startingDay === 0) {
    startingDay = 7; // Điều chỉnh Sunday thành ngày cuối tuần
  }

  // Xác định số ngày từ tháng trước để hiển thị
  var prevMonthEndDate = new Date(year, month, 0).getDate();
  var daysFromPrevMonth = startingDay - 1;

  for (var i = daysFromPrevMonth; i > 0; i--) {
    currentWeek.push({ number: prevMonthEndDate - i + 1, month: month - 1 });
  }

  while (currentDate <= endDate) {
    currentWeek.push({ number: currentDate.getDate(), month: month });

    // Kiểm tra xem đã là ngày cuối tuần chưa
    if (currentDate.getDay() === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    // Kiểm tra xem đó có phải là ngày cuối cùng của tháng không và thêm ngày từ tháng tiếp theo nếu cần
    if (currentDate.getTime() === endDate.getTime()) {
      var nextMonthStartDate = new Date(year, month + 1, 1);
      var remainingDays = 7 - (currentWeek.length % 7);

      if (remainingDays < 7) {
        for (var j = 1; j <= remainingDays; j++) {
          currentWeek.push({ number: j, month: month + 1 });
        }
      }

      weeks.push(currentWeek);
      break;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weeks;
}

// Kết xuất lịch
var calendarBody = document.getElementById('calendarBody');

function renderCalendar(month, year) {
  calendarBody.innerHTML = ''; // Xóa lịch trước đó

  var weeks = generateCalendarWeeks(month, year);

  weeks.forEach(function (week) {
    var row = document.createElement('tr');
    row.classList.add('border-b', 'border-gray-200', 'dark:border-gray-700');

    week.forEach(function (day) {
      var cell = document.createElement('td');
      cell.classList.add('px-6', 'py-4', 'font-medium', 'text-3xl');

      var current = new Date();

      if (day.month === month) {
        cell.classList.add('current-month');

        if (day.number === currentDate.getDate() && day.month === current.getMonth()) {

          cell.classList.add('today');
        }
      } else if (day.month < month) {
        cell.classList.add('previous-month');
      } else {
        cell.classList.add('next-month');
      }



      var link = document.createElement('a');
      link.href = '#';
      link.textContent = day.number;

      cell.appendChild(link);
      row.appendChild(cell);
    });

    calendarBody.appendChild(row);
  });
}

renderCalendar(currentDate.getMonth(), currentDate.getFullYear());





// Sự kiện bấm nút tháng trước
document.getElementById('previousMonthBtn').addEventListener('click', function () {
  currentDate.setMonth(currentDate.getMonth() - 1);
  var previousMonth = currentDate.getMonth();
  var previousYear = currentDate.getFullYear();

  var previousMonthName = currentDate.toLocaleString('default', { month: 'short' });
  document.getElementById('currentMonth').textContent = previousMonthName;
  document.getElementById('currentYear').textContent = previousYear;

  renderCalendar(previousMonth, previousYear);
});

// Sự kiện bấm nút tháng tới
document.getElementById('nextMonthBtn').addEventListener('click', function () {
  currentDate.setMonth(currentDate.getMonth() + 1);
  var nextMonth = currentDate.getMonth();
  var nextYear = currentDate.getFullYear();

  var nextMonthName = currentDate.toLocaleString('default', { month: 'short' });
  document.getElementById('currentMonth').textContent = nextMonthName;
  document.getElementById('currentYear').textContent = nextYear;

  renderCalendar(nextMonth, nextYear);
});





// Biến global để lưu dữ liệu ngày, tháng, năm khi chọn từ dropdown
var selectedDate, selectedMonth, selectedYear;

// Hàm hiển thị dropdown khi nhấp vào biểu tượng
function showDatePickerDropdown() {
  var dropdown = document.getElementById("datePickerDropdown");
  dropdown.classList.toggle("hidden");

  // Kiểm tra nếu dropdown đã hiển thị, thì bỏ kích hoạt sự kiện click để hiển thị lại
  if (dropdown.classList.contains("hidden")) {
    document.removeEventListener("click", outsideClickListener);
  } else {
    document.addEventListener("click", outsideClickListener);
  }
}

// Hàm kiểm tra xem sự kiện click có diễn ra bên ngoài date-picker không
function outsideClickListener(event) {
  var dropdown = document.getElementById("datePickerDropdown");
  var icon = document.getElementById("showDatePickerBtn");
  if (!dropdown.contains(event.target) && !icon.contains(event.target)) {
    hideDatePickerDropdown();
  }
}

// Hàm ẩn dropdown khi nhấp vào nút "Xem" hoặc nút "Close"
function hideDatePickerDropdown() {
  var dropdown = document.getElementById("datePickerDropdown");
  dropdown.classList.add("hidden");
  // Bỏ kích hoạt sự kiện click để ẩn dropdown
  document.removeEventListener("click", outsideClickListener);
}

// Hàm chọn ngày từ dropdown
function selectDate() {
  // Lấy dữ liệu ngày, tháng, năm từ các select trong dropdown
  var selectedDay = document.getElementById("daySelect").value;
  selectedMonth = document.getElementById("monthSelect").value;
  selectedYear = document.getElementById("yearSelect").value;

  // Gán giá trị cho biến ngày đã chọn
  selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);

  // Cập nhật nội dung cho phần hiển thị ngày đã chọn
  var monthName = getMonthName(selectedMonth);
  var dateText = monthName + " Năm " + selectedYear + " " + selectedDay;
  document.getElementById("currentMonthYearText").innerText = dateText;

  // Ẩn dropdown sau khi chọn xong
  hideDatePickerDropdown();
}

// Hàm đổ dữ liệu năm vào select năm
function fillYears() {
  var yearSelect = document.getElementById("yearSelect");
  var currentYear = new Date().getFullYear();
  var years = [];
  for (var i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  yearSelect.innerHTML = "";
  years.forEach(function (year) {
    var option = document.createElement("option");
    option.value = year;
    option.text = year;
    yearSelect.appendChild(option);
  });
}

// Hàm đổ dữ liệu tháng vào select tháng
function fillMonths() {
  var monthSelect = document.getElementById("monthSelect");
  var months = [];
  for (var i = 1; i <= 12; i++) {
    months.push(i);
  }
  monthSelect.innerHTML = "";
  months.forEach(function (month) {
    var option = document.createElement("option");
    option.value = month;
    option.text = month;
    monthSelect.appendChild(option);
  });
}

// Hàm đổ dữ liệu ngày vào select ngày
function fillDays() {
  var daySelect = document.getElementById("daySelect");
  var days = [];
  for (var i = 1; i <= 31; i++) {
    days.push(i);
  }
  daySelect.innerHTML = "";
  days.forEach(function (day) {
    var option = document.createElement("option");
    option.value = day;
    option.text = day;
    daySelect.appendChild(option);
  });
}

// Hàm lấy tên của tháng dựa vào số tháng
function getMonthName(month) {
  var monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  return monthNames[month - 1];
}

// Khi nhấp vào biểu tượng, hiển thị dropdown và đổ dữ liệu ngày, tháng, năm vào các select
document.getElementById("showDatePickerBtn").addEventListener("click", showDatePickerDropdown);

// Khi nhấp vào nút "Xem", chọn ngày và cập nhật thẻ hiển thị ngày đã chọn
document.getElementById("selectDateBtn").addEventListener("click", function (event) {
  selectDate();
  // Ngăn sự kiện click lan ra khỏi button "Xem"
  event.stopPropagation();
});

// Ngăn sự kiện click lan ra khỏi các select trong dropdown
document.getElementById("daySelect").addEventListener("click", function (event) {
  event.stopPropagation();
});

document.getElementById("monthSelect").addEventListener("click", function (event) {
  event.stopPropagation();
});

document.getElementById("yearSelect").addEventListener("click", function (event) {
  event.stopPropagation();
});

// Đổ dữ liệu năm và tháng vào các select khi tải trang
fillYears();
fillMonths();
fillDays();

// Tự động set ngày, tháng và năm hiện tại khi mở dropdown
document.getElementById("showDatePickerBtn").addEventListener("click", function () {
  var currentDate = new Date();
  var currentDay = currentDate.getDate();
  var currentMonth = currentDate.getMonth() + 1;
  var currentYear = currentDate.getFullYear();

  document.getElementById("daySelect").value = currentDay;
  document.getElementById("monthSelect").value = currentMonth;
  document.getElementById("yearSelect").value = currentYear;
});
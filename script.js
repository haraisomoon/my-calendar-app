const calendar = document.querySelector('.calendar');

// 今日の日付を取得
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0が1月、11が12月

// 月初と月末を取得
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);

// 曜日ラベル
const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

// 見出し部分
let html = `<h1>${year}年${month + 1}月</h1>`;
html += '<div class="calendar-grid">';

// 曜日ヘッダー
for (let day of daysOfWeek) {
  html += `<div class="day-name">${day}</div>`;
}

// 空白（1日が始まる曜日分だけ埋める）
for (let i = 0; i < firstDay.getDay(); i++) {
  html += `<div class="day empty"></div>`;
}

// 日にち部分
for (let d = 1; d <= lastDay.getDate(); d++) {
  html += `<div class="day">${d}</div>`;
}

html += '</div>';
calendar.innerHTML = html;

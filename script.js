// 現在表示している年を持つ変数
let currentYear = 2025;

// 現在表示している月を持つ変数（0 = 1月、10 = 11月）
let currentMonth = 10;


// カレンダーを画面に描画するメインの関数
function renderCalendar(year, month) {

  // HTML の .calendar 要素を取ってくる（カレンダー描画場所）
  const calendar = document.querySelector('.calendar');

  // 今の年月を表示する場所（画面の上のタイトル）
  const monthTitle = document.getElementById('month-title');

  // 指定された年・月の「1日」の情報を作る
  const firstDay = new Date(year, month, 1);

  // 次の月の「0日」を指定することで、その月の最終日が取れる仕組み
  const lastDay = new Date(year, month + 1, 0);

  // 1日が何曜日か（0=日曜, 1=月曜…）
  const startDay = firstDay.getDay();

  // その月の日数（28〜31）
  const totalDays = lastDay.getDate();

  // 見出し（タイトル）に "YYYY年 M月" を表示
  monthTitle.textContent = `${year}年 ${month + 1}月`;

  // カレンダーのHTMLを作り始める
  let html = `
    <div class="calendar-grid">
      <div class="day-name">日</div>
      <div class="day-name">月</div>
      <div class="day-name">火</div>
      <div class="day-name">水</div>
      <div class="day-name">木</div>
      <div class="day-name">金</div>
      <div class="day-name">土</div>
  `;

  // 最初の週の、1日より前の空白部分を埋める処理
  for (let i = 0; i < startDay; i++) {
    // 空のマス（背景色が薄いグレー）
    html += `<div class="day empty"></div>`;
  }

  // 1日〜その月の最終日までの数字を入れる処理
  for (let date = 1; date <= totalDays; date++) {
    html += `<div class="day">${date}</div>`;
  }

  // calendar-grid の閉じタグ
  html += `</div>`;

  // 完成したカレンダーHTMLを画面に反映
  calendar.innerHTML = html;
}

// 「前の月」ボタンが押されたときの処理
document.getElementById("prev-month").addEventListener("click", () => {
  // 月を1つ戻す
  currentMonth--;

  if (currentMonth < 0) {
    // 12月に戻る
    currentMonth = 11;
    // 年を1つ減らす
    currentYear--;
  }

  // カレンダーを再描画
  renderCalendar(currentYear, currentMonth);
});

// 「次の月」ボタンが押されたときの処理
document.getElementById("next-month").addEventListener("click", () => {
  // 月を1つ進める
  currentMonth++;

  if (currentMonth > 11) {
    // 1月に戻す
    currentMonth = 0;
    // 年を1つ増やす
    currentYear++;
  }

  // カレンダーを再描画
  renderCalendar(currentYear, currentMonth);
});

// 最初のカレンダーを表示（ページ読み込み時）
renderCalendar(currentYear, currentMonth);

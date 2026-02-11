// 現在日付を取得
const today = new Date();

// 現在表示している年を持つ変数
let currentYear = today.getFullYear();

// 現在表示している月を持つ変数（0 = 1月）
let currentMonth = today.getMonth();

// 選択されている日付（例: "2025-11-15"）
let selectedDate = null;

// 予定を保存する（localStorageから復元）
let schedules = JSON.parse(localStorage.getItem('schedules')) || {};


/**
 * 指定した年月のカレンダーを画面に表示する
 * @param {number} year - 表示する年
 * @param {number} month - 表示する月（0始まり）
 * @returns {void}
 */
function renderCalendar(year, month) {

  // HTML の .calendar 要素を取ってくる（カレンダー表示場所）
  const calendar = document.querySelector('.calendar');

  // 今の年月を表示する場所（画面の上のタイトル）
  const monthTitle = document.querySelector('#month-title');

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
  let html = '<div class="calendar-grid">';

  // 曜日見出し
  const weekNames = ['日', '月', '火', '水', '木', '金', '土'];
  weekNames.forEach(day => {
    html += `<div class="day-name">${day}</div>`;
  });

  // 最初の週の、1日より前の空白部分を埋める処理
  for (let i = 0; i < startDay; i++) {
    // 空のマス（背景色が薄いグレー）
    html += '<div class="day empty"></div>';
  }

  // 1日〜その月の最終日までの数字を入れる処理
  for (let date = 1; date <= totalDays; date++) {

    // その日付の曜日を調べる（0=日, 6=土）
    const dayOfWeek = new Date(year, month, date).getDay();

    // 付与するクラス名を入れる変数
    let className = 'day';

    // 日曜日なら red クラスを追加
    if (dayOfWeek === 0) {
      className += ' sunday';
    }

    // 土曜日なら blue クラスを追加
    if (dayOfWeek === 6) {
      className += ' saturday';
    }

    // YYYY-MM-DD 形式の日付キーを作る
    const dateKey =
      `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

    // 今日の日付かどうかを判定する
    const todayKey =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (dateKey === todayKey) {
      className += ' today';
    }

    // その日付の予定（なければ空配列）
    const daySchedules = schedules[dateKey] || [];

    // 日付マスを作成（どの日かを data-date に持たせる）
    html += `
      <div class="${className}" data-date="${dateKey}">
        ${date}
        ${daySchedules.map(s => `<div class="schedule">${s}</div>`).join('')}
      </div>
    `;
  }

  // calendar-grid の閉じタグ
  html += '</div>';

  // 完成したカレンダーHTMLを画面に反映
  calendar.innerHTML = html;

  // 日付マスをすべて取得（空白マスは除外）
  const dayElements = document.querySelectorAll('.day:not(.empty)');

  // 各日付マスにクリック処理を付ける
  dayElements.forEach(day => {
    day.addEventListener('click', () => {

      // data-date に入っている日付を取得
      selectedDate = day.dataset.date;

      // 選択中の日付を画面に表示
      document.querySelector('#selected-date-title').textContent =
        `${selectedDate} の予定`;

      document.querySelector('#schedule-text').value = '';
      document.querySelector('#schedule-panel').style.display = 'block';
    });
  });
}

// 「前の月」ボタンが押されたときの処理
document.querySelector('#prev-month').addEventListener('click', () => {
  // 月を1つ戻す
  currentMonth--;

  if (currentMonth < 0) {
    // 12月に戻る
    currentMonth = 11;
    // 年を1つ減らす
    currentYear--;
  }

  // カレンダーを再表示
  renderCalendar(currentYear, currentMonth);
});

// 「次の月」ボタンが押されたときの処理
document.querySelector('#next-month').addEventListener('click', () => {
  // 月を1つ進める
  currentMonth++;

  if (currentMonth > 11) {
    // 1月に戻す
    currentMonth = 0;
    // 年を1つ増やす
    currentYear++;
  }

  // カレンダーを再表示
  renderCalendar(currentYear, currentMonth);
});

// 予定追加
document.querySelector('#add-schedule').addEventListener('click', () => {
  if (!selectedDate) return;

  const input = document.querySelector('#schedule-text');
  const text = input.value.trim();
  if (!text) return;

  if (!schedules[selectedDate]) {
    schedules[selectedDate] = [];
  }

  schedules[selectedDate].push(text);

  // localStorage に保存
  localStorage.setItem('schedules', JSON.stringify(schedules));

  // 入力欄を空に
  input.value = '';

  // 子画面を閉じる
  document.querySelector('#schedule-panel').style.display = 'none';
  selectedDate = null;

  // カレンダーを再表示
  renderCalendar(currentYear, currentMonth);
});

// 予定を全て削除
document.querySelector('#delete-schedule').addEventListener('click', () => {
  if (!selectedDate) return;

  // 本当に消していいか確認
  const ok = window.confirm('この日の予定をすべて削除しますか？');
  if (!ok) return;

  // 予定を削除
  delete schedules[selectedDate];

  // localStorage に保存
  localStorage.setItem('schedules', JSON.stringify(schedules));

  // 子画面を閉じる
  document.querySelector('#schedule-panel').style.display = 'none';
  selectedDate = null;

  // カレンダーを再表示
  renderCalendar(currentYear, currentMonth);
});


// ×ボタンで子画面を閉じる
document.querySelector('#close-panel').addEventListener('click', () => {
  document.querySelector('#schedule-panel').style.display = 'none';
  selectedDate = null;
});

// 最初のカレンダーを表示（ページ読み込み時）
window.addEventListener('load', () => {
  renderCalendar(currentYear, currentMonth);
});

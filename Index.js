// ЭТО ЕДИНСТВЕННАЯ функция, которая нужна!
function doGet() {
  return HtmlService.createHtmlOutputFromFile("Form")
    .setTitle("Учет расходов")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitForm(data) {
  try {
    // Сохраняем в ТУ ЖЕ таблицу, из которой запущено приложение
    const ss = SpreadsheetApp.openByUrl(data.sheetUrl);
    const sheet = ss.getActiveSheet();

    // Добавляем заголовки при первом запуске
    if (!sheet.getRange("A1").getValue()) {
      //А1:F1 это диапазон ячеек в самой таблице
      sheet
        .getRange("A1:F1")
        .setValues([
          [
            "Дата",
            "ФИО",
            "Статья расходов",
            "Сумма",
            "Комментарий",
            "Ссылка на фото",
          ],
        ]);
    }

    // Добавляем данные
    sheet.appendRow([
      data.datetimeLocal,
      data.fullName,
      data.expenseItem,
      Number(data.amount),
      data.comment,
      data.photoLink,
    ]);

    return { success: true, message: "✅ Данные сохранены!" };
  } catch (e) {
    return { success: false, message: "❌ Ошибка: " + e.message };
  }
}

// Вспомогательная функция для получения URL таблицы
function getSpreadsheetUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

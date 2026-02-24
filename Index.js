const EXPENSES_FOLDER_ID = "1nVEej4-ibBwOd5jHKBehRY1_h_LaOhfB"; // Например: "1xYzAbcDefGhIjKlMnOpQrStUvWxYz"

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
      data.photoFileId
        ? `=HYPERLINK("https://drive.google.com/file/d/${data.photoFileId}/view", "Посмотреть чек")`
        : "",
    ]);

    return { success: true, message: "✅ Данные сохранены!" };
  } catch (e) {
    return { success: false, message: "❌ Ошибка: " + e.message };
  }
}

// Получение URL текущей таблицы
function getSpreadsheetUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

// Получаем список файлов из папки
function getExpenseFiles() {
  const folder = DriveApp.getFolderById(EXPENSES_FOLDER_ID);
  const files = folder.getFiles();
  const fileList = [];
  while (files.hasNext()) {
    const file = files.next();
    fileList.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
    });
  }
  return fileList;
}

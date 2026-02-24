const EXPENSES_FOLDER_ID = "1nVEej4-ibBwOd5jHKBehRY1_h_LaOhfB"; // Например: "1xYzAbcDefGhIjKlMnOpQrStUvWxYz"

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Form")
    .setTitle("Учет расходов")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Отправка данных в Google Sheets
function submitForm(data) {
  try {
    const ss = SpreadsheetApp.openByUrl(data.sheetUrl);
    const sheet = ss.getActiveSheet();

    // Заголовки, если пусто
    if (!sheet.getRange("A1").getValue()) {
      sheet
        .getRange("A1:D1")
        .setValues([["ФИО", "Статья расходов", "Сумма", "Фото чека"]]);
    }

    sheet.appendRow([
      data.fullName,
      data.expenseItem,
      Number(data.amount),
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

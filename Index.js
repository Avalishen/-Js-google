const EXPENSES_FOLDER_ID = "ВСТАВЬТЕ_ID_ВАШЕЙ_ПАПКИ"; // Например: "1xYzAbcDefGhIjKlMnOpQrStUvWxYz"

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Form')
    .setTitle('Учет расходов')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submitForm(data) {
  try {
    const ss = SpreadsheetApp.openByUrl(data.sheetUrl);
    const sheet = ss.getActiveSheet();
    
    if (!sheet.getRange("A1").getValue()) {
      sheet.getRange("A1:D1").setValues([[
        "ФИО", "Статья расходов", "Сумма", "Фото чека"
      ]]);
    }
    
    sheet.appendRow([
      data.fullName,
      data.expenseItem,
      Number(data.amount),
      data.photoFileId ? `=HYPERLINK("https://drive.google.com/file/d/${data.photoFileId}/view", "Посмотреть чек")` : ""
    ]);
    
    return { success: true, message: "✅ Данные сохранены!" };
  } catch (e) {
    return { success: false, message: "❌ Ошибка: " + e.message };
  }
}

function getSpreadsheetUrl() {
  return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

// НОВАЯ ФУНКЦИЯ: Получает список файлов из папки с чеками
function getExpenseFiles() {
  try {
    const folder = DriveApp.getFolderById(EXPENSES_FOLDER_ID);
    const files = folder.getFiles();
    const fileList = [];
    
    while (files.hasNext()) {
      const file = files.next();
      fileList.push({
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
        icon: file.getIconUrl()
      });
    }
    
    return fileList;
  } catch (e) {
    console.error("Ошибка доступа к папке:", e);
    return [];
  }
}

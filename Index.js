function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Форма учета расходов')
    .setWidth(400)
    .setHeight(500);
}

function submitForm(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const headers = ['ФИО', 'Статья расходов', 'Сумма', 'Ссылка на фото'];
    
    // Проверка и установка заголовков
    const firstRow = sheet.getRange(1, 1, 1, 4).getValues()[0];
    if (!firstRow.some(cell => cell)) {
      sheet.getRange(1, 1, 1, 4).setValues([headers]);
    }
    
    // Валидация суммы
    const amount = parseFloat(data.amount);
    if (isNaN(amount)) {
      throw new Error('Сумма должна быть числом');
    }
    
    // Добавление данных
    sheet.appendRow([
      data.fullName.trim(),
      data.expenseItem.trim(),
      amount,
      data.photoLink.trim()
    ]);
    
    return { status: 'success', message: 'Данные сохранены!' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

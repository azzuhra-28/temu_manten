const SPREADSHEET_ID = '1IjaJaiCiHzJs0JVqYWbAmJCpaGS0h-tamlH94ZLtJD8';
const SHEET_NAME = 'Ucapan';

function doGet(e) {
  try {
    const sheet = getSheet_();

    const rows = sheet.getLastRow() > 1
      ? sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues()
      : [];

    const limit = Math.min(Number(e.parameter.limit || 40), 100);

    const data = {
      ok: true,
      items: rows.reverse().slice(0, limit).map(function(row) {
        return {
          waktu: row[0] instanceof Date
            ? row[0].toISOString()
            : String(row[0] || ''),
          nama: String(row[1] || ''),
          kehadiran: String(row[2] || ''),
          ucapan: String(row[3] || '')
        };
      })
    };

    return output_(data, e.parameter.callback);

  } catch (err) {
    return output_(
      {
        ok: false,
        message: err.message,
        items: []
      },
      e && e.parameter && e.parameter.callback
    );
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Data tidak ditemukan.');
    }

    const body = JSON.parse(e.postData.contents);

    const nama = clean_(body.nama, 60);
    const kehadiran = clean_(body.kehadiran, 30);
    const ucapan = clean_(body.ucapan || body.pesan, 300);

    if (nama.length < 2) {
      throw new Error('Nama belum valid.');
    }

    if (!kehadiran) {
      throw new Error('Kehadiran belum dipilih.');
    }

    if (ucapan.length < 3) {
      throw new Error('Ucapan terlalu pendek.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      getSheet_().appendRow([
        new Date(),
        nama,
        kehadiran,
        ucapan
      ]);
    } finally {
      lock.releaseLock();
    }

    return output_({
      ok: true,
      message: 'Ucapan berhasil disimpan.'
    });

  } catch (err) {
    return output_({
      ok: false,
      message: err.message
    });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Waktu',
      'Nama',
      'Kehadiran',
      'Ucapan'
    ]);

    sheet.setFrozenRows(1);
  }

  return sheet;
}

function clean_(value, max) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function output_(data, callback) {
  const json = JSON.stringify(data);

  if (
    callback &&
    /^[a-zA-Z_$][\w$]*$/.test(callback)
  ) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
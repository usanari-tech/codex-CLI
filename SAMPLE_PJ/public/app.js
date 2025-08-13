// Simple CSV -> JSON converter with minimal CSV parsing
// Note: For simplicity and speed. Handles quoted fields and commas within quotes.

(function () {
  function $(sel) {
    return document.querySelector(sel);
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            field += '"';
            i++; // skip escaped quote
          } else {
            inQuotes = false;
          }
        } else {
          field += c;
        }
      } else {
        if (c === '"') {
          inQuotes = true;
        } else if (c === ',') {
          row.push(field);
          field = '';
        } else if (c === '\n') {
          row.push(field);
          rows.push(row);
          row = [];
          field = '';
        } else if (c === '\r') {
          // ignore CR, handle CRLF
        } else {
          field += c;
        }
      }
    }
    // last field
    if (field.length > 0 || inQuotes || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function toJSON(rows, hasHeader) {
    if (!rows.length) return [];
    if (hasHeader) {
      const headers = rows[0];
      return rows.slice(1).map((r) => {
        const obj = {};
        headers.forEach((h, idx) => {
          obj[h || `col_${idx + 1}`] = r[idx] ?? '';
        });
        return obj;
      });
    }
    return rows.map((r) => r.map((v) => v));
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function attachHandlers() {
    const txtIn = $('#csv-input');
    const fileIn = $('#csv-file');
    const btnClear = $('#clear-input');
    const btnConvert = $('#convert');
    const chkHeader = $('#has-header');
    const txtOut = $('#json-output');
    const btnCopy = $('#copy-json');
    const btnDownload = $('#download-json');
    const proButtons = ['#pro-button', '#hero-pro', '#pro-button-bottom']
      .map((sel) => $(sel))
      .filter(Boolean);

    fileIn.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        txtIn.value = String(reader.result || '');
      };
      reader.readAsText(f);
    });

    btnClear.addEventListener('click', () => {
      txtIn.value = '';
      txtOut.value = '';
    });

    btnConvert.addEventListener('click', () => {
      try {
        const rows = parseCSV(txtIn.value.trim());
        const data = toJSON(rows, chkHeader.checked);
        txtOut.value = JSON.stringify(data, null, 2);
      } catch (e) {
        txtOut.value = `変換エラー: ${e?.message || e}`;
      }
    });

    btnCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(txtOut.value);
        btnCopy.textContent = 'コピー済み!';
        setTimeout(() => (btnCopy.textContent = 'コピー'), 1200);
      } catch (_) {}
    });

    btnDownload.addEventListener('click', () => {
      const name = 'converted.json';
      download(name, txtOut.value || '[]');
    });

    const link = (window.APP_CONFIG && window.APP_CONFIG.paymentLink) || '#';
    proButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (link && link !== '#') {
          window.location.href = link;
        } else {
          alert('決済リンクが未設定です。public/config.js を編集してください。');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', attachHandlers);
})();


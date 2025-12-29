import ExcelJS from "exceljs";

export interface ExcelOptions {
  sheetName?: string;
  parseTable?: boolean;
}

function parseTextToTable(text: string): string[][] {
  const lines = text.split("\n").filter((line) => line.trim());

  const rows: string[][] = [];

  for (const line of lines) {
    let cells: string[];

    if (line.includes("\t")) {
      cells = line.split("\t").map((cell) => cell.trim());
    } else if (line.includes("|")) {
      cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
    } else if (/\s{2,}/.test(line)) {
      cells = line.split(/\s{2,}/).map((cell) => cell.trim());
    } else {
      cells = [line.trim()];
    }

    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return rows;
}

export async function createExcelDocument(
  text: string,
  options: ExcelOptions = {}
): Promise<Blob> {
  const { sheetName = "Extracted Data", parseTable = true } = options;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Image to Text";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  if (parseTable) {
    const tableData = parseTextToTable(text);

    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const excelCell = worksheet.getCell(rowIndex + 1, colIndex + 1);
        excelCell.value = cell;

        if (rowIndex === 0) {
          excelCell.font = { bold: true };
          excelCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE0E0E0" },
          };
        }
      });
    });

    const maxColumns = Math.max(...tableData.map((row) => row.length));
    for (let i = 1; i <= maxColumns; i++) {
      worksheet.getColumn(i).width = 20;
    }

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  } else {
    const lines = text.split("\n");
    lines.forEach((line, index) => {
      worksheet.getCell(index + 1, 1).value = line;
    });
    worksheet.getColumn(1).width = 100;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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

    // Try different delimiters in order of priority
    if (line.includes("\t")) {
      // Tab-separated
      cells = line.split("\t").map((cell) => cell.trim());
    } else if (line.includes("|")) {
      // Pipe-separated (markdown tables)
      cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
    } else if (/\s{3,}/.test(line)) {
      // Multiple spaces (3+) as column separator
      cells = line.split(/\s{3,}/).map((cell) => cell.trim());
    } else if (/^\d+\s+/.test(line)) {
      // Line starts with a number followed by space - treat as row number + content
      const match = line.match(/^(\d+)\s+(.+)$/);
      if (match) {
        cells = [match[1], match[2].trim()];
      } else {
        cells = [line.trim()];
      }
    } else if (/^[A-Z]\s+/.test(line)) {
      // Line starts with a single letter followed by space (like column headers)
      const match = line.match(/^([A-Z])\s+(.+)$/);
      if (match) {
        cells = [match[1], match[2].trim()];
      } else {
        cells = [line.trim()];
      }
    } else {
      // Single cell
      cells = [line.trim()];
    }

    if (cells.length > 0 && cells.some((c) => c)) {
      rows.push(cells);
    }
  }

  // Normalize column count - find max columns and pad shorter rows
  const maxCols = Math.max(...rows.map((r) => r.length));
  rows.forEach((row) => {
    while (row.length < maxCols) {
      row.push("");
    }
  });

  return rows;
}

// Parse table from Tesseract word data with position information
export function parseTableFromWords(
  words: Array<{
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>
): string[][] {
  if (!words || words.length === 0) return [];

  // Sort words by Y position (top to bottom), then X position (left to right)
  const sortedWords = [...words].sort((a, b) => {
    const yDiff = a.bbox.y0 - b.bbox.y0;
    if (Math.abs(yDiff) > 10) return yDiff; // Different rows
    return a.bbox.x0 - b.bbox.x0; // Same row, sort by X
  });

  // Group words into rows based on Y position
  const rows: Array<typeof words> = [];
  let currentRow: typeof words = [];
  let currentY = sortedWords[0]?.bbox.y0 || 0;

  for (const word of sortedWords) {
    if (Math.abs(word.bbox.y0 - currentY) > 15) {
      // New row threshold
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [word];
      currentY = word.bbox.y0;
    } else {
      currentRow.push(word);
    }
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  // Detect column boundaries based on X positions
  const allXPositions = words.map((w) => w.bbox.x0);
  const xClusters = clusterPositions(allXPositions, 50); // 50px threshold for column separation

  // Convert each row to cells based on column boundaries
  const tableData: string[][] = rows.map((row) => {
    const cells: string[] = new Array(xClusters.length).fill("");
    for (const word of row) {
      const colIndex = findClosestCluster(word.bbox.x0, xClusters);
      cells[colIndex] = (cells[colIndex] + " " + word.text).trim();
    }
    return cells;
  });

  return tableData;
}

function clusterPositions(positions: number[], threshold: number): number[] {
  if (positions.length === 0) return [];

  const sorted = [...new Set(positions)].sort((a, b) => a - b);
  const clusters: number[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - clusters[clusters.length - 1] > threshold) {
      clusters.push(sorted[i]);
    }
  }

  return clusters;
}

function findClosestCluster(x: number, clusters: number[]): number {
  let minDist = Infinity;
  let closest = 0;
  for (let i = 0; i < clusters.length; i++) {
    const dist = Math.abs(x - clusters[i]);
    if (dist < minDist) {
      minDist = dist;
      closest = i;
    }
  }
  return closest;
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

        // Style header row
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

    // Auto-fit column width based on content
    const maxColumns = Math.max(...tableData.map((row) => row.length));
    for (let i = 1; i <= maxColumns; i++) {
      let maxLength = 10;
      tableData.forEach((row) => {
        const cell = row[i - 1] || "";
        maxLength = Math.max(maxLength, Math.min(cell.length, 50));
      });
      worksheet.getColumn(i).width = maxLength + 2;
    }

    // Add borders
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { wrapText: true, vertical: "top" };
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

// Create Excel from word position data (better for tables)
export async function createExcelFromWords(
  words: Array<{
    text: string;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>,
  options: ExcelOptions = {}
): Promise<Blob> {
  const { sheetName = "Extracted Data" } = options;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Image to Text";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(sheetName);

  const tableData = parseTableFromWords(words);

  if (tableData.length > 0) {
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

    // Auto-fit column width
    const maxColumns = Math.max(...tableData.map((row) => row.length));
    for (let i = 1; i <= maxColumns; i++) {
      let maxLength = 10;
      tableData.forEach((row) => {
        const cell = row[i - 1] || "";
        maxLength = Math.max(maxLength, Math.min(cell.length, 60));
      });
      worksheet.getColumn(i).width = maxLength + 2;
    }

    // Add borders and alignment
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { wrapText: true, vertical: "top" };
      });
    });
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

import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  HeadingLevel,
  AlignmentType,
} from "docx";

export interface WordOptions {
  title?: string;
  includeImage?: boolean;
  formatted?: boolean;
}

export async function createWordDocument(
  text: string,
  imageBase64?: string,
  options: WordOptions = {}
): Promise<Blob> {
  const { title = "Extracted Text", formatted = false } = options;

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  if (imageBase64) {
    children.push(
      new Paragraph({
        text: "[Original Image]",
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  children.push(
    new Paragraph({
      text: "Extracted Text:",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
    })
  );

  if (formatted) {
    const paragraphs = text.split(/\n\n+/);
    paragraphs.forEach((para) => {
      const lines = para.split(/\n/);
      lines.forEach((line) => {
        children.push(
          new Paragraph({
            children: [new TextRun(line.trim())],
            spacing: { after: 100 },
          })
        );
      });
      children.push(new Paragraph({ text: "" }));
    });
  } else {
    children.push(
      new Paragraph({
        children: [new TextRun(text)],
      })
    );
  }

  children.push(
    new Paragraph({
      text: "",
      spacing: { before: 400 },
    }),
    new Paragraph({
      text: `Generated on ${new Date().toLocaleString()}`,
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `Generated on ${new Date().toLocaleString()}`,
          size: 18,
          color: "808080",
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
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

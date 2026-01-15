export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  keywords: string[];
  readTime: number; // minutes
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-extract-text-from-images",
    title: "How to Extract Text from Images: Complete Guide 2024",
    description:
      "Learn how to extract text from images using OCR technology. Step-by-step guide covering photos, screenshots, scanned documents, and handwritten notes.",
    date: "2024-12-15",
    category: "Tutorial",
    keywords: [
      "extract text from image",
      "image to text",
      "OCR tutorial",
      "copy text from picture",
    ],
    readTime: 8,
    content: `
## Introduction

Have you ever needed to copy text from an image but couldn't select it? Whether it's a screenshot, a photo of a document, or a scanned page, extracting text from images is a common challenge we all face.

In this comprehensive guide, we'll show you exactly how to extract text from any image using OCR (Optical Character Recognition) technology.

## What is OCR?

**OCR (Optical Character Recognition)** is a technology that converts different types of documents—such as scanned paper documents, PDF files, or images captured by a digital camera—into editable and searchable data.

### How Does OCR Work?

1. **Image Processing**: The software analyzes the image to identify text regions
2. **Character Recognition**: Each character is identified by comparing it to a database of known characters
3. **Text Output**: The recognized characters are assembled into words and sentences

## Step-by-Step Guide: Extract Text from Images

### Method 1: Using Our Free Online Tool

The easiest way to extract text from images is using our free online OCR tool:

**Step 1: Upload Your Image**
- Go to the Image to Text converter
- Click "Upload" or drag and drop your image
- Supported formats: JPG, PNG, GIF, BMP, WebP

**Step 2: Select the Language**
- Choose the language of the text in your image
- We support 25+ languages including English, Chinese, Spanish, French, German, and more

**Step 3: Extract and Copy**
- Click "Extract Text"
- Wait a few seconds for processing
- Copy the extracted text to your clipboard

### Method 2: Using Mobile Devices

**On iPhone:**
- Open the Photos app
- Select an image with text
- Tap and hold on the text
- Select "Copy" from the menu

**On Android:**
- Open Google Lens
- Point at the image or select from gallery
- Tap on text to select and copy

## Tips for Better OCR Results

### 1. Image Quality Matters

- **Resolution**: Use images with at least 300 DPI for best results
- **Clarity**: Ensure the text is sharp and in focus
- **Contrast**: High contrast between text and background improves accuracy

### 2. Lighting and Angles

- Avoid shadows across the text
- Capture images straight-on, not at an angle
- Ensure even lighting across the document

### 3. File Format Considerations

| Format | Best For | Quality |
|--------|----------|---------|
| PNG | Screenshots, digital text | Excellent |
| JPG | Photos, scanned docs | Good |
| PDF | Multi-page documents | Excellent |
| WebP | Web images | Good |

## Common Use Cases

### For Students
- Extract text from textbook photos
- Convert lecture slides to notes
- Digitize handwritten notes

### For Professionals
- Convert business cards to contacts
- Extract data from printed reports
- Digitize old documents

### For Personal Use
- Copy recipes from images
- Extract text from memes
- Convert screenshots to text

## Troubleshooting Common Issues

### Issue 1: Poor Recognition Accuracy

**Solution:**
- Improve image quality
- Ensure proper lighting
- Try a different image format

### Issue 2: Handwritten Text Not Recognized

**Solution:**
- Use our advanced handwriting mode
- Write more clearly if possible
- Consider typing important documents

### Issue 3: Non-Latin Scripts Not Working

**Solution:**
- Select the correct language before extraction
- Ensure your image clearly shows the script
- Try our multi-language detection feature

## Frequently Asked Questions

### Is online OCR safe for sensitive documents?

Yes, our tool processes images securely and doesn't store your data. For extra security, we recommend using the offline mode for highly sensitive documents.

### How accurate is OCR technology?

Modern OCR can achieve 95-99% accuracy on clean, printed text. Accuracy varies based on image quality, font type, and language.

### Can OCR handle multiple languages in one image?

Yes! Our tool supports multi-language detection and can process images containing text in multiple languages simultaneously.

## Conclusion

Extracting text from images has never been easier with modern OCR technology. Whether you're a student, professional, or just someone who needs to copy text from a picture, our free online tool makes it simple and fast.

**Ready to try it?** Head over to our Image to Text converter and extract text from your first image in seconds!
    `,
  },
  {
    slug: "jpg-to-excel-converter-guide",
    title: "How to Convert JPG to Excel: Extract Tables from Images",
    description:
      "Complete guide on converting JPG images to Excel spreadsheets. Learn to extract tables, data, and text from images directly into editable Excel files.",
    date: "2024-12-10",
    category: "Tutorial",
    keywords: [
      "jpg to excel",
      "image to spreadsheet",
      "extract table from image",
      "convert picture to excel",
    ],
    readTime: 6,
    content: `
## Introduction

Need to convert a table from an image into an Excel spreadsheet? Whether it's a screenshot of data, a photo of a printed table, or a scanned document, converting JPG to Excel can save you hours of manual data entry.

## Why Convert JPG to Excel?

### Time Savings
- Manual data entry: 30+ minutes for a simple table
- Using OCR: Less than 1 minute

### Accuracy
- Human error rate: 1-3%
- OCR error rate: Less than 1% on clean images

### Convenience
- No software installation needed
- Works on any device with a browser

## Step-by-Step Conversion Process

### Step 1: Prepare Your Image

Before converting, ensure your image meets these criteria:
- Clear, readable text
- Good contrast between text and background
- Minimal skew or rotation
- Resolution of at least 150 DPI

### Step 2: Upload to Our Converter

1. Visit our JPG to Excel converter
2. Click "Upload Image" or drag and drop
3. Wait for the image to load

### Step 3: Configure Settings

- **Language**: Select the language of your table data
- **Table Detection**: Enable automatic table detection
- **Output Format**: Choose .xlsx or .csv

### Step 4: Convert and Download

1. Click "Convert to Excel"
2. Review the preview
3. Download your Excel file

## Tips for Best Results

### Image Quality Tips

\`\`\`
Good Image:
✓ Sharp text
✓ High contrast
✓ Straight alignment
✓ Even lighting

Poor Image:
✗ Blurry text
✗ Low contrast
✗ Skewed/rotated
✗ Shadows or glare
\`\`\`

### Table Structure Tips

- Ensure clear cell borders
- Avoid merged cells when possible
- Use consistent fonts within the table
- Keep headers distinct from data

## Common Scenarios

### Scenario 1: Screenshot of Web Data

Perfect for converting:
- Online statistics
- Web-based reports
- Dashboard screenshots

### Scenario 2: Scanned Documents

Works great with:
- Printed invoices
- Paper reports
- Historical records

### Scenario 3: Mobile Photos

Can handle:
- Whiteboard data
- Printed tables
- Handwritten tables (with some limitations)

## Handling Complex Tables

### Multi-row Headers

Our tool can detect and properly format:
- Multiple header rows
- Merged header cells
- Hierarchical headers

### Mixed Content

We support tables with:
- Numbers and text
- Dates and currencies
- Special characters

## Troubleshooting

### Problem: Columns Not Aligned

**Solution**: Ensure your image shows clear vertical separators between columns.

### Problem: Missing Data

**Solution**: Check image quality and try increasing contrast before upload.

### Problem: Wrong Number Formats

**Solution**: Use Excel's format cells feature after conversion to adjust.

## Conclusion

Converting JPG images to Excel files doesn't have to be tedious. With our free online tool, you can extract tabular data from any image in seconds.

**Try it now** - Upload your first image and see how easy it is!
    `,
  },
  {
    slug: "what-is-ocr-technology",
    title: "What is OCR? Understanding Optical Character Recognition",
    description:
      "Learn everything about OCR (Optical Character Recognition) technology - how it works, its applications, accuracy, and why it matters for digitizing documents.",
    date: "2024-12-05",
    category: "Guide",
    keywords: [
      "what is OCR",
      "optical character recognition",
      "OCR technology",
      "text recognition",
    ],
    readTime: 10,
    content: `
## What is OCR?

**OCR (Optical Character Recognition)** is a technology that enables computers to recognize and extract text from images, scanned documents, and PDF files. It converts visual representations of text into machine-readable and editable text data.

## How Does OCR Technology Work?

### The OCR Process

1. **Image Acquisition**
   - Scanning a document
   - Taking a photo
   - Capturing a screenshot

2. **Pre-processing**
   - Noise reduction
   - Contrast enhancement
   - Skew correction
   - Binarization (converting to black and white)

3. **Text Detection**
   - Identifying text regions
   - Separating text from images
   - Detecting text lines and words

4. **Character Recognition**
   - Pattern matching
   - Feature extraction
   - Neural network classification

5. **Post-processing**
   - Spell checking
   - Context analysis
   - Format preservation

## Types of OCR

### 1. Simple OCR
- Recognizes printed text
- Works with standard fonts
- High accuracy on clean documents

### 2. Intelligent Character Recognition (ICR)
- Handles handwritten text
- Learns and improves over time
- Lower accuracy than printed text OCR

### 3. Intelligent Word Recognition (IWR)
- Recognizes entire words
- Better for cursive handwriting
- Uses context for accuracy

### 4. Optical Mark Recognition (OMR)
- Detects marks (checkboxes, bubbles)
- Used for surveys and tests
- Different from text OCR

## OCR Accuracy Factors

| Factor | Impact on Accuracy |
|--------|-------------------|
| Image Quality | Very High |
| Font Type | High |
| Language | Medium |
| Document Condition | High |
| Text Complexity | Medium |

### What Affects Accuracy?

**Positive Factors:**
- High resolution images (300+ DPI)
- Standard fonts
- Good contrast
- Straight alignment
- Clean documents

**Negative Factors:**
- Low resolution
- Decorative fonts
- Poor lighting
- Skewed images
- Damaged documents

## Applications of OCR

### Business Applications

1. **Document Digitization**
   - Converting paper archives to digital
   - Creating searchable document databases
   - Reducing physical storage needs

2. **Invoice Processing**
   - Automatic data extraction
   - Reducing manual entry
   - Faster accounts payable

3. **Business Card Scanning**
   - Quick contact entry
   - CRM integration
   - Networking efficiency

### Personal Applications

1. **Note Taking**
   - Digitizing handwritten notes
   - Converting lecture slides
   - Creating searchable notebooks

2. **Translation**
   - Extracting foreign text
   - Real-time translation
   - Travel assistance

3. **Accessibility**
   - Reading text aloud
   - Helping visually impaired users
   - Making content accessible

### Industry-Specific Uses

**Healthcare:**
- Medical record digitization
- Prescription processing
- Patient form handling

**Legal:**
- Contract processing
- Discovery documents
- Legal archive search

**Banking:**
- Check processing
- Form automation
- KYC document verification

## OCR vs. Manual Data Entry

| Aspect | OCR | Manual Entry |
|--------|-----|--------------|
| Speed | Very Fast | Slow |
| Cost | Low | High |
| Accuracy | 95-99% | 97-99% |
| Scalability | Excellent | Limited |
| 24/7 Availability | Yes | No |

## The Future of OCR

### Trends

1. **AI-Powered Recognition**
   - Deep learning improvements
   - Better handwriting recognition
   - Context understanding

2. **Real-Time Processing**
   - Mobile camera OCR
   - AR text translation
   - Live document scanning

3. **Cloud Integration**
   - API-based services
   - Scalable processing
   - Cross-platform availability

## Conclusion

OCR technology has revolutionized how we handle documents and text. From simple image-to-text conversion to complex document processing workflows, OCR is an essential tool in our digital world.

**Experience OCR yourself** - Try our free online tool and see how easy it is to extract text from any image!
    `,
  },
  {
    slug: "best-ocr-tools-2024",
    title: "10 Best Free OCR Tools in 2024: Tested and Compared",
    description:
      "Comprehensive comparison of the best free OCR tools available in 2024. We tested accuracy, speed, language support, and features to help you choose.",
    date: "2024-11-28",
    category: "Comparison",
    keywords: [
      "best OCR tools",
      "free OCR software",
      "OCR comparison",
      "online OCR tools",
    ],
    readTime: 12,
    content: `
## Introduction

Looking for the best OCR tool to extract text from images? We've tested the top 10 free OCR tools available in 2024 to help you make an informed choice.

## Our Testing Methodology

We evaluated each tool based on:
- **Accuracy**: Using standard test documents
- **Speed**: Time to process images
- **Language Support**: Number of supported languages
- **Ease of Use**: User interface and experience
- **Features**: Additional capabilities

## The Top 10 OCR Tools

### 1. ImageToText (Our Tool)

**Rating: ⭐⭐⭐⭐⭐ (5/5)**

| Feature | Rating |
|---------|--------|
| Accuracy | 98% |
| Speed | Fast |
| Languages | 25+ |
| Free Usage | Unlimited |

**Pros:**
- Completely free with no limits
- Supports 25+ languages
- Batch processing available
- No registration required
- Mobile-friendly design

**Cons:**
- Requires internet connection

**Best For:** General use, students, professionals needing quick conversions

---

### 2. Google Lens

**Rating: ⭐⭐⭐⭐ (4/5)**

**Pros:**
- Integrated with Google ecosystem
- Real-time camera OCR
- Good translation features

**Cons:**
- Requires Google account
- Mobile-focused
- Limited batch processing

---

### 3. Microsoft OneNote

**Rating: ⭐⭐⭐⭐ (4/5)**

**Pros:**
- Integrated with Office suite
- Good handwriting recognition
- Cross-platform sync

**Cons:**
- Requires Microsoft account
- Not standalone OCR tool
- Slower processing

---

### 4. Adobe Acrobat Online

**Rating: ⭐⭐⭐⭐ (4/5)**

**Pros:**
- Excellent PDF handling
- Professional quality output
- Trusted brand

**Cons:**
- Limited free usage
- Subscription for full features
- Slower than alternatives

---

### 5. Tesseract OCR

**Rating: ⭐⭐⭐⭐ (4/5)**

**Pros:**
- Open source
- Highly accurate
- Supports 100+ languages

**Cons:**
- Technical setup required
- No user interface
- Command line only

---

### 6. Online OCR (onlineocr.net)

**Rating: ⭐⭐⭐ (3.5/5)**

**Pros:**
- Simple interface
- Multiple output formats
- Quick processing

**Cons:**
- File size limits
- Ads on free version
- Limited daily usage

---

### 7. Free OCR (free-ocr.com)

**Rating: ⭐⭐⭐ (3/5)**

**Pros:**
- No registration needed
- Simple to use
- Basic features work well

**Cons:**
- Limited language support
- Lower accuracy
- Basic interface

---

### 8. i2OCR

**Rating: ⭐⭐⭐ (3/5)**

**Pros:**
- Good language support
- PDF output option
- Free to use

**Cons:**
- Ads interruptions
- Slower processing
- Registration recommended

---

### 9. NewOCR

**Rating: ⭐⭐⭐ (3/5)**

**Pros:**
- Multiple file support
- Layout analysis
- Basic editing tools

**Cons:**
- Dated interface
- Variable accuracy
- Limited updates

---

### 10. OCR.Space API

**Rating: ⭐⭐⭐⭐ (4/5)**

**Pros:**
- Developer-friendly API
- Good accuracy
- Free tier available

**Cons:**
- API-focused (technical)
- Rate limits on free tier
- Requires integration

## Comparison Table

| Tool | Accuracy | Speed | Languages | Free Limit |
|------|----------|-------|-----------|------------|
| ImageToText | 98% | Fast | 25+ | Unlimited |
| Google Lens | 95% | Fast | 100+ | Unlimited |
| OneNote | 93% | Medium | 25+ | Unlimited |
| Adobe Acrobat | 97% | Slow | 20+ | Limited |
| Tesseract | 96% | Fast | 100+ | Unlimited |

## Our Recommendation

For most users, we recommend starting with **ImageToText** (our tool) because:

1. **No limits** - Use as much as you need
2. **No registration** - Start immediately
3. **High accuracy** - 98% on standard documents
4. **Easy to use** - Simple drag-and-drop interface
5. **Multiple features** - Image to text, PDF conversion, batch processing

## Conclusion

While there are many OCR tools available, the best choice depends on your specific needs. For quick, accurate, and free OCR, give our ImageToText tool a try!
    `,
  },
  {
    slug: "convert-handwritten-notes-to-text",
    title: "How to Convert Handwritten Notes to Digital Text",
    description:
      "Learn the best methods to digitize handwritten notes using OCR. Tips for better recognition accuracy and recommended tools for converting handwriting to text.",
    date: "2024-11-20",
    category: "Tutorial",
    keywords: [
      "handwritten notes to text",
      "digitize handwriting",
      "handwriting OCR",
      "convert notes to digital",
    ],
    readTime: 7,
    content: `
## Introduction

Handwritten notes are personal and effective for learning, but they can be hard to search, share, and organize. Converting handwritten notes to digital text solves these problems while preserving your valuable content.

## Why Digitize Handwritten Notes?

### Benefits

1. **Searchability** - Find any note instantly
2. **Organization** - Sort and categorize easily
3. **Sharing** - Send notes to anyone
4. **Backup** - Never lose important notes
5. **Editing** - Modify and update content

## Best Methods for Converting Handwriting

### Method 1: Smartphone Camera + OCR

**Steps:**
1. Take a clear photo of your notes
2. Upload to an OCR tool
3. Select "Handwriting" mode if available
4. Review and edit the output

**Tips:**
- Use good lighting
- Keep the camera steady
- Capture pages individually

### Method 2: Dedicated Scanning Apps

Popular apps for note scanning:
- Microsoft Lens
- Adobe Scan
- CamScanner
- Google Drive

### Method 3: Smart Notebooks

Digital notebooks that sync handwriting:
- Rocketbook
- Moleskine Smart Writing Set
- reMarkable tablet

## Tips for Better Handwriting Recognition

### 1. Write Clearly

\`\`\`
Good handwriting for OCR:
✓ Consistent letter size
✓ Clear spacing between words
✓ Minimal cursive connections
✓ Dark ink on light paper

Poor handwriting for OCR:
✗ Very small text
✗ Cramped words
✗ Heavy cursive
✗ Light pencil marks
\`\`\`

### 2. Use Quality Paper

- Plain white paper works best
- Avoid lined paper if possible
- Use high-contrast ink

### 3. Proper Lighting

- Natural light is ideal
- Avoid shadows
- Ensure even illumination

## Step-by-Step Guide

### Step 1: Prepare Your Notes

- Flatten any creased pages
- Ensure text is dark and visible
- Remove any obstructions

### Step 2: Capture the Image

- Hold camera directly above
- Include entire page in frame
- Check for blur before processing

### Step 3: Process with OCR

1. Upload to ImageToText
2. Select appropriate language
3. Enable handwriting mode
4. Process and review results

### Step 4: Edit and Save

- Correct any recognition errors
- Format as needed
- Save in preferred format

## Realistic Expectations

### Accuracy Rates

| Handwriting Type | Expected Accuracy |
|------------------|-------------------|
| Neat print | 85-95% |
| Casual print | 70-85% |
| Neat cursive | 60-80% |
| Casual cursive | 40-60% |

### What Works Best

**High Accuracy:**
- Block letters
- Separated characters
- Standard letter forms
- Dark ink

**Lower Accuracy:**
- Connected cursive
- Unusual letter forms
- Light writing
- Mixed styles

## Troubleshooting

### Problem: Very Low Accuracy

**Solutions:**
1. Improve lighting conditions
2. Write more clearly next time
3. Try multiple OCR tools
4. Manual transcription for critical notes

### Problem: Missing Words

**Solutions:**
1. Check image quality
2. Ensure all text is visible
3. Increase contrast in image
4. Try processing smaller sections

## Recommended Workflow

For regular note-takers, we suggest:

1. **Daily**: Take notes as usual
2. **Weekly**: Photograph and process notes
3. **Monthly**: Review and organize digital versions
4. **Ongoing**: Build searchable note archive

## Conclusion

While handwriting recognition isn't perfect, it's improved dramatically with modern OCR technology. With good technique and the right tools, you can successfully digitize most handwritten notes.

**Start digitizing** - Upload a photo of your handwritten notes and see the results!
    `,
  },
  {
    slug: "pdf-to-excel-conversion",
    title: "How to Convert PDF Tables to Excel Spreadsheets",
    description:
      "Step-by-step guide to converting PDF tables and data into editable Excel spreadsheets. Learn the best tools and techniques for accurate PDF to Excel conversion.",
    date: "2024-11-15",
    category: "Tutorial",
    keywords: [
      "PDF to Excel",
      "convert PDF to spreadsheet",
      "extract table from PDF",
      "PDF data extraction",
    ],
    readTime: 6,
    content: `
## Introduction

PDF files are great for sharing documents, but extracting data from PDF tables into Excel can be challenging. This guide shows you how to convert PDF tables to Excel quickly and accurately.

## Why Convert PDF to Excel?

### Common Scenarios

- Financial statements in PDF format
- Reports with data tables
- Invoices and receipts
- Research data in PDF papers
- Government or legal documents

### Benefits of Conversion

1. **Edit data** - Modify values as needed
2. **Calculate** - Use Excel formulas
3. **Visualize** - Create charts and graphs
4. **Analyze** - Perform data analysis
5. **Integrate** - Combine with other data

## Conversion Methods

### Method 1: Online PDF to Excel Converter

**Best for:** Quick, one-time conversions

**Steps:**
1. Visit our PDF to Excel converter
2. Upload your PDF file
3. Select pages to convert
4. Click "Convert"
5. Download the Excel file

### Method 2: Copy and Paste

**Best for:** Simple tables, small amounts of data

**Steps:**
1. Open PDF in a reader
2. Select the table data
3. Copy (Ctrl+C)
4. Paste into Excel (Ctrl+V)
5. Clean up formatting

**Note:** This method often produces messy results

### Method 3: Adobe Acrobat

**Best for:** Professional users, complex documents

**Steps:**
1. Open PDF in Acrobat
2. Export to Excel format
3. Adjust settings as needed
4. Save the file

## Handling Complex Tables

### Multi-page Tables

Our tool can:
- Detect table continuation
- Merge data across pages
- Maintain column alignment

### Merged Cells

For tables with merged cells:
1. Enable "Detect merged cells" option
2. Review the preview
3. Manually adjust if needed

### Multiple Tables Per Page

Steps:
1. Select specific table region
2. Convert one table at a time
3. Combine in Excel afterward

## Tips for Best Results

### Before Conversion

- **Check PDF quality** - Higher quality = better results
- **Identify table structure** - Note complex layouts
- **Count columns** - Verify alignment after conversion

### During Conversion

- **Use table detection** - Enable automatic detection
- **Preview first** - Check before downloading
- **Adjust settings** - Try different options if needed

### After Conversion

- **Verify data** - Check numbers match
- **Fix formatting** - Adjust column widths
- **Clean up** - Remove extra rows/columns

## Common Issues and Solutions

### Issue 1: Columns Misaligned

**Cause:** Inconsistent spacing in PDF

**Solution:**
- Use text-to-columns in Excel
- Manually adjust columns
- Try different converter settings

### Issue 2: Numbers as Text

**Cause:** OCR interpretation

**Solution:**
- Select cells
- Use "Convert to Number" option
- Or multiply by 1 to convert

### Issue 3: Missing Data

**Cause:** Low PDF quality or complex layout

**Solution:**
- Try higher quality PDF if available
- Convert smaller sections
- Manual entry for missing parts

## Best Practices

### For Regular Conversions

1. Create a template in Excel
2. Convert PDF data
3. Paste into template
4. Apply formatting automatically

### For Financial Data

- Always verify totals
- Check decimal places
- Validate against source

### For Large Documents

- Process in sections
- Use batch conversion
- Review systematically

## Conclusion

Converting PDF tables to Excel doesn't have to be painful. With the right tools and techniques, you can extract data quickly and accurately.

**Try it yourself** - Upload a PDF with tables and see how easy conversion can be!
    `,
  },
];

// Helper function to get all posts
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Helper function to get a single post by slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

// Helper function to get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

// Get all unique categories
export function getAllCategories(): string[] {
  return [...new Set(blogPosts.map((post) => post.category))];
}

// Get related posts (same category, excluding current)
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  return blogPosts
    .filter(
      (post) =>
        post.slug !== currentSlug && post.category === currentPost.category
    )
    .slice(0, limit);
}

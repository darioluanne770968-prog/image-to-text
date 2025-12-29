"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Key, Zap, Shield, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const codeExamples = {
  curl: `curl -X POST https://your-domain.com/api/v1/ocr \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "image=@/path/to/image.jpg" \\
  -F "language=eng"`,
  javascript: `const formData = new FormData();
formData.append('image', imageFile);
formData.append('language', 'eng');

const response = await fetch('https://your-domain.com/api/v1/ocr', {
  method: 'POST',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
  },
  body: formData,
});

const result = await response.json();
console.log(result.data.text);`,
  python: `import requests

url = "https://your-domain.com/api/v1/ocr"
headers = {"x-api-key": "YOUR_API_KEY"}

with open("image.jpg", "rb") as f:
    files = {"image": f}
    data = {"language": "eng"}
    response = requests.post(url, headers=headers, files=files, data=data)

result = response.json()
print(result["data"]["text"])`,
};

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="mb-2">
            Developer API
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">
            Image to Text API Documentation
          </h1>
          <p className="text-muted-foreground text-lg">
            Integrate powerful OCR capabilities into your applications
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Fast & Accurate</h3>
              <p className="text-sm text-muted-foreground">
                High-precision OCR with sub-second response times
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Code className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Easy Integration</h3>
              <p className="text-sm text-muted-foreground">
                Simple REST API with comprehensive documentation
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-1">Secure</h3>
              <p className="text-sm text-muted-foreground">
                API key authentication with rate limiting
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              All API requests require authentication using an API key. Include
              your API key in the request header:
            </p>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              x-api-key: YOUR_API_KEY
            </div>
            <p className="text-sm text-muted-foreground">
              API access is available for Pro and Enterprise plans.{" "}
              <Link href="/pricing" className="text-primary hover:underline">
                Upgrade your plan
              </Link>{" "}
              to get your API key.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OCR Endpoint</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <Badge>POST</Badge>
              <code className="bg-muted px-3 py-1 rounded font-mono">
                /api/v1/ocr
              </code>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Request Headers</h4>
              <div className="bg-muted rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-3">Header</th>
                      <th className="text-left p-3">Required</th>
                      <th className="text-left p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3 font-mono">x-api-key</td>
                      <td className="p-3">
                        <Badge variant="destructive">Required</Badge>
                      </td>
                      <td className="p-3">Your API key</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">Content-Type</td>
                      <td className="p-3">
                        <Badge variant="destructive">Required</Badge>
                      </td>
                      <td className="p-3">
                        multipart/form-data or application/json
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Request Body</h4>
              <div className="bg-muted rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left p-3">Parameter</th>
                      <th className="text-left p-3">Type</th>
                      <th className="text-left p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3 font-mono">image</td>
                      <td className="p-3">File / String</td>
                      <td className="p-3">
                        Image file or base64 data URL
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">language</td>
                      <td className="p-3">String</td>
                      <td className="p-3">
                        Language code (default: eng). Options: eng, chi_sim,
                        chi_tra, jpn, kor, etc.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Response</h4>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "success": true,
  "data": {
    "text": "Extracted text content...",
    "confidence": 0.95,
    "language": "eng"
  },
  "usage": {
    "credits_used": 1
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl">
              <TabsList className="mb-4">
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              {Object.entries(codeExamples).map(([key, code]) => (
                <TabsContent key={key} value={key}>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      {code}
                    </pre>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => copyCode(code, key)}
                    >
                      {copiedCode === key ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-3">Plan</th>
                    <th className="text-left p-3">Requests/Day</th>
                    <th className="text-left p-3">Max File Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3">Pro</td>
                    <td className="p-3">500</td>
                    <td className="p-3">50 MB</td>
                  </tr>
                  <tr>
                    <td className="p-3">Enterprise</td>
                    <td className="p-3">Unlimited</td>
                    <td className="p-3">100 MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/pricing">
            <Button size="lg">
              <Key className="h-4 w-4 mr-2" />
              Get Your API Key
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

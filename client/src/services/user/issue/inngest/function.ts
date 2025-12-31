import { inngest } from "@/inngest/client";
import { db } from "@/lib/firebase-admin";
import { ai } from "@/lib/ai-config";
import { responseSchema } from "@/types/ai";
import { NonRetriableError } from "inngest";
import { zodToJsonSchema } from "zod-to-json-schema";

async function fetchIssueById(issueId: string) {
  const doc = await db.collection("issues").doc(issueId).get();
  if (!doc.exists) throw new Error("Issue not found");
  if(!doc.data()) throw new NonRetriableError("There is no data in issue");
  return { id: doc.id, ...doc.data() };
}

async function buildImageParts(images: string[] | undefined) {
  if (!images || images.length === 0) return [];
  return await Promise.all(
    images.map(async (imgUrl: string) => {
      const response = await fetch(imgUrl);
      const arrayBuffer = await response.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString("base64");
      const mimeType =
        response.headers.get("content-type") || "image/jpeg";

      return {
        inlineData: {
          mimeType,
          data: base64String,
        },
      };
    })
  );
}

async function analyzeIssueWithAI({
  title,
  description,
  images,
  imageParts
}: {
  title: string;
  description: string;
  images?: string[];
  imageParts: any[];
}) {
  const systemPrompt = `
You are an AI tasked with evaluating community-reported issues based on provided images and descriptive text.

Your responsibilities:
- Carefully analyze the information.
- Determine whether the issue is "critical" (urgent and serious), "invalid" (not an actual or relevant issue), or "none" (neither critical nor invalid).
- Write a brief, precise summary describing the problem, avoiding speculation or unsupported inferences.

Do not include any explanations, notes, or extra output.
  `;

  const modelInput = [
    ...(imageParts as any[]),
    {
      text: `Title: ${title}\nDescription: ${description}`,
    },
  ];

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user", // ✅ role belongs here
        parts: [
          { text: systemPrompt },
           ...modelInput,
        ],
      },
    ],
    config:{
      responseMimeType:"application/json",
      responseJsonSchema:zodToJsonSchema(responseSchema)

    }
  });

  const rawText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if(!rawText) throw new Error("No response providedby ai")
  
  return JSON.parse(rawText);
}

async function storeAIResultToIssue(issueId: string, status: string, summary: string) {
  await db.collection("issues").doc(issueId).update({
    status: status,
    ai_summary: summary,
    processed_at: new Date(),
  });
  return true;
}


export const issueAiWorkflowFunction = inngest.createFunction(
    { id: "user/process-issue-ai" },
    { event: "user/issue.created" }, 
    async ({ event, step }) => {
      const issueId =
        event.data.issueId ||
        event.data.id || 
        event.data.issue_id;
      if (!issueId) throw new Error("Missing issueId in event");

      const issue = await step.run("fetch-from-db", async () => {
        return await fetchIssueById(issueId);
      });
      const imageParts = await step.run("build-image-parts", async () => {
        return await buildImageParts((issue as any).images);
    })
      const aiResult = await step.run("analyze-w-ai", async () => {
        return await analyzeIssueWithAI({
          title: (issue as any).title || "",
          description: (issue as any).description || "",
          images: (issue as any).images || [],
          imageParts,
        });
      });

      await step.run("store-ai-result", async () => {
        return await storeAIResultToIssue(issueId, aiResult.status, aiResult.summary);
      });

      return { issueId, ai_status: aiResult.status, ai_summary: aiResult.summary };
    }
  );


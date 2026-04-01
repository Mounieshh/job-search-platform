import { createUploadthing, type FileRouter } from "uploadthing/express";

const f = createUploadthing();

export const uploadRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 }
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
    console.log("file url:", data.file.url); // ← your string URL
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
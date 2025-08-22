"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { withAuth } from "@/contexts/AuthContext";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type UploadState = {
  uploading: boolean;
  progress: number; // 0-100
  error?: string | null;
  success?: boolean;
};

 function CreatePostPage() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upload, setUpload] = useState<UploadState>({
    uploading: false,
    progress: 0,
  });
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setUpload({
        uploading: false,
        progress: 0,
        error: "Max file size is 10MB",
      });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setUpload({ uploading: false, progress: 0, error: null });

    if (!description && !file) {
      setUpload({
        uploading: false,
        progress: 0,
        error: "Please add a description or an image.",
      });
      return;
    }

    const form = new FormData();
    form.append("description", description);
    if (file) form.append("image", file);

    try {
      setUpload({ uploading: true, progress: 0, error: null });

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${API_BASE}/api/post`);

        xhr.withCredentials = true;

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUpload((s) => ({ ...s, progress: percent }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUpload({ uploading: false, progress: 100, success: true });
            resolve();
          } else {
            let msg = `Upload failed with status ${xhr.status}`;
            try {
              const json = JSON.parse(xhr.responseText);
              msg = json?.error || json?.msg || msg;
            } catch (e) {
              console.log(e);
            }
            setUpload({ uploading: false, progress: 0, error: msg });
            reject(new Error(msg));
          }
        };

        xhr.onerror = () => {
          setUpload({ uploading: false, progress: 0, error: "Network error" });
          reject(new Error("Network error"));
        };

        xhr.send(form);
      });
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  }

  function clearPreview() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!user) return <Loading />;
  return (
    <section className="mt-20 max-w-2xl mx-auto p-4">
      <h1 className="text-4xl font-semibold mb-4">
        Create New <span> Post </span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="defaultLabel">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something about this post..."
            className="defaultInput"
          />
        </div>

        <div>
          <label className="defaultLabel">Image (optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="defaultInput cursor-pointer"
          />

          {preview && (
            <div className="mt-3 flex items-start gap-3">
              <img
                src={preview}
                alt="preview"
                className="w-52 h-52 object-cover rounded"
              />
              <div>
                <p className="text-lg">Selected image</p>
                <button
                  type="button"
                  onClick={clearPreview}
                  className=" mt-2 underline text-lg cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <Button
            variant="outline"
            type="submit"
            disabled={upload.uploading}
            className="px-4 py-2 rounded disabled:opacity-60"
          >
            {upload.uploading
              ? `Uploading (${upload.progress}%)`
              : "Create Post"}
          </Button>
        </div>

        {upload.uploading && (
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div style={{ width: `${upload.progress}%` }} className="h-full" />
          </div>
        )}

        {upload.error && <p className="text-red-600">{upload.error}</p>}
        {upload.success && (
          <p className="text-green-600">Post created successfully.</p>
        )}
      </form>
    </section>
  );
}
export default withAuth(CreatePostPage);

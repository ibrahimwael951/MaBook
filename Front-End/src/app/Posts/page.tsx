"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

type UploadState = {
  uploading: boolean;
  progress: number; // 0-100
  error?: string | null;
  success?: boolean;
};

export default function CreatePostPage() {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upload, setUpload] = useState<UploadState>({ uploading: false, progress: 0 });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // optional: validate file type/size on client
    if (f.size > 10 * 1024 * 1024) {
      setUpload({ uploading: false, progress: 0, error: "Max file size is 10MB" });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setUpload({ uploading: false, progress: 0, error: null });

    // Basic client validation
    if (!description && !file) {
      setUpload({ uploading: false, progress: 0, error: "Please add a description or an image." });
      return;
    }

    const form = new FormData();
    form.append("description", description);
    if (file) form.append("image", file);

    try {
      setUpload({ uploading: true, progress: 0, error: null });

      // Use XHR so we can get upload progress events.
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
              // ignore parse
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

      // Reset form on success (optional)
      setDescription("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreview(null);
    } catch (err: any) {
      console.error(err);
    }
  }

  function clearPreview() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Create Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write something about this post..."
            className="w-full border rounded p-2 min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image (optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="block"
          />

          {preview && (
            <div className="mt-3 flex items-start gap-3">
              <img src={preview} alt="preview" className="w-28 h-28 object-cover rounded" />
              <div>
                <p className="text-sm">Selected image</p>
                <button type="button" onClick={clearPreview} className="mt-2 underline text-sm">
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={upload.uploading}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {upload.uploading ? `Uploading (${upload.progress}%)` : "Create Post"}
          </button>
        </div>

        {upload.uploading && (
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div style={{ width: `${upload.progress}%` }} className="h-full" />
          </div>
        )}

        {upload.error && <p className="text-red-600">{upload.error}</p>}
        {upload.success && <p className="text-green-600">Post created successfully.</p>}
      </form>

      <hr className="my-6" />

      <div className="text-xs text-gray-600">
        <p>Notes:</p>
        <ul className="list-disc ml-5">
          <li>Set <code>NEXT_PUBLIC_API_BASE_URL</code> in your .env to point at your backend.</li>
          <li>
            If your backend requires authentication via cookies, this component sends cookies automatically by setting
            <code>xhr.withCredentials = true</code>. Make sure your backend sets cookies with proper <code>SameSite</code> and <code>Secure</code> attributes.
          </li>
          <li>
            This component assumes your backend accepts multipart/form-data with a field named <code>image</code>
            and <code>description</code> in the body (matches the server code you provided).
          </li>
        </ul>
      </div>
    </div>
  );
}

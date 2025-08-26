"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function UpdatePostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // preview for uploaded image
  const [preview, setPreview] = useState<string | null>(null);

  // Fetch post data
  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/post/${id}`, { withCredentials: true })
      .then((res) => {
        setPost(res.data);
        setDescription(res.data.description);
        if (res.data.image?.url) {
          setPreview(res.data.image.url);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/api/post/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/posts/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <section className="min-h-screen flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md border p-6 rounded-lg shadow"
      >
        <h1 className="text-xl font-bold">Update Post</h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* Description */}
        <label>
          <span className="block text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
          />
        </label>

        {/* Image Upload */}
        <label>
          <span className="block text-sm font-medium">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
          />
        </label>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border"
          />
        )}

        <Button type="submit">Update</Button>
      </form>
    </section>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface props {
  postId: string;
  IsSaved: boolean;
}

const SavePost: React.FC<props> = ({ postId, IsSaved }) => {
  const [save, setSave] = useState<boolean>(IsSaved);
  const [loading, setLoading] = useState<boolean>(false);

  const Save = () => {
    setLoading(true);
    api
      .post(`/api/post/save/${postId}`)
      .then(() => {
        toast.success("Save Successfully", {
          classNames: { toast: "!bg-green-500 !text-white" },
        }),
          setSave(true);
      })
      .catch((err) => {
        toast.error(`Error : ${err} `, {
          classNames: { toast: "!bg-red-500 !text-white" },
        }),
          setSave(false);
      })
      .finally(() => setLoading(false));
  };
  const remove = () => {
    setLoading(true);
    api
      .delete(`/api/post/save/${postId}`)
      .then(() => {
        toast.success("Deleted Successfully", {
          classNames: { toast: "!bg-green-500 !text-white" },
        });
        setSave(false);
      })
      .catch((err) =>
        toast.error(`Error : ${err} `, {
          classNames: { toast: "!bg-red-500 !text-white" },
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    console.log(postId);
  }, [save]);
  return (
    <button
      title={save ? "Remove from saved Posts" : "Save Post"}
      className={`h-full duration-100 flex justify-center items-center`}
      onClick={() => {
        if (save) {
          remove();
        } else {
          Save();
        }
      }}
    >
      {loading ? (
        <div className="w-8 h-8 inline-block animate-spin rounded-full  border-b-2  border-third dark:border-primary"></div>
      ) : (
        <Bookmark
          strokeWidth={1}
          color="yellow"
          size={40}
          fill={`${save ? "yellow" : "transparent"}`}
        />
      )}
    </button>
  );
};

export default SavePost;

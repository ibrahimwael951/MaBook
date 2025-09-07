import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  PostId: string;
}

const SendComment: React.FC<Props> = ({ PostId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [Text, setText] = useState<string>("");

  const handelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const SendMessage = () => {
    setLoading(true);

    if (Text.length <= 2)
      return (
        setLoading(false),
        toast("Please Write good Comment ", {
          classNames: {
            toast: "!bg-red-600",
            actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
          },
          description: "from 5 letters to 500",
          closeButton: true,

          action: {
            label: "OK",
            onClick: () => console.log("OK"),
          },
        })
      );

    api
      .post(`/api/post/${PostId}/comment`, { text: Text })
      .then(() => {
        setSuccess(true), setText("");
      })
      .catch((err) =>
        toast(`Error :${err.message}`, {
          className: "!bg-red-600",
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      setSuccess(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success]);

  if (success)
    return (
      <div className="p-5 border rounded-2xl border-green-600 text-green-600">
        <h1 className="text-2xl">your comment sended Successfully </h1>
      </div>
    );
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Reload disabled
        SendMessage();
      }}
      className="mb-5 space-y-3"
    >
      <textarea
        rows={2}
        onChange={handelChange}
        value={Text}
        maxLength={500}
        className="defaultInput"
        placeholder="write your comment Here ....... "
      />
      <Button type="submit" variant="secondary" className="w-full">
        {loading ? "Sending..." : "Send"}
      </Button>
    </form>
  );
};

export default SendComment;

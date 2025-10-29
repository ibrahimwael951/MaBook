"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { X } from "lucide-react";
import { Animate, FadeUp, opacity } from "@/animation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  postId: string;
  RePostsCount: number;
  RePosted: boolean;
  NoAnimate?: boolean;
}
interface Repost {
  text: string;
  feeling: string;
}

const RePost: React.FC<Props> = ({
  postId,
  RePosted,
  RePostsCount,
  NoAnimate,
}) => {
  const { user } = useAuth();
  const [isRePosted, setIsRePosted] = useState<boolean>(RePosted);
  const [loading, setLoading] = useState<boolean>(false);
  const [menu, setMenu] = useState<boolean>(false);
  const [rePostCount, setRePostCount] = useState<number>(RePostsCount);
  const [form, setForm] = useState({
    text: "",
    feeling: "",
    postId,
  });
  useEffect(() => {
    if (menu) {
      window.document.body.classList.add("overflow-hidden");
    } else {
      window.document.body.classList.remove("overflow-hidden");
    }
  }, [menu]);

  const Add = (e: FormEvent) => {
    if (isRePosted === true) return;
    e.preventDefault();
    setLoading(true);
    api
      .post("/api/RePost", { ...form })
      .then(() => {
        toast.success("Reposted Successfully", {
          classNames: { toast: "!bg-green-600 !text-white" },
          closeButton: true,
        });
        setRePostCount((prev) => prev + 1);
        setIsRePosted(true);
      })
      .catch((err) =>
        toast.error(`Error : ${err.message}`, {
          classNames: { toast: "!bg-red-500 !text-white " },
        })
      )
      .finally(() => setLoading(false));
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof Repost;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const Feelings = ["Happy", "Sad", "Normal", "Amazing"];
  return (
    <>
      <AnimatePresence>
        {menu && (
          <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center z-50">
            <motion.div
              {...FadeUp}
              {...Animate}
              className="relative p-10 border dark:border-neutral-500 rounded-2xl bg-primary dark:bg-third z-10 w-xl mx-5"
            >
              <Button
                variant="secondary_2"
                NoAnimate
                disabled={loading ? true : false}
                className="absolute top-1 right-1 rounded-xl z-30"
                onClick={() => setMenu(false)}
              >
                <X />
              </Button>
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="Loading"
                    {...opacity}
                    {...Animate}
                    className="flex flex-col justify-center items-center gap-5"
                  >
                    <div className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"></div>
                    Loading....
                  </motion.div>
                )}
                {!loading &&
                  (isRePosted ? (
                    <motion.div
                      key="Already_RePosted"
                      {...opacity}
                      {...Animate}
                    >
                      <h1 className="text-xl font-bold ">
                        You have already <span> Reposted </span> this post
                      </h1>
                      <p>
                        Go to your Repost section on your Profile page to see it
                      </p>
                      <div className="mt-10 flex justify-center items-center gap-5 ">
                        <Link
                          onClick={() => setMenu(false)}
                          href={`/profile/${user?.username}`}
                        >
                          <Button variant="secondary_2" NoAnimate>
                            My Profile
                          </Button>
                        </Link>
                        <Button
                          variant="third_2"
                          NoAnimate
                          onClick={() => setMenu(false)}
                        >
                          Close Menu
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div {...opacity} {...Animate}>
                      <h1 className="text-2xl font-bold mb-4">Repost </h1>
                      <form onSubmit={Add} className="space-y-5" noValidate>
                        <div className="relative">
                          <label
                            htmlFor="text"
                            className="defaultLabel !inline"
                          >
                            Type your thought{" "}
                            <span className="!text-xs"> *optional</span>
                          </label>
                          <textarea
                            id="text"
                            name="text"
                            maxLength={200}
                            value={form.text}
                            rows={5}
                            onChange={handleChange}
                            className="defaultInput"
                            placeholder="I like this Post, etc...... "
                          />
                          <p className="absolute bottom-2 right-4">
                            {" "}
                            {form.text.length} /200{" "}
                          </p>
                        </div>
                        <div>
                          <label htmlFor="feeling" className="defaultLabel">
                            your Feeling{" "}
                            <span className="!text-xs"> *optional</span>
                          </label>

                          <Select>
                            <SelectTrigger className="w-full text-xl ">
                              <SelectValue
                                className="placeholder:text-third"
                                placeholder="Select your Feelings"
                              />
                            </SelectTrigger>
                            <SelectContent className="bg-primary dark:bg-third !text-white !text-2xl">
                              {Feelings.map((item) => (
                                <SelectItem key={item} value={item}>
                                  <h1 className="text-third dark:text-primary">
                                    {item}
                                  </h1>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="submit"
                          NoAnimate
                          variant="secondary_2"
                          className="w-full"
                        >
                          Repost
                        </Button>
                      </form>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </motion.div>
            {/* The Dark Bg */}
            <motion.div
              {...opacity}
              animate={{ ...Animate.animatenly, opacity: 0.5 }}
              onClick={() => setMenu(false)}
              className="absolute top-0 left-0 w-full h-full bg-third opacity-60 "
            />
          </div>
        )}
      </AnimatePresence>
      <div className="row-span-2 col-span-2 row-end-3">
        <div>{rePostCount} Repost</div>
        <Button
          onClick={() => setMenu(true)}
          variant={isRePosted ? "secondary_2" : "third_2"}
          NoAnimate={NoAnimate ? false : true}
          className="w-full col-span-2"
        >
          {isRePosted ? "Reposted Before" : "Repost"}
        </Button>
      </div>
    </>
  );
};

export default RePost;

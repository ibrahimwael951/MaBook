import React from "react";
interface props {
  error?: string;
}
const NotFound: React.FC<props> = ({ error }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
      <h1>Post not found</h1>
      {error && <p className="text-red-500">{error}</p>}
    </section>
  );
};

export default NotFound;

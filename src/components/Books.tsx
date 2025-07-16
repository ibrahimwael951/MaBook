import React from "react";
import { Books as BooksData } from "@/data/BooksData";
const Books = () => {
  return (
    <section className="my-20">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 w-fit">
        {BooksData.slice(0,4).map((Book, i) => (
          <div key={i} className=" w-60  rounded-2xl overflow-hidden">
            <img
              src={Book.image}
              alt={Book.title}
              className="w-full h-60 object-cover"
            />
            <h1 className="text-2xl">{Book.title}</h1>  
            <p>{Book.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Books;

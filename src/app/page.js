import Books from "@/components/books/Books";
import { Hero } from "@/components/home/Hero";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <Books />
    </div>
  );
};

export default page;

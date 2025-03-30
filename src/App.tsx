import { useEffect, useState } from "react";

export const App = () => {
  const [currentImage, setCurrentImage] = useState("");
  useEffect(() => {
    fetch("http://localhost:7251/api/memes").then(async (res) => {
      const resp = await res.json();
      setCurrentImage(resp.memes[0]);
    });
  }, [setCurrentImage]);
  const fullImageLink = `http://localhost:7251/static/memes/${currentImage}`;
  return (
    <div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-teal-900/70 via-teal-500/60 to-teal-900/70 backdrop-blur-md z-0"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />
      <div className="relative flex h-[95vh] w-[95vw] items-center justify-center mx-auto my-4 overflow-hidden rounded-xl">
        <img
          src={fullImageLink}
          alt="Full size display image"
          className="object-contain relative z-10 w-[90%] h-[90%]"
        />
      </div>
    </div>
  );
};

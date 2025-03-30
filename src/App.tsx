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
      <img style={{ width: "80vw" }} alt="" src={fullImageLink} />
    </div>
  );
};

import React, { useState, useEffect,useCallback } from "react";
import "./Typewriter.css"; // Ensure this includes .blinking-cursor and other styles

const TypewriterEffect = () => {
  const techStack = [
    "Python",
    "GitHub",
    "JavaScript",
    "HTML",
    "CSS",
    "React.js",
    "Flask",
    "Bootstrap",
    "SQLite",
    "REST APIs",
    "Microsoft Azure",
    "AES & RSA ",
    "LLMs",
    "NLP",
    "OpenAI APIs",
    "NumPy",
    "Matplotlib",
    "requests",

  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = techStack[index % techStack.length];
    let typingSpeed = isDeleting ? 100 : 150;

    const timeout = setTimeout(() => {
      setText(prev =>
        isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      );

      if (!isDeleting && text === current) {
        setTimeout(() => setIsDeleting(true), 1200);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex(prev => (prev + 1) % techStack.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index,techStack]);

  return (
    <div className="main-cont">
      <p className="exp-base">
        My playground includes{" "}
        <span className="exp-type">
          {text}
          <span className="blinking-cursor">|</span>
        </span>
      </p>
    </div>
  );
};

function Exp() {
  return (
    <div className="app">
      <TypewriterEffect />
    </div>
  );
}

export default Exp;

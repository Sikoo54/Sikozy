// Efek teks berkilau (shiny sweep) ala React Bits untuk judul Sikozy.
"use client";

export default function ShinyText({
  text,
  speed = 4,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  // Overlay teks dengan kilau putih yang bergerak (gradient + animasi shiny-text dari index.css)
  return (
    <span
      aria-hidden
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 60%)",
        backgroundSize: "200% 100%",
        animation: `shiny-text ${speed}s linear infinite`,
      }}
    >
      {text}
    </span>
  );
}
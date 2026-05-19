export default function manifest() {
  return {
    name: "Settlyou — Document Upload",
    short_name: "Settlyou",
    description: "Upload your documents securely for your college team.",
    start_url: ".",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#3e9b3e",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}

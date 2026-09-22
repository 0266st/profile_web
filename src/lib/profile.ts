export const ROLES = ["Trial-and-Error Engineer", "EDM flea producer / DTMer"] as const;

// One avatar per handle. Put the image in /public (e.g. public/0266st.png) and
// set `src: "/0266st.png"`. While `src` is null, a placeholder is shown.
export const AVATARS: { handle: string; src: string | null }[] = [
  { handle: "0266st", src: "/0266st.png" },
  { handle: "0168th", src: "/0168th.png" },
];

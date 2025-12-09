import { useMeta } from "../hooks/useMeta.js";

export function Seo({ title, description }) {
  useMeta({ title, description });
  return null;
}

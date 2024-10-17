import { Slides } from "@/app/lib/slides";
import { get } from "@vercel/edge-config";

export const getString = async (key: string | number): Promise<string> => {
  const res = (await get(key.toString())) ?? "";
  return res.toString();
};

export const getNumber = async (key: string | number): Promise<number> => {
  const res = (await get(key.toString())) ?? "";
  return parseInt(res.toString());
};

export const getHashList = async (key: string): Promise<string[]> => {
  const res = (await get(key)) ?? "";
  return res
    .toString()
    .split(",")
    .map((f) => f.trim());
};

export const getNumberList = async (key: string): Promise<number[]> => {
  const res = (await get(key)) ?? "";
  return res
    .toString()
    .split(",")
    .map((f) => parseInt(f));
};

export const getSlides = async (key: string): Promise<Slides> =>
  ((await get(key.toString())) ?? { slides: [] }) as Slides;

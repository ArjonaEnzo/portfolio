import { links, linksESP } from "./data";

export type SectionName = (typeof links)[number]["name"];
export type SectionNameEsp = (typeof linksESP)[number]["name"];

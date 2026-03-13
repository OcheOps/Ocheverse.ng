import Parser from "rss-parser";

const RSS_PROXY = process.env.RSS_PROXY_URL || 'https://rss.ocheverse.ng';

export function createParser() {
  return new Parser();
}

export const FEEDS = {
  ocheverse: `${RSS_PROXY}/ocheverse`,
  bpur: `${RSS_PROXY}/bpur`,
};

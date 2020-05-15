export interface HuffPostDatum {
  url: string,
  category: string,
  date: string,
  dateIndex: number,
  title: string,
  subtitle: string,
  content: string,
  keywordObjects: { keyword: string, weight: number }[]
}

export interface InvertedIndex {
  [keywordInDictionary: string]: number[];
}

export interface KeywordObjectDict {
  [keyword: string]: {
    keyword: string;
    weight: number;
    orderIndex: number; // alphabet order index
  }
}
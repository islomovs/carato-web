interface StoryImage {
  startTime: string;
  endTime: string;
  textUz: string;
  textRu: string;
  textEn: string;
  image: string;
  sortOrder: number;
  redirectTo?: string;
}

interface Story {
  title: string;
  startTime: string;
  endTime: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
  images: StoryImage[];
}

export type { Story, StoryImage };

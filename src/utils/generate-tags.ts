import { faker } from "@faker-js/faker";
import { Tag } from "../types/tags";
import { getSlugFromString } from "./get-slug-from-string";

export function generateTags(count: number): Tag[] {
  const tags: Tag[] = [];

  for (let i = 0; i < count; i++) {
    const title = faker.lorem.words(2);
    const slug = getSlugFromString(title);

    const tag: Tag = {
      id: faker.string.uuid(),
      amountOfVideos: faker.number.int({ min: 1, max: 1000 }),
      title,
      slug,
    };

    tags.push(tag);
  }

  return tags;
}

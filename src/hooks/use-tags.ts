import { faker } from "@faker-js/faker";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts"; // Supondo que você está usando a biblioteca 'usehooks-ts'
import { Tag, TagResponse } from "../types/tags";
import { generateTags } from "../utils/generate-tags";

interface UseTagsResponse {
  paginatedTags: (values: {
    page: number;
    rowsPerPage: number;
    search?: string;
  }) => TagResponse;
  createTag({
    title,
    slug,
    amountOfVideos,
  }: {
    title: string;
    slug: string;
    amountOfVideos: number;
  }): void;
}

export default function useTags(): UseTagsResponse {
  const [tags, setTags] = useLocalStorage<Tag[]>("tags", []);

  useEffect(() => {
    if (!tags.length) {
      setTags(generateTags(100));
    }
  }, [setTags, tags.length]);

  function paginatedTags({
    page,
    rowsPerPage,
    search,
  }: {
    page: number;
    rowsPerPage: number;
    search?: string;
  }): TagResponse {
    let filteredTags = tags;

    if (search) {
      filteredTags = filteredTags.filter((tag) =>
        tag.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    const totalItems = filteredTags.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    page = Math.min(Math.max(page, 1), totalPages);

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const data = filteredTags.slice(startIndex, endIndex);

    const tagResponse: TagResponse = {
      first: 1,
      prev: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null,
      last: totalPages,
      pages: totalPages,
      items: totalItems,
      data: data,
    };

    return tagResponse;
  }

  function createTag({
    title,
    slug,
    amountOfVideos,
  }: {
    title: string;
    slug: string;
    amountOfVideos: number;
  }) {
    const newTag: Tag = {
      id: faker.string.uuid(),
      slug,
      title,
      amountOfVideos,
    };

    setTags((currentValue) => [...currentValue, newTag]);
  }

  return {
    paginatedTags,
    createTag,
  };
}

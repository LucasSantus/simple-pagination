import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  FileDown,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { Fragment, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "./components/header";
import { Pagination } from "./components/pagination";
import { Tabs } from "./components/tabs";
import { Button } from "./components/ui/button";
import { Control, Input } from "./components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";

export interface TagResponse {
  first: number;
  prev: number | null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Tag[];
}

export interface Tag {
  title: string;
  amountOfVideos: number;
  id: string;
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get("filter") ?? "";

  const [filter, setFilter] = useState(urlFilter);

  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const rowsPerPage = searchParams.get("rows-per-page") ?? "10";

  const {
    data: tagsResponse,
    isLoading,
    isFetching,
  } = useQuery<TagResponse>({
    queryKey: ["get-tags", urlFilter, page, rowsPerPage],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/tags?_page=${page}&_per_page=${rowsPerPage}&title=${urlFilter}`
      );
      const data = await response.json();

      await new Promise((res) => setTimeout(res, 2000));

      return data;
    },
    placeholderData: keepPreviousData,
  });

  function onHandleSearch() {
    setSearchParams((params) => {
      params.set("page", "1");

      if (filter !== "") params.set("filter", filter);

      return params;
    });
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />
        <Tabs />
      </div>
      <main className="max-w-6xl mx-auto space-y-5 transition-all delay-300 duration-300">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button variant="primary">
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Input variant="filter">
              <Search className="size-3" />
              <Control
                placeholder="Search tags..."
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              />
            </Input>
            <Button onClick={onHandleSearch}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>

          <Button>
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 4 }).map((_, index) => (
                  <TableHead key={index}>
                    <div className="w-full h-5 bg-zinc-900 animate-pulse rounded-md" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 4 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="w-full h-9 bg-zinc-900 animate-pulse rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Amount of videos</TableHead>
                <TableHead className="flex items-center gap-2 justify-end">
                  {isFetching && (
                    <Fragment>
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-zinc-400">Loading...</span>
                    </Fragment>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tagsResponse?.data.map((tag) => {
                return (
                  <TableRow key={tag.id}>
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-zinc-400">
                          {tag.title}
                        </span>
                        <span className="text-xs text-zinc-500">{tag.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-300">
                      {tag.amountOfVideos} video(s)
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {tagsResponse && (
          <Pagination
            pages={tagsResponse.pages}
            items={tagsResponse.items}
            page={page}
            showingItems={tagsResponse.data.length}
          />
        )}
      </main>
    </div>
  );
}

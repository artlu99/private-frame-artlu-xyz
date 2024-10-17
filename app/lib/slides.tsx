/** @jsxImportSource frog/jsx */

import { getNumber, getSlides } from "@/app/lib/storage";
import { Box, Heading, Spacer, Text, VStack } from "@/app/lib/ui";
import { Button } from "frog";

export interface Slides {
  slides: {
    title: string;
    message: string;
    url?: string;
    buttonText?: string;
  }[];
}

export const maybeLinkButton = async (pageNumber: number) => {
  const contents = await getSlides("artlu20240704");
  return contents.slides[pageNumber - 1].url ? (
    <Button.Link href={contents.slides[pageNumber - 1].url ?? ""}>
      {contents.slides[pageNumber - 1].buttonText ?? "Detail"}
    </Button.Link>
  ) : undefined;
};

export const basicPage = (heading: string, instruction?: string) => (
  <Box grow alignVertical="center" backgroundColor="background" padding="32">
    <VStack gap="4">
      <Heading>{heading}</Heading>
      <Text color="text200" size="20">
        {instruction ?? "powered by 🐸"}
      </Text>
    </VStack>
  </Box>
);

export const unauthorizedPage = () =>
  basicPage("Unauthorized", "This endpoint should only be accessed via frame");

export const unauthorizedSlideshowPage = () =>
  basicPage("Come back later", "No slideshows available for you right now");

export const slide = async (pageNumber: number) => {
  const numSlideshowPages = await getNumber("nSlideshowPages");
  const contents = await getSlides("artlu20240704");

  return (
    <Box grow alignVertical="center" backgroundColor="background" padding="32">
      <VStack gap="4">
        <Heading>{contents.slides[pageNumber - 1].title}</Heading>
        <Text color="text200" size="20">
          {contents.slides[pageNumber - 1].message}
        </Text>
        <Spacer size="128" />
        <Text color="text200" size="20">
          Page {pageNumber} of {numSlideshowPages}
        </Text>
      </VStack>
    </Box>
  );
};

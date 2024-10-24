/** @jsxImportSource frog/jsx */

import { FROG_FRAME_TITLE, GITHUB_URL } from "@/app/constants";
import {
  basicPage,
  maybeLinkButton,
  slide,
  unauthorizedPage,
  unauthorizedSlideshowPage,
} from "@/app/lib/slides";
import {
  getHashList,
  getNumber,
  getNumberList,
  getString,
} from "@/app/lib/storage";
import { vars } from "@/app/lib/ui";
import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { pinata } from "frog/hubs";
import { neynar } from "frog/middlewares";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { html } from "hono/html";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: pinata(),
  title: FROG_FRAME_TITLE,
  ui: { vars },
});

app
  .use(
    neynar({
      apiKey: "NEYNAR_FROG_FM",
      features: ["interactor", "cast"],
    })
  )
  .frame("/old-landing-page", async (c) => {
    // reimplemented below in pure html in order to handle redirects better
    const greeting = await getString("greeting");

    return c.res({
      action: "/reveal",
      image: basicPage(greeting),
      intents: [<Button>Gib Secret</Button>],
    });
  })
  .frame("/reveal", async (c) => {
    const { verified, frameData } = c;
    const castObj = c.var.cast;

    if (verified && frameData) {
      const fids = await getNumberList("fids");
      const hashes = await getHashList("hashes");
      const slideshowFids = await getNumberList("slideshow");

      let secret: string | undefined = undefined;
      let allowedToSeeSlideshow: boolean = false;
      if (frameData?.fid && castObj) {
        const maybeMatchedHash = hashes.find((f) => f === castObj.parentHash);
        const maybeMatchedFid = fids.find((f) => f === frameData.fid);
        const mentionedFids = castObj.mentionedProfiles.map(
          (neynarUser) => neynarUser.fid
        );
        if (
          maybeMatchedHash &&
          (frameData.fid === castObj.parentAuthor.fid ||
            frameData.fid === castObj.author.fid ||
            mentionedFids.includes(frameData.fid))
        ) {
          secret = await getString(maybeMatchedHash);
        } else if (maybeMatchedFid) {
          secret = await getString(maybeMatchedFid);
        }
        allowedToSeeSlideshow = !!slideshowFids.find(
          (f) => f === frameData.fid
        );
      }

      return c.res({
        action: "/slideshow",
        image: basicPage(
          secret ?? "Secret",
          allowedToSeeSlideshow ? "click Next to begin slideshow" : undefined
        ),
        intents: allowedToSeeSlideshow
          ? [<Button value="1">Next</Button>]
          : [<Button.Link href={GITHUB_URL}>GitHub</Button.Link>],
      });
    } else {
      return c.res({ image: unauthorizedPage() });
    }
  })
  .frame("/slideshow", async (c) => {
    const { buttonValue, verified, frameData } = c;

    if (verified && frameData) {
      const slideshowFids = await getNumberList("slideshow");
      const allowedToSeeSlideshow = !!slideshowFids.find(
        (f) => f === frameData?.fid
      );

      if (!allowedToSeeSlideshow) {
        return c.res({ image: unauthorizedSlideshowPage() });
      }

      const numSlideshowPages = await getNumber("nSlideshowPages");
      let pageNumber: number | undefined;
      try {
        pageNumber = parseInt(buttonValue ?? "");
      } catch {
        return c.error({ message: "invalid" });
      }
      const prevPage = pageNumber - 1;
      const nextPage =
        pageNumber >= numSlideshowPages ? undefined : pageNumber + 1;

      const maybeButton = await maybeLinkButton(pageNumber);

      return c.res({
        action: "/slideshow",
        image: slide(pageNumber),
        intents:
          prevPage && nextPage
            ? [
                <Button value={prevPage.toString()}>Prev</Button>,
                maybeButton,
                <Button value={nextPage.toString()}>Next</Button>,
              ]
            : nextPage
            ? [maybeButton, <Button value={nextPage.toString()}>Next</Button>]
            : prevPage
            ? [
                <Button value={prevPage.toString()}>Prev</Button>,
                maybeButton,
                <Button value={"1"}>Start Over</Button>,
              ]
            : [],
      });
    } else {
      return c.res({ image: unauthorizedPage() });
    }
  })
  .get("/", async (c) => {
    const greeting = await getString("greeting");

    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

    return c.html(
      html`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
            <meta
              property="fc:frame:image"
              content="https://${baseUrl}/greeting.png"
            />
            <meta
              property="og:image"
              content="https://${baseUrl}/greeting.png"
            />
            <meta property="og:title" content="${greeting}" />
            <meta
              property="fc:frame:post_url"
              content="https://${baseUrl}/api/reveal?initialPath=%252Fapi&amp;previousButtonValues=%2523A_"
            />
            <meta property="fc:frame:button:1" content="Gib Secret" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="frog:version" content="0.17.4" />
            <meta http-equiv="refresh" content="0; URL=https://${baseUrl}" />
          </head>
          <body></body>
        </html> `
    );
  });

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

import React from "react";

import { CoilProvider } from "@alxshelepenok/diesel";
import { Analytics } from "@vercel/analytics/react";
import { WrapRootElementBrowserArgs } from "gatsby";

const wrapRootElement = ({
  element,
}: WrapRootElementBrowserArgs): React.ReactElement => (
  <CoilProvider>
    {element}
    <Analytics />
  </CoilProvider>
);

export { wrapRootElement };

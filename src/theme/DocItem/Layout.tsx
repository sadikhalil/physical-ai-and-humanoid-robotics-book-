// src/theme/DocItem/Layout.tsx
import React from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/theme-common/internal';
import DocItemMetadata from '@theme/DocItem/Metadata';
import DocItemContent from '@theme/DocItem/Content';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocItemReadMore from '@theme/DocItem/ReadMore';
import DocItemReadTime from '@theme/DocItem/ReadTime';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocVersionBadge from '@theme/DocVersionBadge';
import { ThemeClassNames } from '@docusaurus/theme-common';

import UserProfile from '@site/src/components/UserProfile'; // Import your UserProfile component

/**
 * This component is an internal layout, you should not swizzle it.
 * It is used by DocItem for layout purpose.
 * Feel free to swizzle DocItem in order to change the layout.
 */
export default function DocItemLayout({ children }) {
  const docHtmlClassName = useDoc().metadata.htmlClassName;
  const { frontMatter, toc } = useDoc();
  const { hideTOC, hideTableOfContents, toc_max_heading_level } = frontMatter;
  const canDisplayTOC = !hideTOC && !hideTableOfContents && toc.length > 0;
  const { isDocPage, sidebar, nextItem, prevItem, versionMetadata, permalink } = useDoc(); // Added permalink

  // Use the window size to determine if the TOC should be visible
  const windowSize = useWindowSize(); // desktop, tablet, mobile

  const isTocMobile = windowSize === 'mobile';
  const isTocDesktop = windowSize === 'desktop';

  // Determine where to place the UserProfile component
  // For example, above the content, or within the sidebar if a custom sidebar exists.
  // For simplicity, we'll place it right before the main content.

  return (
    <div className={clsx(ThemeClassNames.wrapper.docsPages, docHtmlClassName)}>
      <DocItemMetadata />

      <div className="row">
        {canDisplayTOC && isTocDesktop && (
          <div className="col col--3">
            <DocItemTOCDesktop />
          </div>
        )}
        <div className={clsx('col', canDisplayTOC && isTocDesktop && 'col--9')}>
          <div className="col">
            <DocVersionBadge />
            {canDisplayTOC && isTocMobile && <DocItemTOCMobile />}
            <div className={ThemeClassNames.mainPage.content}>
              <UserProfile /> {/* Inject UserProfile component here */}
              <DocItemContent>{children}</DocItemContent>
            </div>
            <DocItemFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

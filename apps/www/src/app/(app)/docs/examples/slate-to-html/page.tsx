import { Suspense } from 'react';

import { DocContent } from '@/app/(app)/docs/[[...slug]]/doc-content';
import { BlockDisplay } from '@/components/block-display';
import { exampleNavMap } from '@/config/docs-examples';

export default function SlateToHtmlPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocContent
        category="example"
        doc={exampleNavMap['/docs/examples/slate-to-html']}
        toc={[]}
      >
        <BlockDisplay
          item={{
            name: 'slate-to-html',
            type: 'registry:example',
          }}
        />
      </DocContent>
    </Suspense>
  );
}

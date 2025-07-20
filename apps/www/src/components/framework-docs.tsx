'use client';

import type * as React from 'react';

interface FrameworkDocsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: string;
}

export function FrameworkDocs({ ...props }: FrameworkDocsProps) {
  // Removed contentlayer dependency
  return null;
}

'use client';

import * as React from 'react';

import type {
  createFileTreeForRegistryItemFiles,
  FileTree,
} from '@/lib/rehype-utils';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import type {
  registryItemFileSchema,
  registryItemSchema,
} from 'shadcn/registry';
import type { z } from 'zod';

import {
  Check,
  ChevronRight,
  Clipboard,
  File,
  Folder,
  Fullscreen,
  Monitor,
  Package,
  Smartphone,
  Tablet,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';

import { CopyNpmCommandButton } from '@/components/copy-button';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { siteConfig } from '@/config/site';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { cn } from '@/lib/utils';

import { getIconForLanguageExtension } from './icons';

// SYNC

type BlockViewerContext = {
  activeFile: string | null;
  dependencies: string[];
  highlightedFiles:
  | (z.infer<typeof registryItemFileSchema> & {
    highlightedContent: string;
  })[]
  | null;
  isLoading: boolean;
  item: z.infer<typeof registryItemSchema> & {
    meta?: {
      descriptionSrc?: string;
      isPro?: boolean;
      src?: string;
    };
  };
  resizablePanelRef: React.RefObject<ImperativePanelHandle | null> | null;
  tree: ReturnType<typeof createFileTreeForRegistryItemFiles> | null;
  view: 'code' | 'preview';
  setActiveFile: (file: string) => void;
  setView: (view: 'code' | 'preview') => void;
};

const BlockViewerContext = React.createContext<BlockViewerContext | null>(null);

function useBlockViewer() {
  const context = React.useContext(BlockViewerContext);

  if (!context) {
    throw new Error(
      'useBlockViewer must be used within a BlockViewerProvider.'
    );
  }

  return context;
}

function BlockViewerProvider({
  children,
  defaultView = 'preview',
  dependencies,
  highlightedFiles: highlightedFilesProp,
  item,
  tree,
}: Pick<
  BlockViewerContext,
  'dependencies' | 'highlightedFiles' | 'item' | 'tree'
> & {
  children: React.ReactNode;
  defaultView?: BlockViewerContext['view'];
}) {
  const [view, setView] =
    React.useState<BlockViewerContext['view']>(defaultView);
  const [highlightedFiles, setHighlightedFiles] = React.useState<
    BlockViewerContext['highlightedFiles']
  >(highlightedFilesProp ?? []);
  const [activeFile, setActiveFile] = React.useState<
    BlockViewerContext['activeFile']
  >(highlightedFiles?.[0]?.target ?? null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSettled, setIsSettled] = React.useState(false);
  const [hasError, setHasError] = React.useState(false); // Add error state
  const resizablePanelRef = React.useRef<ImperativePanelHandle>(null);

  // Load code files when switching to code view
  React.useEffect(() => {
    if (
      view === 'code' &&
      highlightedFiles?.[1] &&
      !highlightedFiles[1].content &&
      !isLoading &&
      !hasError &&
      !isSettled
    ) {
      const loadFiles = async () => {
        setIsLoading(true);

        try {
          const response = await fetch(
            `/api/registry/${encodeURIComponent(item.name)}`
          );
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch files');
          }
          if (data.files) {
            setHighlightedFiles(data.files);

            if (!activeFile && data.files?.length) {
              setActiveFile(data.files[0].target!);
            }
          }
        } catch (error) {
          console.error('Failed to load files:', error);
          setHasError(true); // Set error state to prevent retries
        } finally {
          setIsLoading(false);
        }

        setIsSettled(true);
      };
      void loadFiles();
    }
  }, [
    activeFile,
    hasError,
    highlightedFiles,
    isLoading,
    isSettled,
    item.name,
    view,
  ]);

  return (
    <BlockViewerContext.Provider
      value={{
        activeFile,
        dependencies,
        highlightedFiles,
        isLoading,
        item,
        resizablePanelRef,
        setActiveFile,
        setView,
        tree,
        view,
      }}
    >
      <div
        id={item.name}
        className="group/block-view-wrapper flex min-w-0 flex-col items-stretch gap-4"
        style={
          {
            '--height': (item.meta?.iframeHeight ?? 650) + 'px',
          } as React.CSSProperties
        }
        data-view={view}
      >
        {children}
      </div>
    </BlockViewerContext.Provider>
  );
}

function BlockViewerToolbar({ block }: { block: boolean }) {
  const { item, resizablePanelRef, setView } = useBlockViewer();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const description =
    item.meta?.descriptionSrc ??
    item.meta?.src?.replace('?iframe=true', '') ??
    `/blocks/${item.name}`;

  return (
    <div className="flex w-full items-center gap-2 md:pr-[14px]">
      <Tabs
        className="hidden sm:flex"
        defaultValue="preview"
        onValueChange={(value) => setView(value as 'code' | 'preview')}
      >
        <TabsList className="h-7 items-center rounded-md p-0 px-[calc(--spacing(1)-2px)] py-[--spacing(1)]">
          <TabsTrigger
            className="h-[1.45rem] rounded-sm px-2 text-xs"
            value="preview"
          >
            Preview
          </TabsTrigger>

          {!item.meta?.isPro && (
            <TabsTrigger
              className="h-[1.45rem] rounded-sm px-2 text-xs"
              value="code"
            >
              Code
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      {block && (
        <Separator orientation="vertical" className="mx-2 hidden h-4 sm:flex" />
      )}

      {block && (
        <Link
          className="text-sm font-medium underline-offset-2 hover:underline"
          href={description}
          target={description.startsWith('/') ? '_self' : '_blank'}
        >
          {item.description}
        </Link>
      )}

      <div className="ml-auto flex items-center gap-2">
        {!item.meta?.src &&
          !item.meta?.isPro &&
          item.meta?.registry !== false && (
            <>
              {/* NPX Command Button */}
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  'flex h-7 rounded-md border bg-transparent px-1.5 shadow-none lg:w-auto'
                )}
                onClick={() => {
                  copyToClipboard(
                    `npx shadcn@latest add ${siteConfig.registryUrl}${item.name}`
                  );
                }}
              >
                {isCopied ? <Check /> : <Terminal />}

                {block && (
                  <span className="hidden lg:inline">
                    npx shadcn@latest add {item.name}
                  </span>
                )}
              </Button>

              {block && (
                <Separator
                  orientation="vertical"
                  className="mx-2 hidden h-4 lg:flex"
                />
              )}
            </>
          )}

        {item.meta?.isPro && (
          <Link
            className={cn(
              buttonVariants(),
              'group relative flex justify-start gap-2 overflow-hidden rounded-sm whitespace-pre',
              'dark:bg-muted dark:text-foreground',
              'hover:ring-2 hover:ring-primary hover:ring-offset-2',
              'transition-all duration-300 ease-out',
              'h-[26px] px-2 text-xs'
            )}
            href={item.meta?.descriptionSrc ?? siteConfig.links.potionIframe}
            target="_blank"
          >
            <span
              className={cn(
                'absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12',
                'bg-white opacity-10',
                'transition-all duration-1000 ease-out'
              )}
            />
            Get the code
          </Link>
        )}

        {block && (
          <div className="hidden h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none lg:flex">
            <ToggleGroup
              defaultValue="100"
              onValueChange={(value) => {
                if (resizablePanelRef?.current) {
                  resizablePanelRef.current.resize(Number.parseInt(value));
                }
              }}
              type="single"
            >
              <ToggleGroupItem
                className="size-[22px] rounded-sm p-0"
                value="100"
                title="Desktop"
              >
                <Monitor className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem
                className="size-[22px] rounded-sm p-0"
                value="60"
                title="Tablet"
              >
                <Tablet className="size-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem
                className="size-[22px] rounded-sm p-0"
                value="30"
                title="Mobile"
              >
                <Smartphone className="size-3.5" />
              </ToggleGroupItem>
              <Separator orientation="vertical" className="h-4" />
              <Button
                asChild
                size="icon"
                variant="ghost"
                className="size-[22px] rounded-sm p-0"
                title="Open in New Tab"
              >
                <Link
                  href={
                    item.meta?.src?.replace('?iframe=true', '') ??
                    `/blocks/${item.name}`
                  }
                  target="_blank"
                >
                  <span className="sr-only">Open in New Tab</span>
                  <Fullscreen className="size-3.5" />
                </Link>
              </Button>
            </ToggleGroup>
          </div>
        )}

        {/* {!item.meta?.isPro && (
          <>
            <Separator
              orientation="vertical"
              className="mx-1 hidden h-4 xl:flex"
            />
            <OpenInV0Button
              name={item.name}
              className="hidden shadow-none sm:flex"
            />
          </>
        )} */}
      </div>
    </div>
  );
}

function BlockViewerView({
  height,
  preview,
}: {
  preview: React.ReactNode;
  height?: string;
}) {
  const { item, resizablePanelRef } = useBlockViewer();

  return (
    <div
      className="h-(--height) group-data-[view=code]/block-view-wrapper:hidden"
      style={height ? { height } : undefined}
    >
      <div className="grid size-full gap-4">
        <ResizablePanelGroup className="relative z-10" direction="horizontal">
          <ResizablePanel
            ref={resizablePanelRef}
            className="relative aspect-[4/2.5] rounded-xl border bg-background md:aspect-auto"
            defaultSize={100}
            minSize={30}
          >
            {/* <Image
              className="absolute left-0 top-0 z-20 w-[970px] max-w-none bg-background data-[block=sidebar-10]:left-auto data-[block=sidebar-10]:right-0 data-[block=sidebar-11]:-top-1/3 data-[block=sidebar-14]:left-auto data-[block=sidebar-14]:right-0 data-[block=login-01]:max-w-full data-[block=sidebar-13]:max-w-full data-[block=sidebar-15]:max-w-full dark:hidden sm:w-[1280px] md:hidden md:dark:hidden"
              alt={item.name}
              data-block={item.name}
              height={900}
              src={`/images/blocks/${item.name}.png`}
              width={1440}
            />
            <Image
              className="absolute left-0 top-0 z-20 hidden w-[970px] max-w-none bg-background data-[block=sidebar-10]:left-auto data-[block=sidebar-10]:right-0 data-[block=sidebar-11]:-top-1/3 data-[block=sidebar-14]:left-auto data-[block=sidebar-14]:right-0 data-[block=login-01]:max-w-full data-[block=sidebar-13]:max-w-full data-[block=sidebar-15]:max-w-full dark:block sm:w-[1280px] md:hidden md:dark:hidden"
              alt={item.name}
              data-block={item.name}
              height={900}
              src={`/images/blocks/${item.name}-dark.png`}
              width={1440}
            /> */}

            {preview ?? (
              <iframe
                // className="chunk-mode relative z-20 hidden w-full bg-background md:block"
                className="chunk-mode relative z-20 size-full bg-background"
                title={item.name}
                height={item.meta?.iframeHeight ?? '100%'}
                sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms"
                src={item.meta?.src ?? `/blocks/${item.name}`}
              />
            )}
          </ResizablePanel>
          <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:-translate-x-px after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all hover:after:h-10 sm:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

function BlockViewerCode({ size }: { size?: 'default' | 'sm' }) {
  const { activeFile, dependencies, highlightedFiles, isLoading } =
    useBlockViewer();
  const deps = dependencies.join(' ');

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile);
  }, [highlightedFiles, activeFile]);

  if (!file?.content && isLoading) {
    return (
      <div className="mr-[14px] flex h-(--height) overflow-hidden rounded-xl bg-zinc-950 text-code-foreground group-data-[view=preview]/block-view-wrapper:hidden">
        <BlockViewerFileTree size={size} />
        <div className="flex min-w-0 flex-1 flex-col items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }
  if (!file) {
    return null;
  }

  return (
    <div className="mr-[14px] flex h-(--height) overflow-hidden rounded-xl group-data-[view=preview]/block-view-wrapper:hidden bg-code">
      <BlockViewerFileTree size={size} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-12 items-center gap-2 border-b  px-4  rounded-none text-sm font-medium !mt-0"
          data-rehype-pretty-code-figure
        >
          {/* <File className="size-4" /> */}
          <span className="size-4" >
            {getIconForLanguageExtension(file.target?.split('.').pop() ?? '')}
          </span>
          {file.target}
          <div className="ml-auto flex items-center gap-2">
            {dependencies.length > 0 && (
              <CopyNpmCommandButton
                className="flex h-7 rounded-md bg-code px-1.5 text-code-foreground shadow-none lg:w-auto"
                commands={{
                  __bunCommand__: 'bun add ' + deps,
                  __npmCommand__: 'npm install ' + deps,
                  __pnpmCommand__: 'pnpm add ' + deps,
                  __yarnCommand__: 'yarn add ' + deps,
                }}
                icon={<Package />}
              />
            )}

            <BlockCopyCodeButton />
          </div>
        </div>
        <div
          key={file?.path}
          className="relative flex-1 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: file?.highlightedContent ?? '' }}
        />
      </div>
    </div>
  );
}

export function BlockViewerFileTree({ size }: { size?: 'default' | 'sm' }) {
  const { highlightedFiles, tree } = useBlockViewer();

  if (!tree || highlightedFiles?.length === 1) {
    return null;
  }

  return (
    <div className={cn('w-[280px]', size === 'sm' && 'w-[240px]')}>
      <SidebarProvider className="flex min-h-full! flex-col">
        <Sidebar
          className="w-full flex-1 overflow-x-hidden overflow-y-auto border-r  text-code-foreground bg-code "
          collapsible="none"
        >
          <SidebarGroupLabel className="sticky top-0 z-10 h-12 rounded-none border-b bg-code px-4 text-sm text-code-foreground">
            Files
          </SidebarGroupLabel>
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {tree.map((file, index) => (
                  <Tree key={index} index={1} item={file} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

function Tree({ index, item }: { index: number; item: FileTree }) {
  const { activeFile, setActiveFile } = useBlockViewer();

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          className={cn(
            'overflow-x-auto rounded-none pl-(--index) whitespace-nowrap hover:bg-code-highlight hover:text-code-foreground focus:bg-code-highlight focus:text-code-foreground focus-visible:bg-code-highlight focus-visible:text-code-foreground active:bg-code-highlight active:text-code-foreground data-[active=true]:bg-code-highlight data-[active=true]:text-code-foreground'
          )}
          style={
            {
              '--index': `${index * 0.75}rem`,
            } as React.CSSProperties
          }
          onClick={() => item.path && setActiveFile(item.path)}
          data-index={index}
          isActive={item.path === activeFile}
        >
          <ChevronRight className="invisible shrink-0" />
          <File className="size-4 shrink-0" />
          <span className="truncate">{item.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn(
              'overflow-x-auto rounded-none pl-(--index) whitespace-nowrap hover:bg-code-highlight hover:text-code-foreground focus-visible:bg-code-highlight focus-visible:text-code-foreground active:bg-code-highlight active:text-code-foreground data-[active=true]:bg-code-highlight data-[active=true]:text-code-foreground data-[state=open]:hover:bg-code-highlight data-[state=open]:hover:text-code-foreground'
            )}
            style={
              {
                '--index': `${index * 0.75}rem`,
              } as React.CSSProperties
            }
          >
            <ChevronRight className="size-4 shrink-0 transition-transform" />
            <Folder className="size-4 shrink-0" />
            <span className="truncate">{item.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full border-none p-0">
            {item.children.map((subItem, key) => (
              <Tree key={key} index={index + 1} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function BlockCopyCodeButton() {
  const { activeFile, highlightedFiles } = useBlockViewer();
  const { copyToClipboard, isCopied } = useCopyToClipboard();

  const file = React.useMemo(() => {
    return highlightedFiles?.find((file) => file.target === activeFile);
  }, [activeFile, highlightedFiles]);

  const content = file?.content;

  if (!content) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      className="size-7 shrink-0 rounded-lg p-0 hover:bg-code-highlight hover:text-code-foreground focus:bg-code-highlight focus:text-code-foreground focus-visible:bg-code-highlight focus-visible:text-code-foreground active:bg-code-highlight active:text-code-foreground data-[active=true]:bg-code-highlight data-[active=true]:text-code-foreground [&>svg]:size-3"
      onClick={() => {
        copyToClipboard(content);
      }}
    >
      {isCopied ? <Check /> : <Clipboard />}
    </Button>
  );
}

export function BlockViewer({
  block = true,
  height,
  preview,
  ...props
}: Pick<
  BlockViewerContext,
  'dependencies' | 'highlightedFiles' | 'item' | 'tree'
> & {
  block?: boolean;
  height?: string;
  preview?: React.ReactNode;
}) {
  return (
    <BlockViewerProvider {...props}>
      <BlockViewerToolbar block={block} />
      <BlockViewerView height={height} preview={preview} />
      <BlockViewerCode size={block ? 'default' : 'sm'} />
    </BlockViewerProvider>
  );
}

export function BlockCode({
  ...props
}: Pick<
  BlockViewerContext,
  'dependencies' | 'highlightedFiles' | 'item' | 'tree'
>) {
  return (
    <BlockViewerProvider defaultView="code" {...props}>
      <BlockViewerCode size="sm" />
    </BlockViewerProvider>
  );
}

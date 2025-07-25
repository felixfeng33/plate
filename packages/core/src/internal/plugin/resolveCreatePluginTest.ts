import type { AnyPluginConfig } from '../../lib/plugin/BasePlugin';

import { createSlateEditor } from '../../lib/editor';
import { createSlatePlugin } from '../../lib/plugin/createSlatePlugin';
import { resolvePlugin } from './resolvePlugin';

export const resolvePluginTest = <P extends AnyPluginConfig>(p: P) => {
  const editor = createSlateEditor({
    plugins: [p],
  }) as any;

  let key = p.key;

  if (!key) {
    key = resolvePlugin(editor, p as any).key;
  }

  return editor.getPlugin({ key });
};

export const resolveCreatePluginTest = ((plugin: AnyPluginConfig) => {
  const p = createSlatePlugin(plugin);

  const editor = createSlateEditor({
    plugins: [p],
  }) as any;

  let key = p.key;

  if (!key) {
    key = resolvePlugin(editor, p as any).key;
  }

  return editor.getPlugin({ key });
}) as typeof createSlatePlugin;

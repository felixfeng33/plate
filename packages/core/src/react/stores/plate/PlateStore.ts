import type { NodeEntry, TRange, TSelection, ValueOf } from '@platejs/slate';
import type { Nullable } from '@udecode/utils';

import type { EditableProps } from '../../../lib';
import type { PlateEditor } from '../../editor';

export type PlateChangeKey =
  | 'versionDecorate'
  | 'versionEditor'
  | 'versionSelection'
  | 'versionValue';

export type PlateStoreState<E extends PlateEditor = PlateEditor> = Nullable<{
  composing: boolean;
  decorate: NonNullable<(options: { editor: E; entry: NodeEntry }) => TRange[]>;
  /** Whether `Editable` is rendered so slate DOM is resolvable. */
  isMounted: boolean;
  /**
   * Whether the editor is primary. If no editor is active, then PlateController
   * will use the first-mounted primary editor.
   *
   * @default true
   */
  primary: boolean;
  //  Whether the editor is read-only.
  readOnly: boolean;
  renderChunk: NonNullable<EditableProps['renderChunk']>;
  renderElement: NonNullable<EditableProps['renderElement']>;
  renderLeaf: NonNullable<EditableProps['renderLeaf']>;
  renderText: NonNullable<EditableProps['renderText']>;
  /**
   * Version incremented when calling `redecorate`. This is a dependency of the
   * `decorate` function.
   */
  versionDecorate: number;
  /** Version incremented on each editor change. */
  versionEditor: number;
  /** Version incremented on each editor.selection change. */
  versionSelection: number;
  /** Version incremented on each editor.children change. */
  versionValue: number;
  /** Controlled callback called when the editor state changes. */
  onChange: (options: { editor: E; value: ValueOf<E> }) => void;
  /** Controlled callback called when the editor.selection changes. */
  onSelectionChange: (options: { editor: E; selection: TSelection }) => void;
  /** Controlled callback called when the editor.children changes. */
  onValueChange: (options: { editor: E; value: ValueOf<E> }) => void;
}> & {
  /**
   * A unique id used as a provider scope. Use it if you have multiple `Plate`
   * in the same React tree.
   *
   * @default random id
   */
  id: string;
  /** A reference to the editor container element. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Slate editor reference.
   *
   * @default createPlateFallbackEditor()
   */
  editor: E;
  /**
   * A reference to the editor scroll container element.
   *
   * @default containerRef
   */
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

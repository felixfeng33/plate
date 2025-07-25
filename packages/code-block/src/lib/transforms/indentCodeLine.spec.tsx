/** @jsx jsxt */

import { jsxt } from '@platejs/test-utils';
import { type ElementEntry, type SlateEditor, createEditor } from 'platejs';
import { createPlateEditor } from 'platejs/react';

import { CodeBlockPlugin } from '../../react/CodeBlockPlugin';
import { indentCodeLine } from './indentCodeLine';

jsxt;

describe('indent code line', () => {
  describe('when the selection is expanded', () => {
    it('should indent', () => {
      const input = createEditor(
        (
          <editor>
            <hcodeblock>
              <hcodeline>
                {'  '}before <anchor />
                selection
                <focus /> after
              </hcodeline>
            </hcodeblock>
          </editor>
        ) as any
      );

      const output = (
        <editor>
          <hcodeblock>
            <hcodeline>
              {'    '}before <anchor />
              selection
              <focus /> after
            </hcodeline>
          </hcodeblock>
        </editor>
      ) as any as SlateEditor;

      const editor = createPlateEditor({
        plugins: [CodeBlockPlugin],
        selection: input.selection,
        value: input.children,
      });

      const codeBlock = editor.api.node([0]) as ElementEntry;
      const codeLine = editor.api.node([0, 0]) as ElementEntry;

      indentCodeLine(editor, { codeBlock, codeLine });

      expect(editor.children).toEqual(output.children);
    });
  });

  describe('when the selection is collapsed', () => {
    describe('when there are only whitespace characters left of the cursor', () => {
      it('should indent', () => {
        const input = (
          <editor>
            <hcodeblock>
              <hcodeline>
                {'  '}
                <cursor />
                after
              </hcodeline>
            </hcodeblock>
          </editor>
        ) as any as SlateEditor;

        const output = (
          <editor>
            <hcodeblock>
              <hcodeline>
                {'    '}
                <cursor />
                after
              </hcodeline>
            </hcodeblock>
          </editor>
        ) as any as SlateEditor;

        const editor = createPlateEditor({
          plugins: [CodeBlockPlugin],
          selection: input.selection,
          value: input.children,
        });

        const codeBlock = editor.api.node([0]) as ElementEntry;
        const codeLine = editor.api.node([0, 0]) as ElementEntry;

        indentCodeLine(editor, { codeBlock, codeLine });

        expect(editor.children).toEqual(output.children);
      });
    });

    describe('when there are non-whitespace characters left of the cursor', () => {
      it('should insert 2 spaces at the cursor', () => {
        const input = (
          <editor>
            <hcodeblock>
              <hcodeline>
                {'  '}before
                <cursor />
                after
              </hcodeline>
            </hcodeblock>
          </editor>
        ) as any as SlateEditor;

        const output = (
          <editor>
            <hcodeblock>
              <hcodeline>
                {'  '}before{'  '}
                <cursor />
                after
              </hcodeline>
            </hcodeblock>
          </editor>
        ) as any as SlateEditor;

        const editor = createPlateEditor({
          plugins: [CodeBlockPlugin],
          selection: input.selection,
          value: input.children,
        });

        const codeBlock = editor.api.node([0]) as ElementEntry;
        const codeLine = editor.api.node([0, 0]) as ElementEntry;

        indentCodeLine(editor, { codeBlock, codeLine });

        expect(editor.children).toEqual(output.children);
      });
    });
  });
});

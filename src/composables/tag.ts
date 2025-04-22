// Utilities
import { propsFactory } from '@/utils/Vuetify';

// Types
import type { JSXComponent } from '@/utils/Vuetify';
import type { PropType } from 'vue';

// Types
export interface TagProps {
  tag: string | JSXComponent;
}

// Composables
export const makeTagProps = propsFactory(
  {
    tag: {
      type: [String, Object, Function] as PropType<string | JSXComponent>,
      default: 'div',
    },
  },
  'tag',
);

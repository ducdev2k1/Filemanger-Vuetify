// Composables
import { makeComponentProps } from '@/composables/component';
import { makeTagProps } from '@/composables/tag';

// Utilities
import { genericComponent, propsFactory, useRender } from '@/utils/Vuetify';

export const makeVListItemActionProps = propsFactory(
  {
    start: Boolean,
    end: Boolean,

    ...makeComponentProps(),
    ...makeTagProps(),
  },
  'VListItemAction',
);

export const VListItemAction = genericComponent()({
  name: 'VListItemAction',

  props: makeVListItemActionProps(),

  setup(props, { slots }) {
    useRender(() => (
      <props.tag
        class={[
          'v-list-item-action',
          {
            'v-list-item-action--start': props.start,
            'v-list-item-action--end': props.end,
          },
          props.class,
        ]}
        style={props.style}
        v-slots={slots}
      />
    ));

    return {};
  },
});

export type VListItemAction = InstanceType<typeof VListItemAction>;

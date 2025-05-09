// Composables
import { makeComponentProps } from '@/composables/component';
import { provideDefaults } from '@/composables/defaults';

// Utilities
import { genericComponent, useRender } from '@/utils/Vuetify';

export const VCardActions = genericComponent()({
  name: 'VCardActions',

  props: makeComponentProps(),

  setup(props, { slots }) {
    provideDefaults({
      VBtn: {
        slim: true,
        variant: 'text',
      },
    });

    useRender(() => (
      <div class={['v-card-actions', props.class]} style={props.style}>
        {slots.default?.()}
      </div>
    ));

    return {};
  },
});

export type VCardActions = InstanceType<typeof VCardActions>;

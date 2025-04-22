// Components
import { DProgressLinear } from '@/components/CustomVuetify/DProgressLinear';

// Utilities
import { getCurrentInstanceName, propsFactory } from '@/utils/Vuetify';
import { toRef } from 'vue';

// Types
import type { SlotsToProps } from '@/utils/Vuetify';
import type { ExtractPropTypes, SetupContext } from 'vue';

export interface LoaderSlotProps {
  color: string | undefined;
  isActive: boolean;
}

export interface LoaderProps {
  loading?: boolean | string;
}

// Composables
export const makeLoaderProps = propsFactory(
  {
    loading: [Boolean, String],
  },
  'loader',
);

export function useLoader(props: LoaderProps, name = getCurrentInstanceName()) {
  const loaderClasses = toRef(() => ({
    [`${name}--loading`]: props.loading,
  }));

  return { loaderClasses };
}

export function LoaderSlot(
  props: {
    absolute?: boolean;
    active: boolean;
    name: string;
    color?: string;
  } & ExtractPropTypes<
    SlotsToProps<{
      default: LoaderSlotProps;
    }>
  >,
  { slots }: SetupContext,
) {
  return (
    <div class={`${props.name}__loader`}>
      {slots.default?.({
        color: props.color,
        isActive: props.active,
      } satisfies LoaderSlotProps) || (
        <DProgressLinear absolute={props.absolute} active={props.active} color={props.color} height="2" indeterminate />
      )}
    </div>
  );
}

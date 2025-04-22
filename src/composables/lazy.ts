// Utilities
import { propsFactory } from '@/utils/Vuetify';
import { shallowRef, toRef, watch } from 'vue';

// Types
import type { Ref } from 'vue';

export const makeLazyProps = propsFactory(
  {
    eager: Boolean,
  },
  'lazy',
);

export function useLazy(props: { eager: boolean }, active: Ref<boolean>) {
  const isBooted = shallowRef(false);
  const hasContent = toRef(() => isBooted.value || props.eager || active.value);

  watch(active, () => (isBooted.value = true));

  function onAfterLeave() {
    if (!props.eager) isBooted.value = false;
  }

  return { isBooted, hasContent, onAfterLeave };
}

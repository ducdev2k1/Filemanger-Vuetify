// Utilities
import { getCurrentInstance } from '@/utils/Vuetify';

export function useScopeId() {
  const vm = getCurrentInstance('useScopeId');

  const scopeId = vm!.vnode.scopeId;

  return { scopeId: scopeId ? { [scopeId]: '' } : undefined };
}

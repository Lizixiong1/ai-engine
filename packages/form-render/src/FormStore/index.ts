// // FormStore implementation
// import { createStore, StoreApi } from 'zustand';
// import { FormRenderProps } from '../index';

// export interface FormState {
//   formData: any;
//   schema: any;
//   updateFormData: (data: any) => void;
//   updateSchema: (schema: any) => void;
//   resetForm: () => void;
// }

// const createFormStore = (initialData: Partial<FormRenderProps> = {}) => {
//   return createStore<FormState>((set, get) => ({
//     formData: initialData.formData || {},
//     schema: initialData.schema || {},
//     updateFormData: (data) => set({ formData: { ...get().formData, ...data } }),
//     updateSchema: (schema) => set({ schema }),
//     resetForm: () => set({ formData: {}, schema: {} }),
//   }));
// };
// export default createFormStore;
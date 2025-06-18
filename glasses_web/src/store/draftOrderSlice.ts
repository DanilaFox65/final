
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDraftOrder, removeServiceFromOrder, submitOrder } from '../api/orderService';
import { RootState } from './index';



interface Service {
  id: number;
  service: {
    id: number;
    name: string;
    image: string;
    price: number;
    description?: string;
    color?: string;
    size?: string;
    date?: string;
  };
}

interface Order {
  id: number;
  status: string;
}

interface DraftOrderResponse {
  order: Order;
  services: Service[];
}

interface DraftOrderState {
  orderData: {
    order: Order | null;
    services: Service[];
  } | null;
  loading: boolean;
  error: string;
  submitted: boolean;
}



const initialState: DraftOrderState = {
  orderData: null,
  loading: false,
  error: '',
  submitted: false,
};




export const fetchDraftOrder = createAsyncThunk<DraftOrderResponse, void, { state: RootState }>(
  'draftOrder/fetchDraftOrder',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Нет токена');
    try {
      return await getDraftOrder(token);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка загрузки');
    }
  }
);


export const deleteServiceFromOrder = createAsyncThunk<
  { serviceId: number },
  { orderId: number; serviceId: number },
  { state: RootState }
>(
  'draftOrder/deleteServiceFromOrder',
  async ({ orderId, serviceId }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Нет токена');
    try {
      await removeServiceFromOrder(orderId, serviceId, token);
      return { serviceId };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка удаления');
    }
  }
);


export const submitDraftOrder = createAsyncThunk<
  boolean,
  { orderId: number },
  { state: RootState }
>(
  'draftOrder/submitDraftOrder',
  async ({ orderId }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('Нет токена');
    try {
      await submitOrder(orderId, token);
      return true;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : 'Ошибка отправки');
    }
  }
);



const draftOrderSlice = createSlice({
  name: 'draftOrder',
  initialState,
  reducers: {
    clearDraftOrder(state) {
      state.orderData = null;
      state.error = '';
      state.submitted = false;
    },
  },
  extraReducers: (builder) => {
    builder

  
      .addCase(fetchDraftOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchDraftOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orderData = {
          order: payload.order,
          services: payload.services,
        };
      })
      .addCase(fetchDraftOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || 'Ошибка загрузки черновика';
      })

  
      .addCase(deleteServiceFromOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(deleteServiceFromOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (state.orderData) {
          state.orderData.services = state.orderData.services.filter(
            (s) => s.service.id !== payload.serviceId
          );
        }
      })
      .addCase(deleteServiceFromOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || 'Ошибка удаления услуги';
      })

     
      .addCase(submitDraftOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(submitDraftOrder.fulfilled, (state) => {
        state.loading = false;
        state.submitted = true;
      })
      .addCase(submitDraftOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || 'Ошибка отправки заказа';
      });
  },
});

export const { clearDraftOrder } = draftOrderSlice.actions;
export default draftOrderSlice.reducer;

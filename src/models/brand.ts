import data from '@/crawler/index.json'
import {
  LipstickInfoList,
} from '@/type'

export interface BrandState {
  lipstickInfoList: LipstickInfoList;
  selectBrand: string;
  selectColor: string;
}

export default {
  namespace: 'brand',
  state: {
    lipstickInfoList: data,
    selectBrand: 'esteelauder',
    selectColor: '',
  },
  reducers: {
    changeBrand(state: BrandState, { payload }) {
      return {
        ...state,
        selectBrand: payload,
      }
    },
    changeColor(state: BrandState, { payload }) {
      return {
        ...state,
        selectColor: payload,
      }
    }
  },
}

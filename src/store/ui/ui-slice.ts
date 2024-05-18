import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../index'

export interface UIState {
	pageTitle: string
}

const initialState: UIState = {
	pageTitle: 'Homunculus',
}

const UISlice = createSlice({
	name: 'ui',
	initialState: initialState,
	reducers: {
		setPageTitle: (state, action: PayloadAction<string>) => {
			state.pageTitle = action.payload
		},
		resetPageTitle: state => {
			state.pageTitle = initialState.pageTitle
		},
	},
})

export const { setPageTitle, resetPageTitle } = UISlice.actions

export const UIReducer = UISlice.reducer
export const pageTitleSelector = (state: RootState) => state.ui.pageTitle

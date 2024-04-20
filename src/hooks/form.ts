import { FormValue } from '../models/form/FormValue'
import { useCallback, useMemo, useReducer } from 'react'

export type FormValues = { [key: string]: FormValue<any> }

interface UseFormProps<T extends FormValues> {
	initialState: T
}

interface Form<T extends FormValues> {
	formState: T
	dispatchState: (property: keyof T, payload: FormValue<any> | undefined) => void
	isInvalid: boolean
}

export function useForm<T extends FormValues>({ initialState }: UseFormProps<T>): Form<T> {
	const formReducer = useCallback(
		(state: T, action: { type: keyof T | 'reset'; payload: FormValue<any> | undefined }) => {
			if (action.type === 'reset') {
				return initialState
			} else if (!!action.payload) {
				return {
					...state,
					[action.type]: action.payload,
				} as T
			} else {
				throw new Error('Invalid option')
			}
		},
		[initialState]
	)
	const [formState, dispatchFormState] = useReducer(formReducer, initialState)

	const dispatchState = useCallback((property: keyof T, payload: FormValue<any> | undefined) => {
		dispatchFormState({ type: property, payload })
	}, [])

	const isInvalid = useMemo(() => {
		return Object.values(formState).some(it => !it.isValid)
	}, [formState])

	return { formState, dispatchState, isInvalid }
}

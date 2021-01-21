import { createSlice } from '@reduxjs/toolkit';
import uuid from 'uuid';
import moment from 'moment';

import { ThunkActionType } from 'store';
import { formatTime } from 'constants/common';


const todosSlice = createSlice({
    name: 'todos',
    initialState: [
        {
            name: 'item 1',
            active: true,
            id: uuid(),
            time: moment().add(1, 'hours').format(formatTime)
        },
        {
            name: 'item 2',
            active: false,
            id: uuid(),
            time: moment().add(1, 'days').format(formatTime)
        },
        {
            name: 'item 3',
            active: true,
            id: uuid(),
            time: moment().add(23, 'hours').format(formatTime)
        }
    ],
    reducers: {
        getListItemsSuccess: (state, { payload}) => {

        },
        createItemSuccess: (state, { payload }) => {
            const newItem = {
                name: payload.name,
                active: false,
                id: uuid(),
                time: payload.time
            }
            
            return [...state, newItem]
        },
        deleteItemSuccess: (state, { payload }) => {
            return state.filter(i => i.id !== payload.id)
        },

        updateItemSuccess: (state, { payload }) => {
            const newState = [...state];
            const index = newState.findIndex(i => i.id === payload.id)
            newState[index] = {...newState[index], ...payload}
            return newState
        },
        markAllCompleted: (state, { payload }) => {
            return state.map(i => {
                return { ...i, active: true }
            })
        },
        markAllUnCompleted: (state, { payload }) => {
            return state.map(i => {
                return { ...i, active: false }
            })
        },
    },
});

export const getListItems = (type): ThunkActionType => async (
    dispatch,
    getStoreValue
) => {
    // const { todos } = getStoreValue();
    // if (type === 'active') {
    //     return todos.filter(i => i.active)
    // } else if (type === 'completed') {
    //     return todos.filter(i => !i.active)
    // } else {
    //     return todos
    // }
};

export const {
    createItemSuccess,
    updateItemSuccess,
    deleteItemSuccess,
    markAllCompleted,
    markAllUnCompleted
} = todosSlice.actions;

export const todos = todosSlice.reducer;


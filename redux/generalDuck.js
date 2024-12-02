const dataInitial = {
    user: {},
    picture: '',
    update: false,
    pets: [],
    stack: false,
}

const OBTENER_DATA_GENERAL = 'OBTENER_DATA_GENERAL'
const CHANGUE_STACK = 'CHANGUE_STACK'
const PICTURE_USER = 'PICTURE_USER'
const UPDATE_DATA = 'UPDATE_DATA'

export default function generalData(state = dataInitial, action) {
    switch (action.type) {
        case OBTENER_DATA_GENERAL:
            return { ...state, user: action.payload }
        case PICTURE_USER:
            return { ...state, picture: action.payload }
        case UPDATE_DATA:
            return { ...state, update: action.payload }
        default:
            return state
    }
}

export const generalDataAction = (payload) => (dispatch, getState) => {
    dispatch({
        type: OBTENER_DATA_GENERAL,
        payload: payload
    })
}

export const pictureUser = (payload) => (dispatch, getState) => {
    dispatch({
        type: PICTURE_USER,
        payload: payload
    })
}

export const updateData = (payload) => (dispatch, getState) => {
    dispatch({
        type: UPDATE_DATA,
        payload: payload
    })
}
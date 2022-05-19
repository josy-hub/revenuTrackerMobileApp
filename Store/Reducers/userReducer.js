const initialState = {
    id:'',
    nom: '',
    entreprise_id: '',
    equipe_id: '',
    username: '',
    poste: '',
    email: '',
    type: '',
    contact: '',
    remember_token: ''
    
}
function userInformations (state = initialState, action) {
    let nextState
    switch (action.type) {
        case 'LOGIN_SUCCESS': 
            return nextState
        case 'LOGOUT':
            return nextState
    default:
        return state
    }
}
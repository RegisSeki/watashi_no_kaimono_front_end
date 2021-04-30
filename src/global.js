import Vue from 'vue'

export const userKey = '__wnk_user'
export const baseApiUrl = 'https://watashi-no-kaimono-back-end.herokuapp.com '

export function showError(e) {
    if(e && e.response && e.response.data) {
        Vue.toasted.global.defaultError({ msg : e.response.data })
    } else if(typeof e === 'string') {
        Vue.toasted.global.defaultError({ msg : e })
    } else {
        Vue.toasted.global.defaultError()
    }
}

export default { baseApiUrl, showError, userKey }
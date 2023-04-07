export default class CookieUtils {
    static getDataFromCookie(cookieName) {
        let cookie = {}
        document.cookie.split(';').forEach(function(el) {
          let [k,v] = el.split('=')
          cookie[k.trim()] = v
        })
        return cookie[cookieName]
    }
    
    static setCookie(cookieName, cookieValue, cookieExpirationTime, path="/") {
        let now = new Date()
        var expireTime = now.getTime() + cookieExpirationTime
        now.setTime(expireTime)
        document.cookie = `${cookieName}=${cookieValue};expires=${now.toUTCString()};path=${path}`
    }
}
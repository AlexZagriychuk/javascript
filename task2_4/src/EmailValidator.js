// Using the business logic from the following articles to determine if Email is valid:
// - https://en.wikipedia.org/wiki/Email_address

//  For this task we only validate unquoted email local part to simplify the solution (quoted Local Part has more complex rules)
export default class EmailValidator {
    static #parseEmail(emailStr) {
        // Regular expression searches for the following email parts:
        // - Local part or recipient name (parsedEmail[1])
        // - @ symbol
        // - Full domain name (parsedEmail[2]): Domain name + "." symbol + Top-level domain name of 2 or more letters
        const regExp = new RegExp("^([^@]+)@(.+\\.[A-Za-z]{2,})$")
        let parsedEmail = regExp.exec(emailStr)
        if(parsedEmail) {
            return {emailLocalPart: parsedEmail[1], emailFullDomain: parsedEmail[2]}
        } else {
            throw new Error(`Email '${emailStr}' cannot be parsed into the format '{LOCAL_PART}@{DOMAIN}.{TOP_DOMAIN_LEVEL}'`)
        }
    }
    
    static #validateUnquotedLocalPart(emailLocalPart) {
        // The local part can be up to 64 characters long
        // If unquoted, it may use any of these ASCII characters:
        // - uppercase and lowercase Latin letters A to Z and a to z
        // - digits 0 to 9
        // - Special symbols: underscore (_) and hyphen (-)
        //      *** Despite the wide range of special characters which are technically valid (!#$%&'*+-/=?^_`{|}~), organizations, mail services, mail servers and mail clients in practice often do not accept all of them. For example, Windows Live Hotmail only allows creation of email addresses using alphanumerics, dot (.), underscore (_) and hyphen (-).[10] Common advice is to avoid using some special characters to avoid the risk of rejected emails 
        // - dot ., provided that it is not the first or last character and provided also that it does not appear consecutively (e.g., John..Doe@example.com is not allowed).
        const regExp = new RegExp("^[\\.A-Za-z0-9_-]{1,64}$")
        if(!regExp.test(emailLocalPart) || emailLocalPart.startsWith(".") || emailLocalPart.endsWith(".") || emailLocalPart.includes("..")) {
            throw new Error(`Email local part '${emailLocalPart}' is not valid (local part can be up to 64 characters long; allowed characters: uppercase and lowercase Latin letters A to Z and a to z, digits 0 to 9, Special symbols: underscore (_) and hyphen (-), dot . provided that it is not the first or last character and provided also that it does not appear consecutively)`)
        }

        return true
    }
    
    static #validateDomain(domain) {
        // Domain may have a maximum of 255 characters
        // Domain name can consist of multiple labels (parts separated by "."), each label being limited to a length of 63 characters
        // The following characters are allowed:
        // - uppercase and lowercase Latin letters A to Z and a to z;
        // - digits 0 to 9
        // - hyphen -, provided that it is not the first or last character.
        // Last label is called Top-level domain, it must consist of 2 to 63 Latin letters A to Z and a to z
    
        if(domain.length > 255) {
            throw new Error(`Full domain '${domain}' is not valid (domain may have a maximum of 255 characters, but the actual number of characters is ${domain.length})`)
        }

        // Verifying there is at least 2 labels (at least 1 domain name label + Top-level domain label)
        let domainLabels = domain.split(".")
        if(domainLabels.length < 2) {
            throw new Error(`Full domain '${domain}' is not valid (must have at least 2 parts separated by dot .)`)
        }

        // Validating all domain labels except for the Top-level domain label (will be validated below)
        const regExp = new RegExp("^[A-Za-z0-9-]{1,63}$")
        for(let i = 0; i < domainLabels.length - 1; i++) {
            let domainLabel = domainLabels[i]

            if(!regExp.test(domainLabel) || domainLabel.startsWith("-") || domainLabel.endsWith("-")) {
                throw new Error(`Full domain '${domain}' is not valid, because its label '${domainLabel}' is not valid (max label length is 63 characters; the following characters are allowed: uppercase and lowercase Latin letters A to Z and a to z, digits 0 to 9, hyphen - provided that it is not the first or last character)`)
            }
        }

        // Validating the Top-level domain label  
        const topLevelDomainRegExp = new RegExp("^[A-Za-z]{2,63}$")
        let topLevelDomain = domainLabels[domainLabels.length - 1]
        if(!topLevelDomainRegExp.test(topLevelDomain)) {            
            throw new Error(`Full domain '${domain}' is not valid, because its top-level domain '${topLevelDomain}' is not valid (must consist of 2 to 63 Latin letters A to Z and a to z)`)
        }

        return true
    }
    
    static isValid(email) {
        try {
            let parsedEmail = this.#parseEmail(email)
            return this.#validateUnquotedLocalPart(parsedEmail.emailLocalPart) && this.#validateDomain(parsedEmail.emailFullDomain)
        } catch(error) {
            console.error(error.message)
            return false
        }
    }
}

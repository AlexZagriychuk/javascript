// Generates a random int (both min and max are inclusive in the range)
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// Generates a string with hex color between 0x000000 and 0xFFFFFF in the format "#XXXXXX"
function getRandomHexColor() {
    const maxHexColorVal = 0xFFFFFF // 16777215
    let randomInt = getRandomIntInclusive(0, maxHexColorVal)
    let randomHexColor = randomInt.toString(16).padStart(6, 0)
    return `#${randomHexColor.toUpperCase()}`
}

// Generates a string in RGB color format: "rgb(red, green, blue)" (where red, green, blue are values between 0 and 255)
function getRandomRgbColor() {
    const maxRgbValue = 255
    let randomRed = getRandomIntInclusive(0, maxRgbValue)
    let randomGreen = getRandomIntInclusive(0, maxRgbValue)
    let randomBlue = getRandomIntInclusive(0, maxRgbValue)
    return `rgb(${randomRed},${randomGreen},${randomBlue})`
}

// Generates a string with a named color supported by CSS (for example: red, aqua, cyan ...)
function getRandomNamedColor() {
    // List of "Basic Colors" and "Extended colors" from https://www.w3.org/wiki/CSS/Properties/color/keywords
    const namedColors = ["black","silver","gray","white","maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua","aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray","green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral","lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum","powderblue","purple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen"]

    let namedColorIdx = getRandomIntInclusive(0, namedColors.length - 1) 
    return namedColors[namedColorIdx]
}

function getRandomColor() {
    const colorTypes = ["named color", "hex", "rgb"]
    let colorTypeIdx = getRandomIntInclusive(0, colorTypes.length - 1) 
    let colorType = colorTypes[colorTypeIdx]

    switch(colorType) {
        case "named color":
            return getRandomNamedColor()
        case "hex":
            return getRandomHexColor()
        case "rgb":
            return getRandomRgbColor()
        default:
            throw new Error("[Implementation issue] getRandomColor function is not implemented for the color type: " + colorType)
    }
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}



document.getElementById("background-color-changer").addEventListener("click", e => {
    const randomColor = getRandomColor()
    document.body.style.backgroundColor = randomColor
    console.log(capitalizeFirstLetter(randomColor))
})
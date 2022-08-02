export const returnRain = (val) => {
    if (val == 1) {
        return 'no rain'
    }
    if (val == 2) {
        return 'little rain'
    }
    if (val == 3) {
        return 'heavy rain'
    }
}

export const returnTemp = (val) => {
    if (val == 1) {
        return 'warm'
    }
    if (val == 2) {
        return 'moderate'
    }
    if (val == 3) {
        return 'cold'
    }
}
export const returnLowMedSev = (val) => {
    if (val == 1) {
        return 'low'
    }
    if (val == 2) {
        return 'medium'
    }
    if (val == 3) {
        return 'severe'
    }
}
export const returnRisk = (val) => {
    if (val == 1) {
        return 'none'
    }
    if (val == 2) {
        return 'low'
    }
    if (val == 3) {
        return 'high'
    }
}
export const returnImpact = (val) => {
    if (val == 1) {
        return 'low'
    }
    if (val == 2) {
        return 'medium'
    }
    if (val == 3) {
        return 'severe'
    }
}
export const returnInfo = (val) => {
    if (val == 1) {
        return 'none'
    }
    if (val == 2) {
        return 'few'
    }
    if (val == 3) {
        return 'full'
    }
}
export const returnMedia = (val) => {
    if (val == 1) {
        return 'none'
    }
    if (val == 2) {
        return 'low'
    }
    if (val == 3) {
        return 'strong'
    }
}
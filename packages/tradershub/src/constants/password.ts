export const passwordRegex = {
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSymbol: /\W/,
    hasUpperCase: /[A-Z]/,
    isLengthValid: /^.{8,25}$/,
    isPasswordValid: /^(?=.*[a-z])(?=.*\d)(?=.*[A-Z])(?=.*[_@?!/#])[!-~]{8,25}$/,
};

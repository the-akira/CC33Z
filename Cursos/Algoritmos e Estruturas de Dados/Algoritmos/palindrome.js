// Solution for Palindrome Checker
function palindrome(str) {
    // Remova caracteres especiais, espaços e coloque em minúsculas
    let removeChar = str.replace(/[^A-Z0-9]/ig,"").toLowerCase();
    // Remove caracteres reversamente para comparação
    let checkPalindrome = removeChar.split('').reverse().join('');
    // Checa se str é palíndromo
    return (removeChar === checkPalindrome);
}

console.log(palindrome('eye'));
console.log(palindrome('raceCar'));
console.log(palindrome('javascript'));
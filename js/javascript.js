let numbersArray = document.querySelectorAll(".numbers");
numbersArray.forEach(number => number.addEventListener("click", (e) => calculator(e.target.name)))

let operatorsArray = document.querySelectorAll(".operators");
operatorsArray.forEach(operator => operator.addEventListener("click", (e) => calculator(e.target.name)))

let cleaningToolsArray = document.querySelectorAll(".cleaningToolsBox");
cleaningToolsArray.forEach(cleaningTool => cleaningTool.addEventListener("click", (e) => clean(e.target.name)))

document.addEventListener('keyup', (e) => {
    let key = e.key;
    if(/[0-9.+-/*=]|^(Enter)$/.test(key)) {
        calculator(key);
    } else if(/^(Backspace)$|^(C)$|^(Escape)$|^(Delete)$/.test(key)) {
        clean(key);
    }
});

let answerBox = document.querySelector(".calculatorScreen");
let prevData = "";
let answer = "";
let masivi = [];
let operatorCount = 0;

function calculator(data) {
    let currentData = data;
    let dataType = checkDataType(currentData);
    
    if((dataType === "operator" && answer.length === 0) || answer.length > 62) {
        return;
    }

    if (dataType === "operator") {
        if(operatorsCheck(currentData)) readyToCalculate(currentData);
        prevData = answer; 
    } else if (dataType === "number") {
        numbers(currentData);
        prevData = currentData; 
    }
   
    answerBox.innerHTML = `${answer}`;
}

function checkDataType (data) {
    return isNaN(Number(data)) ? "operator" : "number";
}
    
function operatorsCheck(currentData) {
   
    if(prevData === currentData) {
        return;
    } 
    else if(currentData === ".") {
        answer = answer + currentData;
    }
    else if(currentData === "=" || currentData === "Enter") {
        return true;
    } 
    else if(currentData === "+/-") {
        let tempStorage = splitString(answer, " ");
        tempStorage[tempStorage.length - 1] = (Number(tempStorage[tempStorage.length - 1]) * -1).toString();
        answer = joinArray(tempStorage, " ");
    } 
    else if(prevData !== currentData && isNaN(Number(prevData)) && prevData !== "+/-" ) {  
        answer = answer.substr(0, answer.length - 2) + currentData + " ";
    } 
    else {
        operatorCount++;
        answer = `${answer} ${currentData} `
    }
    
    if(operatorCount === 2) {
        return true;
    }

    return false;
}

function readyToCalculate(currentData) {
    let splitedString = splitString(answer, " ");
    answer = calculate(splitedString);

    if(operatorCount === 2) {
        answer =  answer + " " + currentData + " ";  
        operatorCount = 1;
    } else {
        operatorCount = 0;   
    }

    masivi = [];
}

function numbers(currentData) {    
    answer = answer + currentData;
}

function splitString(str, separator) {
    str = str.toString(); 
    return str.split(separator)
}

function joinArray(str, separator) {
    return str.join(separator)
}

function calculate([num1, operator, num2]) {
    if(!num2) num2 = num1;
    
    num1 = Number(num1);
    num2 = Number(num2);

    if(operator === "+") {
        return num1 + num2;
    } 
    else if(operator === "-") {
        return num1 - num2;
    } 
    else if(operator === "/") {
        return Math.round((num1 / num2) * 100000000) / 100000000;
    } 
    else if(operator === "*") {
        return Math.round((num1 * num2) * 100000000) / 100000000;
    } else {
        return num1;
    }
}

function clean (data) {
    if(answer.length < 1) return;

    let cleaningTool = data;

    if (cleaningTool === "C" || cleaningTool === "Escape") {
        prevData = "";
        answer = "";
        masivi = [];
        operatorCount = 0;
    } else if (cleaningTool === "CE" || cleaningTool === "Delete") {
        answer = splitString(answer.toString(), " " );        
        answer.pop();
        if(answer.length > 0) {
            prevData = answer[answer.length - 1];
            answer = `${joinArray(answer, " ")} `;
        } else {
            prevData = "";
            answer = "";
        }
    } else if (cleaningTool === "Backspace") {
        let answerInArray = splitString(answer.toString(), "")
        let emptyString = answerInArray[answerInArray.length - 1] === " " ? true : false;
        let dataType = checkDataType(answerInArray[answerInArray.length - 1]);
        
        if(dataType === "number" && !emptyString) answerInArray.pop();
        answer = joinArray(answerInArray, "")
    }
    if(answer.length === 1) {
        answerBox.innerHTML = "0"; 
        return;
    }
  
    if(answer.length === 0) answerBox.innerHTML = `0`;
    else answerBox.innerHTML = answer;
} 





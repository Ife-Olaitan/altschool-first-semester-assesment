// Wait until the page loads
window.addEventListener("DOMContentLoaded", () => {
    const display = document.getElementById("display");
    const historyPanel = document.getElementById("history");
    const historyList = document.getElementById("history-entries");
    const closeHistoryBtn = document.getElementById("close-history");
    const buttonsContainer = document.querySelector(".buttons");

    let showingHistory = false;

    // Listen for button clicks
    buttonsContainer.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") return;
        const value = e.target.getAttribute("data-value");

        if (value === "C") clearDisplay();
        else if (value === "=") calculate();
        else if (value === "⌫") backspace();
        else if (value === "H") toggleHistory();
        else if (value === ".") appendDot();
        else if (["+","-","×","÷","%"].includes(value)) appendOperator(value);
        else append(value);
    });

    // Close history
    closeHistoryBtn.addEventListener("click", () => toggleHistory());

    // Append number
    const append = (value) => {
        if (display.value === "0" || display.value === "Error") {
            display.value = value;
        } else {
            display.value += value;
        }
    };

    // Prevent multiple decimal points
    const appendDot = () => {
        let last = getLastNumber();
        if (!last.includes(".")) {
            append(".");
        }
    };

    const getLastNumber = () => {
        let input = display.value;
        let ops = ["+", "-", "×", "÷", "%"];
        let last = "";
        for (let i = input.length - 1; i >= 0; i--) {
            if (ops.includes(input[i])) break;
            last = input[i] + last;
        }
        return last;
    };

    // Add or replace operator
    const appendOperator = (op) => {
        const last = display.value.slice(-1);
        const ops = ["+", "-", "×", "÷", "%"];
        if (ops.includes(last)) {
            display.value = display.value.slice(0, -1) + op;
        } else if (display.value !== "0" && display.value !== "Error") {
            display.value += op;
        }
    };

    // Clear input
    const clearDisplay = () => {
        display.value = "0";
    };

    // Remove last character
    const backspace = () => {
        display.value = display.value.slice(0, -1);
        if (display.value === "") display.value = "0";
    };

    // Evaluate expression
    const calculate = () => {
        try {
            let expr = display.value.replace("×", "*").replace("÷", "/");

            // Handle percentage
            if (expr.includes("%")) {
                let i = expr.indexOf("%");
                let num = "";
                let j = i - 1;
                while (j >= 0 && "0123456789.".includes(expr[j])) {
                    num = expr[j] + num;
                    j--;
                }
                let val = parseFloat(num) / 100;
                expr = expr.replace(num + "%", val.toString());
            }

            let result = eval(expr);
            let entry = display.value + " = " + result;
            display.value = result;
            addToHistory(entry);
        } catch {
            display.value = "Error";
        }
    };

    // Add to history
    const addToHistory = (entry) => {
        const div = document.createElement("div");
        div.className = "history-entry";
        div.textContent = entry;
        historyList.appendChild(div);
    };

    // Show/hide history
    const toggleHistory = () => {
        showingHistory = !showingHistory;
        historyPanel.style.display = showingHistory ? "block" : "none";
    };

    // Handle keyboard
    document.addEventListener("keydown", (e) => {
        const key = e.key;

        if ("0123456789".includes(key)) append(key);
        else if (["+", "-", "*", "/"].includes(key)) {
            const map = { "*": "×", "/": "÷" };
            appendOperator(map[key] || key);
        } else if (key === ".") appendDot();
        else if (key === "Enter") {
            e.preventDefault();
            calculate();
        } else if (key === "Backspace") backspace();
        else if (key === "Escape") clearDisplay();
        else if (key.toLowerCase() === "h") toggleHistory();
    });
});
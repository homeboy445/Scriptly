
const fibonacci = (num) => {
    const sequence = [0, 1];
    for (let i = 2; i < num; i++) {
        sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence;
};

const displayFibonacciSequence = (num) => {
    const sequence = fibonacci(num);
    const formattedSequence = sequence.join(', ');
    
    const div = document.createElement('div');
    div.id = "codeFile1";
    div.textContent = `Fibonacci Sequence for ${num}: ${formattedSequence}`;
    
    document.body.appendChild(div);
};

displayFibonacciSequence(10);

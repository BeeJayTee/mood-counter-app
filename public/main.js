// main js file

var selectedButtonValue = ''
const moodButtons = document.querySelectorAll('.moodButton')

const buttonSelected = (button) => {
    moodButtons.forEach(button => button.style.background = 'none')
    button.style.background = '#e6e6e6'
    console.log(button.style.background === 'rgb(230, 230, 230)')
    selectedButtonValue = button.innerText
    console.log(selectedButtonValue)
}
moodButtons.forEach(button => button.addEventListener('click', () => buttonSelected(button)))

// when user clicks submit
const submitButton = document.querySelector('.submitButton')

const submitAnswer = () => {
    if (selectedButtonValue === '') {
        const subTitle = document.querySelector('.subTitle').textContent = 'You have not made a selection.'
    } else {
        fetch('/mood-number')
        .then(response => {
            return response.json()
        })
        .then(data => {
            let currentMoodNum = data
            let status = ''
            if (selectedButtonValue === 'Feeling Good') {
                currentMoodNum += 1
                status = 'increase'
            } else {
                currentMoodNum -= 1
                status = 'decrease'
            }
            fetch('/mood-number', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({currentNum: currentMoodNum})
            })
            .then(response => response.json())
            .then(data => {
                location.reload()
            })
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))
    }

}

submitButton.addEventListener('click', submitAnswer)
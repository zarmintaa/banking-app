'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jason Smith',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const clearContainer = () => {
  containerMovements.innerHTML = '';
}

const displayMovement = (movements, sort = false) => {
  clearContainer();

 const movs =  sort ? movements.slice().sort((a,b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal'
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${type}</div>
        <div class="movements__date">${i + 1}</div>
        <div class="movements__value">${mov}🇪🇺</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
}


const calcDisplayBalance = (acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}🇪🇺`;
})

const calcDisplaySummary = acc => {
  const incomes = acc.movements
      .filter(mov => mov > 0)
      .reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes}🇪🇺`;

  const out = acc.movements.filter(mov => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}🇪🇺`;

  const interest = acc.movements.filter(mov => mov > 0)
      .map(deposit => (deposit * acc.interestRate)/100)
      .filter((int, i, arr) => {
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0)

  labelSumInterest.textContent = `${interest}🇪🇺`
}



// get username from full name, which using first letter from each nam
const createUsernames = (accs) => {
  accs.forEach(acc => {
    acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
  });
};

createUsernames(accounts);
// console.log(accounts)

// event handler
const clearInputFields = () => {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
}

let currentAccount;

const updateUi = (acc) => {
  //display movements
  displayMovement(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
}


btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts
      .find(acc => acc.username === inputLoginUsername.value);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUi(currentAccount);
  }
})


btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc?.username !== currentAccount.username){
    console.log('Transfer Valid! ')
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUi(currentAccount);
  }

})

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement
    currentAccount.movements.push(amount);

    updateUi(currentAccount);
    inputLoanAmount.value = '';
  }
})

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (Number(inputClosePin.value) === currentAccount.pin && inputCloseUsername.value === currentAccount.username) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
})

let sortStatus = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovement(currentAccount.movements, sortStatus = !sortStatus);
})


///////////////////////////////////////
////////////////////////////////////////

////////////////////////////////////////
////////////////////////////////////////

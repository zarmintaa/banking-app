'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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



// get username from full name, which using first letter from each name

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

////////////////////////////////////////
////////////////////////////////////////



const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter((mov) => {
  return mov > 0
})

const withdrawls = movements.filter(mov => mov < 0);

// console.log(deposits)
// console.log(withdrawls)
//
// console.log(movements)

// const balance = movements.reduce((acc, cur, i) => {
//   console.log(`iteration ${i}: ${acc} : ${cur}`)
//   return acc + cur
// }, 0)

let balance2 = 0;
movements.forEach(value => balance2 += value)

// console.log(balance)
// console.log(balance2)

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



/////////////////////////////////////////////////

// const eurToUsd = 1.1;
//
// const movementUsd = movements.map(mov =>  mov * eurToUsd)
//
// console.log(movementUsd)

/*

const checkDogs = (dogsJulia, dogsKate) => {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  dogs.forEach((dog, i) => {
    if (dog >= 3) {
      console.log(`Dog number ${i} is an adult, an is ${dog} years old`)
    } else {
      console.log(`Dog number ${i} is a puppy, an is ${dog} years old`)
    }
  })
}

// [3,5,12,7] >< [4,1,15,0,3]

checkDogs([3,5,12,7], [4,1,15,0,3])


*/

// const movementDescriptions = movements.map((mov, i) => {
//   return `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${mov}`
// });
//
// console.log(movementDescriptions)


// MAX VAlue with reduce

// const max = movements.reduce((acc, mov) => acc > mov ? acc : mov, movements[0]);
// console.log(max)

const data1 = [5,2,4,1,15,8,3];
const data2 = [16,6,10, 5,6,1,4];

const calcAverageHumanAge = (ages) => {
  const humanAges = ages.map(age => age <= 2 ? 2 * age : 16 + age * 4);
  const adults = humanAges.filter(age => age >= 18);
  // return adults.reduce((acc, cur) => acc + cur, 0)/adults.length
  return adults.reduce((acc, cur,i,arr) => acc + cur/arr.length, 0)
}

const calcAverageHumanAge2 = ages =>
    ages.map(age => age <= 2 ? 2 * age : 16 + age * 4)
    .filter(age => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur/arr.length, 0)

// console.log(Math.abs(calcAverageHumanAge2(data1)))

const eurToUsd = 1.1
const totalDepositUSD = movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositUSD)

const firstWithDrawal = movements.find(mov => mov < 0)
const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(firstWithDrawal)
// console.log(account)


// console.log(movements);
// console.log(movements.includes(-130));

const myDeposits = movements.some(mov => mov > 0)
// console.log(myDeposits);

const deposit = mov => mov > 0;

console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

const arr = [[1,2,3], [4,5,6], 7,8];
const arrDeep = [[[1,2],3], [4,[5,6]], 7,8];
// console.log(arr.flat());
// console.log(arrDeep.flat(2));


const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov);

// console.log(overallBalance2);

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

// return < 0, A, B = keep order
// return > 0, A, B = switch order

// Ascending
movements.sort((a,b) => {
  if (a > b) return 1;
  if (b > a) return -1;
})
// console.log(movements);

// Descending
movements.sort((a,b) => {
  if (a > b) return -1;
  if (b > a) return 1;
})

// console.log(movements);

movements.sort((a,b) => a - b);
// console.log(movements);


movements.sort((a,b) => b - a);
// console.log(movements);

const z = Array.from({length: 100}, (_, i) =>  Math.trunc(Math.random() * 6 + 1) );
console.log(z);


labelBalance.addEventListener('click', () => {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('🇪🇺', '')));
  // movementsUI.map((el => el.textContent.replace('🇪🇺', '')));
  console.log(movementsUI);
});

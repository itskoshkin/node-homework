//Констанции
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.js');

app.use(bodyParser.json());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//БД в сделку не входило
let expenses = []; let dailyLimit = 0;


//CRUD
//Create
app.post('/expenses', (req, res) => {
  const { name, amount, date, notes } = req.body;
  const expense = {
    id: uuid(undefined, undefined, undefined), //WTF...
    name,
    amount,
    date: new Date(date), //Ну вроде...
    notes
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

//Update
app.put('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { name, amount, date, notes } = req.body;
  const expense = expenses.find(expense => expense.id === id);
  if (expense) {
    expense.name = name;
    expense.amount = amount;
    expense.date = new Date(date);
    expense.notes = notes;
    res.json(expense);
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
});

//Get all
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

//Get by ID
app.get('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const expense = expenses.find(expense => expense.id === id);
  if (expense) {
    res.json(expense);
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
});

//Delete
app.delete('/expenses/:id', (req, res) => {
  const { id } = req.params;
  const index = expenses.findIndex(expense => expense.id === id);
  if (index !== -1) {
    const deletedExpense = expenses.splice(index, 1);
    res.json(deletedExpense[0]);
  } else {
    res.status(404).json({ message: 'Expense not found' });
  }
});

//Search
app.post('/expenses/search', (req, res) => {
  const { date } = req.body; const searchDate = new Date(date);
  const filteredExpenses = expenses.filter(expense => {
    return (
        expense.date.getDate() === searchDate.getDate() &&
        expense.date.getMonth() === searchDate.getMonth() &&
        expense.date.getFullYear() === searchDate.getFullYear()
    );
  });
  res.json(filteredExpenses);
});

//Limit
app.post('/daily-limit', (req, res) => {
  const { limit } = req.body; dailyLimit = limit;
  res.json({ message: 'Daily limit set successfully.' });
});

app.get('/daily-limit', (req, res) => {
  res.json({ limit: dailyLimit });
});

module.exports = app;
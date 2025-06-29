import Loan from '../model/loan_db.js';
import dotenv from 'dotenv';
dotenv.config();

const USER_SERVICE_URL = process.env.USER_URL;
const BOOK_SERVICE_URL = process.env.BOOK_URL;

export const createLoan = async (data) => {
  try {
    const userRes = await fetch(`${USER_SERVICE_URL}/api/users/${data.user_id}`, { timeout: 5000 });
    if (!userRes.ok) throw new Error('User not found');
    const user = await userRes.json();

    const bookRes = await fetch(`${BOOK_SERVICE_URL}/api/books/${data.book_id}`, { timeout: 5000 });
    if (!bookRes.ok) throw new Error('Book not found');
    const book = await bookRes.json();

    if (book.availableCopies <= 0) {
      throw new Error('Book is not available');
    }

    await fetch(`${BOOK_SERVICE_URL}/api/books/${data.book_id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        available_copies: 1,
        operation: 'decrement',
      }),
      timeout: 5000
    });

    return Loan.create({
      userId: data.user_id,
      bookId: data.book_id,
      dueDate: new Date(data.dueDate),
      status: 'ACTIVE',
    });

  } catch (error) {
    console.error('Error creating loan:', error.message);
  }
};

export const returnBook = async (loanId) => {
  try {
    const loan = await Loan.findById(loanId);
    if (!loan) throw new Error('Loan not found');
    if (loan.status === 'RETURNED') throw new Error('Book already returned');

    const res = await fetch(`${BOOK_SERVICE_URL}/api/books/${loan.bookId}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        available_copies: 1,
        operation: 'increment',
      }),
      timeout: 5000
    });

    if (!res.ok) {
      if (res.status === 404) throw new Error('Book not found');
      throw new Error('Error updating book availability');
    }

    return await Loan.findByIdAndUpdate(
      loanId,
      { status: 'RETURNED', returnDate: new Date() },
      { new: true }
    );

  } catch (error) {
    throw error;
  }
};

export async function getUserLoans(userId) {
  try {
    const loans = await Loan.find({ userId }).sort({ issueDate: -1 });

    const enrichedLoans = await Promise.all(
      loans.map(async (loan) => {
        const [bookRes, userRes] = await Promise.all([
          fetch(`${BOOK_SERVICE_URL}/api/books/${loan.bookId}`, { timeout: 5000 }),
          fetch(`${USER_SERVICE_URL}/api/users/${loan.userId}`, { timeout: 5000 }),
        ]);

        const book = await bookRes.json();
        const user = await userRes.json();

        return {
          ...loan.toObject(),
          book: {
            id: book.id,
            title: book.title,
            author: book.author,
          },
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      })
    );

    return {
      loans: enrichedLoans,
      total: loans.length,
    };
  } catch (error) {
    throw error;
  }
}

export const getLoan = async (id) => {
  try {
    const loan = await Loan.findById(id);
    if (!loan) return null;

    const [bookRes, userRes] = await Promise.all([
      fetch(`${BOOK_SERVICE_URL}/api/books/${loan.bookId}`, { timeout: 5000 }),
      fetch(`${USER_SERVICE_URL}/api/users/${loan.userId}`, { timeout: 5000 }),
    ]);

    const book = await bookRes.json();
    const user = await userRes.json();

    return {
      ...loan.toObject(),
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
      },
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error('Error fetching loan:', error.message);
    throw error;
  }
};

import Book from "../model/book_db.js";

export const createBook = async(data) => {
  return Book.create({
    title: data.title,
    author: data.author,
    isbn: data.isbn,
    copies: data.copies,
    availableCopies: data.copies,
  });
}
export const searchBooks = async(search) => {
  return Book.find({
    $or: [
      { title: { $regex: search, $options: 'i' } },
      {author: { $regex: search, $options: 'i' } },
      {isbn: { $regex: search, $options: 'i' } },
    ]
  })
};


export const getBook = async(id) => {
  return Book.findById(id);
}

export const updateBook = async(id, data) => {
  return Book.findByIdAndUpdate(id, {
    copies: data.copies,
    availableCopies: data.copies,
  }, { new: true });
}

export const updateAvailability = async(id, availableCopies, operation) => {
  const updateData = operation === 'increment' 
    ? { $inc: { availableCopies } }
    : { $inc: { availableCopies: -availableCopies } };

  return Book.findByIdAndUpdate(id, updateData, { new: true });
}


export const deleteBook = async(id) => {
  return Book.findByIdAndDelete(id);
}
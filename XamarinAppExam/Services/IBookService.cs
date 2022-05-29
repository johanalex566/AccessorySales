using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using XamarinAppExam.Model;

namespace XamarinAppExam.Services
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> GetBooks();
        Task<Book> GetBook(int id);
        Task AddBook(Book book);
        Task SaveBook(Book book);
        Task DeleteBook(Book book);

    }
}

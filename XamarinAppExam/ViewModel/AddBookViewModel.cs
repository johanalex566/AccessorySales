using System;
using System.Collections.Generic;
using System.Text;
using XamarinAppExam.Services;

namespace XamarinAppExam.ViewModel
{
    public class AddBookViewModel
    {
        private readonly IBookService _bookService;
        private string title;
        private string author;
        private string description;
    }
}

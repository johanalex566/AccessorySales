
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using XamarinAppExam.ViewModel;

namespace XamarinAppExam.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Books : ContentPage
    {
        private readonly BooksViewModel _booksViewModel;
        public Books()
        {
            InitializeComponent();

            _booksViewModel = Startup.Resolve<BooksViewModel>();
            BindingContext = _booksViewModel;
        }
        protected override void OnAppearing()
        {
            _booksViewModel?.PopulateBooks();
        }
    }
}
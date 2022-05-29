
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using XamarinAppExam.ViewModel;

namespace XamarinAppExam.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class BookDetails : ContentPage
    {
        public BookDetails()
        {
            InitializeComponent();

            BindingContext = Startup.Resolve<BookDetailsViewModel>();
        }
    }
}
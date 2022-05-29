using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using XamarinAppExam.ViewModel;

namespace XamarinAppExam.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AddBook : ContentPage
    {
        public AddBook()
        {
            InitializeComponent();
            BindingContext = Startup.Resolve<AddBookViewModel>();
        }
    }
}
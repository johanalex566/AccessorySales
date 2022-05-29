using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using XamarinAppExam.Views;

namespace XamarinAppExam
{
    public partial class AppShell : Xamarin.Forms.Shell
    {
        public AppShell()
        {
            InitializeComponent();

            Routing.RegisterRoute(nameof(AddBook), typeof(AddBook));
            Routing.RegisterRoute(nameof(BookDetails), typeof(BookDetails));
        }
    }
}
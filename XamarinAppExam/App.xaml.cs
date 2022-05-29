using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace XamarinAppExam
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            MainPage = new MainPage();

            Startup.ConfigureServices();

            MainPage = new AppShell();

        }

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}

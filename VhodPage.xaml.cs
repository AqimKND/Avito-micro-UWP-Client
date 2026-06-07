using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// Документацию по шаблону элемента "Пустая страница" см. по адресу https://go.microsoft.com/fwlink/?LinkId=234238

namespace AvitoMicro
{
    /// <summary>
    /// Пустая страница, которую можно использовать саму по себе или для перехода внутри фрейма.
    /// </summary>
    public sealed partial class VhodPage : Page
    {
        ApplicationDataContainer localSettings = ApplicationData.Current.LocalSettings;
        public VhodPage()
        {
            this.InitializeComponent();
        }
        private void Skip_Click(object sender, RoutedEventArgs e)
        {
            localSettings.Values["FirstLaunchQuizDone"] = true;
            localSettings.Values["IsAuthorized"] = false;
            this.Frame.Navigate(typeof(MainPage));
        }
        private void OkLogin_Click(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(OKOauthPage));
        }
    }
}
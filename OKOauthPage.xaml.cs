using System;
using System.Threading.Tasks;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Navigation;

namespace AvitoMicro
{
    public sealed partial class OKOauthPage : Page
    {
        private ApplicationDataContainer localSettings = ApplicationData.Current.LocalSettings;
        private string clientId = "1155875840"; //Взято из декомпилированной всячины официального Авито Android
        private string redirectUri = "https://www.avito.ru/social/login";
        public OKOauthPage()
        {
            this.InitializeComponent(); OauthWebView.NavigationStarting += OauthWebView_NavigationStarting;
            OauthWebView.NavigationCompleted += OauthWebView_NavigationCompleted;
        }
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);
            string authUrl = $"https://connect.ok.ru/oauth/authorize{clientId}&response_type=code&redirect_uri={Uri.EscapeDataString(redirectUri)}&layout=m"; //Это
            OauthWebView.Navigate(new Uri(authUrl));
        }
        private void OauthWebView_NavigationStarting(WebView sender, WebViewNavigationStartingEventArgs args)
        {
            CheckAndNavigateFields(args.Uri.ToString(), sender);
        }
        private void OauthWebView_NavigationCompleted(WebView sender, WebViewNavigationCompletedEventArgs args)
        {
            CheckAndNavigateFields(args.Uri.ToString(), sender);
        }
        private async void CheckAndNavigateFields(string url, WebView sender)
        {
            if (url.Contains("avito.ru/social/login") && url.Contains("code="))
            {
                sender.NavigationStarting -= OauthWebView_NavigationStarting;
                sender.NavigationCompleted -= OauthWebView_NavigationCompleted;
                await Task.Delay(3000);
                var filter = new Windows.Web.Http.Filters.HttpBaseProtocolFilter();
                var cookies = filter.CookieManager.GetCookies(new Uri("https://www.avito.ru"));
                foreach (var cookie in cookies)
                {
                    if (cookie.Name == "v")
                    {
                        localSettings.Values["SavedCookieV"] = cookie.Value;
                        break;
                    }
                }
                localSettings.Values["IsAuthorized"] = true;
                localSettings.Values["ProfileName"] = "Надежда(";
                localSettings.Values["FirstLaunchQuizDone"] = true;
                this.Frame.Navigate(typeof(MainPage));
            }
        }
    }
}

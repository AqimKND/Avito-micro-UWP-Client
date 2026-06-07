using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.Web.Http;
using Windows.Web.Http.Filters;
using Windows.Security.Cryptography.Certificates;
using Windows.Storage.Streams;
using Windows.Storage;
using Windows.UI.Xaml.Media.Imaging;
using Newtonsoft.Json.Linq;

namespace AvitoMicro
{
    public sealed partial class MainPage : Page
    {
        private ApplicationDataContainer localSettings = ApplicationData.Current.LocalSettings;
        private bool _isParsingNow = false;
        public MainPage()
        {
            this.InitializeComponent();
            ResultsListView.ItemsSource = App.ItemsCache;
            this.Loaded += async (s, e) =>
            {
                ApplyStyle();
                if (App.ItemsCache.Count == 0) await LoadAvitoDataAsync();
            };
        }
        private async void Refresh_Click(object sender, RoutedEventArgs e)
        {
            ApplyStyle(); App.ItemsCache.Clear();
            await LoadAvitoDataAsync();
        }
        private void ApplyStyle()
        {
            int viewStyle = localSettings.Values.ContainsKey("ViewStyle") ? (int)localSettings.Values["ViewStyle"] : 0;
            if (viewStyle == 1)
                ResultsListView.ItemTemplate = (DataTemplate)this.Resources["GridTemplate"];
                ResultsListView.ItemTemplate = (DataTemplate)this.Resources["ListTemplate"];
        }
        private async Task LoadAvitoDataAsync()
        {
            if (_isParsingNow) return;  _isParsingNow = true;
            try
            {
                var filter = new HttpBaseProtocolFilter();
                filter.IgnorableServerCertificateErrors.Add(ChainValidationResult.Untrusted);
                using (var client = new HttpClient(filter))
                {
                    client.DefaultRequestHeaders.Add("X-Requested-With", "XMLHttpRequest");
                    int keyVersion = localSettings.Values.ContainsKey("KeyVersion") ? (int)localSettings.Values["KeyVersion"] : 1;
                    if (keyVersion == 1)
                    {
                        client.DefaultRequestHeaders.UserAgent.Clear();
                        client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
                    }
                    {
                        client.DefaultRequestHeaders.UserAgent.Clear();
                        client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36");
                    }
                    if (keyVersion == 2)
                    {
                        string appId = localSettings.Values.ContainsKey("CustomAppId") ? localSettings.Values["CustomAppId"].ToString() : "neohaMNwARklNSgGQiFtz4HFfgX9juWKsMEgczgP";
                        string appSecret = localSettings.Values.ContainsKey("CustomSecret") ? localSettings.Values["CustomSecret"].ToString() : "4fX9juWKsMEgczgPneohaMNwARklNSgGQiFtz4HF";
                        client.DefaultRequestHeaders.Add("X-Avito-App-Id", appId);  client.DefaultRequestHeaders.Add("X-Avito-App-Secret", appSecret);
                        client.DefaultRequestHeaders.Add("X-Avito-Signature", "XcyLEIoAu0F3124mKLaBcDeFgHiJkLmNoPqRsTuVwXyZ");
                        client.DefaultRequestHeaders.Add("X-Avito-Device-Id", "bca6990123456789abcdef0123456789abcdef01");
                    }
                    Uri targetUri;
                    if (keyVersion == 1)
                    {
                        targetUri = new Uri("https://www.avito.ru/web/1/main/items?locationId=621540&X-Parse-Application-Id=DvJRvxirSg82MkkJXaIKbqbpVQkYezdSXlxwvEP1&X-Parse-REST-API-Key=MH8pPb60RxbBZOzccyrZBwzxFDIOUQKw2M4qiBIF");
                    }
                    {
                        targetUri = new Uri("https://www.avito.ru/web/1/main/items?locationId=621540&X-Avito-Application-Id=XcyLEIoAuUgGSJUDFAs4xWTnV2TKEmvZTZuTtPFr&X-Avito-Client-Secret=bca6990fc3c15a8105800c0673517a4b579634a1");
                    }
                    var response = await client.GetAsync(targetUri);
                    if (response.StatusCode != HttpStatusCode.Ok) return;
                    string jsonText = await response.Content.ReadAsStringAsync();
                    var json = JObject.Parse(jsonText);
                    var items = json["items"]
                             ?? json["result"]?["items"]
                             ?? json["data"]?["items"]
                             ?? json["recommendations"]
                             ?? json["data"]?["recommendations"]
                             ?? json["cards"]
                             ?? json["result"]?["cards"]
                             ?? json["data"];
                    if (items == null) return;
                    App.ItemsCache.Clear();
                    foreach (var item in items)
                    {
                        var pd = item["priceDetailed"];
                        string p = pd?["string"]?.ToString() ?? (pd?["value"]?.ToString() != null ? pd["value"].ToString() + " ₽" : "Цена не указана");
                        string imgUrl = "ms-appx:///Assets/NoPhoto.png";
                        var imgs = item["images"];
                        if (imgs != null && imgs.HasValues)
                        {
                            var firstContainer = imgs.First;
                            string rawUrl = string.Empty;
                            if (firstContainer != null)
                            {
                                if (firstContainer["678x678"] != null) rawUrl = firstContainer["678x678"].ToString();
                            }
                            if (!string.IsNullOrEmpty(rawUrl))
                            {
                                imgUrl = rawUrl.Replace("\\", "").Trim(' ', '"', '{', '}', ',');
                                if (imgUrl.StartsWith("//")) imgUrl = "https:" + imgUrl;
                                else if (!imgUrl.StartsWith("http")) imgUrl = "https://" + imgUrl;
                            }
                        }
                        App.ItemsCache.Add(new AvitoItem
                        {
                            id = item["id"]?.ToString(), title = item["title"]?.ToString() ?? "Без названия",
                            price = p, image = imgUrl
                        });
                    }
                    App.LastStatusCache = "Загружено успешно в " + DateTime.Now.ToString("HH:mm");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[AVITO_LOG] Сбой: {ex.Message}");
            }
            finally
            {
                _isParsingNow = false;
            }
        }
        private void AvitoBrowser_NavigationCompleted(WebView sender, WebViewNavigationCompletedEventArgs args) { }
        private void Secondary_Click(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(SettingPage));
        }
        private void About_Click(object sender, RoutedEventArgs e)
        {
            this.Frame.Navigate(typeof(AboutPage));
        }
    }
}

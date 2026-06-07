using System;
using Windows.Storage;
using Windows.UI.Text;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Popups;
using Newtonsoft.Json.Linq;

namespace AvitoMicro
{ public sealed partial class SettingPage : Page
    {
        private ApplicationDataContainer localSettings = ApplicationData.Current.LocalSettings;
        public SettingPage()
        { this.InitializeComponent();
            int viewStyle = localSettings.Values.ContainsKey("ViewStyle") ? (int)localSettings.Values["ViewStyle"] : 0;
            if (viewStyle == 0) StyleList.IsChecked = true; else StyleGrid.IsChecked = true;
            int keyVersion = localSettings.Values.ContainsKey("KeyVersion") ? (int)localSettings.Values["KeyVersion"] : 1;
            if (keyVersion == 1 || keyVersion == 0) KeyParse.IsChecked = true;
            else if (keyVersion == 2)
                KeyZagolovki.IsChecked = true;
            UpdateKeyLabelsUX();
        } private void UpdateKeyLabelsUX()
        {
            if (localSettings.Values.ContainsKey("CustomAppId") || localSettings.Values.ContainsKey("CustomSecret"))
            {
                KeyZagolovki.Content = "Способ №2 (Заголовки v2.6) [Вручную добавлено]";
                KeyZagolovki.FontWeight = FontWeights.SemiBold;
            }
        }
        private void Back_Click(object sender, RoutedEventArgs e)
        {
            localSettings.Values["ViewStyle"] = (StyleGrid.IsChecked == true) ? 1 : 0;
            if (KeyParse.IsChecked == true) localSettings.Values["KeyVersion"] = 1;
            else if (KeyZagolovki.IsChecked == true)   localSettings.Values["KeyVersion"] = 2;
            App.ItemsCache.Clear();  if (Frame.CanGoBack) Frame.GoBack();
        }
        private async void CheckUpdates_Click(object sender, RoutedEventArgs e)
        {
            UpdateBtn.IsEnabled = false;  UpdateBtn.Content = "Проверка!"; string targetUrl = "https://raw.githubusercontent.com/AqimKND/Avito-micro-UWP-Client/refs/heads/main/version.json";
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = 3072;
                using (var client = new System.Net.Http.HttpClient())
                {
                    client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                    var response = await client.GetStringAsync(new Uri(targetUrl + "?t=" + DateTime.Now.Ticks));
                    var data = JObject.Parse(response);
                    string latestVersion = data["version"]?.ToString();
                    if (latestVersion == "0.1.1.0") await new MessageDialog("Последняя версия!").ShowAsync();  else
                    {
                        UpdateVersionTextOverlay.Text = "Версия: " + latestVersion;   UpdateOverlay.Visibility = Visibility.Visible;
                    }
                }
            }
            catch { await new MessageDialog("Ошибка!").ShowAsync(); }
            finally { UpdateBtn.IsEnabled = true; UpdateBtn.Content = "Обновление"; }
        }
        private void CloseOverlay_Click(object sender, RoutedEventArgs e) => UpdateOverlay.Visibility = Visibility.Collapsed;
    }
}

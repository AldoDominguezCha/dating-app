using Azure.Identity;

namespace API.Extensions
{
    public static class ApplicationConfigurationExtensions
    {
        public static void AddKeyVaultToApp(this ConfigurationManager config)
        {
            Uri vaultUri = new Uri(String.Format("https://{0}.vault.azure.net/", config["KeyVaultName"]));

            /* TODO: Configure a managed identity credential for PROD */
            config.AddAzureKeyVault(vaultUri, new DefaultAzureCredential());
        }
    }
}

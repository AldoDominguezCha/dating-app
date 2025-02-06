using Azure.Identity;

namespace API.Extensions
{
    public static class ApplicationConfigurationExtensions
    {
        public static void AddKeyVaultToApp(this ConfigurationManager config, bool isDevelopment)
        {   
            Uri vaultUri = new Uri(String.Format("https://{0}.vault.azure.net/", config["KeyVaultName"]));

            // Authenticate to the Azure Key Vault using a user-managed identity outside of Development
            var azureCredential = isDevelopment ? new DefaultAzureCredential() : new DefaultAzureCredential(new DefaultAzureCredentialOptions
            {
                // TODO: Segment into different environments
                // Client ID of the user managed identity
                ManagedIdentityClientId = "b3df8874-b316-4aab-a530-31dae03f3922"
            });

            config.AddAzureKeyVault(vaultUri, azureCredential);
        }
    }
}

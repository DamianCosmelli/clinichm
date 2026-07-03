using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;

public static class EncryptionHelper
{
    private static string? _key;
    private static string? _iv;

    public static void Initialize(IOptions<EncryptionSettings> options)
    {
        _key = options.Value.Key; // Assuming Key is a string of 32 characters for AES-256
        _iv = options.Value.IV; // Assuming IV is a string of 16 characters for AES block size
    }

    public static string Encrypt(string plainText)
    {
        if (_key == null || _iv == null)
            throw new InvalidOperationException("EncryptionHelper is not initialized.");

        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(_key);
        aes.IV = Encoding.UTF8.GetBytes(_iv);

        var encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream();
        using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
        using (var sw = new StreamWriter(cs))
        {
            sw.Write(plainText);
        }

        return Convert.ToBase64String(ms.ToArray());
    }

    public static string Decrypt(string cipherText)
    {
        if (_key == null || _iv == null)
            throw new InvalidOperationException("EncryptionHelper is not initialized.");

        using var aes = Aes.Create();
        aes.Key = Encoding.UTF8.GetBytes(_key);
        aes.IV = Encoding.UTF8.GetBytes(_iv);

        var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
        using var ms = new MemoryStream(Convert.FromBase64String(cipherText));
        using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
        using var sr = new StreamReader(cs);

        return sr.ReadToEnd();
    }
}

using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Globalization;

public class CapitalizeStringConverter : ValueConverter<string, string>
{
    #pragma warning disable //deshabilita warning por null value en el constructor
    public CapitalizeStringConverter() : base(
        v => v != null ? CultureInfo.CurrentCulture.TextInfo.ToTitleCase(v.ToLower()) : null,
        v => v)
    {

    }
    #pragma warning enable
}
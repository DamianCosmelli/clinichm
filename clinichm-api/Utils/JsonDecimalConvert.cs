using System;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace clinichm_api.Utils
{
    public class DecimalJsonConverter : JsonConverter<decimal>
    {
        public override decimal Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return reader.GetDecimal();
        }

        public override void Write(Utf8JsonWriter writer, decimal value, JsonSerializerOptions options)
        {
            writer.WriteNumberValue(Math.Round(value, 2)); // 🔹 Redondea a 2 decimales sin convertir a string
        }
    }
}

namespace clinichm_api.DTOs
{
    public class WhatsAppMessageDto
    {
        public string PhoneNumber { get; set; } = null!;
        public string Message { get; set; } = null!;
    }

    public class WhatsAppWebhookResponseDto
{
    public List<ChangeDTO> Changes { get; set; } = new();
}

public class ChangeDTO
{
    public ValueDTO? Value { get; set; }
    public string? Field { get; set; }
}

public class ValueDTO
{
    public string? MessagingProduct { get; set; }
    public MetadataDTO? Metadata { get; set; }
    public List<ContactDTO> Contacts { get; set; } = new();
    public List<MessageDTO> Messages { get; set; } = new();
}

public class MetadataDTO
{
    public string? DisplayPhoneNumber { get; set; }
    public string? PhoneNumberId { get; set; }
}

public class ContactDTO
{
    public ProfileDTO? Profile { get; set; }
    public string? WaId { get; set; }
}

public class ProfileDTO
{
    public string? Name { get; set; }
}

public class MessageDTO
{
    public string? From { get; set; }
    public string? Id { get; set; }
    public string? Timestamp { get; set; }
    public TextDTO? Text { get; set; }
    public string? Type { get; set; }
}

public class TextDTO
{
    public string? Body { get; set; }
}

public class WPMessageResponseDTO
{
    public string? From { get; set; }
    public string? Id { get; set; }
    public string? Timestamp { get; set; }
    public string? Text { get; set; }
}

}
